using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Upload.Security
{
    public class ApiKeyValidator : IApiKeyValidator
    {
        public Task<bool> ValidateAsync(string apiKey)
        {
            return Task.FromResult(true);
        }
    }
}
