using DataAnalysis.Service;
using DataAnalysis.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DataAnalysis_Web.Controllers.api
{
    [RoutePrefix("api/home")]
    public class DashboardController : ApiController
    {
        [Route("getregions")]
        public dynamic Getregions()
        {
            return new ServersManager().GetRegions();
        }

        [Route("getCompanyByRegion")]
        public dynamic Getregions(string region)
        {
            return new ServersManager().GetCompaniesByRegion(region);
        }

        [Route("getanlysisdata")]
        public dynamic Getanlysisdata()
        {
           return new ServersManager().getServersAnalysisViewModel();
        }
        
        [Route("getServersCountGlobally")]
        public dynamic GetServersCountGlobally()
        {
            return new ServersManager().getGlobalServersAnalysisView();
        }

        [Route("getServersCountByRegion")]
        public dynamic GetServersCountByRegion(string region)
        {
            return new ServersManager().getServersByRegion(region);
        }

        [Route("getanlysisdataByRegionandCompany")]
        public dynamic GetanlysisdataByRegionandCompany(string region,string company)
        {
            return new ServersManager().getServersAnalysisByRegionandCompany(region,company);
        }

        [Route("getInstanceInfo")]
        public dynamic GetInstanceInfo(string name)
        {
            return new InstanceInfoManager().GetInstanceByName(name);
        }

        [Route("getInstancesList")]
        public dynamic GetInstancesList(string version, string company)
        {
            return new InstanceInfoManager().GetInstancesList(version, company);
        }       

        [Route("getsummaries")]
        public dynamic Getsummaries()
        {
            return new ServersManager().getSummaries();
        }    
    }
}
