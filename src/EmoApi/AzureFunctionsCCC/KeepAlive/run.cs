using Microsoft.Azure.WebJobs.Host;
using System;
using Microsoft.Azure.WebJobs;

namespace Novanet
{
    public class KeepAlive {
        public static void Run(TimerInfo myTimer, TraceWriter log)
        {
            log.Info($"Keep alive trigger function executed at: {DateTime.Now}");
        }
    }
}