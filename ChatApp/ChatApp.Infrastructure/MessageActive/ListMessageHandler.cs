using ChatApp.Application.DTOs;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.MessageActive
{
    public class ListMessageHandler(AppDbContext context) : IRequestHandler<ListMessageQuery, IReadOnlyList<MessageDto>>
    {
        public async Task<IReadOnlyList<MessageDto>> Handle(ListMessageQuery request, CancellationToken ct)
        {
            var query = context.Messages.Where(m => m.ConversationId == request.ConversationId);

            if (request.AftterSeq is long s) query = query.Where(m => m.Seq > s);

            return await query.OrderBy(m => m.Seq)
                .Take(Math.Clamp(request.limit, 1, 200))
                .Select(m => new MessageDto(m.Id, m.ConversationId, m.SenderId, m.Seq, m.Type, m.Body, m.CreatedAt))
                .ToListAsync(ct);
        }
    }
}