using AutoMapper;
using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using ChatApp.Application.Exceptions.Responses;
using ChatApp.Application.Helps;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Polly;

namespace ChatApp.Infrastructure.Services
{
    public class ConversationService(AppDbContext context, IMapper mapper, Utils utils) : IConversationService
    {
        public async Task<GenericResponse<ConversationDto>> CreateDirectConversationAsync(Guid userId, CreateDirectConversationDto request)
        {
            // Tìm kiếm user
            var targetUser = await context.Users.FirstOrDefaultAsync(u => u.Handle == request.TargetHandle && u.IsActive);

            if (targetUser is null) return new GenericResponse<ConversationDto>(false, "Not found user");

            if (targetUser.Id == userId) return new GenericResponse<ConversationDto>(false, "Cannot create conversation yourself");

            //kiểm tra xem có phải là bạn bè không?
            var friendShip = await context.Contacts
                .AnyAsync(c => (c.OwnerId == userId && c.TargetId == targetUser.Id) ||
                                (c.OwnerId == targetUser.Id && c.TargetId == userId) &&
                                c.Status == ContactStatus.Accepted);

            if (!friendShip) return new GenericResponse<ConversationDto>(false, "Can only create conversation with friends");

            //Tạo DirectKey tránh duplication
            var directkey = utils.GenerateDirectkey(userId, targetUser.Id);

            //Kiểm tra conversation đã tồn tại hay chưa
            var existingConversation = await context.Conversations
                .Include(c => c.Members)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(c => c.DirectKey == directkey);

            if (existingConversation is not null)
            {
                //Nếu user chưa là member, thêm lại
                var userMembership = existingConversation.Members.FirstOrDefault(m => m.UserId == userId);
                if (userMembership is null)
                {
                    var newMember = new ConversationMember
                    {
                        ConversationId = existingConversation.Id,
                        UserId = userId,
                        Role = MemberRole.Member,
                        JoinedAt = DateTimeOffset.UtcNow
                    };

                    context.ConversationMembers.Add(newMember);
                    await context.SaveChangesAsync();
                    //Reload conversation
                    existingConversation = await LoadConversationMember(existingConversation.Id);
                }

                return new GenericResponse<ConversationDto>(true, "Add new conversation", mapper.Map<ConversationDto>(existingConversation));
            }

            //Tạo conversation mới
            var newConversation = new Conversation
            {
                Id = Guid.NewGuid(),
                Type = ConversationType.Direct,
                CreatedBy = userId,
                DirectKey = directkey,
            };

            context.Conversations.Add(newConversation);

            var members = new[] {
                new ConversationMember
                {
                    UserId = userId,
                    ConversationId = newConversation.Id,
                    Role = MemberRole.Member,
                    JoinedAt = DateTimeOffset.UtcNow
                },
                new ConversationMember
                {
                    UserId = targetUser.Id,
                    ConversationId = newConversation.Id,
                    Role = MemberRole.Member,
                    JoinedAt = DateTimeOffset.UtcNow
                }
            };

            context.ConversationMembers.AddRange(members);

            //load thông tin đầy đủ
            var loading = await LoadConversationMember(newConversation.Id);

            return new GenericResponse<ConversationDto>(true, "New Chat sheet create succesfully", mapper.Map<ConversationDto>(loading));
        }

        public async Task<GenericResponse<ConversationDto>> CreateGroupConversationAsync(Guid userId, CreateGroupConversationDto request)
        {
            //Kiểm tra : tồn tại là friend chưa
            var existReqFriend = await context.Users
                .Where(u => request.MemberHandle.Contains(u.Handle) && u.IsActive)
                .ToListAsync();

            if (existReqFriend is null) return new GenericResponse<ConversationDto>(false, "User not found");

            //Tạo nhóm
            var conversation = new Conversation
            {
                Id = Guid.NewGuid(),
                Type = ConversationType.Group,
                Title = request.Title,
                AvatarUrl = request.AvatarUrl,
                CreatedBy = userId
            };

            context.Conversations.Add(conversation);

            //Thêm người tạo tạo vào đoạn chat
            var creatorMember = new ConversationMember
            {
                ConversationId = conversation.Id,
                UserId = userId,
                Role = MemberRole.Owner,
                JoinedAt = DateTimeOffset.Now
            };

            context.ConversationMembers.Add(creatorMember);

            //Thêm các member khác
            var members = existReqFriend.Select(user => new ConversationMember
            {
                ConversationId = conversation.Id,
                UserId = userId,
                Role = MemberRole.Member,
                JoinedAt = DateTimeOffset.Now
            });

            context.ConversationMembers.AddRange(members);

            await context.SaveChangesAsync();

            //Reload
            var load = await LoadConversationMember(conversation.Id);
            return new GenericResponse<ConversationDto>(true, "Create new group chat sucessfully");
        }

        //Manage group
        public async Task<GenericResponse<ConversationDto>> UpdateGroupConversationAsync(Guid userid, Guid conversationid, UpdateConversationDto request)
        {
            var conversation = await context.Conversations.Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == conversationid && c.Type == ConversationType.Group);

            if (conversation is null) return new GenericResponse<ConversationDto>(false, "Group conversation not found");

            //chỉ owner hoặc admin được thực hiện
            var userMemberShip = conversation.Members.FirstOrDefault(m => m.UserId == userid);

            if (userMemberShip is null || userMemberShip.Role == MemberRole.Member)
                return new GenericResponse<ConversationDto>(false, "Insufficient permisstion");

            if (!string.IsNullOrEmpty(request.Title))
            {
                conversation.Title = request.Title;
            }

            if (request.AvatarUrl is not null)
                conversation.AvatarUrl = request.AvatarUrl;

            await context.SaveChangesAsync();

            var result = await LoadConversationMember(conversationid);

            return new GenericResponse<ConversationDto>(true, "Update Information Group successfull", mapper.Map<ConversationDto>(result));
        }

        public async Task<Response> LeaveGroupConversationAsync(Guid userId, Guid conversationId)
        {
            var conversation = await context.Conversations.Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == conversationId);

            if (conversation is null) return new Response(false, "Conversation not found");

            var userMembership = conversation.Members.FirstOrDefault(m => m.UserId == userId);
            if (userMembership is null) return new Response(false, "You are not a member of the conversation");

            //Không thể rời khỏi
            if (conversation.Type == ConversationType.Direct)
                return new Response(false, "Cannot leave direct conversation");

            //Nếu là owner và còn members khác, cần tranfer ownership trước
            if (userMembership.Role == MemberRole.Owner)
            {
                var otherMember = conversation.Members.Where(m => m.UserId == userId).ToList();

                if (otherMember.Any())
                {
                    var nextOwner = otherMember.FirstOrDefault(m => m.Role == MemberRole.Admin) ?? otherMember.First();

                    nextOwner.UserId = userId;
                }
            }

            context.ConversationMembers.Remove(userMembership);
            await context.SaveChangesAsync();

            return new Response(true, "Leave group chat successfull");
        }

        public async Task<Response> DeleteGroupConversationAsync(Guid userId, Guid conversationId)
        {
            var conversation = await context.Conversations.Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == conversationId);

            if (conversation is null) return new Response(false, "Conversation not found");

            if (conversation.Type is not ConversationType.Group)
                return new Response(false, "Remove is not available");

            var userMembership = conversation.Members.FirstOrDefault(m => m.UserId == userId);
            if (userMembership is null ||
                (userMembership.Role != MemberRole.Owner &&
                 userMembership.Role != MemberRole.Admin))
                return new Response(false, "You do not a premiss remove group chat");

            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                context.Conversations.Remove(conversation);
                await context.SaveChangesAsync();
                await transaction.CommitAsync();
                return new Response(true, "Delete group successfully");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new Response(false, "Failed to delete group");
            }
        }

        //Member manage
        public async Task<Response> AddMembersAsync(Guid userId, Guid conversationId, AddMembersDto request)
        {
            var conversation = await context.Conversations.Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == conversationId);
            if (conversation is null)
                return new Response(false, "Not found conversation");

            var userMembership = conversation.Members.FirstOrDefault(c => c.UserId == userId);
            if (userMembership is null || (userMembership.Role == MemberRole.Member))
                return new Response(false, "Insufficient permissions");

            //Tìm user cần thêm
            var user = await context.Users.Where(u => request.MemberHandles.Contains(u.Handle) && u.IsActive)
                .Where(u => !conversation.Members.Any(m => m.UserId == u.Id))
                .ToListAsync();

            if (!user.Any())
            {
                return new Response(false, "No valid users to add");
            }

            var newMembers = user.Select(user => new ConversationMember
            {
                ConversationId = conversationId,
                UserId = user.Id,
                Role = MemberRole.Member,
                JoinedAt = DateTimeOffset.UtcNow
            }).ToList();

            context.ConversationMembers.AddRange(newMembers);
            await context.SaveChangesAsync();

            return new Response(true, "Add new user to group successfully!");
        }

        public async Task<Response> RemoveMemberAsync(Guid userId, Guid conversationId, string memberHandle)
        {
            var conversation = await context.Conversations.Include(m => m.Members)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(c => c.Id == conversationId && c.Type == ConversationType.Group);

            if (conversation is null) return new Response(false, "Group conversation not found");

            var userMembership = conversation.Members.FirstOrDefault(m => m.UserId == userId);
            var targetUser = conversation.Members.FirstOrDefault(m => m.User.Handle == memberHandle);
            if (userMembership is null || targetUser is null)
                return new Response(false, "Member not found");

            //Permission check : Owner có thể remove anyone, Admin có thể remove Memvber
            if (userMembership.Role == MemberRole.Member)
                return new Response(false, "Insufficient permission");

            if (userMembership.Role == MemberRole.Admin && userMembership.Role == MemberRole.Member)
                return new Response(false, "Admin cannot remove Owner or other Admin");

            //Không thể remove owner cuối cùng
            if (targetUser.Role == MemberRole.Owner)
            {
                var ownerCount = conversation.Members.Count(m => m.Role == MemberRole.Owner);
                if (ownerCount > 1)
                    return new Response(false, "Cannot remove the last owner");
            }

            context.ConversationMembers.Remove(targetUser);
            await context.SaveChangesAsync();

            return new Response(true, "Remove member successfully!");
        }

        public async Task<Response> UpdateMemberRoleAsync(Guid userId, Guid conversationId, UpdateMemberRoleDto request)
        {
            var conversation = await context.Conversations.Include(c => c.Members)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == conversationId && c.Type == ConversationType.Group);

            if (conversation is null) return new Response(false, "Conversation not found");

            var userMembership = await context.ConversationMembers.FirstOrDefaultAsync(m => m.UserId == userId);
            var targetUser = await context.ConversationMembers.FirstOrDefaultAsync(u => u.User.Handle == request.MemberHandle);
            if (userMembership is null || targetUser is null)
                return new Response(false, "Member not found");

            //chỉ owner mới có thể thay đổi roles
            if (userMembership.Role != MemberRole.Owner)
                return new Response(false, "Only owner can change member role");

            //Không thể thay đổi role của chính mình nếu là owner cuối cùng
            if (targetUser.UserId == userId && userMembership.Role == MemberRole.Owner)
            {
                var ownerCount = conversation.Members.Count(m => m.Role == MemberRole.Owner);
                if (ownerCount == 1 && request.NewRole != MemberRole.Owner)
                    return new Response(false, "Cannot demote the last owner");
            }

            targetUser.Role = MemberRole.Owner;
            await context.SaveChangesAsync();

            return new Response(true, "Update role member successfully");
        }

        private async Task<Conversation> LoadConversationMember(Guid conversationId)
        {
            return await context.Conversations.Include(c => c.Members).ThenInclude(m => m.User)
                .FirstAsync(c => c.Id == conversationId);
        }
    }
}