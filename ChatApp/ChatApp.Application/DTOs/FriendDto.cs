using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class FriendDto
    {
        public Guid Id { get; set; }
        public UserProfileDto Friend { get; set; } = default!;
        public DateTimeOffset FriendsSince { get; set; }
        public string? Note { get; set; }
    }
}