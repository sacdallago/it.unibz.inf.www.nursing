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
		// 
	}

});

Template.navigation.events({
	'click #logout-toggle' : function(e, t) {
		e.preventDefault();
		Meteor.logout();
	}
});

// Router for Pages
var NursingRouter = Backbone.Router.extend({
  routes: {
    
    
  }
  
});



Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

