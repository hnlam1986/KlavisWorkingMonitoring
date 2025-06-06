﻿using HyperBPOWorkingMonitoring.Models;
using System.Data;
using System.Data.SqlClient;

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
                    string schedule = reader.IsDBNull(reader.GetOrdinal("schedule")) ? "" : reader.GetString(reader.GetOrdinal("schedule"));
                    bool isactive = reader.IsDBNull(reader.GetOrdinal("isactive")) ? false : reader.GetBoolean(reader.GetOrdinal("isactive"));
                    bool isdeleted = reader.IsDBNull(reader.GetOrdinal("isdeleted")) ? false : reader.GetBoolean(reader.GetOrdinal("isdeleted"));

                    KlavisAccount account = new KlavisAccount();
                    account.idklavisaccount = idklavisaccount;
                    account.userlogin = userlogin;
                    account.klavisid = klavisid;
                    account.isactive = isactive;
                    account.isdeleted = isdeleted;
                    account.schedule = schedule;
                    
                    res.Add(account);
                }
            }
            cnn.Close();
            return res;
        }

        
    }
}
