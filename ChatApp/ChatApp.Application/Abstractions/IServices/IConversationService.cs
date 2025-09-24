using ChatApp.Application.DTOs;
using ChatApp.Application.Exceptions.Responses;

namespace ChatApp.Application.Abstractions.IServices
{
    public interface IConversationService
    {
        //Create conversation
        Task<GenericResponse<ConversationDto>> CreateDirectConversationAsync(Guid userId, CreateDirectConversationDto request);

        Task<GenericResponse<ConversationDto>> CreateGroupConversationAsync(Guid userId, CreateGroupConversationDto request);

        //Manage group conversation
        Task<GenericResponse<ConversationDto>> UpdateGroupConversationAsync(Guid userid, Guid conversationid, UpdateConversationDto request);

        Task<Response> DeleteGroupConversationAsync(Guid userId, Guid conversationId);

        Task<Response> LeaveGroupConversationAsync(Guid userId, Guid conversationId);

        //Manage Memeber in group
        Task<Response> AddMembersAsync(Guid userId, Guid conversationId, AddMembersDto request);

        Task<Response> RemoveMemberAsync(Guid userId, Guid conversationId, string memberHandle);

        Task<Response> UpdateMemberRoleAsync(Guid userId, Guid conversationId, UpdateMemberRoleDto request);

        //
    }
}