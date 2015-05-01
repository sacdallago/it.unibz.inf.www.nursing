Template.addOptions.helpers({
	patientFilter : function() {
		return Session.get('patientFilter');
	},
	hospitalizationFilter : function() {
		return Session.get('hospitalizationFilter');
	},
});

Template.newEntries.events({
	'click .measurementModal' : function() {
		$('#newMeasurementModal').modal('show');
	},
	'click .reminderModal' : function() {
		$('#newReminderModal').modal('show');
	},
	'click .journalModal' : function() {
		$('#newJournalModal').modal('show');
	}
});

Template.newPatientOption.events({
	'click' : function() {
		$('#newPatientModal').modal('show');
	}
});

Template.newHospitalizationOption.events({
	'click' : function() {
		Hospitalizations.insert({
			active : true,
			patientId : Session.get('patientFilter'),
			timestamp : Date.now(),
			nurseId : Meteor.userId()
		}, function(error, object) {
			if (!error) {
				Meteor.call('updateProblems', Session.get('patientFilter'), object, function(err) {
					if (!err) {
						Notifications.success('Success', 'Created a new hospitalization! Fill it out in the home!');
						Session.set('hospitalizationFilter', object);
					}
				});
			}
		});
	}
});
