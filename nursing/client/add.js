Units = new Meteor.Collection('units');
unitsHandle = Meteor.subscribe('units');

Template.modals.helpers({
	patientSelected : function() {
		return Session.get('patientFilter');
	},
	hasHospitalization : function() {
		return Session.get('hospitalizationFilter');
	}
});

Template.newPatient.events({
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
				Notifications.success('Success', 'Paziente inserito!');
				Session.set('patientFilter', data);
				event.target.reset();
				$('#patient').modal('hide');
			}
		});

	}
});

Template.newMeasurement.events({
	'change #measurementType' : function(event) {
		var id = $(event.currentTarget).find(':selected').data("_id");
		Session.set("measures", Units.findOne(id));
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
			element.type = measures[i].dataset.pretext;
			fields.push(element);
		}

		var problemId = $("#measurementProblemSelector option:selected").attr("data-problemId");

		var entry = {
			patientId : Session.get('patientFilter'),
			hospitalizationId : Session.get('hospitalizationFilter'),
			nurseId : Meteor.userId(),
			timestamp : Date.now(),
			type : Session.get('measures').type,
			active : true,
			fields : fields
		};

		if (problemId) {
			entry.journalId = problemId;
		}

		if (fields.length > 0) {
			if (Session.get('patientFilter') && Session.get('hospitalizationFilter')) {
				Measures.insert(entry, function(error) {
					if (error) {
						Notifications.error('Error', 'Si è verificato un errore inserendo la rilevazione');
					} else {
						Notifications.info('Confirmation', 'Nuova rilevazione inserita con successo');
					}
				});
				$('#measurement').modal('hide');
				event.target.reset();

			} else {
				Notifications.error('Error', 'Per favora prima seleziona un paziente');
			}
		} else {
			Notifications.warn('Wohps', 'Per favore compila tutti i campi correttamente');
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
			},
			patientId : Session.get('patientFilter'),
			$or : [{
				solved : false
			}, {
				solved : {
					$exists : false
				}
			}]
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
			Notifications.warn("Whops", "Per favore, seleziona un problema esistente o definiscine uno nuovo");
			return;
		} else if (newProblem) {
			entry.subject = newProblem;
			entry.active = true;
		} else if (problemId) {
			entry.journalId = problemId;
		}

		if (Session.get('patientFilter') && Session.get('hospitalizationFilter')) {
			if (files[0]) {
				JournalDocuments.insert(files[0], function(err, fileObj) {
					if (err) {
						Notifications.error('Error', 'Si è verificato un errore salvando il file');
					} else {
						if (message) {
							entry.message = message;
							entry.attachment = fileObj._id;
							Journal.insert(entry, function(error) {
								if (error) {
									Notifications.error('Error', 'Si è verificato un errore salvando la nota');
								} else {
									Notifications.info('Confirmation', 'Nuova nota inserita correttamente nel Diario');
								}
							});
						} else {
							entry.attachment = fileObj._id;
							Journal.insert(entry, function(error) {
								if (error) {
									Notifications.error('Error', 'Si è verificato un errore salvando la nota');
								} else {
									Notifications.info('Confirmation', 'Nuova nota inserita correttamente nel Diario');
								}
							});
						}
					}
				});
			} else if (message) {
				entry.message = message;
				Journal.insert(entry, function(error) {
					if (error) {
						Notifications.error('Error', 'Si è verificato un errore salvando la nota');
					} else {
						Notifications.info('Confirmation', 'Nuova nota inserita correttamente nel Diario');
					}
				});
			} else {
				Notifications.warn('Whops', 'Per favore, inserisci un testo per la nota o allega un file');
				return;
			}
		} else {
			Notifications.error('Error', 'Per favore, prima seleziona un paziente');
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
			},
			patientId : Session.get('patientFilter'),
			$or : [{
				solved : false
			}, {
				solved : {
					$exists : false
				}
			}]
		});
	}
});

Template.newJournal.destroyed = function() {
	delete Session.keys['fileSelected'];
};

//newReminder
Template.newReminder.rendered = function() {
	var category = Categories.findOne({});
	Session.set('inputCategory', category.name);
};

Template.newReminder.events({
	'click .category' : function(event) {
		//TODO MUTUAL EXCLUSIVE SELECTION OF CATEGORIES
		event.preventDefault();
		Session.set('inputCategory', this.name);
	},
	'submit' : function(event) {
		event.preventDefault();
		var patientId = Session.get('patientFilter');
		var hospitalizationId = Session.get('hospitalizationFilter');
		var nurseId = Meteor.userId();

		var problemId = $("#reminderProblemSelector option:selected").attr("data-problemId");

		var category = Session.get('categoryName');
		var dueDate = $('input[name="dueDate"]:checked').val();
		var message = document.getElementById('remindermessage').value;
		var done = false;
		var timestamp = new Date().getTime();

		if (dueDate === "today") {
			dueDate = new Date();
		} else if (dueDate === "tomorrow") {
			dueDate = new Date();
			dueDate.setDate(dueDate.getDate() + 1);
		} else if (dueDate === "day after tomorrow") {
			dueDate = new Date();
			dueDate.setDate(dueDate.getDate() + 2);
		} else {
			dueDate = $('input[name="otherDueDate"]').val();
			dueDate = new Date(dueDate);
		}

		var entry = {
			patientId : patientId,
			hospitalizationId : hospitalizationId,
			nurseId : nurseId,
			done : done,
			message : message,
			timestamp : timestamp,
			dueDate : dueDate.getTime(),
			category : category
		};

		if (problemId) {
			entry.journalId = problemId;
		}
		console.log(entry);
		Reminders.insert(entry, function(error) {
			if (error) {
				Notifications.error("Error", "Si è verificato un errore inserendo il nuovo Memo");
			} else {
				Notifications.success("Success", "Nuovo Memo salvato");
				$('#reminder').modal('hide');
				event.target.reset();
			}
		});
	}
});

Template.newReminder.helpers({
	loading : function() {
		return !categoriesHandle.ready();
	},
	categories : function() {
		var list = Categories.find({});
		return list;
	},
	categorySelected : function() {
		return (Session.equals('categoryName', this.name)) ? 'label-info' : '';
	},
	problems : function() {
		return Journal.find({
			subject : {
				$exists : true
			},
			patientId : Session.get('patientFilter'),
			$or : [{
				solved : false
			}, {
				solved : {
					$exists : false
				}
			}]
		});
	}
});
