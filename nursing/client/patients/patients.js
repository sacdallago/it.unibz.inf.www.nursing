Patients = new Meteor.Collection("patients");

//patientsHandle is used in Session.js to manage when to show loading cubes
patientsHandle = Meteor.subscribe('patients',function(error){
	if(error){
		Notifications.error('Error','Si è verificato un errore caricando i pazienti. Contattare gli amministratori');
	}
});