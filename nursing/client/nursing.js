Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Router.configure({
  templateNameConverter: 'upperCamelCase'
});

Router.map(function() {
	this.route('main', {
		path : '/'
	});
	this.route('home');
	this.route('loginform');
	this.route('registrationform');
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
		window.location.href = '/registrationform';
	}
});

Template.navigation.events({
	'click #logout-toggle' : function(e, t) {
		e.preventDefault();
		Meteor.logout();
	}
});