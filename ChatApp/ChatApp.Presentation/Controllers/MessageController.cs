using System.Security.Claims;
using ChatApp.Application.DTOs;
using ChatApp.Infrastructure.MessageActive;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Presentation.Controllers
{
    [ApiController]
    [Route("api/conversations/{conversationId:guid}/messages")]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<MessageController> _logger;

        public MessageController(IMediator mediator, ILogger<MessageController> logger)
        {
            _mediator = mediator;
            _logger = logger;
            Console.WriteLine("===== MessageController INSTANTIATED =====");
        }

        private Guid GetCurrentUser()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"User claim: {userClaim}");
            return Guid.Parse(userClaim);
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> Send(
            Guid conversationId,
            [FromBody] SendMessageRequest req,
            CancellationToken ct
        )

        {
            Console.WriteLine("===== SEND METHOD ENTERED ====="); // THÊM DÒNG NÀY
            Console.WriteLine($"ConversationId: {conversationId}");
            Console.WriteLine($"ClientMessageId: {req?.ClientMessageId}");

            _logger.LogInformation("Send message request received for conversation {ConversationId}", conversationId);

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("ModelState invalid for conversation {ConversationId}: {Errors}",
                    conversationId, string.Join(", ", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))));
                return BadRequest(ModelState);
            }

            var currentUserId = GetCurrentUser();
            _logger.LogInformation("User {UserId} sending message to conversation {ConversationId}", currentUserId, conversationId);

            try
            {
                var result = await _mediator.Send(
                    new SendMessageCommand(
                        conversationId,
                        currentUserId,
                        req.ClientMessageId,
                        req.Text,
                        req.Type
                    ),
                    ct
                );

                if (result == null)
                {
                    return BadRequest(new { error = "Failed to send message" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message to conversation {ConversationId}", conversationId);
                return StatusCode(500, new { error = "An error occurred while sending the message" });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> List(
            Guid conversationId,
            [FromQuery] long? afterSeq,
            [FromQuery] int limit = 50,
            CancellationToken ct = default
        )
        {
            Console.WriteLine("===== LIST METHOD ENTERED =====");
            Console.WriteLine($"ConversationId from route: {conversationId}");
            Console.WriteLine($"AfterSeq: {afterSeq}");
            Console.WriteLine($"Limit: {limit}");

            var list = await _mediator.Send(
                new ListMessageQuery(conversationId, afterSeq, limit),
                ct
            );


            Console.WriteLine($"List result count: {list.Count}");
            Console.WriteLine("==================================");
            return Ok(list);
        }
    }
}