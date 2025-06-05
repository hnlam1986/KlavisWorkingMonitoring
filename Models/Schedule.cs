namespace HyperBPOWorkingMonitoring.Models
{
    public class Schedule
    {
        public Schedule()
        {
                
        }
        public int? idSchedule { get; set; }
        public int? idProjectTeam { get; set; }
        public string? projectTeam { get; set; }
        public string? description { get; set; }
        public bool? isActive { get; set; }
        public bool? isDeleted { get; set; }
        public List<StepSchedule>? steps { get; set; }

    }
}
