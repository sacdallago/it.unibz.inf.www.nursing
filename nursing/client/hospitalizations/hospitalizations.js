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

UI.registerHelper('htmlDate', function(context, options) {
	if (context) {
		return htmlDate(context);
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

Template.patientCard.events({
	'taphold input' : function(e) {
		if (e.target.disabled) {
			e.target.style.border = "3px solid #f89406";
			e.target.disabled = false;
		} else {
			var value = e.target.value;
			var field = e.target.dataset.field;
			if (field == "birthdate") {
				value = new Date(value).getTime();
			}
			var update = {};
			update[field] = value;
			Patients.update({
				_id : this._id
			}, {
				$set : update
			}, function(error) {
				if (!error) {
					Notifications.success('Updated', 'Updated ' + field + ' of patient');
				}
			});
			//Codice per fare l'update sull'ogetto
			e.target.style.border = "0";
			e.target.disabled = true;
		}
	},
	'dblclick input' : function(e) {
		if (e.target.disabled) {
			//Put a color to
			e.target.style.border = "3px solid #f89406";
			e.target.disabled = false;
		}
	},
	'keydown input' : function(e) {
		if (e.keyCode == '13' && !e.target.disabled) {
			var value = e.target.value;
			var field = e.target.dataset.field;
			if (field == "birthdate") {
				value = new Date(value).getTime();
			}
			var update = {};
			update[field] = value;
			Patients.update({
				_id : this._id
			}, {
				$set : update
			}, function(error) {
				if (!error) {
					Notifications.success('Updated', 'Updated ' + field + ' of patient');
				}
			});
			//Codice per fare l'update sull'ogetto
			e.target.style.border = "0";
			e.target.disabled = true;
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
		if (room) {
			element.bed = room.number + "" + room.bed;
		} else {
			element.bed = "NO BED ASSIGNED";
		}

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
