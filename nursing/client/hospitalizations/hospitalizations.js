Hospitalizations = new Meteor.Collection('hospitalizations');
hospitalizationsHandle = Meteor.subscribe('hospitalizations');

UI.registerHelper('enumProperties', function(context, options) {
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

UI.registerHelper('formatDate', function(context, options) {
	if (context) {
		return dayYearFormatter(context);
	}
});

UI.registerHelper('nurseNameFormatter', function(context, options) {
	if (context) {
		var user = Meteor.users.findOne(context);
		return niceName(user.profile.first, user.profile.last);
	}
});

UI.registerHelper('capitalize', function(context, options) {
	if (context) {
		return context.capitalize();
	}
});

Template.home.helpers({
	patient : function() {
		return Session.get('patientFilter');
	}
});

Template.patientCard.helpers({
	patient : function() {
		return Patients.findOne(Session.get('patientFilter'));
	},
	bed : function() {
		var room = Rooms.findOne({
			'patientId' : Session.get('patientFilter')
		});
		if (room) {
			bed = room.number + "" + room.bed;
			return bed;
		} else {
			return null;
		}

	}
});

Template.hospitalizationCard.helpers({
	hospitalization : function() {
		var hospitalizationId = Session.get('hospitalizationFilter');
		if (hospitalizationId) {
			return Hospitalizations.findOne(hospitalizationId);
		} else {
			return null;
		}
	}
});

Template.home.entry = function() {
	var filter = {};
	if (Session.get('patientFilter')) {
		filter.patientId = Session.get('patientFilter');
	}

	var entries = [];

	Journal.find(filter).forEach(function(element) {

		var patient = Patients.findOne(element.patientId);
		element.patientName = niceName(patient.first, patient.last);

		var room = Rooms.findOne({
			'patientId' : element.patientId
		});
		element.bed = room.number + "" + room.bed;

		element.date = dateFormatter(element.timestamp);

		if (element.journalId) {
			element.problemSubject = Journal.findOne(element.journalId).subject.capitalize();
		}

		element.subject ? (element.subject = ((String)(element.subject)).capitalize()) : null;

		var nurse = Meteor.users.findOne(element.nurseId);
		element.nurseName = niceName(nurse.profile.first, nurse.profile.last);

		element.attachment = JournalDocuments.findOne(element.attachment);

		entries.push(element);
	});

	Measures.find(filter).map(function(element) {

		var patient = Patients.findOne(element.patientId);
		element.patientName = niceName(patient.first, patient.last);

		var room = Rooms.findOne({
			'patientId' : element.patientId
		});
		element.bed = room.number + "" + room.bed;

		element.date = dateFormatter(element.timestamp);

		if (element.journalId) {
			element.problemSubject = Journal.findOne(element.journalId).subject.capitalize();
		}

		_.each(element.fields, function(field) {
			if (!field.unit) {
				field.checkbox = field.value == 0 ? "No" : "Yes";
			}
		});

		element.type = element.type.capitalize();

		var nurse = Meteor.users.findOne(element.nurseId);
		element.nurseName = niceName(nurse.profile.first, nurse.profile.last);

		entries.push(element);
	});

	entries.sort(function(a, b) {
		if (a.timestamp < b.timestamp) {
			return 1;
		} else if (a.timestamp > b.timestamp) {
			return -1;
		}
		return 0;
	});

	return entries;
};
