using ChatApp.Domain.Enum;

namespace ChatApp.Domain.Entities
{
    public class ConversationMember : AuditableEntity
    {
        public Guid ConversationId { get; set; }
        public Guid UserId { get; set; }
        public MemberRole Role { get; set; } = MemberRole.Member;
        public DateTimeOffset JoinedAt { get; set; } = DateTimeOffset.UtcNow;
        public long LastReadSeq { get; set; } = 0L;
        public DateTimeOffset? MutedUntil { get; set; }

        public Conversation Conversation { get; set; } = default!;
        public User User { get; set; } = default!;
    }
}