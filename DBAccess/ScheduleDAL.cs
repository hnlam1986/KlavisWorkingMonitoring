using HyperBPOWorkingMonitoring.Models;
using System.Data;
using System.Data.SqlClient;

namespace HyperBPOWorkingMonitoring.DBAccess
{
    public class ScheduleDAL:DAL
    {
        public List<Schedule> GetSchedule()
        {
            SqlConnection cnn = new SqlConnection(CnnString);
            cnn.Open();

            SqlCommand command = new SqlCommand("GetSchedule", cnn);
            command.CommandType = CommandType.StoredProcedure;

            List<Schedule> res = new List<Schedule>();
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    int IdSchedule = reader.IsDBNull(reader.GetOrdinal("idSchedule")) ? 0 : reader.GetInt32(reader.GetOrdinal("IdSchedule"));
                    int IdProjectTeam = reader.IsDBNull(reader.GetOrdinal("idProjectTeam")) ? 0 : reader.GetInt32(reader.GetOrdinal("IdProjectTeam"));
                    string ProjectTeam = reader.IsDBNull(reader.GetOrdinal("projectTeam")) ? "" : reader.GetString(reader.GetOrdinal("ProjectTeam"));
                    string Description = reader.IsDBNull(reader.GetOrdinal("description")) ? "" : reader.GetString(reader.GetOrdinal("Description"));
                    bool IsActive = reader.IsDBNull(reader.GetOrdinal("isActive")) ? false : reader.GetBoolean(reader.GetOrdinal("IsActive"));
                    bool IsDeleted = reader.IsDBNull(reader.GetOrdinal("isDeleted")) ? false : reader.GetBoolean(reader.GetOrdinal("IsDeleted"));
                    string Steps = reader.IsDBNull(reader.GetOrdinal("steps")) ? "" : reader.GetString(reader.GetOrdinal("steps"));

                    Schedule schedule = new Schedule();
                    schedule.idSchedule = IdSchedule;
                    schedule.idProjectTeam = IdProjectTeam;
                    schedule.projectTeam = ProjectTeam;
                    schedule.description = Description;
                    schedule.isActive = IsActive;
                    schedule.isDeleted = IsDeleted;
                    if (Steps != "")
                    {
                        schedule.steps = Newtonsoft.Json.JsonConvert.DeserializeObject<List<StepSchedule>>(Steps);
                    }

                    res.Add(schedule);
                }
            }
            cnn.Close();
            return res;
        }

        public List<Step> GetSteps()
        {
            SqlConnection cnn = new SqlConnection(CnnString);
            cnn.Open();

            SqlCommand command = new SqlCommand("GetSteps", cnn);
            command.CommandType = CommandType.StoredProcedure;

            List<Step> res = new List<Step>();
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    int IdInputStep = reader.IsDBNull(reader.GetOrdinal("IdInputStep")) ? 0 : reader.GetInt32(reader.GetOrdinal("IdInputStep"));
                    string Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? "" : reader.GetString(reader.GetOrdinal("Description"));
                    string StepLink = reader.IsDBNull(reader.GetOrdinal("StepLink")) ? "" : reader.GetString(reader.GetOrdinal("StepLink"));
                    bool IsActive = reader.IsDBNull(reader.GetOrdinal("IsActive")) ? false : reader.GetBoolean(reader.GetOrdinal("IsActive"));


                    Step step = new Step();
                    step.idInputStep = IdInputStep;
                    step.description = Description;
                    step.stepLink = StepLink;
                    step.isActive = IsActive;
                    res.Add(step);
                }
            }
            cnn.Close();
            return res;
        }

        public int SaveSchedule(Schedule schedule)
        {
            int res = 0;
            SqlConnection cnn = new SqlConnection(CnnString);
            cnn.Open();
            SqlCommand command = new SqlCommand("SaveSchedule", cnn);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@IdSchedule", schedule.idSchedule==null?DBNull.Value: schedule.idSchedule);
            command.Parameters.AddWithValue("@IdProjectTeam", schedule.idProjectTeam == null ? DBNull.Value : schedule.idProjectTeam);
            command.Parameters.AddWithValue("@Description", schedule.description == null ? DBNull.Value : schedule.description);
            command.Parameters.AddWithValue("@IsActive", schedule.isActive == null ? DBNull.Value : schedule.isActive);
            command.Parameters.AddWithValue("@IsDeleted", schedule.isDeleted == null ? DBNull.Value : schedule.isDeleted);
            res = (int)command.ExecuteScalar();
            cnn.Close();
            return res;
        }

        public int SaveStepSchedule(StepSchedule step)
        {
            int res = 0;
            SqlConnection cnn = new SqlConnection(CnnString);
            cnn.Open();
            SqlCommand command = new SqlCommand("SaveStepSchedule", cnn);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@idStepSchedule", step.idStepSchedule == null ? DBNull.Value : step.idStepSchedule);
            command.Parameters.AddWithValue("@idStep", step.idInputStep == null ? DBNull.Value : step.idInputStep);
            command.Parameters.AddWithValue("@idSchedule", step.idSchedule == null ? DBNull.Value : step.idSchedule);
            command.Parameters.AddWithValue("@percentRatio", step.percentRatio == null ? DBNull.Value : step.percentRatio);
            command.Parameters.AddWithValue("@orderNum", step.orderNum == null ? DBNull.Value : step.orderNum);
            command.Parameters.AddWithValue("@isActive", step.isActive == null ? DBNull.Value : step.isActive);
            command.Parameters.AddWithValue("@isDeleted", step.isDeleted == null ? DBNull.Value : step.isDeleted);
            res = (int)command.ExecuteScalar();
            cnn.Close();
            return res;
        }
    }
}
