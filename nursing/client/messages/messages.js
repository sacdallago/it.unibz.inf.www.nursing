Messages = new Meteor.Collection("messages");

Session.setDefault('unreadMessages', 0);
// Gets augmented when a new message for the given ward gets inserted!

//This is what the template displays
var messagesHandle = null;

Template.messages.events({
	'submit #more' : function(e, t) {
		e.preventDefault();
		Notifications.success('Loading next 5 messages');
		messagesHandle.loadNextPage();
	}
});

Template.messages.messages = function() {
	messagesHandle = Meteor.subscribeWithPagination("messages", 5, function onReady() {
		Session.set('messagesLoaded', true);
	});
	return Messages.find({}, {
		sort : {
			time : -1
		}
	});
};
/////////////////////////////////////

//This is what the template minimessages displays -- currently not loaded in html
Template.minimessages.messages = function() {
	var handle = Meteor.subscribe;
	var messages = Messages.find({}, {
		sort : {
			time : -1
		},
		limit : 4
	}).fetch();

	var result = [];

	for (var i = 0; i < 4 && i < messages.length; i++) {
		var patient = Patients.findOne({
			'_id' : Hospitalizations.findOne({
				'_id' : messages[i].hospitalizationId
			}).patientId
		});
		var date = new Date(messages[i].time);
		var trim = 30;
		while (messages[i].message.charAt(trim) != " " && messages[i].message.length > trim) {
			trim++;
		}
		var element = {
			attachment : messages[i].attachment,
			name : patient.first.capitalize() + " " + patient.last.capitalize(),
			timestamp : date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes(),
			message : messages[i].message.substring(0, trim) + "..."
		};
		result.push(element);
	}
	return result;
}; 