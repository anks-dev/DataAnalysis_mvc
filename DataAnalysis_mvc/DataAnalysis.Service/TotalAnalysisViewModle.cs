using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAnalysis.Service.Models
{
    public class TotalAnalysisViewModel

    {        
        public int TotalProdServersCount { get; set; }

        public List<string> ProdVersions { get; set; }

        public List<string> ProdEditions { get; set; }

        public List<string> NonProdVersions { get; set; }

        public List<string> NonProdEditions { get; set; }

        public int ProdClustersCount { get; set; }

        public int NonProdClustersCount { get; set; }

        public int TotalNonProdServersCount { get; set; }

        public int DevSeversCount { get; set; }

        public int QAServersCount { get; set; }

        public int TestServersCount { get; set; }

        public int SitServersCount { get; set; }

        public int OtherServersCount { get; set; }

        public List<KeyValuePair<string, int>> ProdItemsByVersion { get; set; }

        public List<KeyValuePair<string, int>> NonProdItemsByVersion { get; set; }

        public List<KeyValuePair<string, int>> ProdItemsByEdition { get; set; }

        public List<KeyValuePair<string, int>> NonProdItemsByEdition { get; set; }

        public List<KeyValuePair<string, int>> NonProdItemsByStatus { get; set; }

        public MachineDetails MachineDetails { get; set; }


        public Object DataSource { get; set; }

        public string TableName { get; set; }

        private int _prodVersionCount;

        public int ProdVersionCount {

            get
            {
                return _prodVersionCount;
            }
            set
            {
                _prodVersionCount = value;
                OnPropertyChanged("ProdVersionCount");               
            }
        }
        public int TotalServers
        {

            get
            {
                return this.TotalProdServersCount + this.TotalNonProdServersCount;
            }            
        }



        public TotalAnalysisViewModel()
        {
            this.ProdVersions = new List<string>();
            this.ProdEditions = new List<string>();
            this.NonProdVersions = new List<string>();
            this.NonProdEditions = new List<string>();
            this.ProdItemsByVersion = new List<KeyValuePair<string, int>>();
            this.NonProdItemsByVersion = new List<KeyValuePair<string, int>>();
            this.ProdItemsByEdition = new List<KeyValuePair<string, int>>();
            this.NonProdItemsByEdition = new List<KeyValuePair<string, int>>();
            this.NonProdItemsByStatus = new List<KeyValuePair<string, int>>();
            this.MachineDetails = new MachineDetails();
        }

        public static TotalAnalysisViewModel operator+ (TotalAnalysisViewModel a, TotalAnalysisViewModel b)
        {
            TotalAnalysisViewModel model = new TotalAnalysisViewModel();

            model.TotalProdServersCount = a.TotalProdServersCount + b.TotalProdServersCount;
            
            model.ProdVersions.AddRange(a.ProdVersions.Concat(b.ProdVersions).Distinct());

            model.ProdEditions.AddRange(a.ProdEditions.Concat(b.ProdEditions).Distinct());

            model.NonProdVersions.AddRange(a.NonProdVersions.Concat(b.NonProdVersions).Distinct());

            model.NonProdEditions.AddRange(a.NonProdEditions.Concat(b.NonProdEditions).Distinct());           

            model.ProdClustersCount  = a.ProdClustersCount + b.ProdClustersCount;

            model.NonProdClustersCount = a.NonProdClustersCount + b.NonProdClustersCount;

            model.TotalNonProdServersCount = a.TotalNonProdServersCount + b.TotalNonProdServersCount;

            model.DevSeversCount = a.DevSeversCount + b.DevSeversCount;

            model.QAServersCount = a.QAServersCount + b.QAServersCount;

            model.TestServersCount = a.TestServersCount + b.TestServersCount;

            model.SitServersCount = a.SitServersCount + b.SitServersCount;
            
            model.OtherServersCount = a.OtherServersCount + b.OtherServersCount;

            model.ProdItemsByVersion.AddRange(a.ProdItemsByVersion.Concat(b.ProdItemsByVersion).GroupBy(c => c.Key).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());

            model.NonProdItemsByVersion.AddRange(a.NonProdItemsByVersion.Concat(b.NonProdItemsByVersion).GroupBy(c => c.Key).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());

            model.ProdItemsByEdition.AddRange(a.ProdItemsByEdition.Concat(b.ProdItemsByEdition).GroupBy(c => c.Key).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());

            model.NonProdItemsByEdition.AddRange(a.NonProdItemsByEdition.Concat(b.NonProdItemsByEdition).GroupBy(c => c.Key).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());

            model.NonProdItemsByStatus.AddRange(a.NonProdItemsByStatus.Concat(b.NonProdItemsByStatus).GroupBy(c => c.Key.ToLower()).Select(c => new KeyValuePair<string, int>(c.Key, c.Sum(d => d.Value))).ToList());

            //a.NonProdItemsByStatus.Concat(b.NonProdItemsByStatus).ToList().ForEach(c => {
            //    var index = model.NonProdItemsByStatus.FindIndex(d => d.Key.ToLower().Equals(c.Key));
            //    if (index == -1)
            //    {
            //        model.NonProdItemsByStatus.Add(new KeyValuePair<string, int>(c.Key, c.Value));
            //    }
            //    else
            //    {
            //        model.NonProdItemsByStatus[index] = new KeyValuePair<string, int>(c.Key, c.Value + model.NonProdItemsByStatus[index].Value);
            //       // model.NonProdItemsByStatus.Add(new KeyValuePair<string, int>(c.Key, c.Value));
            //    }

            //   // model.NonProdItemsByStatus.Add()


            //});


            // machine details
            model.MachineDetails.ProdMachines = a.MachineDetails.ProdMachines + b.MachineDetails.ProdMachines;
            //model.MachineDetails.NonProdMachines = a.MachineDetails.NonProdMachines + b.MachineDetails.NonProdMachines;
            model.MachineDetails.DevMachines = a.MachineDetails.DevMachines + b.MachineDetails.DevMachines;
            model.MachineDetails.QAMachines = a.MachineDetails.QAMachines + b.MachineDetails.QAMachines;
            model.MachineDetails.TestMachines = a.MachineDetails.TestMachines + b.MachineDetails.TestMachines;

            return model;
    }

        private void OnPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
        public event PropertyChangedEventHandler PropertyChanged;


       // public event PropertyChangedEventHandler PropertyChanged;
    }
    
}
