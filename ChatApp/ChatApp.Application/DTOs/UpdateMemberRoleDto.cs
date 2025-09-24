using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class UpdateMemberRoleDto
    {
        [Required]
        public string MemberHandle { get; set; } = default!;

        [Required]
        public MemberRole NewRole { get; set; }
    }
}