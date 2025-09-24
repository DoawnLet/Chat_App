using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    // 11) MessageReaction
    public class MessageReaction : AuditableEntity
    {
        public Guid Id { get; set; }
        public Guid MessageId { get; set; }
        public Guid UserId { get; set; }
        public string Emoji { get; set; } = default!;
        public DateTimeOffset Created { get; set; } = DateTimeOffset.UtcNow;

        public Message Message { get; set; } = default!;
        public User User { get; set; } = default!;
    }
}