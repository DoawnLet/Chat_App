using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class ConversationSummaryDto
    {
        public Guid Id { get; set; }

        public ConversationType ConversationType { get; set; }
        public string DisplayName { get; set; }
        public string? Avatar { get; set; }
        public DateTimeOffset? LastMessageAt { get; set; }
        public string? LastMessagePreview { get; set; }

        public int UnreadCount { get; set; }

        public bool IsMuted { get; set; }

        public DateTimeOffset? MutedUntil { get; set; }
    }
}