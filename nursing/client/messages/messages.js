Messages = new Meteor.Collection("messages");

Session.setDefault('unreadMessages', 0);
// Gets augmented when a new message for the given ward gets inserted!
//This is what the template displays
var messagesHandle = null;

Template.messages.events({
	'click .read': function(event){
		Messages.update({_id:this._id},{$inc: { readBy: 1 }}, function(error){
			if(error){
				Notifications.error("Error","An error occoured. Please try again");
			} else {
				Notifications.success("Yeah","You read it! :)");
			}
		});
	},
	'click .delete': function(event){
		Messages.update({_id:this._id},{$inc: { readBy: 1 }}, function(error){
			if(error){
				Notifications.error("Error","An error occoured. Please try again");
			} else {
				Notifications.success("Yeah","You deleted it! :)");
			}
		});
	},
});

Template.messages.messages = function() {
	messagesHandle = Meteor.subscribeWithPagination("messages", 10, function onReady() {
		Session.set('messagesLoaded', true);
	});
	return Messages.find({}, {
		$orderby : {
			timestamp : 1
		}
	});
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
            Notifications.info('Loading next messages');
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