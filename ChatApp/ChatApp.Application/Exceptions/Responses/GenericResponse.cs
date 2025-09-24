namespace ChatApp.Application.Exceptions.Responses
{
    public record GenericResponse<T> : Response
    {
        public T? Data { get; set; }

        public GenericResponse(bool flag, string message)
            : base(flag, message)
        {
        }

        public GenericResponse(bool flag, string message, T data)
            : base(flag, message)
        {
            Data = data;
        }
    }
}