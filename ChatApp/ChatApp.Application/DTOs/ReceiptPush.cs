using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class ReceiptPush
    {
        public Guid MessageId { get; set; }
        public Guid UserId { get; set; }
        public ReceiptStatus Status { get; set; }
        public DateTimeOffset Timestamp { get; set; }
    }
}