using ChatApp.Domain.Enum;

namespace ChatApp.Application.DTOs
{
    public record MessageDto
    (
        Guid Id,
        Guid ConversationId,
        Guid SenderId,
        long Seq,
        MessageType Type,
        string Body,
        DateTimeOffset CreatedAt
    );
}