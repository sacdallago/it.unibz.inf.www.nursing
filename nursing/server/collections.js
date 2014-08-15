// see https://github.com/sacdallago/it.unibz.inf.www.nursing/wiki/Collections

Messages = new Meteor.Collection("messages");
Alerts = new Meteor.Collection("alerts");
Patients = new Meteor.Collection("patients");
Notes = new Meteor.Collection("notes");
Anagraphics = new Meteor.Collection("anagraphics");
Rooms = new Meteor.Collection("rooms");

//Security first
Meteor.publish('notes', function() {
	if (this.userId) {
		return Notes.find();
	} else {
		return null;
	}
});
Meteor.publish('messages', function(limit) {
	if (this.userId) {
		var user = Meteor.users.findOne(this.userId);
		return Messages.find({
			target : user.profile.department
		}, {
			sort : {
				timestamp : -1
			},
			limit : limit
		});
	} else {
		return null;
	}
});
Meteor.publish('anagraphics', function(limit) {
	if (this.userId) {
		return Anagraphics.find({}, {
			limit : limit
		});
	} else {
		return null;
	}
});
Meteor.publish('patients', function(criteria, projection) {
	if (this.userId) {
		if (criteria && projection) {
			return Patients.find(criteria, projection);
		} else {
			var user = Meteor.users.findOne(this.userId);
			return Patients.find({
				'currentHospitalization.departmentOfStay' : user.profile.department
			});
		}
	} else {
		return null;
	}
});
Meteor.publish('alerts', function() {
	if (this.userId) {
		return Alerts.find();
	} else {
		return null;
	}
});

Meteor.publish('rooms', function() {
	if (this.userId) {
		return Rooms.find();
	} else {
		return null;
	}
});
/* by activating the following publication, all users can see each other!
 Meteor.publish("nurses", function () {
 return Meteor.users.find({}, {fields: {profile: 1}});
 });
 */