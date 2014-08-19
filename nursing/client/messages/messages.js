Messages = new Meteor.Collection("messages");
// Gets augmented when a new message for the given ward gets inserted!
//This is what the template displays

messagesHandle = Meteor.subscribe("messages");

//Array of {index:0,type:"",value:"",unit:""}

Template.addmessage.destroyed = function() {
	delete Session.keys['fileSelected'];
};

/*
Template.messages.destroyed = function(){
	Session.set('typeFilter',null); // Filter that stores type attribute. Can be used in messsages (data.type: this)
	Session.set('patientFilter',null); // Filter that stores patient attribute. Can be used wherever patientId is used.
};
*/

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
	},
	'focusout #messageText' : function(event){
		var text = document.getElementById('messageText').value;
		//Implement regex to filter bad stuff ?
		Meteor.users.update(Meteor.user()._id,{$set: {'profile.message.message':text}});
	}
});

Template.addmessage.helpers({
	fileSelected: function(){
		return Session.get('fileSelected') ? 'river' : '';
	},
	inputfields : function(){
		return Session.get('inputfields');
	},
	messageData : function(){
		return Meteor.user().profile.message;
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

Template.messagetags.events({
	'click .tag' : function(event) {
		if (this.type) {
			var now = Session.get('typeFilter');
			if (now == this.type) {
				Session.set('typeFilter', null);
			} else {
				Session.set('typeFilter', this.type);
			}
		} else if (this.patientId) {
			var now = Session.get('patientFilter');
			if (now == this.patientId) {
				Session.set('patientFilter', null);
			} else {
				Session.set('patientFilter', this.patientId);
			}
		}
		if (this.type == null && this.patientId == null) {
			Session.set('typeFilter', null);
			Session.set('patientFilter', null);
		}
	}
});

Template.messageitems.messages = function() {
	var typeFilter = Session.get('typeFilter');
	var patientFilter = Session.get('patientFilter');
	var messages;
	if (typeFilter && patientFilter) {
		messages = Messages.find({
			'data.type' : typeFilter,
			patientId : patientFilter
		});
	} else if (typeFilter) {
		messages = Messages.find({
			'data.type' : typeFilter
		});
	} else if (patientFilter) {
		messages = Messages.find({
			patientId : patientFilter
		});
	} else {
		messages = Messages.find();
	}
	
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


Template.messagetags.tags = function() {
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

Template.messagetags.active = function() {
	return (Session.equals('typeFilter', this.type) || Session.equals('patientFilter', this.patientId)) ? 'label-info' : '';
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
