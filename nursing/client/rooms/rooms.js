Rooms = new Meteor.Collection("rooms");

roomsHandle = null;

Template.rooms.rooms = function() {
	roomsHandle = Meteor.subscribeWithPagination("rooms", 10, function onReady() {
		Session.set('roomsloaded', true);
	});
	return Rooms.find({}, {
		sort : {
			time : -1
		}
	});
};

