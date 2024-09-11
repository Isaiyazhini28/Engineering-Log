namespace EngineeringLog.Services.IServices
{
   
        public interface IHrmsAuthService
        {
            Task<Dictionary<string, object>> AuthenticateAsync(string userId, string password);
        }
    }