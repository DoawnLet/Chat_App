using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class Message : AuditableEntity
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }
        public long Seq { get; set; }                       // tăng dần trong phạm vi 1 conversation
        public string ClientMessageId { get; set; } = default!; // idempotency từ client
        public MessageType Type { get; set; } = MessageType.Text;
        public string Body { get; set; } = "";              // JSON text: { "text": "...", ... }
        public DateTimeOffset? EditedAt { get; set; }
        public DateTimeOffset? DeletedAt { get; set; }

        public Conversation Conversation { get; set; } = default!;
        public User Sender { get; set; } = default!;
        public ICollection<MessageAttachment> Attachments { get; set; } = new List<MessageAttachment>();
        public ICollection<MessageReceipt> Receipts { get; set; } = new List<MessageReceipt>();
        public ICollection<MessageReaction> Reactions { get; set; } = new List<MessageReaction>();
    }
}