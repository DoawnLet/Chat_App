using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using ChatApp.Presentation.Realtime.ChatHubs;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Presentation.Realtime
{
    internal class SignalRMessageBus : IMessageBus
    {
        private readonly IHubContext<ChatHub, IChatClient> _hub;

        public SignalRMessageBus(IHubContext<ChatHub, IChatClient> hub) => _hub = hub;

        public async Task publicMessageCreatedAsync(MessageCreatedEvent evt)
        {
            // Nhắm tới group "conv:{conversationId}"
            await _hub.Clients.Group($"conv:{evt.ConversationId}")
                .MessageCraete(new MessagePush
                {
                    Id = evt.Id,
                    ConversationId = evt.ConversationId,
                    SenderId = evt.SenderId,
                    Seq = evt.Seq,
                    Type = evt.Type,
                    Body = evt.Body,
                    CreatedAt = evt.CreatedAt
                });
        }
    }
}