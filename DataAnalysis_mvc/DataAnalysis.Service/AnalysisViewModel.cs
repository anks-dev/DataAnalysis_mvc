using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAnalysis.Service.Models
{

    public class TechnologySummary
    {           
      
        public string SQL_Prod_Count { get; set; }
        public string SQL_NonProd_Count { get; set; }

        public string DB2_Prod_Count { get; set; }
        public string DB2_NonProd_Count { get; set; }


        public string Oracle_Prod_Count { get; set; }
        public string Oracle_NonProd_Count { get; set; }
    }

    public class OracleSummary
    {
        public string Technology { get; set; }
        public string LSA { get; set; }
        public string Oracle_Prod { get; set; }
        public string Oracle_NonProd { get; set; }
        public string Oracle_Total { get; set; }
    }

    public class DB2Summary
    {
        public string Technology { get; set; }
        public string LSA { get; set; }
        public string DB2_Prod { get; set; }
        public string DB2_NonProd { get; set; }
        public string DB2_Total { get; set; }
    }

    public class MSSQLSummary
    {
        public string Technology { get; set; }
        public string LSA { get; set; }
        public string SQL_Prod { get; set; }
        public string SQL_NonProd { get; set; }
        public string SQL_Total { get; set; }
    }

    public class LSASummary
    {       
        public string LSA { get; set; }
        public string TotalProdCount { get; set; }
        public string TotalNonProdCount { get; set; }       
    }

    public class SummariesViewModel
    {
        public List<TechnologySummary> TechnologySummary { get; set; }
        public List<OracleSummary> OracleSummary { get; set; }
        public List<DB2Summary> DB2Summary { get; set; }
        public List<MSSQLSummary> MSSQLSummary { get; set; }
        public List<LSASummary> LSASummary { get; set; }

    }

    public class TechnologyDetailsViewModel
    {
        public int OracleServersCount { set; get; }
        public int MSSQLServersCount { set; get; }
        public int DB2ServersCount { set; get; }

        public TechnologyDetailsViewModel() { }
    }

    public class EnvironmentDetailsViewModel
    {
        public int EnvProdCount { get; set; }
        public int EnvNonProdCount { get; set; }

        public EnvironmentDetailsViewModel(){}
    }

    public class LSADetailsViewModel
    {
        public int EMEACount { get; set; }
        public int ZNACount { get; set; }
        public int _21CenturyCount { get; set; }
        public int FarmersCount { get; set; }

        public LSADetailsViewModel() { }
    }

    public class ServerTypeDetailsViewModel
    {
        public int DEVServersCount { get; set; }
        public int TestServersCount { get; set; }
        public int QAServersCount { get; set; }

        public ServerTypeDetailsViewModel() { }
    }

    public class ServerAnalysisViewModel
    {
        public TechnologyDetailsViewModel TechDetails { get; set; }
        public EnvironmentDetailsViewModel EnvDetails { get; set; }
        public LSADetailsViewModel LSADetails { get; set; }
        public ServerTypeDetailsViewModel ServerTypeDetails { get; set; }

        public Dictionary<string,int> SQLServersProd { get; set; }
        public Dictionary<string, int> OracleServersProd { get; set; }
        public Dictionary<string, int> DB2ServersProd { get; set; }

        public Dictionary<string, int> SQLServersNonProd { get; set; }
        public Dictionary<string, int> OracleServersNonProd { get; set; }
        public Dictionary<string, int> DB2ServersNonProd { get; set; }

        public ServerAnalysisViewModel()
        {

        }


    }

    public class AnalysisViewModel
    {
       
        public List<KeyValuePair<string, int>> InstanceName { get; set; }
        public List<KeyValuePair<string, int>> Version { get; set; }
        public List<KeyValuePair<string, int>> Status { get; set; }
        public List<KeyValuePair<string, int>> Company { get; set; }
        public List<KeyValuePair<string, int>> Monitor { get; set; }

        public TechnologyDetailsViewModel TechnologyDetails { get; set; }
        public EnvironmentDetailsViewModel EnvironmentDetails { get; set; }
        public LSADetailsViewModel LSADetails { get; set; }
        public ServerAnalysisViewModel FarmersAnalysis { get; set; }
        public ServerAnalysisViewModel ZNAServersAnalysis { get; set; }
        public ServerAnalysisViewModel EMEAServersAnalysis { get; set; }
        public ServerAnalysisViewModel _21stCenturyServersAnalysis { get; set; }



        public AnalysisViewModel()
        {
            this.TechnologyDetails = new TechnologyDetailsViewModel();
            this.EnvironmentDetails = new EnvironmentDetailsViewModel();
            this.LSADetails = new LSADetailsViewModel();
            this.FarmersAnalysis = new ServerAnalysisViewModel();
            this.ZNAServersAnalysis = new ServerAnalysisViewModel();
            this.EMEAServersAnalysis = new ServerAnalysisViewModel();

        }

        public static AnalysisViewModel operator +(AnalysisViewModel a, AnalysisViewModel b)
        {
            var vm = new AnalysisViewModel();

            //vm.InstanceName.AddRange(a.InstanceName.Concat(b.InstanceName).GroupBy(c => c.Key.ToLower()).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());
            //vm.Version.AddRange(a.Version.Concat(b.Version).GroupBy(c => c.Key.ToLower()).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());
            //vm.Company.AddRange(a.Company.Concat(b.Company).GroupBy(c => c.Key.ToLower()).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());
            //vm.Status.AddRange(a.Status.Concat(b.Status).GroupBy(c => c.Key.ToLower()).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());
            //vm.Monitor.AddRange(a.Monitor.Concat(b.Monitor).GroupBy(c => c.Key.ToLower()).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());

            //vm.OracleServerCount = a.OracleServerCount + b.OracleServerCount;

            return vm;

        }

    }
}
