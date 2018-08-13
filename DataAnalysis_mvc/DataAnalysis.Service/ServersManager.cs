using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAnalysis.Service.Models;

namespace DataAnalysis.Service
{
    public class ServersManager
    {

        private Servers.ServersDB db { get; set; }

        public ServersManager()
        {
            this.db = new Servers.ServersDB();
        }

        public List<string> GetTables()
        {
            return this.db.Fetch<string>("SELECT * FROM sys.Tables");
        }

        public List<string> GetRegions()
        {
            return this.db.Fetch<string>("select distinct(Region) from [dbo].[instanceinfo]");
        }

        public List<string> GetCompaniesByRegion(string region)
        {
            return this.db.Fetch<string>("select distinct(Company) from [dbo].[instanceinfo] where region=@0", region);
        }

        public Models.TechnologyDetailsViewModel GetServersTechnologyDetails()
        {
            var model = new Models.AnalysisViewModel();            
            //model.NonProdMachines = this.db.Fetch<ORACLE_Servers_EMEA>("Select distinct ServerName from ORACLE_Servers_EMEA where isbillable = 1").Count();
            return this.db.FirstOrDefault<TechnologyDetailsViewModel>
                ("select sum(case when version like 'SQL%' then 1 else 0 end) MSSQLServersCount," +
                    " sum(case when version like 'ORACLE%' then 1 else 0 end) OracleServersCount," +
                    " sum(case when version like 'DB%' then 1 else 0 end) DB2ServersCount" +
                    " from All_Instance_Count");
        }

        public Models.EnvironmentDetailsViewModel GetServersEnvironmentDetails()
        {

            //model.NonProdMachines = this.db.Fetch<ORACLE_Servers_EMEA>("Select distinct ServerName from ORACLE_Servers_EMEA where isbillable = 1").Count();
            return this.db.FirstOrDefault<EnvironmentDetailsViewModel>
                ("select sum(case when[status] = 'prod' then 1 else 0 end) EnvProdCount," +
                    " sum(case when[status] <> 'prod' then 1 else 0 end) EnvNonProdCount" +
                    " from All_Instance_Count");
        }

        public Models.LSADetailsViewModel GetServersLSADetails()
        {

            //model.NonProdMachines = this.db.Fetch<ORACLE_Servers_EMEA>("Select distinct ServerName from ORACLE_Servers_EMEA where isbillable = 1").Count();
            return this.db.FirstOrDefault<LSADetailsViewModel>
                ("select"+
                    " sum(case when company = 'EMEA' then 1 else 0 end) EMEACount,"+
                    " sum(case when company in ('ZNA', 'CANADA') then 1 else 0 end) ZNACount,"+
                    " sum(case when company in ('Farmers', 'Exchange') then 1 else 0 end ) FarmersCount,"+
                    " sum(case when company = '21stCentury' then 1 else 0 end) _21CenturyCount"+
                    " from All_Instance_Count");
        }

        public AnalysisViewModel getServersAnalysisViewModel()
        {
            var vm = new AnalysisViewModel();
            vm.TechnologyDetails = this.GetServersTechnologyDetails();
            vm.EnvironmentDetails = this.GetServersEnvironmentDetails();
            vm.LSADetails = this.GetServersLSADetails();
            vm.FarmersAnalysis = this.GetFarmerAnalysisViewModel();
            vm.ZNAServersAnalysis = this.GetZNAServersAnalysisViewModel();
            vm.EMEAServersAnalysis = this.GetEMEAServersAnalysisViewModel();
            vm._21stCenturyServersAnalysis = this.Get21CentServersAnalysisViewModel();
            vm.globalCount = this.getGlobalServersAnalysisView();
            return vm;
        }

        public AnalysisViewModel getServersAnalysisByRegionandCompany(string region , string company)
        {
            var vm = new AnalysisViewModel();
            vm.TechnologyDetails = this.GetServersTechnologyDetails();
            vm.EnvironmentDetails = this.GetServersEnvironmentDetails();
            vm.LSADetails = this.GetServersLSADetails();
            vm.FarmersAnalysis = this.GetFarmerAnalysisViewModel();
            vm.ZNAServersAnalysis = this.GetZNAServersAnalysisViewModel();
            vm.EMEAServersAnalysis = this.GetEMEAServersAnalysisViewModel();
            vm._21stCenturyServersAnalysis = this.Get21CentServersAnalysisViewModel();
            vm.globalCount = this.getGlobalServersAnalysisView();
            return vm;
        }

        public dynamic getGlobalServersAnalysisView()
        {
            return new {
                TechnologyCount = this.GetTechnologyServersGlobally(),
                EnviromnetCount = this.GetEnvironmentServersGlobally(),
                LSACount = this.GetLSAServersGlobally()
            };
        }

        private dynamic GetLSAServersGlobally()
        {
            return this.db.Query<dynamic>("select * from regionCount");              
        }

        private dynamic GetEnvironmentServersGlobally()
        {
            return this.db.Query<dynamic>("select * from environmentCount");
        }

        private dynamic GetTechnologyServersGlobally()
        {
            return this.db.Query<dynamic>("select * from technologyCount");
        }

        public dynamic getServersByRegion(string region)
        {
            return new
            {
                TechnologyCount = this.GetTechnologyServersByRgion(region),
                EnviromnetCount = this.GetEnvironmentServersByRegion(region),
                LSACount = this.GetLSAServersByRegion(region)
            };
        }

        private dynamic GetLSAServersByRegion(string region)
        {
            return this.db.Query<dynamic>("exec LsaViewTech @0", region);
        }

        private dynamic GetEnvironmentServersByRegion(string region)
        {
            return this.db.Query<dynamic>("exec EnvironmentViewTech @0", region);
        }

        private dynamic GetTechnologyServersByRgion(string region)
        {
            return this.db.Query<dynamic>("exec RegionViewTech @0", region);
        }

        private dynamic GetLSAServersByRegionandCompany(string region, string company)
        {
            return this.db.Query<dynamic>("exec ServerType_AccountViewTech @0, @1", region, company);
        }

        private dynamic GetEnvironmentServersByRegionandCompany(string region, string company)
        {
            return this.db.Query<dynamic>("exec Environment_AccountViewTech @0, @1", region, company);
        }

        private dynamic GetTechnologyServersByRgionandCompany(string region, string company)
        {
            return this.db.Query<dynamic>("exec Region_AccountViewTech @0, @1", region, company);
        }

        public Dictionary<string, int> GetProdOracleServersCountByRegion(string region, string company)
        {
            return this.db.Query<dynamic>(
                "exec [dbo].[OracleVersion_ProdView] @0, @1", region, company)
                .ToDictionary(e => (string)e.Version, e => (int)e.InstanceCount);
        }

        public Dictionary<string, int> GetNonProdOracleServersCountByRegion(string region, string company)
        {
            return this.db.Query<dynamic>(
                "exec [dbo].[OracleVersion_NonProdView] @0, @1", region, company)
                .ToDictionary(e => (string)e.Version, e => (int)e.InstanceCount);
        }

        public Dictionary<string, int> GetProdSqlServersCountByRegion(string region, string company)
        {
            return this.db.Query<dynamic>(
                "exec [dbo].[SQLVersion_ProdView] @0, @1", region, company)
                .ToDictionary(e => (string)e.Version, e => (int)e.InstanceCount);
        }

        public Dictionary<string, int> GetNonProdSqlServersCountByRegion(string region, string company)
        {
            return this.db.Query<dynamic>(
                "exec [dbo].[SQLVersion_NonProdView] @0, @1", region, company)
                .ToDictionary(e => (string)e.Version, e => (int)e.InstanceCount);
        }

        public Dictionary<string, int> GetProdDB2ServersCountByRegion(string region, string company)
        {
            return this.db.Query<dynamic>(
                "exec [dbo].[DB2Version_ProdView] @0, @1", region, company)
                .ToDictionary(e => (string)e.Version, e => (int)e.InstanceCount);
        }

        public Dictionary<string, int> GetNonProdDB2ServersCountByRegion(string region, string company)
        {
            return this.db.Query<dynamic>(
                "exec [dbo].[DB2Version_NonProdView] @0, @1", region, company)
                .ToDictionary(e => (string)e.Version, e => (int)e.InstanceCount);
        }


        #region FarmersAnalysis


        public TechnologyDetailsViewModel GetFarmerServersTechnologyDetails()
        {
            return this.db.FirstOrDefault<TechnologyDetailsViewModel>(
                "select" +
                    " sum(case when version like 'SQL%' then 1 else 0 end) MSSQLServersCount," +
                    " sum(case when version like 'ORACLE%' then 1 else 0 end) OracleServersCount," +
                    " sum(case when version like 'DB%'  then 1 else 0 end) DB2ServersCount" +                    
                    " from[dbo].[All_Instance_Count]" +
                    " where  company in ('Farmers', 'Exchange')");
        }

        public EnvironmentDetailsViewModel GetFarmerServersEnvironmentDetails()
        {
            return this.db.FirstOrDefault<EnvironmentDetailsViewModel>(
                "select" +                    
                    " sum(case when[status] = 'prod' then 1 else 0 end) EnvProdCount,"+
                    " sum(case when[status] <> 'prod' then 1 else 0 end) EnvNonProdCount"+
                    " from[dbo].[All_Instance_Count]"+
                    " where company in ('Farmers', 'Exchange')");
        }

        public ServerTypeDetailsViewModel GetFarmerServerTypeDetails()
        {
            return this.db.FirstOrDefault<ServerTypeDetailsViewModel>(
                "select" +
                        " sum(case when[status] = 'dev' then 1 else 0 end) DevServersCount," +
                        " sum(case when[status] in ('QA', 'Reporting', 'SIT') then 1 else 0 end) QAServersCount ," +
                        " sum(case when[status] in ('Test', 'Trng') then 1 else 0 end ) TestServersCount" +
                        " from[dbo].[All_Instance_Count]" +
                        " where company in ('Farmers','Exchange')");
        }

        public Dictionary<string,int> GetSQLServersCountInFormers()
        {
            return this.db.Fetch<Dictionary<string,int>>("select Version as SQL_Version_Farmers,count(Version) as Count_SQL_Version_Farmers from [dbo].[All_Instance_Count] where version like 'SQL%' and company in ('Farmers','Exchange') group by version")
                .SelectMany(d => d).ToDictionary(e => e.Key, e => e.Value);
        }

        public Dictionary<string, int> GetOracleServersCountInFormersByProd()
        {
            return this.db.Query<dynamic>(
                "select"
                +" Version as OracleVersionFarmers, count(Version) as OracleVersionFarmersCount"
                +" from[dbo].[All_Instance_Count]"
                +" where version like 'Oracle%' and company in ('Farmers', 'Exchange')  and[status] = 'prod' group by version")
                .ToDictionary(e => (string)e.OracleVersionFarmers, e => (int)e.OracleVersionFarmersCount);
        }

        public Dictionary<string, int> GetOracleServersCountInFormersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select"
                + " Version as OracleVersionFarmers, count(Version) as OracleVersionFarmersCount"
                + " from[dbo].[All_Instance_Count]"
                + " where version like 'Oracle%' and company in ('Farmers', 'Exchange')  and[status] <> 'prod' group by version")
                .ToDictionary(e => (string)e.OracleVersionFarmers, e => (int)e.OracleVersionFarmersCount);
        }

        public Dictionary<string, int> GetDB2ServersCountInFormersByProd()
        {            

            return this.db.Query<dynamic>(
                "select"
                + " Version as DB2VersionFarmers ,count(Version) as DB2VersionFarmersCount"
                + " from[dbo].[All_Instance_Count]"
                + " where version like 'DB%' and company in ('Farmers', 'Exchange') and [status] = 'prod' group by version")
                .ToDictionary(d => (string)d.DB2VersionFarmers, d => (int)d.DB2VersionFarmersCount);
                
        }

        public Dictionary<string, int> GetDB2ServersCountInFormersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select"
                + " Version as DB2VersionFarmers,count(Version) as DB2VersionFarmersCount"
                + " from[dbo].[All_Instance_Count]"
                + " where version like 'DB%' and company in ('Farmers', 'Exchange') and [status] <> 'prod' group by version")
                .ToDictionary(d => (string)d.DB2VersionFarmers, d => (int)d.DB2VersionFarmersCount);
        }

        public Dictionary<string,int> GetSqlServerCountInFormersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select"
                    + " Version as SQLversionFarmers, count(Version) as "
                    + " SQLVersionFarmersCount from[dbo].[All_Instance_Count] "
                    + " where version like 'SQL%' and company in ('Farmers', 'Exchange') and [status] <> 'prod' group by version")
                    .ToDictionary(d => (string)d.SQLversionFarmers, d => (int)d.SQLVersionFarmersCount);
        }

        public Dictionary<string, int> GetSqlServerCountInFormersByProd()
        {
            return this.db.Query<dynamic>(
                "select"
                    + " Version as SQLVersionFarmers, count(Version) as "
                    + " SQLVersionFarmersCount from[dbo].[All_Instance_Count] "
                    + " where version like 'SQL%' and company in ('Farmers', 'Exchange') and [status] = 'prod' group by version")
                    .ToDictionary(e => (string)e.SQLVersionFarmers, e => (int)e.SQLVersionFarmersCount); ;
        }

        public ServerAnalysisViewModel GetFarmerAnalysisViewModel()
        {
            var vm = new ServerAnalysisViewModel();

            vm.DB2ServersProd = this.GetDB2ServersCountInFormersByProd();
            vm.SQLServersProd = this.GetSqlServerCountInFormersByProd();           
            vm.OracleServersProd = this.GetOracleServersCountInFormersByProd();

            vm.DB2ServersNonProd = this.GetDB2ServersCountInFormersByNonProd();
            vm.SQLServersNonProd = this.GetSqlServerCountInFormersByNonProd();
            vm.OracleServersNonProd = this.GetOracleServersCountInFormersByNonProd();

            vm.TechDetails = this.GetFarmerServersTechnologyDetails();
            vm.EnvDetails = this.GetFarmerServersEnvironmentDetails();
            vm.ServerTypeDetails = this.GetFarmerServerTypeDetails();

            return vm;
        }


        //        Farmers:
        //========
        //Technology Wise
        //===============
        //select count(*) as Count_SQL_Farmers from[dbo].[All_Instance_Count]
        //        where version like 'SQL%' and company in ('Farmers','Exchange')

        //select count(*) as Count_Oracle_Farmers from[dbo].[All_Instance_Count]
        //        where version like 'ORACLE%'and company in ('Farmers','Exchange')

        //select count(*) as Count_DB2_Farmers from[dbo].[All_Instance_Count]
        //        where version like 'DB%' and company in ('Farmers','Exchange')

        //Environment Wise
        //================
        //select count(*) as Count_Prod_Farmers from[dbo].[All_Instance_Count]
        //        where status = 'prod' and company in ('Farmers','Exchange')

        //select count(*) as Count_NONProd_Farmers from[dbo].[All_Instance_Count]
        //        where status<> 'prod' and company in ('Farmers','Exchange')

        //Non-Prod Wise
        //=============
        //select count(*) as Count_Dev_Farmers from[dbo].[All_Instance_Count]
        //        where status = 'dev' and company in ('Farmers','Exchange')

        //select count(*) as Count_QA_Farmers from[dbo].[All_Instance_Count]
        //        where status in ('QA','Reporting','SIT') and company in ('Farmers','Exchange')

        //select count(*) as Count_Test_Farmers from[dbo].[All_Instance_Count]
        //        where status in ('Test','Trng') and company in ('Farmers','Exchange')

        //Vesion Wise(Bar-graph)
        //===========
        //select Version as SQL_Version_Farmers,count(Version) as Count_SQL_Version_Farmers from[dbo].[All_Instance_Count]
        //        where version like 'SQL%' and company in ('Farmers','Exchange') group by version

        //select Version as Oracle_Version_Farmers,count(Version) as Count_Oracle_Version_Farmers from[dbo].[All_Instance_Count]
        //        where version like 'Oracle%' and company in ('Farmers','Exchange') group by version

        //select Version as DB2_Version_Farmers,count(Version) as Count_DB2_Version_Farmers from[dbo].[All_Instance_Count]
        //        where version like 'DB%' and company in ('Farmers','Exchange') group by version



        #endregion


        #region EMEA Analysis     

        public TechnologyDetailsViewModel GetEMEAServersTechnologyDetails()
        {
            return this.db.FirstOrDefault<TechnologyDetailsViewModel>(
                "select"
                    +" sum(case when version like 'SQL%'  then 1 else 0 end) as MSSQLServersCount,"
                    +" sum(case when version like 'ORACLE%' then 1 else 0 end) as OracleServersCount,"
                    +" sum(case when version like 'DB%'  then 1 else 0 end) as DB2ServersCount"
                    +" from[dbo].[All_Instance_Count]"
                    +" where  company in ('EMEA')");
        }

        //public EnvironmentDetailsViewModel GetEMEAServersEnvironmentDetails()
        //{
        //    return this.db.FirstOrDefault<EnvironmentDetailsViewModel>(
        //        "select"
        //        + " sum(case when status = 'prod'  then 1 else 0 end) as EnvProdCount,"
        //        + " sum(case when status <> 'prod' then 1 else 0 end) as EnvNonProdCount"
        //        + " from[dbo].[All_Instance_Count]"
        //        + " where  company in ('ZNA', 'Canada')");
        //}

        public ServerTypeDetailsViewModel GetEMEAServerTypeDetails()
        {
            return this.db.FirstOrDefault<ServerTypeDetailsViewModel>(
                "select"
                    +" sum(case when status = 'dev'  then 1 else 0 end) as DevServersCount,"
                    +" sum(case when status in ('QA', 'Reporting', 'SIT')  then 1 else 0 end) as QAServersCount,"
                    +" sum(case when status in ('Test', 'Trng')  then 1 else 0 end) as TestServersCount"
                    +" from[dbo].[All_Instance_Count]"
                    +" where company in ('EMEA')");
        }

        //public Dictionary<string, int> GetOracleInstanceCountInEMEAServersByProd()
        //{
        //    return this.db.Query<dynamic>(
        //        "select Version as OracleVersionZNA,count(Version) as OracleVersionZNACount from [dbo].[All_Instance_Count] "
        //        + " where version like 'Oracle%' and company in ('ZNA', 'Canada') AND status = 'prod'"
        //        + " group by version")
        //        .ToDictionary(e => (string)e.OracleVersionZNA, e => (int)e.OracleVersionZNACount);
        //}

        public Dictionary<string, int> GetOracleInstanceCountInEMEAServersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select Version as OracleVersion, count(Version) as OracleVersionCount from[dbo].[All_Instance_Count]"
                +" where  version like 'Oracle%' and company in ('EMEA') AND status <> 'prod'"
                +" group by version")
                .ToDictionary(e => (string)e.OracleVersion, e => (int)e.OracleVersionCount);
        }

        //public Dictionary<string, int> GetDB2InstanceCountInEMEAServersByProd()
        //{
        //    return this.db.Query<dynamic>(
        //        "select Version as DB2Version,count(Version) as DB2VersionCount from [dbo].[All_Instance_Count] "
        //        + " where version like 'DB%' and company in ('ZNA', 'Canada') AND status = 'prod'"
        //        + " group by version")
        //        .ToDictionary(d => (string)d.DB2Version, d => (int)d.DB2VersionCount);
        //}

        public Dictionary<string, int> GetDB2InstanceCountInEMEAServersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select Version as DB2Version,count(Version) as DB2VersionCount from [dbo].[All_Instance_Count] "
                +" where version like 'DB%' and company in ('EMEA') AND status <> 'prod'"
                +" group by version")
                .ToDictionary(d => (string)d.DB2Version, d => (int)d.DB2VersionCount);
        }

        public Dictionary<string, int> GetSqlInstanceCountInEMEAServersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select Version as SQLversion,count(Version) as SQLVersionCount from [dbo].[All_Instance_Count] "
                +" where version like 'SQL%' and company in ('EMEA') AND status <> 'prod'"
                +" group by version")
                    .ToDictionary(d => (string)d.SQLversion, d => (int)d.SQLVersionCount);
        }

        //public Dictionary<string, int> GetSqlInstanceCountInEMEAServersByProd()
        //{
        //    return this.db.Query<dynamic>(
        //        "select Version as SQLVersion,count(Version) as SQLVersionCount from [dbo].[All_Instance_Count] "
        //        + " where version like 'SQL%' and company in ('ZNA', 'Canada') AND status = 'prod'"
        //        + " group by version")
        //            .ToDictionary(e => (string)e.SQLVersion, e => (int)e.SQLVersionCount); ;
        //}

        public ServerAnalysisViewModel GetEMEAServersAnalysisViewModel()
        {
            var vm = new ServerAnalysisViewModel();

            //vm.DB2ServersProd = this.GetDB2InstanceCountInZNAServersByProd();
            //vm.SQLServersProd = this.GetSqlInstanceCountInZNAServersByProd();
            //vm.OracleServersProd = this.GetOracleInstanceCountInZNAServersByProd();

            vm.DB2ServersNonProd = this.GetDB2InstanceCountInEMEAServersByNonProd();
            vm.SQLServersNonProd = this.GetSqlInstanceCountInEMEAServersByNonProd();
            vm.OracleServersNonProd = this.GetOracleInstanceCountInEMEAServersByNonProd();

            vm.TechDetails = this.GetEMEAServersTechnologyDetails();
            //vm.EnvDetails = this.GetEMEAServersEnvironmentDetails();
            vm.ServerTypeDetails = this.GetEMEAServerTypeDetails();

            return vm;
        }



        #endregion
       

        #region ZNA Analysis

        public TechnologyDetailsViewModel GetZNAServersTechnologyDetails()
        {
            return this.db.FirstOrDefault<TechnologyDetailsViewModel>(
                "select"
                    +" sum(case when version like 'SQL%'  then 1 else 0 end) as MSSQLServersCount,"
                    +" sum(case when version like 'ORACLE%' then 1 else 0 end) as OracleServersCount,"
                    +" sum(case when version like 'DB%' then 1 else 0 end) as DB2ServersCount"
                    +" from[dbo].[All_Instance_Count]"
                    +" where  company in ('ZNA', 'Canada')");
        }

        public EnvironmentDetailsViewModel GetZNAServersEnvironmentDetails()
        {
            return this.db.FirstOrDefault<EnvironmentDetailsViewModel>(
                "select"
                +" sum(case when status = 'prod'  then 1 else 0 end) as EnvProdCount,"
                +" sum(case when status <> 'prod' then 1 else 0 end) as EnvNonProdCount"
                +" from[dbo].[All_Instance_Count]"
                +" where  company in ('ZNA', 'Canada')");
        }

        public ServerTypeDetailsViewModel GetZNAServerTypeDetails()
        {
            return this.db.FirstOrDefault<ServerTypeDetailsViewModel>(
                "select"
                    +" sum(case when status = 'dev'  then 1 else 0 end) as DevServersCount,"
                    +" sum(case when status in ('QA', 'Reporting', 'SIT')  then 1 else 0 end) as QAServersCount,"
                    +" sum(case when status in ('Test', 'Trng')  then 1 else 0 end) as TestServersCount"                    
                    +" from[dbo].[All_Instance_Count]"
                    +" where company in ('ZNA','Canada')");
        }        

        public Dictionary<string, int> GetOracleInstanceCountInZNAServersByProd()
        {
            return this.db.Query<dynamic>(
                "select Version as OracleVersionZNA,count(Version) as OracleVersionZNACount from [dbo].[All_Instance_Count] "
                + " where version like 'Oracle%' and company in ('ZNA', 'Canada') AND status = 'prod'"
                +" group by version")
                .ToDictionary(e => (string)e.OracleVersionZNA, e => (int)e.OracleVersionZNACount);
        }

        public Dictionary<string, int> GetOracleInstanceCountInZNAServersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select Version as OracleVersionZNA, count(Version) as OracleVersionZNACount from[dbo].[All_Instance_Count]"
                + "where version like 'Oracle%' and company in ('ZNA', 'Canada') AND status <> 'prod'"
                +"group by version")
                .ToDictionary(e => (string)e.OracleVersionZNA, e => (int)e.OracleVersionZNACount);
        }

        public Dictionary<string, int> GetDB2InstanceCountInZNAServersByProd()
        {
            return this.db.Query<dynamic>(
                "select Version as DB2Version,count(Version) as DB2VersionCount from [dbo].[All_Instance_Count] "
                + " where version like 'DB%' and company in ('ZNA', 'Canada') AND status = 'prod'"
                +" group by version")
                .ToDictionary(d => (string)d.DB2Version, d => (int)d.DB2VersionCount);
        }

        public Dictionary<string, int> GetDB2InstanceCountInZNAServersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select Version as DB2Version,count(Version) as DB2VersionCount from [dbo].[All_Instance_Count] "
                + "where version like 'DB%' and company in ('ZNA', 'Canada') AND status <> 'prod'"
                +"group by version")
                .ToDictionary(d => (string)d.DB2Version, d => (int)d.DB2VersionCount);
        }

        public Dictionary<string, int> GetSqlInstanceCountInZNAServersByNonProd()
        {
            return this.db.Query<dynamic>(
                "select Version as SQLversion,count(Version) as SQLVersionCount from [dbo].[All_Instance_Count] "
                + " where version like 'SQL%' and company in ('ZNA', 'Canada') AND status <> 'prod'"
                + " group by version")
                    .ToDictionary(d => (string)d.SQLversion, d => (int)d.SQLVersionCount);
        }

        public Dictionary<string, int> GetSqlInstanceCountInZNAServersByProd()
        {
            return this.db.Query<dynamic>(
                "select Version as SQLVersion,count(Version) as SQLVersionCount from [dbo].[All_Instance_Count] "
                + " where version like 'SQL%' and company in ('ZNA', 'Canada') AND status = 'prod'"
                +" group by version")
                    .ToDictionary(e => (string)e.SQLVersion, e => (int)e.SQLVersionCount); ;
        }

        public ServerAnalysisViewModel GetZNAServersAnalysisViewModel()
        {
            var vm = new ServerAnalysisViewModel();

            vm.DB2ServersProd = this.GetDB2InstanceCountInZNAServersByProd();
            vm.SQLServersProd = this.GetSqlInstanceCountInZNAServersByProd();
            vm.OracleServersProd = this.GetOracleInstanceCountInZNAServersByProd();

            vm.DB2ServersNonProd = this.GetDB2InstanceCountInZNAServersByNonProd();
            vm.SQLServersNonProd = this.GetSqlInstanceCountInZNAServersByNonProd();
            vm.OracleServersNonProd = this.GetOracleInstanceCountInZNAServersByNonProd();

            vm.TechDetails = this.GetZNAServersTechnologyDetails();
            vm.EnvDetails = this.GetZNAServersEnvironmentDetails();
            vm.ServerTypeDetails = this.GetZNAServerTypeDetails();

            return vm;
        }



        #endregion

        #region ZNA Analysis

        public TechnologyDetailsViewModel Get21StCentServersTechnologyDetails()
        {
            return this.db.FirstOrDefault<TechnologyDetailsViewModel>(
                "select"
                    +" sum(case when version like 'SQL%'  then 1 else 0 end) as MSSQLServersCount,"
                    +" sum(case when version like 'ORACLE%' then 1 else 0 end) as OracleServersCount"
                    +" from[dbo].[All_Instance_Count]"
                    +" where  company in ('21stCentury')");
        }

        public EnvironmentDetailsViewModel Get21stCentServersEnvironmentDetails()
        {
            return this.db.FirstOrDefault<EnvironmentDetailsViewModel>(
                "select"
                    +" sum(case when status = 'prod'  then 1 else 0 end) as EnvProdCount,"
                    +" sum(case when status <> 'prod' then 1 else 0 end) as EnvNonProdCount"
                    +" from[dbo].[All_Instance_Count]"
                    +" where  company in ('21stCentury')");
        }

        public ServerTypeDetailsViewModel Get21stCentServerTypeDetails()
        {
            return this.db.FirstOrDefault<ServerTypeDetailsViewModel>(
                "select"
                    +" sum(case when status = 'dev'  then 1 else 0 end) as DevServersCount,"
                    +" sum(case when status in ('QA', 'Reporting', 'SIT')  then 1 else 0 end) as QAServersCount,"
                    +" sum(case when status in ('Test', 'Trng')  then 1 else 0 end) as TestServersCount"
                    +" from[dbo].[All_Instance_Count]"
                    +" where company in ('21stCentury')");
        }

        public Dictionary<string, int> GetOracleInstanceCountIn21stCentServersByProd()
        {
            return this.db.Query<dynamic>(
                " select Version as OracleVersion,count(Version) as OracleVersionCount  from [dbo].[All_Instance_Count] "
                + " where version like 'Oracle%' and company in ('21stCentury')  AND status = 'prod'"
                +" group by version")
                .ToDictionary(e => (string)e.OracleVersion, e => (int)e.OracleVersionCount);
        }

        public Dictionary<string, int> GetOracleInstanceCountIn21CentServersByNonProd()
        {
            return this.db.Query<dynamic>(
               " select Version as OracleVersion,count(Version) as OracleVersionCount  from [dbo].[All_Instance_Count] "
               + " where version like 'Oracle%' and company in ('21stCentury')  AND status <> 'prod'"
               + " group by version")
               .ToDictionary(e => (string)e.OracleVersion, e => (int)e.OracleVersionCount);
        }

        //public Dictionary<string, int> GetDB2InstanceCountInZNAServersByProd()
        //{
        //    return this.db.Query<dynamic>(
        //        "select Version as DB2Version,count(Version) as DB2VersionCount from [dbo].[All_Instance_Count] "
        //        + " where version like 'DB%' and company in ('ZNA', 'Canada') AND status = 'prod'"
        //        + " group by version")
        //        .ToDictionary(d => (string)d.DB2Version, d => (int)d.DB2VersionCount);
        //}

        //public Dictionary<string, int> GetDB2InstanceCountInZNAServersByNonProd()
        //{
        //    return this.db.Query<dynamic>(
        //        "select Version as DB2Version,count(Version) as DB2VersionCount from [dbo].[All_Instance_Count] "
        //        + "where version like 'DB%' and company in ('ZNA', 'Canada') AND status <> 'prod'"
        //        + "group by version")
        //        .ToDictionary(d => (string)d.DB2Version, d => (int)d.DB2VersionCount);
        //}

        public Dictionary<string, int> GetSqlInstanceCountIn21CentServersByProd()
        {
            return this.db.Query<dynamic>(
                " select Version as SQLVersion,count(Version) as SQLVersionCount  from [dbo].[All_Instance_Count] "
                + " where version like 'SQL%'  and company in ('21stCentury')  AND status = 'prod'"
                + " group by version")
                .ToDictionary(e => (string)e.SQLVersion, e => (int)e.SQLVersionCount);
        }

        public Dictionary<string, int> GetSqlInstanceCountIn21CentServersByNonProd()
        {
            return this.db.Query<dynamic>(
               " select Version as SQLVersion,count(Version) as SQLVersionCount  from [dbo].[All_Instance_Count] "
               + " where version like 'SQL%'  and company in ('21stCentury')  AND status <> 'prod'"
               + " group by version")
               .ToDictionary(e => (string)e.SQLVersion, e => (int)e.SQLVersionCount);
        }

        public ServerAnalysisViewModel Get21CentServersAnalysisViewModel()
        {
            var vm = new ServerAnalysisViewModel();

            //vm.DB2ServersProd = this.GetDB2InstanceCountInZNAServersByProd();
            vm.SQLServersProd = this.GetSqlInstanceCountIn21CentServersByProd();
            vm.OracleServersProd = this.GetOracleInstanceCountIn21stCentServersByProd();

           // vm.DB2ServersNonProd = this.GetDB2InstanceCountInZNAServersByNonProd();
            vm.SQLServersNonProd = this.GetSqlInstanceCountIn21CentServersByNonProd();
            vm.OracleServersNonProd = this.GetOracleInstanceCountIn21CentServersByNonProd();

            vm.TechDetails = this.Get21StCentServersTechnologyDetails();
            vm.EnvDetails = this.Get21stCentServersEnvironmentDetails();
            vm.ServerTypeDetails = this.Get21stCentServerTypeDetails();

            return vm;
        }



        #endregion

        #region summaries

        public SummariesViewModel getSeverSummaries()
        {
            var vm = new SummariesViewModel();
            vm.TechnologySummary = this.GetTechnologySummary();
            vm.MSSQLSummary = this.GetMSSQLSummary();
            vm.OracleSummary = this.GetOracleSummary();
            vm.LSASummary = this.GetLSASummary();
            vm.DB2Summary = this.GetDB2Summary();
            
            return vm;
        }

        public dynamic getSummaries()
        {
            var vm = new {
                TechnologySummary = this.db.Fetch<dynamic>("select * from [dbo].[Technology_Summary]"),
                MSSQLSummary = this.db.Fetch<dynamic>("select * from [dbo].[MSSQL_Summary]").ToList(),
                OracleSummary = this.db.Fetch<dynamic>("select * from [dbo].[Oracle_Summary]").ToList(),
                LSASummary = this.db.Fetch<dynamic>("select * from [dbo].[LSA_Summary]").ToList(),
                DB2Summary = this.db.Fetch<dynamic>("select * from [dbo].[DB2_Summary]").ToList(),
                OracleVersionSummary = this.db.Fetch<dynamic>("select * from [dbo].[Oracle_Version_Summary]").ToList(),
                MSSQLVersionSummary = this.db.Fetch<dynamic>("select * from [dbo].[MSSQL_Version_Summary]").ToList(),
                DB2VersionSummary = this.db.Fetch<dynamic>("select * from [dbo].[DB2_Version_Summary]").ToList()
            };
        
            return vm;
        }

        public List<TechnologySummary> GetTechnologySummary()
        {
            return this.db.Fetch<TechnologySummary>(
                "select * from [dbo].[Technology_Summary]");
        }

        public List<LSASummary> GetLSASummary()
        {
            return this.db.Fetch<LSASummary>(
                "select * from [dbo].[LSA_Summary]").ToList();
        }

        public List<DB2Summary> GetDB2Summary()
        {
            return this.db.Fetch<DB2Summary>(
                "select * from [dbo].[DB2_Summary]").ToList();
        }

        public List<OracleSummary> GetOracleSummary()
        {
            return this.db.Fetch<OracleSummary>(
                "select * from [dbo].[Oracle_Summary]").ToList();
        }

        public List<MSSQLSummary> GetMSSQLSummary()
        {
            return this.db.Fetch<MSSQLSummary>(
                "select * from [dbo].[MSSQL_Summary]").ToList();
        }

        #endregion

    }
}
