using ChatApp.Application.Abstractions.IRepositories;
using ChatApp.Application.DTOs;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Repositories
{
    public class UserRepository(AppDbContext context) : IUserRepository
    {
        public async Task<List<UserForSearchDto>> GetUserByHandleOrName(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return new List<UserForSearchDto>();

            var users = await context.Users
                .Where(u => u.IsActive &&
                u.Handle.ToLower().Contains(keyword.ToLower()) ||
                u.DisplayName.ToLower().Contains(keyword.ToLower()))
                .Select(u => new UserForSearchDto
                {
                    Id = u.Id,
                    Handle = u.Handle,
                    DisplayName = u.DisplayName,
                    AvatarUrl = u.AvatarUrl,
                }).ToListAsync();

            return users;
        }

        public async Task<(List<UserForSearchDto> Users, int TotalCount)> SearchUsers(string keyword, int pageNumber = 1, int pageSize = 10)
        {
            var query = context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var normalizedKeyword = keyword.ToLower();
                query = query.Where(u =>
                    u.Handle.ToLower().Contains(normalizedKeyword) ||
                    u.DisplayName.ToLower().Contains(normalizedKeyword) ||
                    (u.Email != null && u.Email.ToLower().Contains(normalizedKeyword)));
            }

            var totalCount = await query.CountAsync();

            var users = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .OrderBy(u => u.DisplayName)
                .Select(u => new UserForSearchDto
                {
                    Id = u.Id,
                    Handle = u.Handle,
                    DisplayName = u.DisplayName,
                    AvatarUrl = u.AvatarUrl!,
                })
                .ToListAsync();

            return (users, totalCount);
        }
    }
}