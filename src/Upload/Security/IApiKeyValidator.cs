using System.Threading.Tasks;

namespace Upload.Security
{
    public interface IApiKeyValidator
    {
        Task<bool> ValidateAsync(string apiKey);
    }
}