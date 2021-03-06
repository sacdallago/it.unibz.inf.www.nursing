//Define file storage collection at startup
JournalDocuments = new FS.Collection("journalDocuments", {
	stores : [new FS.Store.FileSystem("journalDocuments")]
});

journalDocumentsHandle = Meteor.subscribe('journalDocuments');
FS.HTTP.setBaseUrl('/attachments');

//Load Journal at startup
Journal = new Meteor.Collection("journal");
journalHandle = Meteor.subscribe('journal',{active:true},{});


//Template logic
Template.journal.journals = function() {
	var filter = {};
	if(Session.get('patientFilter')){
		filter.patientId = Session.get('patientFilter');
	}
	return Journal.find(filter, {
		sort : {
			timestamp : -1
		}
	}).map(function(element) {

		var patient = Patients.findOne(element.patientId);
		element.patientName = niceName(patient.first, patient.last);

		var room = Rooms.findOne({
			'patientId' : element.patientId
		});
		
		if(room){
			element.bed = room.number + "" + room.bed;
		}
		
		element.date = dateFormatter(element.timestamp);

		if (element.journalId) {
			element.problemSubject = Journal.findOne(element.journalId).subject.capitalize();
		}

		element.subject ? (element.subject = ((String)(element.subject)).capitalize()) : null;

		var nurse = Meteor.users.findOne(element.nurseId);
		element.nurseName = niceName(nurse.profile.first, nurse.profile.last);

		element.attachment = JournalDocuments.findOne(element.attachment);

		return element;
	});
};

Template.journalItems.helpers({
	noPatientSelected : function() {
		return !Session.get('patientFilter');
	},
	problems : function() {
		return Journal.find({
			subject : {
				$exists : true
			},
			patientId: this.patientId,
			$or: [{ solved: false}, {solved :{$exists: false}}]
		});
	}
});

Template.journalItems.events({
	'change select' : function(event) {
		var problemId = $(event.currentTarget).find(':selected').data("problemid");
		Journal.update({
			_id : this._id
		}, {
			$set : {
				journalId : problemId
			}
		});
	},
	'click .label' : function(event) {
		event.preventDefault();
		Journal.update({
			_id : this._id
		}, {
			$unset : {
				journalId : ""
			}
		});
	},
	'click .solved' : function(event) {
		event.preventDefault();
		Journal.update({
			_id : this._id
		}, {
			$set : {
				solved : true
			}
		});
	},
	'click .unsolved' : function(event) {
		event.preventDefault();
		Journal.update({
			_id : this._id
		}, {
			$unset : {
				solved : ''
			}
		});
	},
	'click .delete' : function(event) {
		event.preventDefault();
		var id = this._id;
		if (this.subject) {
			Meteor.call('deleteProblem', id, function(error){
				if(error){
					alert(error);
				}
			});
		}
		if (this.attachment) {
			JournalDocuments.remove({
				_id : this.attachment._id
			}, function(err) {
				if (!err) {
					Journal.remove({
						_id : id
					}, function(e) {
						if (!e) {
							Notifications.success("Success", "Nota eliminata dal Diario");
						}
					});
				}
			});
		} else {
			Journal.remove({
				_id : id
			}, function(e) {
				if (!e) {
					Notifications.success("Success", "Nota eliminata dal Diario");
				}
			});
		}

	}
});
