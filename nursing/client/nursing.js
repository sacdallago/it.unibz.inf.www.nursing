//Minimongo to match server:
Messages = new Meteor.Collection("messages");
Alerts = new Meteor.Collection("alerts");
Patients = new Meteor.Collection("patients");
Hospitalizations = new Meteor.Collection("hospitalizations");
Notes = new Meteor.Collection("notes");

//Navigation
var language = window.navigator.userLanguage || window.navigator.language;
Navigation = new Meteor.Collection("navigation");

Template.navigation.nav = function(){
	return Navigation.find({'language': { $regex:'^'+language.substr(0,2)}});
}

//Set notifications to last 3seconds
Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 3000
    });
});

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
	this.route('rooms', {
		path : '/rooms'
	});
	this.route('registrationform', {
		path : '/signup'
	});
	this.route('messages', {
		path : '/messages',
		onAfterAction: function(){
			active='messages';
			alert('hello');
		}
	});
});																		;

Template.loginform.events({
	'submit #login-form' : function(e, t) {
		e.preventDefault();

		var username = t.find('#login-username').value, password = t.find('#login-password').value;

		Meteor.loginWithPassword(username, password, function(err) {
			if (err) {
				Notifications.warn('Could not login!', 'Please check your credentials.');
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
								Notifications.error('Error!', 'Failed to create user. Please contact administrators.');
							} else {
								Router.go('main');
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
		Router.go('main');
	}
});

Template.navigation.events({
	'click #logout-toggle' : function(e, t) {
		e.preventDefault();
		Meteor.logout();
	}
});

Meteor.subscribe('tasks', function onReady() {
  Session.set('tasksLoaded', true);
});

Template.miniMessages.messages = function(){
	var messages = Messages.find({},{sort: {time: 1}}).fetch();
	
	var result = [];
	
	//Only show 3 messages!
	for(var i = 0; i<4 && i<messages.length; i++){
		var patient = Patients.findOne({'_id' : Hospitalizations.findOne({'_id' : messages[i].hospitalizationId}).patientId});
		var date = new Date(messages[i].time);
		var trim = 30;
		while(messages[i].message.charAt(trim) != " " && messages[i].message.length > trim){
			trim++;
		}
		var element = {
			attachment: messages[i].attachment,
			name: patient.first.capitalize() + " " + patient.last.capitalize(),
			timestamp: date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes(),
			message: messages[i].message.substring(0,trim) + "..."
		};
		result.push(element);
	}
	return result;
};
