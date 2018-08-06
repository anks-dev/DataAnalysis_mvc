using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAnalysis.service.Models
{
    public class InstanceDetails
    {
        public string CompanName { get; set; }
        public string SupportedBy { get; set; }
        public string MachineName { get; set; }
        public string IPAddress { get; set; }
        public string Monitor { get; set; }
        public string Status { get; set; }
        public string Version { get; set; }
        public string ServicePack { get; set; }
        public string OS { get; set; }
        public string ProjectUsing { get; set; }
        public string Contact { get; set; }
        public string Edition { get; set; }
        public string Virtual { get; set; }
        public string InstanceName { get; set; }
        public string SourceTable { get; set; }
    }

    public class InstanceInfo
    {

        public string InstanceName { get; set; }
        public string FQName { get; set; }
        public string MachineName { get; set; }
        public string IPAddress { get; set; }
        public string Company { get; set; }
        public string SupportedBy { get; set; }
        public string Monitor { get; set; }
        public string AliasFor { get; set; }
        public string Status { get; set; }
        public string Is_Cluster { get; set; }
        public string HostNodes { get; set; }
        public string Version { get; set; }
        public string ServicePack { get; set; }
        public string Edition { get; set; }
        public string OS { get; set; }
        public string IsVirtual { get; set; }
        public string ProjectsUsing { get; set; }
        public string BusinessUnit { get; set; }
        public string Contact { get; set; }

    }
}     