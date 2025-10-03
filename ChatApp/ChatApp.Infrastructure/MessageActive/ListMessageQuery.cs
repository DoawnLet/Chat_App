using ChatApp.Application.DTOs;
using MediatR;

namespace ChatApp.Infrastructure.MessageActive
{
    public record class ListMessageQuery
    (Guid ConversationId, long? AftterSeq, int limit = 50) : IRequest<IReadOnlyList<MessageDto>>;
}