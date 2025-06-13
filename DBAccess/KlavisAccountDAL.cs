using HyperBPOWorkingMonitoring.Models;
using System.Data;
using System.Data.SqlClient;
using System.Security.Principal;

namespace HyperBPOWorkingMonitoring.DBAccess
{
    public class KlavisAccountDAL:DAL
    {
        public List<KlavisAccount> GetKlavisAccount()
        {
            SqlConnection cnn = new SqlConnection(CnnString);
            cnn.Open();

            SqlCommand command = new SqlCommand("GetKlavisAccount", cnn);
            command.CommandType = CommandType.StoredProcedure;

            List<KlavisAccount> res = new List<KlavisAccount>();
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    int idklavisaccount = reader.IsDBNull(reader.GetOrdinal("idklavisaccount")) ? 0 : reader.GetInt32(reader.GetOrdinal("idklavisaccount"));
                    string userlogin = reader.IsDBNull(reader.GetOrdinal("userlogin")) ? "" : reader.GetString(reader.GetOrdinal("userlogin"));
                    string klavisid = reader.IsDBNull(reader.GetOrdinal("klavisid")) ? "" : reader.GetString(reader.GetOrdinal("klavisid"));
                    int idschedule = reader.IsDBNull(reader.GetOrdinal("idschedule")) ? 0 : reader.GetInt32(reader.GetOrdinal("idschedule"));
                    int flowsetting = reader.IsDBNull(reader.GetOrdinal("flowsetting")) ? 0 : reader.GetInt32(reader.GetOrdinal("flowsetting"));
                    int idkvaccountschedule = reader.IsDBNull(reader.GetOrdinal("idkvaccountschedule")) ? 0 : reader.GetInt32(reader.GetOrdinal("idkvaccountschedule"));
                    bool isactive = reader.IsDBNull(reader.GetOrdinal("isactive")) ? false : reader.GetBoolean(reader.GetOrdinal("isactive"));
                    bool isdeleted = reader.IsDBNull(reader.GetOrdinal("isdeleted")) ? false : reader.GetBoolean(reader.GetOrdinal("isdeleted"));
                    string steppriority = reader.IsDBNull(reader.GetOrdinal("steppriority")) ? "" : reader.GetString(reader.GetOrdinal("steppriority"));

                    KlavisAccount account = new KlavisAccount();
                    account.idklavisaccount = idklavisaccount;
                    account.userlogin = userlogin;
                    account.klavisid = klavisid;
                    account.isactive = isactive;
                    account.isdeleted = isdeleted;
                    account.idschedule = idschedule;
                    account.flowsetting = flowsetting;
                    account.idkvaccountschedule = idkvaccountschedule;
                    account.steppriority = Newtonsoft.Json.JsonConvert.DeserializeObject<List<StepPriority>>(steppriority); ;

                    res.Add(account);
                }
            }
            cnn.Close();
            return res;
        }

        public int SaveKlavisAccount(KlavisAccount account)
        {
            SqlConnection cnn = new SqlConnection(CnnString);
            cnn.Open();
            int res = 0;
            SqlCommand command = new SqlCommand("SaveKlavisAccount", cnn);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@idklavisaccount", account.idklavisaccount == null ? DBNull.Value : account.idklavisaccount);
            command.Parameters.AddWithValue("@userlogin", account.userlogin == null ? DBNull.Value : account.userlogin);
            command.Parameters.AddWithValue("@klavisid", account.klavisid == null ? DBNull.Value : account.klavisid);
            command.Parameters.AddWithValue("@flowsetting", account.flowsetting == null ? DBNull.Value : account.flowsetting);
            command.Parameters.AddWithValue("@isactive", account.isactive == null ? DBNull.Value : account.isactive);
            command.Parameters.AddWithValue("@isdeleted", account.isdeleted == null ? DBNull.Value : account.dbisdeleted);
            res = (int)command.ExecuteScalar();

            cnn.Close();
            return res;
        }
        public int SaveFlowSetting(KlavisAccount account)
        {
            SqlConnection cnn = new SqlConnection(CnnString);
            cnn.Open();
            int res = 0;
            SqlCommand command = new SqlCommand("SaveFlowSetting", cnn);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@idklavisaccount", account.idklavisaccount == null ? DBNull.Value : account.idklavisaccount);
            command.Parameters.AddWithValue("@idkvaccountschedule", account.idkvaccountschedule == null ? DBNull.Value : account.idkvaccountschedule);
            command.Parameters.AddWithValue("@flowsetting", account.flowsetting == null ? DBNull.Value : account.flowsetting);
            command.Parameters.AddWithValue("@priorityjson", account.steppriority == null ? DBNull.Value : Newtonsoft.Json.JsonConvert.SerializeObject(account.steppriority));
            command.Parameters.AddWithValue("@idschedule", account.idschedule == null ? DBNull.Value : account.idschedule);
            res = (int)command.ExecuteScalar();

            cnn.Close();
            return res;
        }
        public FlowSetting GetSettingById(string id)
        {
            SqlConnection cnn = new SqlConnection(CnnString);
            cnn.Open();

            SqlCommand command = new SqlCommand("GetFlowSettingById", cnn);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@klavisid", id);
            FlowSetting setting = new FlowSetting();
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    int idklavisaccount = reader.IsDBNull(reader.GetOrdinal("klavisid")) ? 0 : reader.GetInt32(reader.GetOrdinal("idklavisaccount"));
                    string userlogin = reader.IsDBNull(reader.GetOrdinal("userlogin")) ? "" : reader.GetString(reader.GetOrdinal("userlogin"));
                    string klavisid = reader.IsDBNull(reader.GetOrdinal("klavisid")) ? "" : reader.GetString(reader.GetOrdinal("klavisid"));
                    int flowsetting = reader.IsDBNull(reader.GetOrdinal("flowsetting")) ? 0 : reader.GetInt32(reader.GetOrdinal("flowsetting"));
                    string steppriority = reader.IsDBNull(reader.GetOrdinal("steppriority")) ? "" : reader.GetString(reader.GetOrdinal("steppriority"));
                    string stepschedule = reader.IsDBNull(reader.GetOrdinal("stepschedule")) ? "" : reader.GetString(reader.GetOrdinal("stepschedule"));

                    setting.flowsetting = flowsetting;
                    setting.prioritystep = Newtonsoft.Json.JsonConvert.DeserializeObject<List<StepPriority>>(steppriority); ;
                    setting.stepschedule = Newtonsoft.Json.JsonConvert.DeserializeObject<List<StepSchedule>>(stepschedule); ;
                    break;

                }
            }
            cnn.Close();
            return setting;
        }

    }
}
