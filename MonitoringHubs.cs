using Microsoft.AspNetCore.SignalR;
using System.Data;
using System.Reflection.Metadata.Ecma335;
using Newtonsoft.Json;
using System;

namespace HyperBPOWorkingMonitoring
{
    public class MonitoringHubs:Hub
    {
        public async Task SendMessage(string user, Message message)
        {
            if (user.IndexOf("admin")==-1)
            {
                if (message.Type == "connecting")
                {
                    if (UsersManagement.UsersStatus != null && UsersManagement.UsersStatus.Count > 0)
                    {
                        UserStatus found = UsersManagement.UsersStatus.Where(item => item.UserId == user).FirstOrDefault();
                        if (found == null)
                        {
                            UserStatus newUser = new UserStatus();
                            newUser.UserId = user;
                            newUser.CurrentStatus = WorkingStatus.Connected;
                            newUser.ConnectionId = Context.ConnectionId;
                            UsersManagement.UsersStatus.Add(newUser);
                            Message msg = new Message();
                            msg.Type = "NewUser";
                            msg.Content = WorkingStatus.Connected.ToString();
                            if (UsersManagement.AdminConnections != null)
                            {
                                foreach (UserStatus admin in UsersManagement.AdminConnections)
                                {
                                    await Clients.Client(admin.ConnectionId).SendAsync("ReceiveMessage", user, msg);
                                }
                            }
                            
                        }
                        else
                        {
                            found.ConnectionId = Context.ConnectionId;
                        }
                    }
                    else
                    {
                        UsersManagement.UsersStatus = new List<UserStatus>();
                        UserStatus newUser = new UserStatus();
                        newUser.UserId = user;
                        newUser.CurrentStatus = WorkingStatus.Connected;
                        newUser.ConnectionId = Context.ConnectionId;
                        UsersManagement.UsersStatus.Add(newUser);
                        Message msg = new Message();
                        msg.Type = "NewUser";
                        msg.Content = WorkingStatus.Connected.ToString();
                        if (UsersManagement.AdminConnections != null)
                        {
                            foreach (UserStatus admin in UsersManagement.AdminConnections)
                            {
                                await Clients.Client(admin.ConnectionId).SendAsync("ReceiveMessage", user, msg);
                            }
                        }
                    }

                }
                else if (message.Type == "workingtime")
                {
                    if (UsersManagement.UsersStatus != null && UsersManagement.UsersStatus.Count > 0)
                    {
                        UserStatus found = UsersManagement.UsersStatus.Where(item => item.UserId == user).FirstOrDefault();
                        if (found != null)
                        {
                            WorkingTime wt = new WorkingTime();
                            wt = JsonConvert.DeserializeObject<WorkingTime>(message.Content.ToString());
                            
                            found.TotalOffline = wt.offline;
                            found.TotalOnline = wt.online;
                            found.TotalIdle = wt.idle;
                            found.TotalInProcess = wt.inprocess;
                            found.TotalWorkingTime = wt.workingtime;
                            found.CurrentStatus = ConvertStringToWorkingStatus(wt.status);
                            found.Version = wt.version;
                            Message msg = new Message();
                            msg.Type = "UpdateStatus";
                            msg.Content = found;
                            if (UsersManagement.AdminConnections != null)
                            {
                                foreach (UserStatus admin in UsersManagement.AdminConnections)
                                {
                                    await Clients.Client(admin.ConnectionId).SendAsync("ReceiveMessage", user, msg);
                                }
                            }
                        }
                    }
                }else if (message.Type == "ReceiveScreenShot")
                {
                    UserStatus found = UsersManagement.AdminConnections.Where(item => item.UserId == message.Content.ToString()).FirstOrDefault();
                    if (found != null)
                    {
                        await Clients.Client(found.ConnectionId).SendAsync("ReceiveScreenShot", user, "ReceiveScreenShot");
                    }
                    
                }
            }
            else
            {
                if (message.Type == "connecting")
                {
                    UserStatus found = null;
                    if (UsersManagement.AdminConnections != null && UsersManagement.AdminConnections.Count > 0)
                    {
                        found = UsersManagement.AdminConnections.Where(item => item.UserId == user).FirstOrDefault();
                    }
                    


                    if (found == null)
                    {
                        UserStatus adminUser = new UserStatus();
                        adminUser.UserId = user;
                        adminUser.ConnectionId = Context.ConnectionId;
                        if (UsersManagement.AdminConnections == null)
                        {
                            UsersManagement.AdminConnections = new List<UserStatus>();
                        }
                        UsersManagement.AdminConnections.Add(adminUser);
                    }
                    else
                    {
                        found.ConnectionId = Context.ConnectionId;
                    }
                    await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", "all", UsersManagement.UsersStatus);
                }else if(message.Type == "TakeScreenShot")
                {
                    UserStatus found = UsersManagement.UsersStatus.Where(item => item.UserId == message.Content.ToString()).FirstOrDefault();
                    if (found!=null)
                    {
                        await Clients.Client(found.ConnectionId).SendAsync("TakeScreenShot", found.UserId, user);
                    }
                    
                }
            }
            
        }
        public async Task CheckAlive(string user,string status)
        {
            if (user == "admin")
            {
                if (UsersManagement.UsersStatus != null && UsersManagement.UsersStatus.Count > 0)
                {

                    await Clients.All.SendAsync("CheckAlive");
                    foreach (UserStatus item in UsersManagement.UsersStatus)
                    {
                        await Clients.Client(item.ConnectionId).SendAsync("CheckAlive");
                        item.CurrentStatus = WorkingStatus.Disconnect;
                    }
                }
            }
            else
            {
                UserStatus found = UsersManagement.UsersStatus.Where(item => item.UserId == user).FirstOrDefault();
                if (found != null)
                {
                    found.CurrentStatus = ConvertStringToWorkingStatus(status);
                }
            }
        }
            private WorkingStatus ConvertStringToWorkingStatus(string status) {
            WorkingStatus res = WorkingStatus.Disconnect;
            switch (status)
            {
                case "ON":
                    return WorkingStatus.Online;
                case "OFF":
                    return WorkingStatus.Offline;
                case "INPRO":
                    return WorkingStatus.Inprocess;
                case "IDLE":
                    return WorkingStatus.Idle;
                case "CON":
                    return WorkingStatus.Connected;
                case "DIS":
                    return WorkingStatus.Disconnect;
            }
            return res;
        }
    }
}
