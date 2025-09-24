using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class User : AuditableEntity
    {
        public Guid Id { get; set; }
        public string Handle { get; set; } = default!;
        public string DisplayName { get; set; } = default!;
        public string? AvatarUrl { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string PasswordHash { get; set; } = default!;
        public DateTimeOffset? LastSeenAt { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Device> Devices { get; set; } = new List<Device>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public ICollection<Contact> ContactsOwned { get; set; } = new List<Contact>();
        public ICollection<Contact> ContactsTargeted { get; set; } = new List<Contact>();
        public ICollection<ConversationMember> Memberships { get; set; } = new List<ConversationMember>();
    }
}