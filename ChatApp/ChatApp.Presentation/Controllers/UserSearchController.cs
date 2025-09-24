using ChatApp.Application.Abstractions.IRepositories;
using ChatApp.Application.DTOs;
using ChatApp.Application.Exceptions.Responses;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSearchController(IUserRepository repo) : ControllerBase
    {
        [HttpPost("search")]
        public async Task<ActionResult<GenericResponse<List<UserForSearchDto>>>> SearchByHandleOrDisplayName([FromQuery] string keyword)
        {
            if (!ModelState.IsValid)
                return BadRequest(new Response(false, "Invalid search parameters"));

            var users = await repo.GetUserByHandleOrName(keyword);

            if (users == null || !users.Any())
                return Ok(new GenericResponse<List<UserForSearchDto>>(false, "No users found matching your search", new List<UserForSearchDto>()));

            return Ok(new GenericResponse<List<UserForSearchDto>>(true, "Users found successfully", users));
        }

        [HttpGet("search-paging")]
        public async Task<ActionResult<GenericResponse<PagedResult<UserForSearchDto>>>> SearchUser(
            [FromQuery] string keyword,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var (users, totalCount) = await repo.SearchUsers(keyword, pageNumber, pageSize);

            var result = new PagedResult<UserForSearchDto>
            {
                Items = users,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            return Ok(new GenericResponse<PagedResult<UserForSearchDto>>(true, "Search results retrieved", result));
        }
    }
}