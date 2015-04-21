Template.home.helpers({
	patient : function() {
		return Session.get('patientFilter');
	},
	hasHospitalization : function() {
		return Session.get('hospitalizationFilter');
	},
	reminders : function() {
		// Determine which reminders to display in main pane,
		// selected based on category
		var category = Session.get('categoryName');
		var patientFilter = Session.get('patientFilter');
		var reminders;
		var sel = {};
		if (category) {
			sel.category = category;
		}
		if (patientFilter) {
			sel.patientId = patientFilter;
		}

		reminders = Reminders.find(sel, {
			sort : {
				done : 1,
				journalId : -1,
				dueDate : 1
			}
		});

		var tempHandle = null;
		return reminders.map(function(element) {
			var patient = Patients.findOne({
				_id : element.patientId
			});

			var room = Rooms.findOne({
				patientId : element.patientId
			});

			var nurse = Meteor.users.findOne({
				_id : element.nurseId
			});

			if (element.journalId) {
				var journalentry = Journal.findOne(element.journalId);
				element.problemSubject = journalentry.subject;
				if (journalentry.solved) {
					element.solved = journalentry.solved;
				}
			}

			if (patient) {
				element.patientName = niceName(patient.first, patient.last);
			}

			if (room) {
				element.roomNumber = room.number;
				element.bed = room.bed;
			}

			if (nurse) {
				element.nurseName = niceName(nurse.profile.first, nurse.profile.last);
			}
			//This adds a nice formatting of the date the message was written / modified

			element.date = dateFormatter(element.timestamp);
			element.niceDue = dateFormatter(element.dueDate);
			return element;
		});
	},
	entry : function() {
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

			if (room) {
				element.bed = room.number + "" + room.bed;
			} else {
				element.bed = "NO BED ASSIGNED";
			}

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
	}
}); 