Hospitalizations = new Meteor.Collection('hospitalizations');
hospitalizationsHandle = Meteor.subscribe('hospitalizations', {
	active : true
}, {});

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

UI.registerHelper('trim', function(context, options) {
	if (context) {
		return context.substring(0, 20) + "...";
	}
});

UI.registerHelper('formatDate', function(context, options) {
	if (context) {
		return dayYearFormatter(context);
	}
});

UI.registerHelper('findSelected', function(context, paragon) {
	return context == paragon ? 'selected' : '';
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
	},
	hasHospitalization : function() {
		return Session.get('hospitalizationFilter');
	}
});

Template.home.reminders = function() {
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
};

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
			e.target.style.color = "#f89406";
			e.target.disabled = false;
		} else {
			var value = e.target.value;
			var field = e.target.dataset.field;
			var required = e.target.required;
			if (required && field) {
				if (!validatePatientData(field, value)) {
					return;
				}
			}
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
					Notifications.success('Updated', 'Aggiornato ' + field + ' del paziente');
				}
			});
			//Codice per fare l'update sull'ogetto
			e.target.style.color = "";
			e.target.disabled = true;
		}
	},
	'dblclick input' : function(e) {
		if (e.target.disabled) {
			//Put a color to
			e.target.style.color = "#f89406";
			e.target.disabled = false;
		}
	},
	'keydown input' : function(e) {
		if (e.keyCode == '13' && !e.target.disabled) {
			var value = e.target.value;
			var field = e.target.dataset.field;
			if (!validatePatientData(field, value)) {
				return;
			}
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
					Notifications.success('Updated', 'Aggiornato ' + field + ' del paziente');
				}
			});
			//Codice per fare l'update sull'ogetto
			e.target.style.color = "";
			e.target.disabled = true;
		}
	}
});

Template.hospitalizationCard.events({
	'taphold input' : function(e) {
		if (e.target.type == "text") {
			if (e.target.disabled) {
				e.target.style.color = "#f89406";
				e.target.disabled = false;
			} else {
				var value = e.target.value;
				var field = e.target.dataset.field;
				var update = {};
				update[field] = value;
				Hospitalizations.update({
					_id : this._id
				}, {
					$set : update
				}, function(error) {
					if (!error) {
						Notifications.success('Updated', 'Aggiornato ' + field + ' del ricovero');
					}
				});
				e.target.style.color = "";
				e.target.disabled = true;
			}
		}
	},
	'dblclick input' : function(e) {
		if (e.target.type == "text") {
			if (e.target.disabled) {
				e.target.style.color = "#f89406";
				e.target.disabled = false;
			}
		}
	},
	'keydown input' : function(e) {
		if (e.keyCode == '13' && !e.target.disabled) {
			var value = e.target.value;
			var field = e.target.dataset.field;
			var update = {};
			update[field] = value;
			Hospitalizations.update({
				_id : this._id
			}, {
				$set : update
			}, function(error) {
				if (!error) {
					Notifications.success('Updated', 'Aggiornato ' + field + ' del ricovero');
				}
			});
			e.target.style.color = "";
			e.target.disabled = true;
		}
	},
	'change input' : function(e) {
		var checked = e.target.checked;
		var type = e.target.type;
		var field = e.target.dataset.field;
		var update = {};

		if (type == "checkbox") {
			update[field] = checked;

			Hospitalizations.update({
				_id : this._id
			}, {
				$set : update
			}, function(error) {
				if (!error) {
					Notifications.success('Updated', 'Aggiornato ' + field + ' del ricovero');
				}
			});
		}
	},
	'change select' : function(e) {
		var value = e.target.value;
		var field = e.target.dataset.field;
		var update = {};

		update[field] = value;

		Hospitalizations.update({
			_id : this._id
		}, {
			$set : update
		}, function(error) {
			if (!error) {
				Notifications.success('Updated', 'Aggiornato ' + field + ' del ricovero');
			}
		});
	},
	'click .dismiss' : function(e){
		Meteor.call('dismissPatient',this._id,this.patientId,function(error){
			if(!error){
				Session.set('hospitalizationFilter',null);
				delete Session.keys['hospitalizationFilter'];
				Notifications.success('Success','Paziente!');
			}
		});
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
};

Template.bedCard.helpers({
	rooms : function() {
		var entries = [];
		Rooms.find({}).map(function(room) {
			room.niceId = room.number + room.bed;

			if (!room.hasOwnProperty("patientId")) {
				room.status = "disponibile";
			} else {
				if (room.patientId) {
					var patient = Patients.findOne({_id:room.patientId});
					room.status = niceName(patient.first,patient.last);
				} else {
					room.status = "disponibile";
				}
			}
			entries.push(room);
		});

		return entries;
	},
	bedStatus : function() {
		return (this.status) ? 'fa fa-circle' : 'fa fa-circle-thin';
	},
	getRoomAndBed : function() {
		var patientId = Session.get('patientFilter');
		var bed = Rooms.findOne({
			patientId : patientId
		});

		if (bed) {
			var niceId = bed.number + bed.bed;
			return niceId;
		} else {
			return "NESSUNA SISTEMAZIONE ASSEGNATA";
		}
	}
});

Template.bedCard.events({
	'change #roomSelect' : function() {
		var roomId = $(event.currentTarget).find(':selected').data("_id");
		var patientId = Session.get('patientFilter');
		var oldRoomId = Rooms.findOne({
			patientId : patientId
		});
		if(oldRoomId){
			Rooms.update({
				_id : oldRoomId._id
			}, {
				$unset : {
					patientId : ""
				}
			}, function(error) {
				if (error) {
					Notifications.error('Error', 'Si è verificato un errore aggiornando la stanza');
				} else {
					Rooms.update({
						_id : roomId
					}, {
						$set : {
							patientId : patientId
						}
					}, function(error) {
						if (error) {
							Notifications.error('Error', 'Si è verificato un errore aggiornando la stanza');
						} else {
							Notifications.info('Confirmation', 'Stanza aggiornata con successo');
						}
					});
				}
			});
		} else {
			Rooms.update({
					_id : roomId
				},
				{
					$set: {
						patientId : patientId
					}
				}, function(error) {
						if (error) {
							Notifications.error('Error', 'Si è verificato un errore aggiornando la stanza');
						} else {
							Notifications.info('Confirmation', 'Stanza aggiornata con successo');
						}
					});
		}
	}
});
