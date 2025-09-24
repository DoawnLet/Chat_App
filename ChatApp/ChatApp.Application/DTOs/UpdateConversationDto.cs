using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class UpdateConversationDto
    {
        [StringLength(100, MinimumLength = 1)]
        public string? Title { get; set; }

        [StringLength(900)]
        public string? AvatarUrl { get; set; }
    }
}