using AutoMapper;
using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Helps.Mapping
{
    public class MapToFriendRequestProfile : Profile

    {
        public MapToFriendRequestProfile()
        {
            CreateMap<Contact, FriendRequestDto>()
             .ForMember(dest => dest.Sender, opt => opt.MapFrom(src => src.Owner))
             .ForMember(dest => dest.Target, opt => opt.MapFrom(src => src.Target))
             .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        }
    }
}