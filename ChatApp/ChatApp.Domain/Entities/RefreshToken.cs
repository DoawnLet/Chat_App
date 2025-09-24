using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class RefreshToken : AuditableEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid DeviceId { get; set; }
        public string TokenHash { get; set; } = default!;
        public DateTimeOffset ExpiresAt { get; set; }
        public DateTimeOffset? RevokedAt { get; set; }
        public string? Reason { get; set; }

        public User User { get; set; } = default!;
        public Device Device { get; set; } = default!;
    }
}