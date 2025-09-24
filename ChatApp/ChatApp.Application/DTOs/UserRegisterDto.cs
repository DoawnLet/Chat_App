using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class UserRegisterDto
    {
        [Required, StringLength(32, MinimumLength = 3)]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Handle can only contain letters, numbers and underscore")]
        public string Handle { get; set; } = default!;

        [Required, StringLength(64, MinimumLength = 2)]
        public string DisplayName { get; set; } = default!;

        [Required, StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = default!;

        [Required, EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public string? AvatarUrl { get; set; }
    }
}