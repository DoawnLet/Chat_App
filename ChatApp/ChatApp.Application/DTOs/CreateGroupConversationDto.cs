using System.ComponentModel.DataAnnotations;

namespace ChatApp.Application.DTOs
{
    public class CreateGroupConversationDto
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Title { get; set; }

        [StringLength(500)]
        public string? AvatarUrl { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one number is required")]
        [MaxLength(50, ErrorMessage = "Maxium 50 number allowed")]
        public List<string> MemberHandle { get; set; } = new();
    }
}