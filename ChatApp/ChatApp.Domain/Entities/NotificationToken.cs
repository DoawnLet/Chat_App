using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class NotificationToken : AuditableEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid DeviceId { get; set; }
        public string Token { get; set; } = default!;
        public Platform Platform { get; set; }
        public DateTimeOffset UpdatedAtToken { get; set; } = DateTimeOffset.UtcNow;

        public User User { get; set; } = default!;
        public Device Device { get; set; } = default!;
    }
}