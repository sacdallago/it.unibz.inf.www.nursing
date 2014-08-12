// see https://github.com/sacdallago/it.unibz.inf.www.nursing/wiki/Collections

Messages = new Meteor.Collection("messages");
Alerts = new Meteor.Collection("alerts");
Patients = new Meteor.Collection("patients");
Hospitalizations = new Meteor.Collection("hospitalizations");
Notes = new Meteor.Collection("notes");

Rooms = new Meteor.Collection("rooms");

//Security first
Meteor.publish('notes', function() {
  if(this.userId){
		return Notes.find(); 
	} else {
		return null;
	} 
});
Meteor.publish('messages', function(limit) {
  if(this.userId){
		return Messages.find({}, {limit: limit}); 
	} else {
		return null;
	}
});
Meteor.publish('hospitalizations', function() {
  if(this.userId){
		return Hospitalizations.find(); 
	} else {
		return null;
	}
});
Meteor.publish('patients', function() {
  if(this.userId){
		return Patients.find(); 
	} else {
		return null;
	} 
});
Meteor.publish('alerts', function() {
  if(this.userId){
		return Alerts.find(); 
	} else {
		return null;
	} 
});

Meteor.publish('rooms', function(){
	if(this.userId){
		return Rooms.find();
	} else{
		return null;
	}
});