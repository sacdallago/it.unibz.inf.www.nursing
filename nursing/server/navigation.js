Meteor.startup(function() {
	Navigation.remove({});
	Navigation.insert({
		language : 'en',
		active : true,
		route : 'rooms',
		name : 'Rooms',
		fa : 'fa-table'
	});
	Navigation.insert({
		language : 'en',
		route : 'alerts',
		name : 'Alerts',
		fa : 'fa-bar-chart-o'
	});
	Navigation.insert({
		language : 'en',
		route : 'messages',
		name : 'Messages',
		fa : 'fa-envelope'
	});
});
