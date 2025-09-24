using ChatApp.Application.DTOs;
using ChatApp.Application.Exceptions.Responses;
using ChatApp.Domain.Enum;

namespace ChatApp.Application.Abstractions.IServices
{
    public interface IContactService
    {
        Task<GenericResponse<FriendRequestDto>> SendFriendRequestAsync(Guid userId, SendFriendRequestDto request);

        Task<GenericResponse<FriendRequestDto>> ResponseToFriendRequestAsync(Guid userId, ResponseFriendRequestDto request);

        Task<Response> BlockUserAsync(Guid userid, BlockUserDto request);

        Task<Response> UnBlockUserAsync(Guid userid, string targetHandle);

        Task<Response> RemoveRequestFriendAysnc(Guid userid, string friendHandle);

        Task<GenericResponse<ContactStatus>> GetRelationShipStatusAsync(Guid userid, string handle);

        Task<PagedResult<FriendRequestDto>> GetPendingFriendRequestsAsync(Guid userId, int page = 1, int pageSize = 20);

        Task<PagedResult<FriendRequestDto>> GetSentFriendRequestsAsync(Guid userId, int page = 1, int pageSize = 20);

        Task<PagedResult<FriendDto>> GetFriendsAsync(Guid userId, int page = 1, int pageSize = 20);

        Task<PagedResult<UserProfileDto>> GetBlockedUsersAsync(Guid userId, int page = 1, int pageSize = 20);
    }
}