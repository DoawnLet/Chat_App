using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class SendFriendRequestDto
    {
        [Required]
        [StringLength(32, MinimumLength = 3)]
        public string TagerHandle { get; set; }

        public string? Note { get; set; }
    }
}