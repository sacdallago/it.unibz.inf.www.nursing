//Define file storage collection at startup
JournalDocuments = new FS.Collection("journalDocuments", {
	stores : [new FS.Store.FileSystem("journalDocuments")]
});

journalDocumentsHandle = null;

FS.HTTP.setBaseUrl('/attachments');

Template.journalItems.journals = function(){
	return Journal.find({},{ sort : { timestamp : -1} }).map(function(element){
		var patient = Patients.findOne(element.patientId);
		element.patientName = niceName(patient.first,patient.last);
		
		var room = Rooms.findOne({'patientId':element.patientId});	
		element.bed = room.number + "" + room.bed;
		
		element.date = dateFormatter(element.timestamp);
		
		element.subject ? (element.subject = ((String) (element.subject)).capitalize()) : null ;
		
		var nurse = Meteor.users.findOne(element.nurseId);
		element.nurseName = niceName(nurse.profile.first,nurse.profile.last);
		
		return element;
	});
};
