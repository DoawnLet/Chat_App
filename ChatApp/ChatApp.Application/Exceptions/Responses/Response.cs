namespace ChatApp.Application.Exceptions.Responses
{
    public record Response
    {
        public bool Flag { get; set; } = false;
        public string Message { get; set; }

        public Response(bool flag, string message)
        {
            Flag = flag;
            Message = message;
        }
    }
}