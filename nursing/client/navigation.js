Template.navigation.helpers({
	newJournals : function() {
		var newJournals = Session.get("newJournals");
		if (newJournals == 0) {
			return null;
		}
		return newJournals;
	},
	deadlineReminders : function() {
		var deadlineReminders = Session.get("deadlineReminders");
		if (deadlineReminders == 0) {
			return null;
		}
		return deadlineReminders;
	},
	activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute && template === currentRoute.lookupTemplate() ? 'active' : '';
    }
});

Template.navigation.events({
	'click #logout-toggle' : function(e, t) {
		e.preventDefault();
		Meteor.logout();
		//This implemented intelligently can destroy all session variables!
		//Session.keys = {};
		var name = Meteor.user().profile.first;
		Notifications.success('', 'Bye bye ' + name.capitalize() + '.');
		Router.go('goodbye');
	}
});

Template.connectionStatus.connectionLost = function(){
	return !Meteor.status().connected;
};
