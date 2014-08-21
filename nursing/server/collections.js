// see https://github.com/sacdallago/it.unibz.inf.www.nursing/wiki/Collections
Patients = new Meteor.Collection("patients");////
Measures = new Meteor.Collection("measures");////
Journal = new Meteor.Collection("journal");////
Reminders = new Meteor.Collection("reminders");////
Favorites = new Meteor.Collection("favorites");////
Units = new Meteor.Collection("units");////
Categories = new Meteor.Collection("categories");////
Categories._ensureIndex({'name':1},{unique:true});//// Category.name unique no redundant categories
Rooms = new Meteor.Collection("rooms");////
Hospitalizations = new Meteor.Collection("hospitalizations");////

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
		return null;
	}
});
Meteor.publish('favorites', function() {
	if (this.userId) {
		return Favorites.find();
	} else {
		return null;
	}
});
Meteor.publish('favor', function() {
	if (this.userId) {
		return Measures.find();
	} else {
		return null;
	}
});
Meteor.publish('journal', function() {
	if (this.userId) {
		return Journal.find();
	} else {
		return null;
	}
});
Meteor.publish('hospitalizations', function() {
	if (this.userId) {
		return Hospitalizations.find();
	} else {
		return null;
	}
});
Meteor.publish('reminders', function() {
	if (this.userId) {
		return Reminders.find();
	} else {
		return null;
	}
});
Meteor.publish('rooms', function() {
	if (this.userId) {
		return Rooms.find();
	} else {
		return null;
	}
});
Meteor.publish('units', function(){
	if (this.userId) {
		return Units.find();
	} else {
		return null;
	}
});
Meteor.publish('categories', function(){
	if (this.userId) {
		return Categories.find();
	} else {
		return null;
	}
});
/* by activating the following publication, all users can see each other!
 Meteor.publish("nurses", function () {
 return Meteor.users.find({}, {fields: {profile: 1}});
 });
 */