using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAnalysis.Service.Models
{

    public class MachineDetails
    {
        public int ProdMachines { get; set; }
        public int NonProdMachines
        {
            get
            {
                return this.DevMachines + this.QAMachines + this.TestMachines;
            }

        }
        public int DevMachines { get; set; }
        public int QAMachines { get; set; }
        public int TestMachines { get; set; }
        public int TotalMachines
        {
            get
            {
                return this.ProdMachines + this.NonProdMachines;
            }
        }
    }

}
