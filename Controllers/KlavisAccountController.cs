using HyperBPOWorkingMonitoring.DBAccess;
using HyperBPOWorkingMonitoring.Models;
using Microsoft.AspNetCore.Mvc;

namespace HyperBPOWorkingMonitoring.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KlavisAccountController : Controller
    {
        [HttpGet("GetKlavisAccount")]
        public List<KlavisAccount> GetKlavisAccount()
        {
            KlavisAccountDAL dal = new KlavisAccountDAL();
            return dal.GetKlavisAccount();
        }
    }
}
