//Login
Template.loginform.events({
	'submit #login-form' : function(e, t) {
		e.preventDefault();

		var username = t.find('#login-username').value, password = t.find('#login-password').value;

		Meteor.loginWithPassword(username, password, function(err) {
			if (err) {
				Notifications.warn('Could not login!', 'Please check your credentials.');
			} else {
				Router.go('registrationform');
			}
		});
		return false;
	},
	'click #create-account' : function(e, t) {
		e.preventDefault();
		Router.go('registrationform');
	}
});

//Registration
Template.registrationform.departments = Departments; //See client/lib/helpers.js

Template.registrationform.events({
	'submit #register-form' : function(e, t) {
		e.preventDefault();
		// retrieve the input field values
		var first = t.find('#account-first').value, last = t.find('#account-last').value, username = t.find('#account-username').value, email = t.find('#account-email').value, password = t.find('#account-password').value, passwordCheck = t.find('#account-password-repeat').value, admin = t.find('#admin-password').value, department = t.find('#account-department').value;

		if (first && last && username && password && passwordCheck && admin && department) {
			if (password == passwordCheck) {
				if (admin % 2 == 0) {
					if (username.length >= 3 && username.length <= 15) {
						//Yay, it worked!

						Accounts.createUser({
							profile : {
								first : first,
								last : last,
								department : department
							},
							username : username,
							email : email,
							password : password
						}, function(err) {
							if (err) {
								Notifications.error('Error!', 'Failed to create user. Please contact administrators.');
							} else {
								//autoroute
							}
						});

						return false;
					} else {
						Notifications.warn('Warning:', 'Username must have at least 3 characters and not more than 15!');
						throw new Meteor.Error(403, "Username must have at least 3 characters and not more than 15!");
					}
				} else {
					Notifications.warn('Warning:', 'Sorry, you are not authorized to register!');
					throw new Meteor.Error(403, "Sorry, you are not authorized to register!");
				}
			} else {
				Notifications.warn('Warning:', 'The password and its check do not match!');
				throw new Meteor.Error(403, "The password and its check do not match!");
			}
		} else {
			Notifications.warn('Warning:', 'Please fill out all fields');
			throw new Meteor.Error(403, "Please fill out all fields");
		}
	},
	'click #account-signin' : function(e, t) {
		e.preventDefault();
		Router.go('loginform');
	}
});