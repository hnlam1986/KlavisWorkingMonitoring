namespace HyperBPOWorkingMonitoring.Models
{
    public class KlavisAccount
    {
        public KlavisAccount() { }
        public int? idklavisaccount { get; set; }
        public string? userlogin { get; set; }
        public string? klavisid { get; set; }
        public int? idkvaccountschedule { get; set; }
        public int? idschedule { get; set; }
        public bool? isactive { get; set; }
        public bool? isdeleted { get; set; }
        public int? dbisdeleted { get { return isdeleted == true ? 1 : 0; } }


    }
}
