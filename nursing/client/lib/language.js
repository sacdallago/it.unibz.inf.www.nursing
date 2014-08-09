Meteor.autosubscribe(function() {
	var userLanguage = window.navigator.userLanguage || window.navigator.language;
	Language = new Meteor.Collection("language");

	//Meteor.subscribe("language");

	Session.setDefault("language", Language.findOne({
		'language' : userLanguage.substr(0, 2)
	}));
});

Template.navigation.helpers({
		languages : function() {
			return Session.get('language');
		}
	});