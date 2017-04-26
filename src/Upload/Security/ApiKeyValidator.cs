using System;
using System.Threading.Tasks;

namespace Upload.Security
{
    public class ApiKeyValidator : IApiKeyValidator
    {
        public Task<bool> ValidateAsync(string apiKey)
        {
            return Task.FromResult(apiKey == Environment.GetEnvironmentVariable("APPSETTING_ApiKey"));
        }
    }
}
