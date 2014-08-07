Meteor.startup(function() {
	Navigation.remove({});
	//EN
	Navigation.insert({
		language : 'en',
		route : 'beds',
		name : 'Beds',
		fa : 'fa-table'
	});
	Navigation.insert({
		language : 'en',
		route : 'alerts',
		name : 'Alerts',
		fa : 'fa-bell'
	});
	Navigation.insert({
		language : 'en',
		route : 'messages',
		name : 'Messages',
		fa : 'fa-envelope'
	});
	//IT
	Navigation.insert({
		language : 'it',
		route : 'beds',
		name : 'Stanze',
		fa : 'fa-table'
	});
	Navigation.insert({
		language : 'it',
		route : 'alerts',
		name : 'Avvisi',
		fa : 'fa-bell'
	});
	Navigation.insert({
		language : 'it',
		route : 'messages',
		name : 'Messaggi',
		fa : 'fa-envelope'
	});
	//DE
	Navigation.insert({
		language : 'de',
		route : 'beds',
		name : 'Zimmer',
		fa : 'fa-table'
	});
	Navigation.insert({
		language : 'de',
		route : 'alerts',
		name : 'Warnungen',
		fa : 'fa-bell'
	});
	Navigation.insert({
		language : 'de',
		route : 'messages',
		name : 'Nachrichten',
		fa : 'fa-envelope'
	});
});
