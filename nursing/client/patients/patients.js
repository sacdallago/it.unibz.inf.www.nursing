Patients = new Meteor.Collection("patients");

//patientsHandle is used in Session.js to manage when to show loading cubes
patientsHandle = Meteor.subscribe('patients',function(error){
	if(error){
		Notifications.error('Error','There was an error loading the patients. Please contact the administrators.');
	}
});