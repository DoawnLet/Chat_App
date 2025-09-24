using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public string Handle { get; set; } = default!;
        public string DisplayName { get; set; } = default!;
        public string? AvatarUrl { get; set; }
        public DateTimeOffset? LastSeenAt { get; set; }
        public bool IsActive { get; set; }
    }
}