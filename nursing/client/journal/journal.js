//Define file storage collection at startup
JournalDocuments = new FS.Collection("journalDocuments", {
	stores : [new FS.Store.FileSystem("journalDocuments")]
});

journalDocumentsHandle = Meteor.subscribe('journalDocuments');

FS.HTTP.setBaseUrl('/attachments');

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
		element.bed = room.number + "" + room.bed;

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
	'click .delete' : function(event) {
		event.preventDefault();
		var id = this._id;
		if (this.subject) {
			var count = 1;
			Meteor.call('deleteProblem', id);
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
							Notifications.success("Success", "Removed Journal entry");
						}
					});
				}
			});
		} else {
			Journal.remove({
				_id : id
			}, function(e) {
				if (!e) {
					Notifications.success("Success", "Removed Journal entry");
				}
			});
		}

	}
});
