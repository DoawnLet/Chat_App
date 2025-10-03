using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class MessagePush
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }
        public long Seq { get; set; }
        public MessageType Type { get; set; }
        public string Body { get; set; } = "";
        public DateTimeOffset CreatedAt { get; set; }
    }
}