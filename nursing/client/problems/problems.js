
Template.problems.helpers({
	subjects : function(){
		var list = Journal.find({
			active: true,
			subject: {$exists:true}
		});
		return list;
	},
	origin : function(){
		var problemId = Session.get('problemFilter');
		var problem = null;
		if (problemId){
			 problem = Journal.findOne({
			 	_id: problemId
			});
		}
		console.log(problem);
		return problem;
	},
	isClass : function(itemClass){
		return (this.itemClass === itemClass);
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