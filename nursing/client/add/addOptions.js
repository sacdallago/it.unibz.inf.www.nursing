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
		$('.ui.search.dropdown').dropdown();
		$("#transity3").transition('hide');
		$('.ui.checkbox').checkbox();
	},
	'click .reminderModal' : function() {
		$('#newReminderModal').modal('show');
		$("#transity2").transition('hide');
		$("#offset1").transition('hide');
	},
	'click .journalModal' : function() {
		
		$('#newJournalModal').modal('show');
		$("#transity").transition('hide');
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
				console.log("object as below: "+object);
				console.log("Get session? : "+ Session.get('hospitalizationFilter'));
				Meteor.call('updateProblems', Session.get('patientFilter'), object, function(err) {
					if (!err) {
						Notifications.success('Success', 'Created a new hospitalization! Fill it out in the home!');
						console.log("session set return: " + Session.set('hospitalizationFilter', object));
						Session.set('hospitalizationFilter', object);
					}
				});
			}
		});
	}
});
