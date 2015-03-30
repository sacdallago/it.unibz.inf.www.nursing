Patients = new Meteor.Collection("patients");

//patientsHandle is used in Session.js to manage when to show loading cubes
patientsHandle = Meteor.subscribe('patients',function(error){
    if(error){
        Notifications.error('Error','There was an error loading the patients. Please contact the administrators.');
    }
});

Template.patientItemList.helpers({
    patients: function(){
        return Patients.find({},{
            sort: {
                last:-1
            }
        });
    }
});

Template.patientElement.helpers({
    hospitalization: function(){
        return Hospitalizations.findOne({
            patientId:this._id,
            active:{
                $exists:true
            }
        });
    },
    room : function(){
        return Rooms.findOne({
			patientId : this._id
		});
    },
    reminders : function() {
        var today = new Date();
        today.setHours(0,0,0,0);
        
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1); 
        
        return Reminders.find({
            patientId:this._id,
            done: false,
            dueDate: {
                $gte: today.getTime,
                $lte: tomorrow.getTime
            }
        });
    }
});

Template.newPatient.rendered = function() {
    
};

Template.addPatientOption.events({
    'click' : function(){
        $('#newPatientModal').modal('show');
    }
});

/*Template.newPatient.events({
	'submit' : function(event) {
		event.preventDefault();
		var inputs = document.getElementsByClassName('newPatient');
		var patient = {};
		for (var i = 0; i < inputs.length; i++) {
			var value = inputs[i].value;
			var field = inputs[i].dataset.field;
			if (!validatePatientData(field, value)) {
				return;
			}
			patient[field] = value;
		}
		Patients.insert(patient, function(error, data) {
			if (!error) {
				Notifications.success('Success', 'Patient inserted!');
				Session.set('patientFilter', data);
				event.target.reset();
				$('#patient').modal('hide');
			}
		});

	}
});*/