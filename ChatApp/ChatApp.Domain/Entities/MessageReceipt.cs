using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class MessageReceipt : AuditableEntity
    {
        public Guid Id { get; set; }
        public Guid MessageId { get; set; }
        public Guid UserId { get; set; }
        public ReceiptStatus Status { get; set; }
        public DateTimeOffset Timestamp { get; set; }

        public Message Message { get; set; } = default!;
        public User User { get; set; } = default!;
    }
}