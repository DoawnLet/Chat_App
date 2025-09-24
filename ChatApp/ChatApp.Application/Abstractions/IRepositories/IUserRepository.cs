using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;
using System.Linq.Expressions;

namespace ChatApp.Application.Abstractions.IRepositories
{
    public interface IUserRepository
    {
        // Tìm kiếm cơ bản theo từ khóa
        Task<List<UserForSearchDto>> GetUserByHandleOrName(string keyword);

        // Tìm kiếm với phân trang
        Task<(List<UserForSearchDto> Users, int TotalCount)> SearchUsers(
            string keyword,
            int pageNumber = 1,
            int pageSize = 10);
    }
}