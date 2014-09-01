
Template.problems.helpers({
	subjects : function(){
		var list = Journal.find({
			active: true,
			subject: $exists:true
		});
	}
});

Template.problems.events({});

Template.subject.helpers({
	selected: function(){
		Session.equals('problemFilter', this._id) ? 'label-info' : '';
	}
});
Template.subject.events({
	'click .subject' : function(event){
		Session.set('problemFilter',this._id);
	}
});