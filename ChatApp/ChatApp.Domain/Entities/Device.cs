using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class Device : AuditableEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Platform Platform { get; set; }
        public string? AppVersion { get; set; }
        public string? LastIp { get; set; }
        public DateTimeOffset? LastActiveAt { get; set; }

        public User User { get; set; } = default!;
        public ICollection<NotificationToken> NotificationTokens { get; set; } = new List<NotificationToken>();
    }
}