//Minimongo to match server:
Notifications = new Meteor.Collection("notifications");
Alerts = new Meteor.Collection("alerts");
Patients = new Meteor.Collection("patients");
Hospitalizations = new Meteor.Collection("hospitalizations");
Notes = new Meteor.Collection("notes");

Accounts.ui.config({
	passwordSignupFields : 'USERNAME_AND_EMAIL'
});

Router.configure({
	templateNameConverter : 'upperCamelCase'
});

Router.map(function() {
	this.route('main', {
		path : '/'
	});
	this.route('loginform', {
		path : '/login'
	});
	this.route('registrationform', {
		path : '/signup'
	});
	this.route('notifications', {
		path : '/notifications'
	});
});


Template.loginform.events({
	'submit #login-form' : function(e, t) {
		e.preventDefault();

		var username = t.find('#login-username').value, password = t.find('#login-password').value;

		Meteor.loginWithPassword(username, password, function(err) {
			if (err) {
				alert('Please check your credentials.');
			} else {
				//autoroute
			}
		});
		return false;
	},
	'click #create-account' : function(e, t) {
		e.preventDefault();
		Router.go('registrationform');
	}
}); 


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
								alert('Failed to create user. Please contact administrators.');
							} else {
								Router.go('main');
							}
						});

						return false;
					} else {
						alert('Username must have at least 3 characters and not more than 15!');
						throw new Meteor.Error(403, "Username must have at least 3 characters and not more than 15!");
					}
				} else {
					alert('Sorry, you are not authorized to register!');
					throw new Meteor.Error(403, "Sorry, you are not authorized to register!");
				}
			} else {
				alert('The password and its check do not match!');
				throw new Meteor.Error(403, "The password and its check do not match!");
			}
		} else {
			alert('Please fill out all fields');
			throw new Meteor.Error(403, "Please fill out all fields");
		}
	},
	'click #account-signin' : function(e, t) {
		e.preventDefault();
		Router.go('main');
	}
});

Template.navigation.events({
	'click #logout-toggle' : function(e, t) {
		e.preventDefault();
		Meteor.logout();
	}
});

Template.miniNotifications.notifications = function(){
	var notifications = Notifications.find({},{sort: {time: 1}});
	
	var result = [];
	
	//Only show 3 notifications!
	for(var i = 0; i<4; i++){
		console.log(notifications[0].message);
		
		/*
		var patient = Patients.findOne({'_id' : Hospitalizations.findOne({'_id' : notifications[i].hospitalizationId}).patientId});
		var element = {
			attachment: notifications[i].attachment,
			name: patient.first + " " + patient.last,
			timestamp: (new Date(notifications[i].time)),
			message: notifcations[i].substring(0,13) + "..."
		};
		console.log(element);
		*/
	}
};
