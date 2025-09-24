using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController(IConversationService service) : ControllerBase
    {
        private Guid GetCurrentUser()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return Guid.Parse(userClaim!);
        }

        // <summary>
        /// Tạo hội thoại 1-1 (sẽ tự động dedupe nếu đã tồn tại)
        /// </summary>
        [HttpPost("direct")]
        public async Task<IActionResult> CreateDirectConversationAsync([FromBody] CreateDirectConversationDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetCurrentUser();
            var result = await service.CreateDirectConversationAsync(userId, request);

            if (!result.Flag)
            {
                return BadRequest(new { error = result.Message });
            }

            return Ok(result);
        }

        /// <summary>
        /// Tạo group conversation
        /// </summary>
        [HttpPost("groups")]
        public async Task<IActionResult> CreateGroupConversation([FromBody] CreateGroupConversationDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = GetCurrentUser();
            var result = await service.CreateGroupConversationAsync(user, request);
            if (!result.Flag)
            {
                return BadRequest(new { error = result.Message });
            }

            return Ok(result);
        }

        ///<summary>
        ///Cập nhật thông tin group
        ///</summary>
        [HttpPut("{conversationId}")]
        public async Task<IActionResult> UpdateGroupConversation(Guid conversationid, [FromBody] UpdateConversationDto request)
        {
            var user = GetCurrentUser();
            var result = await service.UpdateGroupConversationAsync(user, conversationid, request);

            if (!result.Flag)
            {
                return BadRequest(new { error = result.Message });
            }

            return Ok(result);
        }

        ///<summary>
        /// xóa group
        ///</summary>
        [HttpDelete("{conversationId}")]
        public async Task<IActionResult> DeleteGroupConversation(Guid conversationId)
        {
            var user = GetCurrentUser();
            var result = await service.DeleteGroupConversationAsync(user, conversationId);
            if (!result.Flag) return BadRequest(new { error = result.Message });

            return Ok(result);
        }

        ///<summary>
        ///Rời khỏi nhóm
        ///</summary>
        [HttpPost("{conversationId}/leave")]
        public async Task<IActionResult> LeaveGroupConversation(Guid conversationId)
        {
            var user = GetCurrentUser();
            var result = await service.LeaveGroupConversationAsync(user, conversationId);
            if (!result.Flag) return BadRequest(new { error = result.Message });
            return Ok(result);
        }

        //Member Management
        ///<summary>
        ///Thêm thành viên mới
        ///<summary>
        [HttpPost("{conversationId}/members")]
        public async Task<IActionResult> AddMember(Guid conversationId, [FromBody] AddMembersDto request)
        {
            var user = GetCurrentUser();
            var result = await service.AddMembersAsync(user, conversationId, request);
            if (!result.Flag) return BadRequest(new { error = result.Message });

            return Ok(result);
        }

        // <summary>
        /// Xóa member khỏi group
        /// </summary>
        [HttpDelete("{conversationId}/members/{memberHandle}")]
        public async Task<IActionResult> RemoveMember(Guid conversationId, string memberHandle)
        {
            var userId = GetCurrentUser();
            var result = await service.RemoveMemberAsync(userId, conversationId, memberHandle);

            if (!result.Flag)
                return BadRequest(new { error = result.Message });

            return Ok(new { message = "Member removed successfully" });
        }

        /// <summary>
        /// Thay đổi role của member
        /// </summary>
        [HttpPatch("{conversationId}/members/role")]
        public async Task<IActionResult> UpdateMemberRole(Guid conversationId, [FromBody] UpdateMemberRoleDto request)
        {
            var userId = GetCurrentUser();
            var result = await service.UpdateMemberRoleAsync(userId, conversationId, request);

            if (!result.Flag)
                return BadRequest(new { error = result.Message });

            return Ok(new { message = "Member role updated successfully" });
        }
    }
}