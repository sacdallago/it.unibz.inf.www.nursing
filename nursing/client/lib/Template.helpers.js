Template.registerHelper('enumProperties', function(context, options) {
	if (context) {
		var li = "";
		for (var property in context) {
			li += property;
			li += ": ";
			li += context[property];
			li += "\n";
		}
		return li;
	}
});

Template.registerHelper('trim', function(context, options) {
	if (context) {
		return context.substring(0, 20) + "...";
	}
});

Template.registerHelper('formatDate', function(context, options) {
	if (context) {
		return moment(new Date(context)).format("DD/MM/YYYY");
	}
});

Template.registerHelper('findSelected', function(context, paragon) {
	return context == paragon ? 'selected' : '';
});

Template.registerHelper('htmlDate', function(context, options) {
	if (context) {
		return htmlDate(context);
	}
});

Template.registerHelper('nurseNameFormatter', function(context, options) {
	if (context) {
		var user = Meteor.users.findOne(context);
		return niceName(user.profile.first, user.profile.last);
	}
});

Template.registerHelper('capitalize', function(context, options) {
	if (context) {
		return context.capitalize();
	}
});