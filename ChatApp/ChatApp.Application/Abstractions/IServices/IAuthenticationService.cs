using ChatApp.Application.DTOs;
using ChatApp.Application.Exceptions.Responses;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Abstractions.IServices
{
    public interface IAuthenticationService
    {
        //Kiểm soát đầu ra bằng response hoặc dto response
        Task<Response> RegisterAsync(UserRegisterDto dto);

        Task<Response> LoginAsync(UserLoginDto dto);

        Task<UserDto> GetUser(int userId);

        Task<User> GetUserByHandle(string handle);
    }
}