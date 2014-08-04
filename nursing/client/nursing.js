var wantstoregister = false;

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.loginform.events({
	'submit #login-form' : function(e, t) {
		e.preventDefault();
		// retrieve the input field values
		var username = t.find('#login-username').value, password = t.find('#login-password').value;

		// Trim and validate your fields here....

		// If validation passes, supply the appropriate fields to the
		// Meteor.loginWithPassword() function.
		Meteor.loginWithPassword(username, password, function(err) {
		});
		return false;
	},
	'click #create-account' : function(e, t) {
		e.preventDefault();
		wantstoregister = true;
	}
});

Template.main.loggedin = function () {
  return Meteor.user();
};

Template.main.wantstoregister = function () {
  return wantstoregister;
};