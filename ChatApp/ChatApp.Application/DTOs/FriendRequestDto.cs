using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class FriendRequestDto
    {
        public Guid Id { get; set; }
        public UserProfileDto Sender { get; set; } = default!;
        public UserProfileDto Target { get; set; } = default!;
        public ContactStatus Status { get; set; }
        public string? Note { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}