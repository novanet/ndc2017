using System;

namespace Upload.database
{
    public class Photo
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public string BlobUri { get; set; }
    }
}
