using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;

namespace ChatApp.Application.DTOs
{
    public class ConversationDto
    {
        public Guid Id { get; set; }
        public ConversationType Type { get; set; }
        public string? Title { get; set; }
        public UserProfileDto CreateBy { get; set; }
        public DateTimeOffset CreateAt { get; set; }

        public DateTimeOffset LastMessageAt
        {
            get; set;
        }

        public List<ConversationMember> Members { get; set; } = new();

        public int UnreadCount { get; set; }
        public DateTimeOffset MuteUntil { get; set; }
    }
}