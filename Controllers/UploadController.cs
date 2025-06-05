using Microsoft.AspNetCore.Mvc;

namespace HyperBPOWorkingMonitoring.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost("UploadBase64")]
        public async Task<object> UploadBase64(UploadBase64 base64)
        {
            try
            {
                if (base64.Base64Content != "")
                {
                    var bytes = Convert.FromBase64String(base64.Base64Content.Replace("data:image/jpeg;base64,",""));
                    string imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/", "screenshot.jpg");
                    using (var imageFile = new FileStream(imagePath, FileMode.Create))
                    {
                        imageFile.Write(bytes, 0, bytes.Length);
                        imageFile.Flush();
                    }
                }
                return "";
            }catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
