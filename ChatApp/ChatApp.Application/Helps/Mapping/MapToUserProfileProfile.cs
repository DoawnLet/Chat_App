using AutoMapper;
using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Helps.Mapping
{
    public class MapToUserProfileProfile : Profile
    {
        public MapToUserProfileProfile()
        {
            CreateMap<User, UserProfileDto>();
        }
    }
}