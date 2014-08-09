Language = new Meteor.Collection("language");

Meteor.publish('language', function() {
	return Language.find(); 
});

Meteor.startup(function() {
	Language.remove({});
	//EN
	Language.insert({
		language : 'en',
		beds : 'Beds',
		alerts: 'Alerts',
		messages: 'Messages'
	});
	//IT
	Language.insert({
		language : 'it',
		beds : 'Letti',
		alerts: 'Avvisi',
		messages: 'Messaggi'
	});
	//DE
	Language.insert({
		language : 'de',
		beds : 'Zimmer',
		alerts: 'Warnungen',
		messages: 'Nachrichten'
	});
});
