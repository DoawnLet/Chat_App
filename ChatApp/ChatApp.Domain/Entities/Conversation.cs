using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;

namespace ChatApp.Domain.Entities
{
    public class Conversation : AuditableEntity
    {
        public Guid Id { get; set; }
        public ConversationType Type { get; set; }
        public string? Title { get; set; }                  // dùng cho Group
        public string? AvatarUrl { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? LastMessageId { get; set; }
        public DateTimeOffset? LastMessageAt { get; set; }

        /// <summary>
        /// Dùng cho Direct: key duy nhất min(UserA,UserB)+max(UserA,UserB) để chống trùng hội thoại 1-1.
        /// Với Group để null.
        /// </summary>
        public string? DirectKey { get; set; }

        public ICollection<ConversationMember> Members { get; set; } = new List<ConversationMember>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}