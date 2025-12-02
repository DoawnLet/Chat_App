using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;
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
            // Validate input
            if (string.IsNullOrWhiteSpace(request.ClientMessageId))
            {
                throw new ArgumentException("ClientMessageId is required");
            }

            if (string.IsNullOrWhiteSpace(request.Text) && request.Type == MessageType.Text)
            {
                throw new ArgumentException("Text is required for text messages");
            }

            //using var tx = await context.Database.BeginTransactionAsync(
            //    System.Data.IsolationLevel.Serializable, ct);

            try
            {
                // Check idempotency
                var existingMsg = await context.Messages
                    .FirstOrDefaultAsync(m =>
                        m.ConversationId == request.ConversationId &&
                        m.ClientMessageId == request.ClientMessageId, ct);

                if (existingMsg != null)
                {
                    //await tx.CommitAsync(ct);

                    // Publish event even for existing message to ensure real-time sync
                    await _bus.publicMessageCreatedAsync(new MessageCreatedEvent(
                        existingMsg.Id,
                        existingMsg.ConversationId,
                        existingMsg.SenderId,
                        existingMsg.Seq,
                        existingMsg.Type,
                        existingMsg.Body,
                        existingMsg.CreatedAt
                    ));

                    return new MessageDto(existingMsg.Id, existingMsg.ConversationId,
                        existingMsg.SenderId, existingMsg.Seq, existingMsg.Type,
                        existingMsg.Body, existingMsg.CreatedAt);
                }

                var isMember = await context.ConversationMembers
                 .AnyAsync(m => m.ConversationId == request.ConversationId
                && m.UserId == request.SenderId, ct);

                if (!isMember)
                {
                    throw new UnauthorizedAccessException(
                        "You are not a member of this conversation");
                }

                // Get next Seq with row lock
                var lastSeq = await context.Messages
                .Where(m => m.ConversationId == request.ConversationId)
                .MaxAsync(m => (long?)m.Seq, ct) ?? 0L;

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
                //await tx.CommitAsync(ct);

                // Publish event for real-time push
                await _bus.publicMessageCreatedAsync(new MessageCreatedEvent(
                    msg.Id,
                    msg.ConversationId,
                    msg.SenderId,
                    msg.Seq,
                    msg.Type,
                    msg.Body,
                    msg.CreatedAt
                ));

                return new MessageDto(msg.Id, msg.ConversationId, msg.SenderId,
                     msg.Seq, msg.Type, msg.Body, msg.CreatedAt);
            }
            catch (Exception ex)
            {
                //await tx.RollbackAsync(ct);
                _logger.LogError
                    (ex, "Error sending message to conversation {ConversationId}", request.ConversationId);
                throw;
            }
        }
    }
}