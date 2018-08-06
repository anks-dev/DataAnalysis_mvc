using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Servers;
using DataAnalysis.service.Models;

namespace DataAnalysis.Service.Models
{
    public class InstanceInfoManager
    {

        private ServersDB db { get; set; }

        public InstanceInfoManager()
        {
            this.db = new ServersDB();
        }

        public List<string> GetTables()
        {
            return this.db.Fetch<string>("SELECT * FROM sys.Tables");
        }
       
        public List<InstanceInfo> GetInstanceByName(string name)
        {          
            return this.db.Fetch<InstanceInfo>("select * from instanceinfo where instancename like @0", "%"+name+"%");            
        }

        public List<InstanceInfo> GetInstancesList(string version, string company )
        {
            var list = new List<InstanceInfo>();
            var sql =  PetaPoco.Sql.Builder.Select("*").From("instanceinfo");

            switch (version)
            {
                case "db2":
                    switch (company)
                    {

                        case "zna":
                            sql.Where("version like @0 and company = @1", "%db2%", "zna");                            
                            break;

                        case "farmers":
                            sql.Where("version like @0 and company in (@1)", "%" + "db2" + "%", new string[] { "farmers", "exchange" });
                            break;

                        case "emea":
                            sql.Where("version like @0 and company = @1", "%db2%", "emea");                            
                            break;

                        default:
                            sql.Where("version like @0", "%db2%");                           
                            break;
                    }

                    break;

                case "oracle":
                    switch (company)
                    {

                        case "zna":
                            sql.Where("version like @0 and company = @1", "oracle%", "zna");                            
                            break;

                        case "farmers":
                            sql.Where("version like @0 and company in (@1)", "oracle%", new string[] { "farmers", "exchange" });
                            break;

                        case "emea":
                            sql.Where("version like @0 and company = @1", "oracle%", "emea");
                            break;

                        case "21stcentury":

                            sql.Where("version like @0 and company = @1", "oracle%", "21stcentury");
                            break;

                        default:
                            sql.Where("version like @0", "oracle%");                           
                            break;
                    }

                    break;

                case "mssql":
                    switch (company)
                    {

                        case "zna":
                            sql.Where("version like @0 and company = @1", "sql%", "zna");
                            break;

                        case "farmers":
                            sql.Where("version like @0 and company in (@1)", "sql%", new string[] { "farmers", "exchange" });
                            break;

                        case "emea":
                            sql.Where("version like @0 and company = @1", "sql%", "emea");                           
                            break;

                        case "21stcentury":

                            sql.Where("version like @0 and company = @1", "sql%", "21stcentury");
                            break;

                        default:
                            sql.Where("version like @0", "sql%");                            
                            break;
                    }

                    break;

                case "all":
                    switch (company)
                    {

                        case "zna":
                            sql.Where("company = @0", "zna");                            
                            break;

                        case "farmers":
                            sql.Where("company in (@0)", "sql%", new string[] { "farmers", "exchange" });                           
                            break;

                        case "emea":
                            sql.Where("company = @0", "emea");                            
                            break;

                        case "21stcentury":
                            sql.Where("company = @1", "21stcentury");                            
                            break;                        
                    }

                    break;
            }

            return this.db.Fetch<InstanceInfo>(sql);            
            
        }

    }
}
