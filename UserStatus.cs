namespace HyperBPOWorkingMonitoring
{
    public class UserStatus
    {
        public string UserId { get; set; }
        public string ConnectionId { get; set; }
        public WorkingStatus CurrentStatus { get; set; }
        public DateTime StartTime { get; set; }
        public double TotalInProcess { get; set; }
        public double TotalOnline { get; set; }
        public double TotalOffline { get; set; }
        public double TotalWorkingTime { get; set; }
        public double TotalIdle { get; set; }
        public string Version { get; set; }
    }
    public enum WorkingStatus
    {
        Online, Offline, Inprocess, Idle, Disconnect, Connected
    }
}
