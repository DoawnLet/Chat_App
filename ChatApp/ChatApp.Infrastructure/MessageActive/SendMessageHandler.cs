using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ChatApp.Infrastructure.MessageActive
{
    public class SendMessageHandler(ILogger<SendMessageHandler> _logger,
        AppDbContext context, IMessageBus _bus) : IRequestHandler<SendMessageCommand, MessageDto>
    {
        public async Task<MessageDto> Handle(SendMessageCommand request, CancellationToken ct)
        {
            using var tx = await context.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable, ct);

            try
            {
                // Check idempotency
                var existingMsg = await context.Messages
                    .FirstOrDefaultAsync(m =>
                        m.ConversationId == request.ConversationId &&
                        m.ClientMessageId == request.ClientMessageId, ct);

                if (existingMsg != null)
                {
                    await tx.CommitAsync(ct);
                    return new MessageDto(existingMsg.Id, existingMsg.ConversationId,
                        existingMsg.SenderId, existingMsg.Seq, existingMsg.Type,
                        existingMsg.Body, existingMsg.CreatedAt);
                }

                // Get next Seq with row lock
                var lastSeq = await context.Messages
                    .FromSqlRaw(@"
                SELECT TOP(1) * FROM Messages WITH (UPDLOCK, HOLDLOCK)
                WHERE ConversationId = {0}
                ORDER BY Seq DESC", request.ConversationId)
                    .Select(m => (long?)m.Seq)
                    .FirstOrDefaultAsync(ct) ?? 0L;

                var nextSeq = lastSeq + 1;

                // Create message
                var msg = new Message
                {
                    Id = Guid.NewGuid(),
                    ConversationId = request.ConversationId,
                    SenderId = request.SenderId,
                    Seq = nextSeq,
                    Type = request.Type,
                    Body = System.Text.Json.JsonSerializer.Serialize(new { text = request.Text }),
                    ClientMessageId = request.ClientMessageId
                };

                context.Messages.Add(msg);

                // Update conversation
                await context.Conversations
                    .Where(c => c.Id == request.ConversationId)
                    .ExecuteUpdateAsync(c => c
                        .SetProperty(x => x.LastMessageAt, DateTimeOffset.UtcNow)
                        .SetProperty(x => x.LastMessageId, msg.Id), ct);

                await context.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);

                return new MessageDto(msg.Id, msg.ConversationId, msg.SenderId,
                    msg.Seq, msg.Type, msg.Body, msg.CreatedAt);
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync(ct);
                throw;
            }
        }
    }
}