using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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