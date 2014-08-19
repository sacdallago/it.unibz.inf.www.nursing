//Session variables

//Which page am I at?
Session.setDefault('pageName','login');

//Badges counter. These show up in the menu next to the relevant menu item
Session.setDefault('deadlineAlerts', 0); // Count the alerts that are due today
Session.setDefault('unreadMessages', 0); // When a new message is sent to the department the user is registered at, augment. When user enters /messages, set to 0


//Filters for find queries
Session.setDefault('typeFilter',null); // Filter that stores type attribute. Can be used in messsages (data.type: this)
Session.setDefault('patientFilter',null); // Filter that stores patient attribute. Can be used wherever patientId is used.

//Loading cubes
/*
 * Added: loading cubes while messages are not yet loaded
 * Added: loading cubes while patients are not yet loaded
 * Missing: alerts, oldpatients, 
 */
Template.loading.helpers({
	notReady : function() {
		if(Meteor.user()){
			return ( messagesHandle ? !messagesHandle.ready() : false) ||  !patientsHandle.ready();
		}
		return false;
	}
}); 

