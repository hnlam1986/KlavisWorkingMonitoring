namespace HyperBPOWorkingMonitoring.Models
{
    public class StepSchedule
    {
        public StepSchedule()
        {
            
        }
        public int? idStepSchedule { get; set; }
        public int? idInputStep { get; set; }
        public string? description { get; set; }
        public int? idSchedule { get; set; }
        public int? percentRatio { get; set; }
        public int? orderNum { get; set; }
        public bool? isActive { get; set; }
        public bool? isDeleted { get; set; }

    }
}
