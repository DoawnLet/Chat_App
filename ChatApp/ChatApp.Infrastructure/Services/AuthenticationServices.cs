using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using ChatApp.Application.Exceptions.Responses;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ChatApp.Infrastructure.Services
{
    public class AuthenticationServices(AppDbContext context, IConfiguration config) : IAuthenticationService
    {
        public async Task<UserDto> GetUser(int userId)
        {
            var users = await context.Users.FindAsync(userId);
            return users is not null ? new UserDto() : null!;
        }

        public async Task<Response> LoginAsync(UserLoginDto dto)
        {
            var getUser = await GetUserByEmail(dto.Email);
            if (getUser is null) return new Response(false, "Emaill is invalid, Please check email again");

            //var verifyPassword = BCrypt.Net.BCrypt.Verify(dto.Password, getUser.PasswordHash);
            var verifyPassword = BCrypt.Net.BCrypt.Verify(dto.Password, getUser.PasswordHash);
            if (!verifyPassword)
                return new Response(false, "Password is incorrect");

            string token = GeneratedToken(getUser);
            return new Response(true, token);
        }

        public async Task<Response> RegisterAsync(UserRegisterDto dto)
        {
            try
            {
                var getUserHandle = await GetUserByHandle(dto.Handle);
                if (getUserHandle is not null)
                {
                    return new Response(false, $"You cannot use this handle for registration");
                }

                var getUserEmail = await GetUserByEmail(dto.Email);
                if (getUserEmail is not null)
                {
                    return new Response(false, $"You cannot use this email for registration");
                }

                var result = context.Users.Add(new User()
                {
                    Id = Guid.NewGuid(),
                    Handle = dto.Handle,
                    DisplayName = dto.DisplayName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    AvatarUrl = dto.AvatarUrl,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    IsActive = true,
                    LastSeenAt = DateTimeOffset.UtcNow
                });

                await context.SaveChangesAsync();
                return result.Entity.Id != Guid.Empty ? new Response(true, "User register successfully") : new Response(false, "User Register Faill");
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết
                Console.WriteLine($"Registration error: {ex.Message}");
                return new Response(false, $"Registration failed: {ex.Message}");
            }
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email);
            return user is not null ? user! : null!;
        }

        public async Task<User?> GetUserByHandle(string handle)
        {
            if (string.IsNullOrEmpty(handle))
                return null;

            return await context.Users.FirstOrDefaultAsync(x => x.Handle == handle);
        }

        public string GeneratedToken(User user)
        {
            var devicedId = Guid.NewGuid();
            var now = DateTimeOffset.UtcNow;
            var expires = now.AddDays(7);

            var key = Encoding.UTF8.GetBytes(config.GetSection("Authentication:key").Value!);
            var securityKey = new SymmetricSecurityKey(key);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
                {
                    new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                    new("uid", user.Id.ToString()),
                    new("handle", user.Handle),
                    new("deviceId", devicedId.ToString())
                };

            var token = new JwtSecurityToken(
               issuer: config["Authentication:Issuer"],
               audience: config["Authentication:Audience"],
               claims: claims,
               expires: expires.DateTime,
               signingCredentials: credentials
               );

            //Tạo và lưu refresh token
            SaveRefreshToken(user.Id, devicedId, expires);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SaveRefreshToken(Guid userId, Guid deviceId, DateTimeOffset expiresAt)
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            var token = Convert.ToBase64String(bytes);

            string tokenHash = BCrypt.Net.BCrypt.HashPassword(token);

            var refreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                DeviceId = deviceId,
                TokenHash = tokenHash,
                ExpiresAt = expiresAt,
                RevokedAt = DateTimeOffset.UtcNow
            };

            // Tạo mới Device nếu cần
            var device = new Device
            {
                Id = deviceId,
                UserId = userId,
                Platform = Platform.Web, // Hoặc xác định từ context
                LastActiveAt = DateTimeOffset.UtcNow
            };

            context.Devices.Add(device);
            context.RefreshTokens.Add(refreshToken);
            context.SaveChanges();
        }
    }
}