﻿using System.Web;
using System.Web.Optimization;

namespace DataAnalysis_Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/libraries").Include(
                        "~/Scripts/jquery-2.2.3.js",
                        "~/Scripts/jquery.tmpl.js",
                        "~/Scripts/jquery - ui.js",
                        "~/Scripts/knockout.js",
                        "~/Scripts/datatables.js",
                        "~/Scripts/Chart.js",
                        "~/Scripts/bootstrap.js",
                        "~/Scripts/charjs - customization.js",
                        "~/Scripts/bootstrap3 - typeahead.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(                       
                       "~/Scripts/app/searchInstance.js",
                       "~/Scripts/app/summary.js",
                       "~/Scripts/app/dashboard.js",
                       "~/Scripts/app/instanceInfo.js"
                       ));
           
           
           
           

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}