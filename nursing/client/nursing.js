//Minimongo to match server:
Messages = new Meteor.Collection("messages");
Alerts = new Meteor.Collection("alerts");
Patients = new Meteor.Collection("patients");
Hospitalizations = new Meteor.Collection("hospitalizations");
Notes = new Meteor.Collection("notes");
Navigation = new Meteor.Collection("navigation");

Meteor.subscribe("messages", function onReady() {
  Session.set('messagesLoaded', true);
});
Meteor.subscribe("alerts", function onReady() {
  Session.set('alertsLoaded', true);
});
Meteor.subscribe("patients", function onReady() {
  Session.set('patientsLoaded', true);
});
Meteor.subscribe("hospitalizations", function onReady() {
  Session.set('hospitalizationsLoaded', true);
});
Meteor.subscribe("notes", function onReady() {
  Session.set('notesLoaded', true);
});

//Client pushed notifications
Warnings = new Meteor.Collection("warnings");
Meteor.subscribe("warnings");
Meteor.call("removeWarnings",function(){}); //This will remove all warnings every time a user connects or every time a user refreshes the app. Its sub-optimal
Deps.autorun(function() {
  	Warnings.find({}).observe({
    added: function(item){
    	 if(this.isSimulation){
    	 	Notifications.info(item.title,item.message);
    	 }
      console.log(item.title, item.message);
    }
  });
});

//Navigation
var language = window.navigator.userLanguage || window.navigator.language;

Meteor.subscribe("navigation", language.substr(0,2), function onReady() {
  Session.set('navigationLoaded', true);
});

Template.navigation.nav = function(){
	return Navigation.find({});
}

//Set notifications to last 3seconds
Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 3000
    });
});

Router.configure({
	layoutTemplate: 'main',
	templateNameConverter : 'upperCamelCase'
});

Router.map(function() {
	this.route('registrationform', {
		path : '/signup',
		onBeforeAction: function() {
      		if (Meteor.user())
        	this.redirect('beds');
   		},
   		onAfterAction: function() {
      		if (Meteor.user())
        	this.redirect('beds');
   		}
	});
	this.route('loginform', {
		path: '/',
		onBeforeAction: function() {
      		if (Meteor.user())
        	this.redirect('beds');
   		},
   		onAfterAction: function() {
      		if (Meteor.user())
        	this.redirect('beds');
   		}
	});
	this.route('goodbye', {
		path : '/goodbye',
		onBeforeAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		},
   		onAfterAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		}
	});
	this.route('beds', {
		path : '/beds',
		onBeforeAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		},
   		onAfterAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		}
	});
	this.route('messages', {
		path : '/messages',
		onBeforeAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		},
   		onAfterAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		}
	});
	this.route('alerts', {
		path : '/alerts',
		onBeforeAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		},
   		onAfterAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
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

Template.navigation.events({
	'click #logout-toggle' : function(e, t) {
		Meteor.logout();
		e.preventDefault();
		var name = Meteor.user().profile.first;
		Notifications.success('','Bye bye '+name.capitalize()+'.');
		Router.go('goodbye');
	}
});

Template.messages.messages = function(){
	var messages = Messages.find({},{sort: {time: -1}}).fetch();
	var result = [];
	
	//Only show 3 messages!
	for(var i = 0; i<messages.length; i++){
		var hospitalization = Hospitalizations.findOne({'_id' : messages[i].hospitalizationId});
		var patient = Patients.findOne({'_id' : hospitalization.patientId});
		var nurse = messages[i].nurseId;
		var date = new Date(messages[i].time);
		var element = {
			attachment: messages[i].attachment,
			name: patient.first.capitalize() + " " + patient.last.capitalize(),
			bed: hospitalization.bed,
			nurse: nurse.profile.first + " " + nurse.profile.last,
			department: nurse.profile.department,
			timestamp: date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes(),
			message: messages[i].message
		};
		result.push(element);
	}
	return result;
};

Template.minimessages.messages = function(){
	var messages = Messages.find({},{sort: {time: -1}, limit: 4}).fetch();
	
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
