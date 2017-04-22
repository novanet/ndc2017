using Microsoft.AspNetCore.Builder;

namespace Upload.Security
{
    public class ApiKeyAuthenticationOptions : AuthenticationOptions
    {
        public const string DefaultHeaderName = "Authorization";
        public string HeaderName { get; set; } = DefaultHeaderName;

        public ApiKeyAuthenticationOptions() : base()
        {
            AuthenticationScheme = "apikey";
        }
    }
}
