// see https://github.com/sacdallago/it.unibz.inf.www.nursing/wiki/Helper-Collections


//Warnings. The update of this collection triggers updat
Warnings = new Meteor.Collection("warnings");

//Deny everything for the clients (they must use Meteor.call)
Warnings.deny({
	insert : function(){
		return false;
	},
	update : function(){
		return false;
	},
	remove : function(){
		return false;
	}
});

//Publish warnings only to users based on their profile.department
Meteor.publish('warnings', function() {
	if(this.userId){
		var user = Meteor.users.findOne({_id: this.userId});
		return Warnings.find({'department': user.profile.department});
	} else {
		return null;
	}
});

//Clean collection at startup
Warnings.remove({});

//Define the two things users can do: delete alerts (otherwise everytime they login they see all of 'em), insert a new notification for a given department
Meteor.methods({
	removeWarnings : function() {
		if (this.userId) {
			var user = Meteor.users.findOne({
				_id : this.userId
			});
			return Warnings.remove({
				'department' : user.profile.department
			});
		} else {
			return null;
		}
	},
	newNotification : function(title,message,department){
		console.log('Warning for dep '+department+" created");
		if (department && message) {
			return Warnings.insert({
				department : department,
				title : title,
				message : message
			});
		}
		return null;

	}
}); 
