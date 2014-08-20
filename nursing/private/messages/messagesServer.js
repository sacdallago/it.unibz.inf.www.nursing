Meteor.publish('messages', function(criteria, projection) {
	if (this.userId) {
		var user = Meteor.users.findOne(this.userId);
		if (criteria && projection) {
			criteria.target = user.profile.department;
			return Messages.find(criteria, projection);
		} else {
			return Messages.find({
				target : user.profile.department
			}, {
				sort : {
					timestamp : -1
				}
			});
		}

	} else {
		return null;
	}
}); 