using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.Presentation.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController(IContactService service) : ControllerBase
    {
        private Guid GetCurrentUser()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userClaim);
        }

        /// <summary>
        /// Gửi lời mời kết bạn
        /// </summary>
        [HttpPost("requests")]
        public async Task<IActionResult> SendFriendRequest([FromBody] SendFriendRequestDto request)
        {
            var userId = GetCurrentUser();
            var result = await service.SendFriendRequestAsync(userId, request);

            if (result.Flag == false)
            {
                return BadRequest(new { error = result.Message });
            }

            return Ok(result);
        }

        /// <summary>
        /// Phản hồi lời mời kết bạn (accept/reject)
        /// </summary>
        [HttpPatch("requests/respond")]
        public async Task<IActionResult> ResponseToFriendRequest([FromBody] ResponseFriendRequestDto reponse)
        {
            var user = GetCurrentUser();
            var result = await service.ResponseToFriendRequestAsync(user, reponse);

            if (result.Flag == false)
            {
                return BadRequest(new { error = result.Message });
            }
            return Ok(result);
        }

        ///<summary>
        /// Lấy danh sách bạn bè
        ///</summary>
        [HttpGet]
        public async Task<IActionResult> GetListFriendRequest([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var user = GetCurrentUser();
            var result = await service.GetFriendsAsync(user, page, pageSize);

            return Ok(result);
        }

        ///<summary>
        ///Lấy danh sách lời mời kết bạn đã gửi
        ///</summary>
        [HttpGet("requests/sent")]
        public async Task<IActionResult> GetSendFriendRequest([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var user = GetCurrentUser();
            var result = await service.GetSentFriendRequestsAsync(user, page, pageSize);
            return Ok(result);
        }

        ///<summary>
        ///Lấy danh sách lời mời kết bạn đã gửi
        ///</summary>
        [HttpGet("request/pending")]
        public async Task<IActionResult> GetPendingFriendRequest([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var user = GetCurrentUser();
            var result = await service.GetPendingFriendRequestsAsync(user, page, pageSize);

            return Ok(result);
        }

        ///<summary>
        /// Danh sách block friend
        ///</summary>
        [HttpGet("blocked")]
        public async Task<IActionResult> GetBlockFriendReponse([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var user = GetCurrentUser();
            var result = await service.GetBlockedUsersAsync(user, page, pageSize);
            return Ok(result);
        }

        ///<summary>
        ///Kiểm tra mối quan hệ với người dùng khác
        ///</summary>
        [HttpGet("relationship/{targetHandle}")]
        public async Task<IActionResult> GetRelationShipFriendRequest(string handle)
        {
            var user = GetCurrentUser();
            var result = await service.GetRelationShipStatusAsync(user, handle);
            return Ok(result);
        }

        /// <summary>
        /// Chặn người dùng
        /// </summary>
        [HttpPost("block")]
        public async Task<IActionResult> BlockUser([FromBody] BlockUserDto request)
        {
            var userId = GetCurrentUser();
            var result = await service.BlockUserAsync(userId, request);

            if (!result.Flag)
                return BadRequest(new { error = result.Message });

            return Ok(new { message = "User blocked successfully" });
        }

        // <summary>
        /// Bỏ chặn người dùng
        /// </summary>
        [HttpDelete("block/{targetHandle}")]
        public async Task<IActionResult> UnblockUser(string targetHandle)
        {
            var userId = GetCurrentUser();
            var result = await service.UnBlockUserAsync(userId, targetHandle);

            if (!result.Flag)
                return BadRequest(new { error = result.Message });

            return Ok(new { message = "User unblocked successfully" });
        }

        ///<summary>
        ///xóa bạn bè
        ///</summary>
        [HttpDelete("{friendHandle}")]
        public async Task<IActionResult> RemoveFriend(string handle)
        {
            var user = GetCurrentUser();
            var result = await service.RemoveRequestFriendAysnc(user, handle);
            return Ok(result);
        }
    }
}