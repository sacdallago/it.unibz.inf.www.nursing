// see https://github.com/sacdallago/it.unibz.inf.www.nursing/wiki/Collections
Patients = new Meteor.Collection("patients");
////
Measures = new Meteor.Collection("measures");
////
Journal = new Meteor.Collection("journal");
////
Reminders = new Meteor.Collection("reminders");
////
Favorites = new Meteor.Collection("favorites");
////
Units = new Meteor.Collection("units");
////
Categories = new Meteor.Collection("categories");
////
Categories._ensureIndex({
	'name' : 1
}, {
	unique : true
});
//// Category.name unique no redundant categories
Rooms = new Meteor.Collection("rooms");
////
Hospitalizations = new Meteor.Collection("hospitalizations");
////

//Security first
//_id: { $in: [ 5,  ObjectId("507c35dd8fada716c89d0013") ] }
Meteor.publish('patients', function(criteria, projection) {
	if (this.userId) {
		if (criteria && projection) {
			return Patients.find(criteria, projection);
		} else {
			return Patients.find();
		}
	} else {
	}
});
Meteor.publish('favorites', function() {
	if (this.userId) {
		return Favorites.find();
	} else {
	}
});
Meteor.publish('measures', function(criteria, projection) {
	if (this.userId) {
		if (criteria && projection) {
			return Measures.find(criteria, projection);
		} else {
			return Measures.find();
		}
	} else {
		return;
	}
});
Meteor.publish('journal', function(criteria, projection) {
	if (this.userId) {
		if (criteria && projection) {
			return Journal.find(criteria, projection);
		} else {
			return Journal.find();
		}
	} else {
	}
});
Meteor.publish('hospitalizations', function(criteria, projection) {
	if (this.userId) {
		if (criteria && projection) {
			return Hospitalizations.find(criteria, projection);
		} else {
			return Hospitalizations.find();
		}
	} else {
		return;
	}
});
Meteor.publish('reminders', function(criteria, projection) {
	if (this.userId) {
		if (criteria && projection) {
			return Reminders.find(criteria, projection);
		} else {
			return Reminders.find();
		}
	} else {
	}
});
Meteor.publish('rooms', function() {
	if (this.userId) {
		return Rooms.find();
	} else {
	}
});
Meteor.publish('units', function() {
	if (this.userId) {
		return Units.find();
	} else {
	}
});
Meteor.publish('categories', function() {
	if (this.userId) {
		return Categories.find();
	} else {
	}
});
Meteor.publish('users', function() {
	if (this.userId) {
		return Meteor.users.find({}, {
			'profile.first' : 1,
			'profile.last' : 1
		});
	} else {
	}
});
/* by activating the following publication, all users can see each other!
 Meteor.publish("nurses", function () {
 return Meteor.users.find({}, {fields: {profile: 1}});
 });
 */

Meteor.methods({
	deleteProblem : function(problemId) {
		Journal.update({
			journalId : problemId
		}, {
			$unset : {
				journalId : ""
			}
		});
		Measures.update({
			journalId : problemId
		}, {
			$unset : {
				journalId : ""
			}
		});
		Reminders.update({
			journalId : problemId
		}, {
			$unset : {
				journalId : ""
			}
		});
		return true;
	},
	updateProblems : function(patientId, hospitalizationId) {
		Journal.update({
			patientId : patientId,
			subject : {
				$exists : true
			},
			$or : [{
				solved : false
			}, {
				solved : {
					$exists : false
				}
			}]
		}, {
			$set : {
				hospitalizationId : hospitalizationId,
				active : true
			}
		});
	},
	dismissPatient : function(hospitalizationId, patientId) {
		Reminders.remove({
			hospitalizationId : hospitalizationId
		});
		Journal.update({
			hospitalizationId : hospitalizationId
		}, {
			$unset : {
				active : ''
			}
		});
		Measures.update({
			hospitalizationId : hospitalizationId
		}, {
			$unset : {
				active : ''
			}
		});
		Hospitalizations.update({
			_id : hospitalizationId
		}, {
			$unset : {
				active : ''
			}
		});
		Rooms.update({
			patientId : patientId
		}, {
			$unset : {
				patientId : ''
			}
		});
		return;
	}
});
