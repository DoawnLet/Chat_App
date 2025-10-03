using ChatApp.Application.DTOs;
using ChatApp.Infrastructure.MessageActive;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.Presentation.Controllers
{
    [ApiController]
    [Route("api/conversations/{conversationId:guid}/messages")]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MessageController(IMediator mediator)
        {
            _mediator = mediator;
        }

        private Guid GetCurrentUser()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userClaim);
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> Send(Guid conversationId, [FromBody] SendMessageRequest req, CancellationToken ct)
        {
            var currentUser = GetCurrentUser();

            var result = await _mediator.Send(new SendMessageCommand(conversationId, currentUser, req.ClientMessageId, req.Text, req.Type), ct);

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> List(Guid conversationId, [FromQuery] long? afterSeq, [FromQuery] int limit = 50, CancellationToken ct = default)
        {
            var list = await _mediator.Send(new ListMessageQuery(conversationId, afterSeq, limit), ct);
            return Ok(list);
        }
    }
}