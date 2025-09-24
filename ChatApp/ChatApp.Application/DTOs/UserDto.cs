using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class UserDto
    {
        public string DisplayName { get; set; } = default!;
        public string? AvatarUrl { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}