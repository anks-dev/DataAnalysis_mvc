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

        //[Route("getserverssummaries")]
        //public dynamic Getserverssummaries(string version, string company)
        //{
        //    return new ServersManager().getSeverSummaries();
        //}

        [Route("getsummaries")]
        public dynamic Getsummaries()
        {
            return new ServersManager().getSummaries();
        }






        //        Get["/"] = parameters =>
        //            {
        //                return View["index"];
        //            };

        //    Get["/getanlysisdata"] = parameters =>
        //            {

        //                var mg = new ServersManager();
        //                return Response.AsJson(mg.getServersAnalysisViewModel());
        //            };

        //Get["/getInstanceInfo"] = parameters =>
        //            {

        //               var name = this.Request.Query["name"];
        //var mg = new InstanceInfoManager();
        //                return mg.GetInstanceByName(name);
        //            };

        //            Get["/getInstancesList"] = parameters =>
        //            {

        //                var version = this.Request.Query["version"];
        //var company = this.Request.Query["company"];
        //var mg = new InstanceInfoManager();
        //                return mg.GetInstancesList(version, company);
        //            };

        //            Get["/getserverssummaries"] = parameters =>
        //            {
        //                var mg = new ServersManager();
        //                return Response.AsJson(mg.getSeverSummaries());                
        //            };

        //            Get["/getsummaries"] = parameters =>
        //            {
        //                var mg = new ServersManager();
        //                return mg.getSummaries();
        //            }; 

    }
}
