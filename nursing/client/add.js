Units = new Meteor.Collection('units');
unitsHandle = Meteor.subscribe('units');

Template.modals.helpers({
	patientSelected : function() {
		return Session.get('patientFilter');
	}
});

Template.newMeasurement.events({
	'change #measurementType' : function(event) {
		var id = $(event.currentTarget).find(':selected').data("_id");
		Session.set("measures", Units.findOne(id).fields);
		//var form = document.getElementsByClassName('form');
		//form[0].reset();
	},
	'submit' : function(event) {
		event.preventDefault();
		//var type = document.getElementById('measurementType').value;
		var measures = document.getElementsByClassName('measure');
		var fields = [];

		for (var i = 0; i < measures.length; i++) {
			var element = {};
			if (measures[i].placeholder) {
				//Is a input field. Theoretically we only defined number fields, so the placeholder serves as unit.
				element.value = measures[i].value.replace(",", ".");
				//Fix the fact that some browsers allow to write a comma instead of a point for decimal values
				element.unit = measures[i].placeholder;
			} else {
				//This is a checkbox. We only defined checkboxes and number inputs, so... there's not much to check here :D
				//I'm gonna store 0 is the checkbox isn't checked, otherwise 1!
				element.value = (measures[i].checked ? 1 : 0);
			}
			fields.push(element);
		}

		var problemId = $("#journalProblemSelector option:selected").attr("data-problemId");

		var entry = {
			patientId : Session.get('patientFilter'),
			hospitalizationId : Session.get('hospitalizationFilter'),
			nurseId : Meteor.userId(),
			timestamp : Date.now(),
			active : true,
			fields : fields
		};

		if (problemId) {
			entry.problemId = problemId;
		}

		if (fields.length > 0) {
			if (Session.get('patientFilter') && Session.get('hospitalizationFilter')) {
				Measures.insert(entry, function(error) {
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

Template.newMeasurement.helpers({
	units : function() {
		return Units.find().map(function(element) {
			element.name = element.type.capitalize();
			return element;
		});
	},
	problems : function() {
		return Journal.find({
			subject : {
				$exists : true
			}
		});
	},
	measures : function() {
		return Session.get('measures');
	}
});

Template.newMeasurement.destroyed = function() {
	delete Session.keys['measures'];
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
		var newProblem = document.getElementById("defineProblem").value;
		var problemId = $("#journalProblemSelector option:selected").attr("data-problemId");

		//create entry with basic data
		var entry = {
			patientId : Session.get('patientFilter'),
			hospitalizationId : Session.get('hospitalizationFilter'),
			nurseId : Meteor.userId(),
			timestamp : Date.now(),
			active : true
		};

		//Mark entry as problem if it is one, or add the problem id if it is problem-related
		if (newProblem && problemId) {
			Notifications.warn("Whops", "Please, either select an existing problem or define a new one!");
			return;
		} else if (newProblem) {
			entry.subject = newProblem;
			entry.active = true;
		} else if (problemId) {
			entry.problemId = problemId;
		}

		if (Session.get('patientFilter') && Session.get('hospitalizationFilter')) {
			if (files[0]) {
				console.log(files[0]);
				JournalDocuments.insert(files[0], function(err, fileObj) {
					console.log(1);
					if (err) {
						console.log(2);
						Notifications.error('Error', 'There was an error saving the file!');
					} else {
						console.log(3);
						if (message) {
							console.log(4);
							entry.message = message;
							entry.attachment = fileObj._id;
							Journal.insert(entry, function(error) {
								if (error) {
									console.log(5);
									Notifications.error('Error', 'Something happened while saving your journal entry.. :(');
								} else {
									console.log(6);
									Notifications.info('Confirmation', 'New journal entry inserted!');
								}
							});
							console.log(7);
						} else {
							console.log(8);
							entry.attachment = fileObj._id;
							Journal.insert(entry, function(error) {
								if (error) {
									console.log(9);
									Notifications.error('Error', 'Something happened while saving your journal entry.. :(');
								} else {
									console.log(10);
									Notifications.info('Confirmation', 'New journal entry inserted!');
								}
							});
						}
					}
					console.log(11);
				});
			} else if (message) {
				entry.message = message;
				Journal.insert(entry, function(error) {
					if (error) {
						Notifications.error('Error', 'Something happened while saving your journal entry.. :(');
					} else {
						Notifications.info('Confirmation', 'New journal entry inserted!');
					}
				});
			} else {
				Notifications.warn('Whops', 'Please, either attach a file or write a message!');
				return;
			}
		} else {
			Notifications.error('Error', 'Please select a patient first!!');
		}

		//cleanup
		$('#journal').modal('hide');
		Meteor.users.update(Meteor.userId(), {
			$set : {
				'profile.message.message' : ""
			}
		});
		document.getElementById('textCounter').innerHTML = "";
		event.target.reset();
		Session.set('fileSelected', null);
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
	},
	problems : function() {
		return Journal.find({
			subject : {
				$exists : true
			}
		});
	}
});

Template.newJournal.destroyed = function() {
	delete Session.keys['fileSelected'];
};
