using HyperBPOWorkingMonitoring.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace HyperBPOWorkingMonitoring.DBAccess
{
    public class DAL
    {
        public string CnnString { get; set; }
        public DAL()
        {
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            string cnnString = configuration.GetValue<string>("AppSettings:SQLConectionString");
            CnnString = cnnString;
        }
        

    }
}
