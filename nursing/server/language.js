Language = new Meteor.Collection("language");

Meteor.publish('language', function() {
	return Language.find({}); 
});

Meteor.startup(function() {
	Language.remove({});
	//EN
	Language.insert({
		language : 'en',
		target: 'navigation',
		beds : 'Beds',
		alerts: 'Alerts',
		messages: 'Messages',
		signout: 'Sign out',
		rooms: 'Rooms'
	});
	Language.insert({
		language : 'en',
		target: 'beds',
		heading : 'Beds',
		subheading: '',
	});
	Language.insert({
		language : 'en',
		target: 'messages',
		heading : 'Messages',
		subheading: '',
	});
	Language.insert({
		language : 'en',
		target: 'registration',
		firstname : 'First Name',
		lastname: 'Last Name',
		createaccount: 'Create Account',
		backtosignin: 'Back to Sign in'
	});

	Language.insert({
		language: 'en',
		target: 'rooms',
		heading: 'Rooms',
		subheading: ''
	});
	//IT
	Language.insert({
		language : 'it',
		target: 'navigation',
		beds : 'Letti',
		alerts: 'Avvisi',
		messages: 'Messaggi',
		signout: 'Scollegati'
	});
	Language.insert({
		language : 'it',
		target: 'beds',
		heading : 'Letti',
		subheading: '',
	});
	Language.insert({
		language : 'it',
		target: 'messages',
		heading : 'Messaggi',
		subheading: '',
	});
	Language.insert({
		language : 'it',
		target: 'registration',
		firstname : 'Nome',
		lastname: 'Cognome',
		createaccount: 'Creare Utente',
		backtosignin: 'Login'
	});

	Language.insert({
		language: 'it',
		target: 'rooms',
		heading: 'Stanze',
		subheading: ''
	});
	//DE
	Language.insert({
		language : 'de',
		target: 'navigation',
		beds : 'Zimmer',
		alerts: 'Warnungen',
		messages: 'Nachrichten',
		signout: 'Verlassen'
	});
	Language.insert({
		language : 'de',
		target: 'beds',
		heading : 'Zimmer',
		subheading: '',
	});
	Language.insert({
		language : 'de',
		target: 'messages',
		heading : 'Nachrichten',
		subheading: '',
	});
	Language.insert({
		language : 'de',
		target: 'registration',
		firstname : 'Name',
		lastname: 'Nachname',
		createaccount: 'Benutzer erstellen',
		backtosignin: 'Login'
	});

	Language.insert({
		language: 'de',
		target: 'rooms',
		heading: 'Zimmer',
		subheading: ''
	});
});
