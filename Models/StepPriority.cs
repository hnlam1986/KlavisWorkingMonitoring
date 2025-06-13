namespace HyperBPOWorkingMonitoring.Models
{
    public class StepPriority
    {
        public int? idsteppriority { get; set; }
        public int? idklavisaccount { get; set; }
        public int? idstep { get; set; }
        public bool? isdeleted { get; set; }
        public string? description { get; set; }
        public string? steplink { get; set; }
        public int? dbisdeleted { get { return isdeleted == true ? 1 : 0; } }
    }
}
