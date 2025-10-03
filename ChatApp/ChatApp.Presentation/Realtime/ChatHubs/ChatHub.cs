using ChatApp.Application.Abstractions.IServices;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Presentation.Realtime.ChatHubs
{
    /// <summary>
    /// Đã có custom tại service của ConversationSerivice
    /// Vào đó mà xem mà ứng dụng
    /// Kiểm tra xem nó được thực hiện theo thời gian thực của ứng dụng hay không
    /// </summary>
    public class ChatHub : Hub<IChatClient>
    {
        public Task JoinConversation(Guid conversationId) =>
        Groups.AddToGroupAsync(Context.ConnectionId, $"conv:{conversationId}");

        public Task LeaveConversation(Guid conversationId) =>
            Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conv:{conversationId}");
    }
}