Hospitalizations = new Meteor.Collection('hospitalizations');
hospitalizationsHandle = Meteor.subscribe('hospitalizations', {
	active : true
}, {});

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
			if (field == "residenceNumber"){
				value = value.replace(/\s+/g, ' ');
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
			if (field == "residenceNumber"){
				value = value.replace(/\s+/g, ' ');
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
						Notifications.success('Updated', 'Updated ' + field + ' of hospitalization');
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
					Notifications.success('Updated', 'Updated ' + field + ' of hospitalization');
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
					Notifications.success('Updated', 'Updated ' + field + ' of hospitalization');
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
				Notifications.success('Updated', 'Updated ' + field + ' of hospitalization');
			}
		});
	},
	'click .dismiss' : function(e){
		Meteor.call('dismissPatient',this._id,this.patientId,function(error){
			if(!error){
				Session.set('hospitalizationFilter',null);
				delete Session.keys['hospitalizationFilter'];
				Notifications.success('Success','Dismissed patient!');
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

	

Template.bedCard.helpers({
	rooms : function() {
		var entries = [];
		Rooms.find({}).map(function(room) {
			room.niceId = room.number + room.bed;

			if (!room.hasOwnProperty("patientId")) {
				room.status = "free";
			} else {
				if (room.patientId) {
					var patient = Patients.findOne({_id:room.patientId});
					room.status = niceName(patient.first,patient.last);
				} else {
					room.status = "free";
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
			return "NO ROOM OR BED ASSIGNED";
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
					Notifications.error('Error', 'Something happened while saving updating the room');
				} else {
					Rooms.update({
						_id : roomId
					}, {
						$set : {
							patientId : patientId
						}
					}, function(error) {
						if (error) {
							Notifications.error('Error', 'Something happened while updating the room');
						} else {
							Notifications.info('Confirmation', 'Room updated successfully!');
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
							Notifications.error('Error', 'Something happened while updating the room');
						} else {
							Notifications.info('Confirmation', 'Room updated successfully!');
						}
					});
		}
	}
});
