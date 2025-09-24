using System.ComponentModel.DataAnnotations;

namespace ChatApp.Application.DTOs
{
    public class AddMembersDto
    {
        [Required]
        [MinLength(1)]
        [MaxLength(20, ErrorMessage = "Maximum 20 members can be added at once")]
        public List<string> MemberHandles { get; set; } = new();
    }
}