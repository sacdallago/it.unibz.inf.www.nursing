
Template.problems.helpers({
	subjects : function(){
		var patientId = Session.get('patientFilter');
		var filter = {
			active: true,
			subject: {$exists:true},
			$or: [{solved:{$exists:false}}, {solved:false}]
		};
		if(patientId)
			filter.patientId = patientId;
		var list = Journal.find(filter);
		return list;
	},
	origin : function(){
		var problemId = Session.get('problemFilter');
		var problem = null;
		var filter = {};
		if (problemId){
			filter._id = problemId;
		} else {
			filter = {
				active: true,
				subject: {$exists:true},
				$or: [{solved:{$exists:false}}, {solved:false}]
			};
			var patientId = Session.get('patientFilter');
			if(patientId)
				filter.patientId = patientId;
		}
		 console.log(problemId);
		 problem = Journal.find( filter).map(function(element){
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

			element.subject ? (element.subject = ((String)(element.subject)).capitalize()) : null;

			var nurse = Meteor.users.findOne(element.nurseId);
			element.nurseName = niceName(nurse.profile.first, nurse.profile.last);

			element.attachment = JournalDocuments.findOne(element.attachment);
			return element;
		});
		console.log("loading origin");
		console.log(problem);
		return problem;
	},
	isClass : function(itemClass){
		return (this.itemClass === itemClass);
	},
	entries : function(){
		var entries = [];
		var filter = {};
		var problemId = Session.get('problemFilter');
		filter.journalId = problemId;
		if(problemId){

			Reminders.find(filter, {sort: {timestamp:1}}).map(function(element) {
		      var patient = Patients.findOne({
		        _id : element.patientId
		      });

		      var room = Rooms.findOne({
		        patientId : element.patientId
		      });

		      var nurse = Meteor.users.findOne({
		        _id : element.nurseId
		      });
		      
		      if (element.journalId){
		        var journalentry = Journal.findOne(element.journalId);
		        element.problemSubject = journalentry.subject;
		        if (journalentry.solved){
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
		      console.log("Remapping");
		      element.date = dateFormatter(element.timestamp);
		      element.niceDue = dateFormatter(element.dueDate);
		      element.itemClass = "reminder";
		      entries.push(element);
		    });

			
			Measures.find(filter).map(function(element) {

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

				_.each(element.fields, function(field) {
					if (!field.unit) {
						field.checkbox = field.value == 0 ? "No" : "Yes";
					}
				});

				element.type = element.type.capitalize();

				var nurse = Meteor.users.findOne(element.nurseId);
				element.nurseName = niceName(nurse.profile.first, nurse.profile.last);
				element.itemClass = "measure"
				entries.push(element);
			});
		

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
				element.itemClass = "journal";
				entries.push(element);
			});
			entries.sort(function(a, b) {
				if (a.timestamp < b.timestamp) {
					return -1;
				} else if (a.timestamp > b.timestamp) {
					return 1;
				}
				return 0;
			});

			return entries;
		}
	},
	problemSelected : function(){
		return !Session.equals('problemFilter',null);
	}
});
Template.problems.destroyed = function(){
	delete Session.keys['problemFilter'];
};

Template.problems.events({});

Template.subject.helpers({
	selected: function(){
		return Session.equals('problemFilter', this._id) ? 'label-info' : '';
	}
});
Template.subject.events({
	'click .subject' : function(event){
		Session.set('problemFilter',this._id);
	}
});