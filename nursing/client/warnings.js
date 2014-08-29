//Set warnings to last 3seconds
Meteor.startup(function() {
	_.extend(Notifications.defaultOptions, {
		timeout : 3000
	});
});

//These warnings should ideally be similar to the notifications that come out at login, when you type the wrong username or pass
Warnings = new Meteor.Collection("warnings");
Meteor.subscribe("warnings");
Meteor.call("removeWarnings");
/*	To insert warnings use the function below
 *  Meteor.call("newNotification", title, message, department);
 */

/*
Deps.autorun(function() {
	Warnings.find({}).observeChanges({
		added : function(item) {
			console.log(item.title, item.message);
			// The next line of code is what this should ideally do. But due to some wired error, the user that fires the warning can't get rid of it... To be fixed!
			// Notifications.info(item.title,item.message);
		}
	});

	Journal.find({}).observeChanges({
		added : function(item) {
			Session.set('newJournals', Session.get('newJournals') + 1);
		}
	});
});
*/