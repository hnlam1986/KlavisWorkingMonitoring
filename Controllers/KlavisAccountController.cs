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
        [HttpPost("SaveKlavisAccount")]
        public int SaveKlavisAccount(KlavisAccount account)
        {
            KlavisAccountDAL dal = new KlavisAccountDAL();
            return dal.SaveKlavisAccount(account);
        }
        [HttpPost("SaveFlowSetting")]
        public int SaveFlowSetting(KlavisAccount account)
        {
            KlavisAccountDAL dal = new KlavisAccountDAL();
            return dal.SaveFlowSetting(account);
        }
        [HttpGet("GetSetting/{id}")]
        public FlowSetting GetSetting(string id)
        {
            KlavisAccountDAL dal = new KlavisAccountDAL();
            return dal.GetSettingById(id);
        }
    }
}
