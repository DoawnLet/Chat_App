using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class ResponseFriendRequestDto
    {
        [Required]
        public Guid RequestId { get; set; }

        [Required]
        public bool Accept { get; set; } // true = accept, false = reject
    }
}