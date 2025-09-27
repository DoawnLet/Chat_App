using AutoMapper;
using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Helps.Mapping
{
    public class ConversionProfile : Profile
    {
        public ConversionProfile()
        {
            CreateMap<ConversationMember, ConvesationMemberDto>();

            //CreateMap<Conversation, ConversationDto>()
            //    .ForMember(dest => dest.CreateBy,
            //    opt => opt.MapFrom(src => new UserProfileDto
            //    {
            //        Id = src.CreatedBy
            //    }))
            //.ForMember(dest => dest.LastMessageAt,
            //    opt => opt.MapFrom(src => src.LastMessageAt ?? DateTimeOffset.MinValue))
            //.ForMember(dest => dest.Members,
            //    opt => opt.MapFrom(src => src.Members)) // tốt nhất đổi sang ConversationMemberDto
            //.ForMember(dest => dest.UnreadCount, opt => opt.Ignore())
            //.ForMember(dest => dest.MuteUntil, opt => opt.Ignore()); ;

            // Conversation -> ConversationDto
            CreateMap<Conversation, ConversationDto>()
                .ForMember(dest => dest.CreateAt, opt => opt.MapFrom((src, dest, destMember, context) =>
                {
                    // Tìm user tạo conversation trong danh sách members
                    var creator = src.Members.FirstOrDefault(m => m.UserId == src.CreatedBy);
                    return creator?.User != null ? context.Mapper.Map<UserProfileDto>(creator.User) : null;
                }))
                .ForMember(dest => dest.UnreadCount, opt => opt.Ignore()) // Sẽ calculate riêng
                .ForMember(dest => dest.MuteUntil, opt => opt.MapFrom((src, dest, destMember, context) =>
                {
                    // Lấy từ context nếu có currentUserId
                    if (context.Items.TryGetValue("CurrentUserId", out var userIdObj) && userIdObj is Guid currentUserId)
                    {
                        var membership = src.Members.FirstOrDefault(m => m.UserId == currentUserId);
                        return membership?.MutedUntil.HasValue == true && membership.MutedUntil.Value > DateTimeOffset.UtcNow;
                    }
                    return false;
                }))
                .ForMember(dest => dest.MuteUntil, opt => opt.MapFrom((src, dest, destMember, context) =>
                {
                    if (context.Items.TryGetValue("CurrentUserId", out var userIdObj) && userIdObj is Guid currentUserId)
                    {
                        var membership = src.Members.FirstOrDefault(m => m.UserId == currentUserId);
                        return membership?.MutedUntil;
                    }
                    return null;
                }));
        }
    }
}