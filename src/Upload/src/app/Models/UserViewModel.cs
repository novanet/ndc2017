namespace Upload.src.app.Models
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string TwitterHandle { get; set; }
        public string Company { get; set; }
        public bool IsExisting { get; set; }
        public string Base64Image { get; set; }

    }
}
