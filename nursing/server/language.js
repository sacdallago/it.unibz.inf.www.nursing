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
		home : 'Home',
		reminders: 'Reminders',
		journal: 'Journal',
		problems: 'Problems',
		signout: 'Sign out',
		measures: "Measures"
	});
	Language.insert({
		language : 'en',
		target: 'home',
		heading : 'Home',
		subheading: '',
	});
	Language.insert({
		language : 'en',
		target: 'reminders',
		heading : 'Reminders',
		subheading: '',
	});
	Language.insert({
		language : 'en',
		target: 'journal',
		heading : 'Journal',
		subheading: '',
	});
	Language.insert({
		language : 'en',
		target: 'measures',
		heading : 'Measures',
		subheading: '',
	});
	Language.insert({
		language : 'en',
		target: 'journal',
		heading : 'Journal',
		subheading: '',
	});
	Language.insert({
		language : 'en',
		target: 'problems',
		heading : 'Problems',
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
	//IT
	Language.insert({
		language : 'it',
		target: 'navigation',
		home : 'Home',
		reminders: 'Reminders',
		journal: 'Journal',
		problems: 'Problemi',
		signout: 'Sign out',
		measures: "Measures"
	});
	Language.insert({
		language : 'it',
		target: 'home',
		heading : 'Home',
		subheading: '',
	});
	Language.insert({
		language : 'it',
		target: 'reminders',
		heading : 'Reminders',
		subheading: '',
	});
	Language.insert({
		language : 'it',
		target: 'journal',
		heading : 'Journal',
		subheading: '',
	});
	Language.insert({
		language : 'it',
		target: 'measures',
		heading : 'Measures',
		subheading: '',
	});
	Language.insert({
		language : 'it',
		target: 'journal',
		heading : 'Journal',
		subheading: '',
	});
	Language.insert({
		language : 'it',
		target: 'problems',
		heading : 'Problemi',
		subheading: '',
	});
	Language.insert({
		language : 'it',
		target: 'registration',
		firstname : 'First Name',
		lastname: 'Last Name',
		createaccount: 'Create Account',
		backtosignin: 'Back to Sign in'
	});
});
