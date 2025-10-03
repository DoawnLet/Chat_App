using ChatApp.Application.DTOs;
using ChatApp.Domain.Enum;
using MediatR;

namespace ChatApp.Infrastructure.MessageActive
{
    public class SendMessageCommand : IRequest<MessageDto>
    {
        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }
        public string? ClientMessageId { get; set; }
        public string? Text { get; set; }
        public MessageType Type = MessageType.Text;

        // Thêm constructor
        public SendMessageCommand(
            Guid conversationId,
            Guid senderId,
            string? clientMessageId,
            string? text,
            MessageType type = MessageType.Text)
        {
            ConversationId = conversationId;
            SenderId = senderId;
            ClientMessageId = clientMessageId;
            Text = text;
            Type = type;
        }

        // Thêm constructor không tham số để duy trì khả năng tương thích
        public SendMessageCommand() { }
    }
}