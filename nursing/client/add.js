Units = new Meteor.Collection('units');
unitsHandle = Meteor.subscribe('units');

Template.modals.helpers({
	patientSelected : function() {
		return Session.get('patientFilter');
	}
});

Template.newMeasurement.events({
	'change select' : function(event) {
		document.getElementById('measurementUnit').value = $(event.currentTarget).find(':selected').data("unit");
	},
	'submit' : function(event) {
		event.preventDefault();
		var type = document.getElementById('measurementType').value;
		var value = document.getElementById('measurementValue').value;
		var unit = document.getElementById('measurementUnit').value;
		if (unit && parseFloat(value)) {
			if (Session.get('patientFilter') && Session.get('hospitalizationFilter')) {
				Measures.insert({
					patientId : Session.get('patientFilter'),
					hospitalizationId : Session.get('hospitalizationFilter'),
					nurseId : Meteor.userId(),
					timestamp : Date.now(),
					active : true,
					value : value,
					unit : unit
				}, function(error) {
					if (error) {
						Notifications.error('Error', 'Something happened while saving your measurement.. :(');
					} else {
						Notifications.info('Confirmation', 'New measurement inserted!');
					}
				});
				$('#measurement').modal('hide');
				event.target.reset();

			} else {
				Notifications.error('Error', 'Please select a patient first!!');
			}
		} else {
			Notifications.warn('Wohps', 'Please fill out all fields correctly');
		}
	}
});

Template.newMeasurement.units = function() {
	return Units.find().map(function(element) {
		element.name = element.type.capitalize();
		return element;
	});
};

Template.newJournal.events({
	'change #journalFile' : function(event) {
		document.getElementById('journalFile').value != "" ? Session.set('fileSelected', true) : Session.set('fileSelected', null);
	},
	'focusout #messageText' : function(event) {
		var text = document.getElementById('messageText').value;
		//Implement regex to filter bad stuff ?
		Meteor.users.update(Meteor.userId(), {
			$set : {
				'profile.message.message' : text
			}
		});
	},
	'submit' : function(event) {
		event.preventDefault();
		var message = document.getElementById('messageText').value;
		var files = document.getElementById('journalFile').files;
		if (Session.get('patientFilter') && Session.get('hospitalizationFilter')) {
			if (files[0]) {
				JournalDocuments.insert(files[0], function(err, fileObj) {
					if (err) {
						Notifications.error('Error', 'There was an error saving the file!');
					} else {
						if (message) {
							Journal.insert({
								patientId : Session.get('patientFilter'),
								hospitalizationId : Session.get('hospitalizationFilter'),
								nurseId : Meteor.userId(),
								timestamp : Date.now(),
								active : true,
								message : message,
								attachment : fileObj._id
							}, function(error) {
								if (error) {
									Notifications.error('Error', 'Something happened while saving your journal entry.. :(');
								} else {
									Notifications.info('Confirmation', 'New journal entry inserted!');
								}
							});
						} else {
							Journal.insert({
								patientId : Session.get('patientFilter'),
								hospitalizationId : Session.get('hospitalizationFilter'),
								nurseId : Meteor.userId(),
								timestamp : Date.now(),
								active : true,
								attachment : fileObj._id
							}, function(error) {
								if (error) {
									Notifications.error('Error', 'Something happened while saving your journal entry.. :(');
								} else {
									Notifications.info('Confirmation', 'New journal entry inserted!');
								}
							});
						}
					}
				});
			} else if (message) {
				Journal.insert({
					patientId : Session.get('patientFilter'),
					hospitalizationId : Session.get('hospitalizationFilter'),
					nurseId : Meteor.userId(),
					timestamp : Date.now(),
					active : true,
					message : message
				}, function(error) {
					if (error) {
						Notifications.error('Error', 'Something happened while saving your journal entry.. :(');
					} else {
						Notifications.info('Confirmation', 'New journal entry inserted!');
					}
				});
			} else {
				Notifications.warn('What?', 'Please, either attach a file or write a message!');
			}
		} else {
			Notifications.error('Error', 'Please select a patient first!!');
		}
		$('#journal').modal('hide');
		Meteor.users.update(Meteor.userId(), {
			$set : {
				'profile.message.message' : ""
			}
		});
		document.getElementById('textCounter').innerHTML = "";
		event.target.reset();
		Session.set('fileSelected',null);
	},
	'keydown #messageText' : function(event) {
		var text = document.getElementById('messageText').value;
		document.getElementById('textCounter').innerHTML = text.length + "/180";
	}
});

Template.newJournal.helpers({
	fileSelected : function() {
		return Session.get('fileSelected') ? 'river' : '';
	},
	messageData : function() {
		return Meteor.user().profile.message;
	}
});
