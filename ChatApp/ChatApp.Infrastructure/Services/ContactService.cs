using AutoMapper;
using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using ChatApp.Application.Exceptions.Responses;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class ContactService(AppDbContext context, IMapper mapper) : IContactService
    {
        public async Task<Response> UnBlockUserAsync(Guid userid, string targetHandle)
        {
            var blockList = await context.Contacts.Include(c => c.Target)
                .FirstOrDefaultAsync(c => c.OwnerId == userid &&
                                           c.Target.Handle == targetHandle &&
                                           c.Status == ContactStatus.Blocked);

            if (blockList is null)
                return new Response(false, "Do not have user in list block");

            context.Contacts.Remove(blockList);
            await context.SaveChangesAsync();

            return new Response(true, "Cancel block friend success!");
        }

        public async Task<Response> BlockUserAsync(Guid userid, BlockUserDto request)
        {
            var getUserById = await GetUserById(userid);
            if (getUserById is null)
            {
                return new Response(false, "Not found ");
            }

            var getUserByHandle = await GetUserByHandle(request.TargetHandle);
            if (getUserByHandle is null)
                return new Response(false, "Not found");

            var currentUser = getUserById.Data;
            var targetUser = getUserByHandle.Data;

            //Tìm và xóa các quan hệ hiện đang có hoặc nếu có
            var existingContact = await context.Contacts
                .Where(u => (u.OwnerId == userid && u.TargetId == targetUser.Id) ||
                            (u.OwnerId == currentUser.Id && u.TargetId == userid))
                .ToListAsync();

            if (existingContact is null)
                return new Response(false, "User is not exist in list block");

            context.Contacts.RemoveRange(existingContact);

            //Tạo danh sách block
            var blockList = new Contact
            {
                Id = Guid.NewGuid(),
                OwnerId = userid,
                TargetId = targetUser.Id,
                Status = ContactStatus.Blocked,
                Note = request.Reason,
            };

            context.Contacts.Add(blockList);

            return new Response(true, "Add item in list block user sucessfully");
        }

        public async Task<Response> RemoveRequestFriendAysnc(Guid userid, string friendHandle)
        {
            var getUser = await GetUserByHandle(friendHandle);
            if (getUser is null) return new Response(false, "Not found");

            var targetUser = getUser.Data;

            var friendShips = await context.Contacts.
                    Where(c => (c.OwnerId == userid && c.Target.Id == targetUser.Id) ||
                                (c.OwnerId == targetUser.Id && c.TargetId == userid))
                    .ToListAsync();

            if (friendShips is null) return new Response(false, "Friendship not found");

            context.Contacts.RemoveRange(friendShips);

            await context.SaveChangesAsync();

            return new Response(true, "RDelete friend request successfully");
        }

        public async Task<GenericResponse<ContactStatus>> GetRelationShipStatusAsync(Guid userid, string handle)
        {
            var getUser = await GetUserById(userid);
            var targetUser = getUser.Data;
            if (getUser is null) return new GenericResponse<ContactStatus>(false, "Not found");

            var contact = await context.Contacts
                .FirstOrDefaultAsync(c => (c.OwnerId == userid && c.TargetId == targetUser.Id) ||
                (c.OwnerId == targetUser.Id && c.TargetId == userid));

            if (contact is null) return new GenericResponse<ContactStatus>(false, "Not found");

            return new GenericResponse<ContactStatus>(true, "Contact relationship list", contact.Status);
        }

        public async Task<GenericResponse<FriendRequestDto>> ResponseToFriendRequestAsync(Guid userId, ResponseFriendRequestDto response)
        {
            var friendRequest = await context.Contacts.Include(c => c.Owner).Include(c => c.Target)
                .FirstOrDefaultAsync(c => c.Id == response.RequestId &&
                                          c.TargetId == userId &&
                                          c.Status == ContactStatus.Pending);
            if (friendRequest is null)
                return new GenericResponse<FriendRequestDto>(false, "Friend request not found or already proccessed");

            if (response.Accept)
            {
                //Cập nhật trạng thánh thành chấp nhân
                friendRequest.Status = ContactStatus.Accepted;

                var reverseContact = new Contact
                {
                    Id = Guid.NewGuid(),
                    OwnerId = userId,
                    TargetId = friendRequest.OwnerId,
                    Status = ContactStatus.Accepted,
                    Note = "Auto-create reverse friendship"
                };
                context.Contacts.Add(reverseContact);
            }
            else
            {
                //xóa request
                context.Contacts.Remove(friendRequest);
            }

            await context.SaveChangesAsync();
            return new GenericResponse<FriendRequestDto>(true, "Accept friend successfully", mapper.Map<FriendRequestDto>(friendRequest));
        }

        public async Task<GenericResponse<FriendRequestDto>> SendFriendRequestAsync(Guid userId, SendFriendRequestDto request)
        {
            //Sử dụng await để lấy kết quả thực tế phải chờ thực hiện.
            var userHandle = await GetUserByHandle(request.TagerHandle);

            if (userHandle == null)
                return new GenericResponse<FriendRequestDto>(false, "Not Found", null!);

            var userById = await GetUserById(userId);
            if (userById == null)
                return new GenericResponse<FriendRequestDto>(false, "Not found", null!);

            //Lấy dữ liệu từ GenerericResponse
            var targetUser = userHandle.Data;
            var currentUser = userById.Data;

            //Kiểm tra có các tài khoản có liên kết với nhau hay chưa
            var existingContact = await context.Contacts
                .FirstOrDefaultAsync(u =>
                (u.OwnerId == userId && u.TargetId == targetUser.Id) ||
                (u.OwnerId == currentUser.Id && u.TargetId == userId));

            if (existingContact != null)
            {
                return existingContact.Status switch
                {
                    ContactStatus.Accepted => new GenericResponse<FriendRequestDto>(false, "Already Friend"),

                    ContactStatus.Pending => new GenericResponse<FriendRequestDto>(false, "Friend request already sent"),

                    ContactStatus.Blocked => new GenericResponse<FriendRequestDto>(false, "Cannot send friend request"),

                    _ => new GenericResponse<FriendRequestDto>(false, "Unknow relationship status")
                };
            }

            //Tạo request
            var friendRequest = new Contact
            {
                Id = Guid.NewGuid(),
                OwnerId = userId,
                TargetId = targetUser.Id,
                Status = ContactStatus.Accepted,
                Note = request.Note
            };

            context.Contacts.Add(friendRequest);
            await context.SaveChangesAsync();

            //Load lại trả về response
            var result = await context.Contacts.Include(c => c.Owner).Include(c => c.Target).FirstAsync(c => c.Id == friendRequest.Id);

            return new GenericResponse<FriendRequestDto>(true, "Friend request sent succesfully!", mapper.Map<FriendRequestDto>(result));
        }

        public async Task<PagedResult<FriendRequestDto>> GetPendingFriendRequestsAsync(Guid userId, int page = 1, int pageSize = 20)
        {
            var query = context.Contacts
                .Include(c => c.Owner)
                .Include(c => c.Target)
                .Where(c => c.TargetId == userId && c.Status == ContactStatus.Pending);

            var totalCount = await query.CountAsync();

            //Không thể tích hợp mapper vào nên phải tách ra
            var items = await query
                .Skip((page - 1) * pageSize).Take(pageSize)
                .ToListAsync();

            var friendRequests = items.Select(c => mapper.Map<FriendRequestDto>(c)).ToList();

            return new PagedResult<FriendRequestDto>
            {
                Items = friendRequests,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<FriendRequestDto>> GetSentFriendRequestsAsync(Guid userId, int page = 1, int pageSize = 20)
        {
            var query = context.Contacts
                 .Include(c => c.Owner)
                 .Include(c => c.Target)
                 .Where(c => c.TargetId == userId && c.Status == ContactStatus.Pending);

            var totalCount = await query.CountAsync();

            //Không thể tích hợp mapper vào nên phải tách ra
            var items = await query
                .Skip((page - 1) * pageSize).Take(pageSize)
                .ToListAsync();

            var friendRequests = items.Select(c => mapper.Map<FriendRequestDto>(c)).ToList();

            return new PagedResult<FriendRequestDto>
            {
                Items = friendRequests,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<FriendDto>> GetFriendsAsync(Guid userId, int page = 1, int pageSize = 20)
        {
            var query = context.Contacts.Include(c => c.Target)
                .Where(c => c.OwnerId == userId && c.Status == ContactStatus.Accepted)
                .OrderBy(c => c.Target.DisplayName);

            var totalCount = await query.CountAsync();
            var items = await query
                 .Skip((page - 1) * pageSize).Take(pageSize)
                 .ToListAsync();

            var list = items.Select(c => new FriendDto
            {
                Id = c.Id,
                Friend = mapper.Map<UserProfileDto>(c.Target),
                FriendsSince = c.CreatedAt,
                Note = c.Note,
            }).ToList();

            return new PagedResult<FriendDto>
            {
                Items = list,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<UserProfileDto>> GetBlockedUsersAsync(Guid userId, int page = 1, int pageSize = 20)
        {
            var query = context.Contacts
                .Include(c => c.Target)
                .Where(c => c.OwnerId == userId && c.Status == ContactStatus.Blocked)
                .OrderByDescending(c => c.UpdatedAt);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<UserProfileDto>
            {
                Items = mapper.Map<List<UserProfileDto>>(items.Select(c => c.Target)),
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        private async Task<GenericResponse<UserProfileDto>> GetUserByHandle(string handle)
        {
            var getUser = await context.Users.FirstOrDefaultAsync(u => u.Handle == handle && u.IsActive == true);
            if (getUser is null)
            {
                return new GenericResponse<UserProfileDto>(false, "User is not found", null!);
            }

            var user = new UserProfileDto
            {
                Id = getUser.Id,
                Handle = getUser.Handle,
                DisplayName = getUser.DisplayName,
                AvatarUrl = getUser.AvatarUrl
            };

            return new GenericResponse<UserProfileDto>(true, "User is found", user);
        }

        private async Task<GenericResponse<UserProfileDto>> GetUserById(Guid id)
        {
            var getUser = await context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (getUser is null)
            {
                return new GenericResponse<UserProfileDto>(false, "User is not found", null!);
            }

            var user = new UserProfileDto
            {
                Id = getUser.Id,
                Handle = getUser.Handle,
                DisplayName = getUser.DisplayName,
                AvatarUrl = getUser.AvatarUrl
            };

            return new GenericResponse<UserProfileDto>(true, "User is found", user);
        }
    }
}