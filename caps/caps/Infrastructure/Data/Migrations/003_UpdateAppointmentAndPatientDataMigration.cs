using MongoDB.Bson;
using MongoDB.Driver;

namespace caps.Infrastructure.Data.Migrations;

public class UpdateAppointmentAndPatientDataMigration : IMigration
{
    public int MigrationId => 3; // Unique ID for this migration
    public string Description => "Set default values and update NumberOfAppointments for patients and construct AppointmentId for appointments";

    public async Task Up(IMongoDatabase database)
    {
        var appointmentsCollection = database.GetCollection<BsonDocument>("Appointments");
        var patientsCollection = database.GetCollection<BsonDocument>("Patients");

        // Step 1: Set default values for missing fields
        var updateAppointmentsDefault = Builders<BsonDocument>.Update.Set("AppointmentId", "0");
        await appointmentsCollection.UpdateManyAsync(
            Builders<BsonDocument>.Filter.Exists("AppointmentId", false),
            updateAppointmentsDefault
        );

        var updatePatientsDefault = Builders<BsonDocument>.Update.Set("NumberOfAppointments", 0);
        await patientsCollection.UpdateManyAsync(
            Builders<BsonDocument>.Filter.Exists("NumberOfAppointments", false),
            updatePatientsDefault
        );

        // Step 2: Update NumberOfAppointments for each patient
        var patientAppointments = await appointmentsCollection
            .Aggregate()
            .Group(new BsonDocument
            {
                { "_id", "$PatientId" },
                { "AppointmentCount", new BsonDocument("$sum", 1) }
            })
            .ToListAsync();

        foreach (var entry in patientAppointments)
        {
            var patientId = entry["_id"].AsObjectId;
            var appointmentCount = entry["AppointmentCount"].AsInt32;

            var updatePatient = Builders<BsonDocument>.Update.Set("NumberOfAppointments", appointmentCount);
            await patientsCollection.UpdateOneAsync(
                Builders<BsonDocument>.Filter.Eq("_id", patientId),
                updatePatient
            );
        }

        // Step 3: Construct AppointmentId for each appointment
        var patients = await patientsCollection.Find(FilterDefinition<BsonDocument>.Empty).ToListAsync();

        foreach (var patient in patients)
        {
            var patientId = patient["_id"].AsObjectId;
            var idNumber = patient["IDNumber"].AsString;

            var patientAppointmentsCursor = await appointmentsCollection
                .Find(Builders<BsonDocument>.Filter.Eq("PatientId", patientId))
                .Sort(Builders<BsonDocument>.Sort.Ascending("_id")) // Ensure consistent order
                .ToListAsync();

            int counter = 1;
            foreach (var appointment in patientAppointmentsCursor)
            {
                var formattedIdNumber = $"{idNumber.Substring(0, 4)}-{idNumber.Substring(4, 4)}-{idNumber.Substring(8)}";
                var appointmentId = $"{formattedIdNumber}.{counter:D3}";

                var updateAppointment = Builders<BsonDocument>.Update.Set("AppointmentId", appointmentId);
                await appointmentsCollection.UpdateOneAsync(
                    Builders<BsonDocument>.Filter.Eq("_id", appointment["_id"].AsObjectId),
                    updateAppointment
                );

                counter++;
            }
        }
    }
}
