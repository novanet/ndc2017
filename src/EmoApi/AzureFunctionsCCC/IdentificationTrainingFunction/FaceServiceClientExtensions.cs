using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.ProjectOxford.Face;
using Microsoft.ProjectOxford.Face.Contract;

namespace Novanet
{
    public static class FaceServiceClientExtensions
    {
        public static async Task CreatePersonGroupIfNotExising(this FaceServiceClient client, string personGroupId, string name)
        {
            var personGroups = await client.ListPersonGroupsAsync();
            if (!personGroups.Any(pg => pg.PersonGroupId.Equals(personGroupId, StringComparison.InvariantCultureIgnoreCase)))
            {
                await client.CreatePersonGroupAsync(personGroupId, name);
            }
        }

        public static async Task<Guid> CreateUserAsPersonIfNotExising(this FaceServiceClient client, string personGroupId, User user)
        {
            // Use person UserData property to store external UserId for matching
            var persons = await client.GetPersonsAsync(personGroupId);
            if (persons.Any(p => p.UserData.Equals(user.Id.ToString(), StringComparison.InvariantCultureIgnoreCase)))
            {
                return persons.First(p => p.UserData.Equals(user.Id.ToString(), StringComparison.InvariantCultureIgnoreCase)).PersonId;
            }
            var person = await client.CreatePersonAsync(personGroupId, user.Name, user.Id.ToString());
            return person.PersonId;
        }

        public static async Task WaitForPersonGroupStatusNotRunning(this FaceServiceClient client, string personGroupId, TraceWriter log)
        {
            // WOW, this is ugly, should probably put back on queue?
            try
            {
                var status = await client.GetPersonGroupTrainingStatusAsync(personGroupId);

                while (status.Status == Status.Running)
                {
                    log.Info("Waiting for training...");
                    await Task.Delay(5000);
                }
            } catch (FaceAPIException notTrainedException)
            {
                // Throws if never tained before, and I don't care.
            }
        }
    }
}