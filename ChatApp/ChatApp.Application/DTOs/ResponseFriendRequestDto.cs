using System.ComponentModel.DataAnnotations;

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
