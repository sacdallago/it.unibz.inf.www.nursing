Units = new Meteor.Collection('units');
unitsHandle = Meteor.subscribe('units');

Template.newMeasurement.events({
	'change select' : function(event) {
		document.getElementById('unit').value = $(event.currentTarget).find(':selected').data("unit");
	},
	'submit' : function(event){
		event.preventDefault();
		console.log('submit');
	}
});

Template.newMeasurement.units = function() {
	return Units.find().map(function(element) {
		element.name = element.type.capitalize();
		return element;
	});
};

Template.newJournal.events({
	'change #file' : function(event){
		document.getElementById('file').value != "" ? Session.set('fileSelected', true) : Session.set('fileSelected', null);
	},
	'focusout #messageText' : function(event){
		var text = document.getElementById('messageText').value;
		//Implement regex to filter bad stuff ?
		Meteor.users.update(Meteor.user()._id,{$set: {'profile.message.message':text}});
	},
	'submit' : function(event){
		event.preventDefault();
		console.log('submit');
	}
});

Template.newJournal.helpers({
	fileSelected: function(){
		return Session.get('fileSelected') ? 'river' : '';
	},
	messageData : function(){
		return Meteor.user().profile.message;
	}
});
