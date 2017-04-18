using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Upload.Security
{
    public interface IApiKeyValidator
    {
        Task<bool> ValidateAsync(string apiKey);
    }

    public class ApiKeyAuthenticationHandler : AuthenticationHandler<ApiKeyAuthenticationOptions>
    {
        private IApiKeyValidator _validator;
        public ApiKeyAuthenticationHandler(IApiKeyValidator validator)
        {
            _validator = validator;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Context.Request.Headers.TryGetValue(Options.HeaderName, out StringValues headerValue))
            {
                return AuthenticateResult.Fail("Missing or malformed 'Authorization' header.");
            }

            var apiKey = headerValue.First();
            if (!await _validator.ValidateAsync(apiKey))
            {
                return AuthenticateResult.Fail("Invalid API key.");
            }

            // success! Now we just need to create the auth ticket
            var identity = new ClaimsIdentity("apikey"); // the name of our auth scheme
                                                         // you could add any custom claims here
            var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), null, "apikey");
            return AuthenticateResult.Success(ticket);
        }
    }
}
