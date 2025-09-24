using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class BlockUserDto
    {
        [Required]
        [StringLength(32, MinimumLength = 3)]
        public string TargetHandle { get; set; } = default!;

        [StringLength(200)]
        public string? Reason { get; set; }
    }
}