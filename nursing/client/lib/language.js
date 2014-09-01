Session.setDefault("language",(window.navigator.userLanguage || window.navigator.language));
var Language = new Meteor.Collection("language");

Meteor.subscribe("language");

Template.navigation.helpers({
	language : function() {
		return Language.findOne({
			'target' : 'navigation',
			'language' : Session.get('language').toString().substr(0, 2)
		});
	}
}); 

Template.home.helpers({
	language : function() {
		return Language.findOne({
			'target' : 'home',
			'language' : Session.get('language').toString().substr(0, 2)
		});
	}
});

Template.registrationform.helpers({
	language : function() {
		return Language.findOne({
			'target' : 'registration',
			'language' : Session.get('language').toString().substr(0, 2)
		});
	}
});

Template.reminders.helpers({
	language: function(){
		return Language.findOne({
			'target' : 'reminders',
			'language' : Session.get('language').toString().substr(0,2)
		});
	}
});

Template.problems.helpers({
	language:function(){
		return Language.findOne({
			'target': 'problems',
			'language' : Session.get('language').toString().substr(0,2)
		});
	}
});