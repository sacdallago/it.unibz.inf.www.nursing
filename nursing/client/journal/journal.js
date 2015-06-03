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
Template.journal.helpers({
	journals : function() {
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
	}
});

Template.journalItems.onCreated(function(){
	this.opened = new ReactiveVar(false);
})

Template.journalItems.onRendered(function(){
	var template = this;
  this.$(".ui.accordion").accordion({
    onOpen:function(){
      template.opened.set(true);
      shit = true;
    },
    onClose:function(){
      shit = false;
      template.opened.set(false);
    }
  });
});
Template.journalItems.helpers({
	noPatientSelected : function() {
		return !Session.get('patientFilter');
	},
	opened:function(){
    	return Template.instance().opened.get();
  	},
  	problems : function() {
  		var sel={};
  		var patientFilter=Session.get('patientFilter');
  		if (patientFilter){
  			sel.patientId=patientFilter;
  		} else{
  			sel.patientId=this.patientId;
  		}
  		sel.subject={$exists:true};
  		var problems=Journal.find(sel);
  		return problems;
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
})