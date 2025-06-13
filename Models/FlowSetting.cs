namespace HyperBPOWorkingMonitoring.Models
{
    public class FlowSetting
    {
        public FlowSetting() { }
        public int? flowsetting { get; set; }
        public List<StepPriority>? prioritystep { get; set; }
        public List<StepSchedule>? stepschedule { get; set; }

    }
}
