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

            CreateMap<Conversation, ConversationDto>()
                .ForMember(dest => dest.CreateBy,
                opt => opt.MapFrom(src => new UserProfileDto
                {
                    Id = src.CreatedBy
                }))
            .ForMember(dest => dest.LastMessageAt,
                opt => opt.MapFrom(src => src.LastMessageAt ?? DateTimeOffset.MinValue))
            .ForMember(dest => dest.Members,
                opt => opt.MapFrom(src => src.Members)) // tốt nhất đổi sang ConversationMemberDto
            .ForMember(dest => dest.UnreadCount, opt => opt.Ignore())
            .ForMember(dest => dest.MuteUntil, opt => opt.Ignore()); ;
        }
    }
}