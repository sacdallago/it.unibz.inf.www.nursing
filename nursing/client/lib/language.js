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

Template.beds.helpers({
	language : function() {
		return Language.findOne({
			'target' : 'beds',
			'language' : Session.get('language').toString().substr(0, 2)
		});
	}
});

Template.messages.helpers({
	language : function() {
		return Language.findOne({
			'target' : 'messages',
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