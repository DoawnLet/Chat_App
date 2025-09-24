namespace ChatApp.Application.Helps
{
    public class Utils
    {
        public string GenerateDirectkey(Guid id1, Guid id2)
        {
            var ids = new[] { id1, id2 }.OrderBy(x => x).ToArray();
            return $"{ids[0]}_{ids[1]}";
        }
    }
}