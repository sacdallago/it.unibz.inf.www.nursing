Patients = new Meteor.Collection("patients");

//patientsHandle is used in Session.js to manage when to show loading cubes
patientsHandle = Meteor.subscribe('patients', function(error) {
	if (error) {
		Notifications.error('Error', 'There was an error loading the patients. Please contact the administrators.');
	}
});

Template.patientItemList.helpers({
	patients : function() {
		return Patients.find({}, {
			sort : {
				last : -1
			}
		});
	}
});

Template.patientElement.helpers({
	hospitalization : function() {
		return Hospitalizations.findOne({
			patientId : this._id,
			active : {
				$exists : true
			}
		});
	},
	room : function() {
		return Rooms.findOne({
			patientId : this._id
		});
	},
	reminders : function() {
		var today = new Date();
		today.setHours(0, 0, 0, 0);

		var tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);

		return Reminders.find({
			patientId : this._id,
			done : false,
			dueDate : {
				$gte : today.getTime,
				$lte : tomorrow.getTime
			}
		});
	}
});

Template.newPatient.rendered = function() {
	this.$('.ui.form').form({
		first : {
			identifier : 'first',
			rules : [{
				type : 'empty',
				prompt : 'Please enter the patient\'s first name'
			}]
		},
		last : {
			identifier : 'last',
			rules : [{
				type : 'empty',
				prompt : 'Please enter the patient\'s last name'
			}]
		},
		birthday : {
			identifier : 'birthday',
			rules : [{
				type : 'empty',
				prompt : 'Please enter the patient\'s birthdate'
			}]
		}
	}, {
		onSuccess : function() {
			var patient = {
				first : first.value,
				last : last.value,
				birthday : birthday.value
			};
			Patients.insert(patient, function(error, newDataId) {
				if (!error) {
					Notifications.success('Success', 'Patient inserted!');
					Session.set('patientFilter', newDataId);
				}
			});
			$('#newPatientModal').modal('hide');
		}
	});
};