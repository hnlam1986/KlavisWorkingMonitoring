namespace HyperBPOWorkingMonitoring.Models
{
    public class Step
    {
        public Step()
        {
            
        }
        public int idInputStep { get; set; }
        public string? description { get; set; }
        public string? stepLink { get; set; }
        public bool isActive { get; set; }
    }
}
