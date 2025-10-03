using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;

namespace ChatApp.Infrastructure.MessageActive
{
    public class SendMessageHandler(ILogger<SendMessageHandler> _logger,
        AppDbContext context, IMessageBus _bus) : IRequestHandler<SendMessageCommand, MessageDto>
    {
        public async Task<MessageDto> Handle(SendMessageCommand request, CancellationToken ct)
        {
            //kiểm tra tra message có tồn tại hay không
            var existMessage = await context.Messages
                .Where(m => (m.ConversationId == request.ConversationId) &&
                               (m.SenderId == request.SenderId) &&
                                (m.ClientMessageId == request.ClientMessageId))
                .Select(m => new MessageDto(m.Id, m.ConversationId, m.SenderId, m.Seq, m.Type, m.Body, m.CreatedAt))
                .FirstOrDefaultAsync(ct);

            if (existMessage != null) return existMessage;

            //Gửi trong transaction + khóa cuối (UPDLOCK, HOLDLOCK) để cấp seq tiếp theo
            var maxRetries = 3;

            for (var attemp = 1; attemp <= maxRetries; attemp++)
            {
                using var tx = await context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable, ct);

                //lấy khóa cuối cùng để thực hiện để tránh race
                var lastSeq = await context.Messages.FromSqlRaw(@"SELECT TOP(1) * FROM Messages WITH (UPDLOCK, HOLDLOCK, ROWLOCK)
                    WHERE ConversationId = {0}
                    ORDER BY Seq DESC", request.ConversationId)
                    .Select(m => (long?)m.Seq)
                    .FirstOrDefaultAsync(ct) ?? 0L;

                var nextSeq = lastSeq + 1;

                var msg = new Message
                {
                    Id = Guid.NewGuid(),
                    ConversationId = request.ConversationId,
                    SenderId = request.SenderId,
                    Seq = nextSeq,
                    Type = request.Type,
                    Body = System.Text.Json.JsonSerializer.Serialize(new { text = request.Text })
                };

                context.Add(msg);

                //cập nhật Conversation.LasteMessage tối ưu lại list hội thoại
                var loadConversation = await context.Conversations.Where(c => c.Id == request.ConversationId).FirstOrDefaultAsync(ct);

                if (loadConversation != null)
                {
                    loadConversation.LastMessageAt = DateTime.UtcNow;
                    loadConversation.LastMessageId = msg.Id;
                }

                try
                {
                    await context.SaveChangesAsync(ct); //unique idx (coversationId, Seq) bảo vệ trùng seq:
                    await tx.CommitAsync(ct);

                    //đẩy sự kiên realtime  và push qua outbox/bus
                    await _bus.publicMessageCreatedAsync(new MessageCreatedEvent
                        (msg.Id, msg.ConversationId, msg.SenderId, msg.Seq, msg.Type, msg.Body, msg.CreatedAt));

                    return new MessageDto(msg.Id, msg.ConversationId, msg.SenderId, msg.Seq, msg.Type, msg.Body, msg.CreatedAt);
                }
                catch (DbUpdateException ex)
                {
                    await tx.RollbackAsync(ct);

                    //Nếu dính Req do Race có thể retruy
                    _logger.LogError(ex, "Seq conflict, retrying attempt {Attempt}", attemp);
                    if (attemp == maxRetries) throw;
                    await Task.Delay(25 * attemp, ct); //backoff nhẹ
                }
            }

            throw new InvalidOperationException("Unable to send message after retries");
        }
    }
}