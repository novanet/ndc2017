using System;
using System.Threading.Tasks;

namespace Upload.Security
{
    public class ApiKeyValidator : IApiKeyValidator
    {
        public Task<bool> ValidateAsync(string apiKey)
        {
            var correctKey = Environment.GetEnvironmentVariable("ndc2017ApiKey");
#if DEBUG
            correctKey = "debug";
#endif

            return Task.FromResult(apiKey == correctKey);
        }
    }
}
