//Session variables

//Load rooms at startup
Rooms = new Meteor.Collection('rooms');
roomsHandle = Meteor.subscribe('rooms');

usersHandle = Meteor.subscribe('users');

//Which page am I at?
//Session.setDefault('pageName','login');
categoriesHandle = Meteor.subscribe('categories');

//Badges counter. These show up in the menu next to the relevant menu item
Session.setDefault('deadlineReminders', 0); // Count the reminders that are due today
Session.setDefault('newJournals', 0); // When a new message is sent to the department the user is registered at, augment. When user enters /messages, set to 0

// newReminder category
Session.setDefault('inputCategory', null);

//Filters for find queries
Session.setDefault('typeFilter',null); // Filter that stores type attribute. Can be used in messsages (data.type: this)
Session.setDefault('patientFilter',null); // Filter that stores patient id. Can be used wherever patientId is used.
Session.setDefault('hospitalizationFilter',null); // Filter that stores hospitalization id. Can be used wherever hospitalizationId is used.
Session.setDefault('problemFilter',null);

//Loading cubes
/*
 * Added: loading cubes while messages are not yet loaded
 * Added: loading cubes while patients are not yet loaded
 * Missing: reminders, oldpatients, 
 */

 //How to structure return statement for dynamically called handles:
//( messagesHandle ? !messagesHandle.ready() : false)
Template.loading.helpers({
	notReady : function() {
		if(Meteor.user()){
			return  !patientsHandle.ready() || !roomsHandle.ready() || !hospitalizationsHandle.ready();
		}
		return false;
	}
});

