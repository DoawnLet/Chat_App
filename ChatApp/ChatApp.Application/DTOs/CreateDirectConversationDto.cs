using System.ComponentModel.DataAnnotations;

namespace ChatApp.Application.DTOs
{
    public record CreateDirectConversationDto
    {
        [Required]
        [StringLength(32, MinimumLength = 3)]
        public string TargetHandle { get; set; } = default!;
    };
}