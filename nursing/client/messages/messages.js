Messages = new Meteor.Collection("messages");
// Gets augmented when a new message for the given ward gets inserted!
//This is what the template displays

messagesHandle = null; // Initiated in router beforeAction!!

Template.messageitems.events({
	'click .read': function(event){
		Messages.update({_id:this._id},{$inc: { readBy: 1 }}, function(error){
			if(error){
				Notifications.error("Error","An error occoured. Please try again");
			} else {
				Notifications.success("","You read it! :)");
			}
		});
	},
	'click .delete': function(event){
		Messages.remove({_id:this._id}, function(error){
			if(error){
				Notifications.error("Error","An error occoured. Please try again");
			} else {
			}
		});
	}
});

Template.messages.events({
	'click .tag': function(event){
		if(this.type){
			var now = Session.get('tagTypeFilter');
			if(now == this.type){
				Session.set('tagTypeFilter',null);
			} else {
				Session.set('tagTypeFilter',this.type);
			}
		} else if(this.patientId){
			var now = Session.get('patientTagFilter');
			if(now == this.patientId){
				Session.set('patientTagFilter',null);
			} else {
				Session.set('patientTagFilter',this.patientId);
			}
		} if (this.type == null && this.patientId == null){
			Session.set('tagTypeFilter',null);
			Session.set('patientTagFilter',null);
		}
	}
});

Template.messages.helpers({
	notReady : function(){
		return !(messagesHandle && messagesHandle.ready());
	}
});

Template.messageitems.messages = function() {
	var tagTypeFilter = Session.get('tagTypeFilter');
	var patientTagFilter = Session.get('patientTagFilter');
	if (tagTypeFilter && patientTagFilter) {
		return Messages.find({
			'data.type' : tagTypeFilter,
			patientId: patientTagFilter
		}, {
			$orderby : {
				timestamp : 1
			}
		});
	} else if(tagTypeFilter) {
		return Messages.find({
			'data.type' : tagTypeFilter
		}, {
			$orderBy : {
				timestamp : 1
			}
		});
	} else if(patientTagFilter) {
		return Messages.find({
			patientId: patientTagFilter
		}, {
			$orderBy : {
				timestamp : 1
			}
		});
	} else {
		return Messages.find({}, {
			$orderBy : {
				timestamp : 1
			}
		});
	}
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
				patientName: message.patientName,
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
	return (Session.equals('tagTypeFilter',this.type) || Session.equals('patientTagFilter',this.patientId)) ? 'label-info' : '';
};

Template.messages.moreResults = function() {
    // If, once the subscription is ready, we have less rows than we
    // asked for, we've got all the rows in the collection.
    if(messagesHandle && messagesHandle.ready() && Messages.find().count() < messagesHandle.limit()){
    	return false;
    }
    return true;
};

function moreMessages() {
    var threshold, target = $("#moreMessages");
    if (!target.length) return;
 
    threshold = $(window).scrollTop() + $(window).height() - target.height();
 
    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
            // console.log("target became visible (inside viewable area)");
            target.data("visible", true);
            messagesHandle.loadNextPage();
            //Notifications.info('Loading next messages');
        }
    } else {
        if (target.data("visible")) {
            // console.log("target became invisible (below viewable arae)");
            target.data("visible", false);
        }
    }        
}
 
// run the above func every time the user scrolls
$(window).scroll(moreMessages);
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