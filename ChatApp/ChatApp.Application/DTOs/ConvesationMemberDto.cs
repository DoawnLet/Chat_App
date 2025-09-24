using ChatApp.Domain.Enum;

namespace ChatApp.Application.DTOs
{
    public class ConvesationMemberDto
    {
        public UserProfileDto User { get; set; } = default!;
        public MemberRole Role { get; set; }
        public DateTimeOffset JointAt { get; set; }
        public DateTimeOffset LastReadReq { get; set; }
        public bool IsMuted { get; set; }

        public DateTimeOffset? MuteUntill
        {
            get;
            set;
        }
    }
}