using HyperBPOWorkingMonitoring.DBAccess;
using HyperBPOWorkingMonitoring.Models;
using Microsoft.AspNetCore.Mvc;

namespace HyperBPOWorkingMonitoring.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("GetSchedules")]
        public List<Schedule> GetSchedules()
        {
            ScheduleDAL dal = new ScheduleDAL();
            return dal.GetSchedule();
        }
        [HttpGet("GetSteps")]
        public List<Step> GetSteps()
        {
            ScheduleDAL dal = new ScheduleDAL();
            return dal.GetSteps();
        }
        [HttpPost("SaveSchedule")]
        public int SaveSchedule(Schedule schedule)
        {
            ScheduleDAL dal = new ScheduleDAL();
            return dal.SaveSchedule(schedule);
        }
        [HttpPost("SaveStepSchedule")]
        public int SaveStepSchedule(StepSchedule step)
        {
            ScheduleDAL dal = new ScheduleDAL();
            return dal.SaveStepSchedule(step);
        }
        [HttpPost("SaveStepScheduleSorting")]
        public int SaveStepScheduleSorting(List<SortingItem> steps)
        {
            ScheduleDAL dal = new ScheduleDAL();
            return dal.SaveStepScheduleSorting(steps);
        }
    }
}
