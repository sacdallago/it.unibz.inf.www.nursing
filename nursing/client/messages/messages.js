Messages = new Meteor.Collection("messages");
// Gets augmented when a new message for the given ward gets inserted!
//This is what the template displays

messagesHandle = null;
patientsNameHandle = null;
// Initiated in router beforeAction!!
var inputfields = null;

Template.messageitems.rendered = function(){
	inputfields = 1;
	if(!patientsNameHandle){
		patientsNameHandle = Meteor.subscribe('patients',{},{fields: {first:1,last:1,'currentHospitalization.departmentOfStay':1}},function(error){
			if(error){
				Notifications.error('Error','There was an error loading the patients. Please contact the administrators.');
			}
		});
	}
};
	

Template.messages.destroyed = function(){
	Session.set('tagTypeFilter',null); // Filter that stores type attribute. Can be used in messsages (data.type: this)
	Session.set('patientTagFilter',null); // Filter that stores patient attribute. Can be used wherever patientId is used.
};

Template.messageitems.destroyed = function() {
	delete Session.keys['fileSelected'];
	if (patientsNameHandle) {
		patientsNameHandle.stop();
		delete patientsNameHandle;
		patientsNameHandle = null;
	}
};

Template.messageitems.events({
	'click .read' : function(event) {
		Messages.update({
			_id : this._id
		}, {
			$inc : {
				readBy : 1
			}
		}, function(error) {
			if (error) {
				Notifications.error("Error", "An error occoured. Please try again");
			} else {
				Notifications.success("", "You read it! :)");
			}
		});
	},
	'click .delete' : function(event) {
		Messages.remove({
			_id : this._id
		}, function(error) {
			if (error) {
				Notifications.error("Error", "An error occoured. Please try again");
			} else {
			}
		});
	}
});

Template.addmessage.events({
	'submit' : function(event) {
		event.preventDefault();
		console.log(document.getElementById('patientId'));
	},
	'change #file' : function(event){
		document.getElementById('file').value != "" ? Session.set('fileSelected', true) : Session.set('fileSelected', null);
	}
});

Template.addmessage.helpers({
	fileSelected: function(){
		return Session.get('fileSelected') ? 'river' : '';
	}
});

Template.addmessage.settings = function() {
  return {
   position: "bottom",
   limit: 5,
   rules: [
     {
       collection: Patients,
       field: "first",
       template: Template.patientPill,
       selector: function(match){
  			var regex = new RegExp("^"+match, 'i');
  			return {$or: [{'first': regex}, {'last': regex}]};},
  		callback : function(doc,element){
  			document.getElementById('patientId').value = doc._id;
  		}
     },
   ]
  };
};

Template.addmessage.departments = Departments; 

Template.messages.events({
	'click .tag' : function(event) {
		if (this.type) {
			var now = Session.get('tagTypeFilter');
			if (now == this.type) {
				Session.set('tagTypeFilter', null);
			} else {
				Session.set('tagTypeFilter', this.type);
			}
		} else if (this.patientId) {
			var now = Session.get('patientTagFilter');
			if (now == this.patientId) {
				Session.set('patientTagFilter', null);
			} else {
				Session.set('patientTagFilter', this.patientId);
			}
		}
		if (this.type == null && this.patientId == null) {
			Session.set('tagTypeFilter', null);
			Session.set('patientTagFilter', null);
		}
	}
});

Template.messageitems.messages = function() {
	var tagTypeFilter = Session.get('tagTypeFilter');
	var patientTagFilter = Session.get('patientTagFilter');
	var messages;
	if (tagTypeFilter && patientTagFilter) {
		messages = Messages.find({
			'data.type' : tagTypeFilter,
			patientId : patientTagFilter
		});
	} else if (tagTypeFilter) {
		messages = Messages.find({
			'data.type' : tagTypeFilter
		});
	} else if (patientTagFilter) {
		messages = Messages.find({
			patientId : patientTagFilter
		});
	} else {
		messages = Messages.find();
	}
	
	var tempHandle = null;
	return messages.map(function(element) {
		var patient = Patients.findOne({
			_id : element.patientId
		});
		if (patient) {
			//This adds beds to patient names, if the patient is in the ward the message is sent to
			element.bed = patient.currentHospitalization.bed;
		}
		//This adds a nice formatting of the date the message was written / modified
		element.date = dateFormatter(element.timestamp);
		return element;
	});
}; 


Template.messages.tags = function() {
	var tag_infos = [];
	var total_count = 0;

	Messages.find().forEach(function(message) {
		_.each(message.data, function(data) {
			var tag_info = _.find(tag_infos, function(element) {
				return element.type === data.type;
			});
			if (!tag_info)
				tag_infos.push({
					type : data.type,
					count : 1
				});
			else
				tag_info.count++;
		});
		var tag_info = _.find(tag_infos, function(element) {
			return element.patientId === message.patientId;
		});
		if (!tag_info)
			tag_infos.push({
				patientId : message.patientId,
				patientName : message.patientName,
				count : 1
			});
		else
			tag_info.count++;

		total_count++;
	});

	tag_infos = _.sortBy(tag_infos, function(x) {
		return x.type;
	});

	tag_infos.unshift({
		type : null,
		count : total_count
	});

	return tag_infos;
};

Template.messages.active = function() {
	return (Session.equals('tagTypeFilter', this.type) || Session.equals('patientTagFilter', this.patientId)) ? 'label-info' : '';
};

Template.messages.moreResults = function() {
	// If, once the subscription is ready, we have less rows than we
	// asked for, we've got all the rows in the collection.
	if (messagesHandle && messagesHandle.ready() && Messages.find().count() < messagesHandle.limit()) {
		return false;
	}
	return true;
};
/////////////////////////////////////

//This is what the template minimessages displays -- currently not loaded in html
Template.minimessages.messages = function() {
	var handle = Meteor.subscribe;
	var messages = Messages.find({}, {
		sort : {
			time : -1
		},
		limit : 4
	}).fetch();

	var result = [];

	for (var i = 0; i < 4 && i < messages.length; i++) {
		var patient = Patients.findOne({
			'_id' : Hospitalizations.findOne({
				'_id' : messages[i].hospitalizationId
			}).patientId
		});
		var date = new Date(messages[i].time);
		var trim = 30;
		while (messages[i].message.charAt(trim) != " " && messages[i].message.length > trim) {
			trim++;
		}
		var element = {
			attachment : messages[i].attachment,
			name : patient.first.capitalize() + " " + patient.last.capitalize(),
			timestamp : date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes(),
			message : messages[i].message.substring(0, trim) + "..."
		};
		result.push(element);
	}
	return result;
};
