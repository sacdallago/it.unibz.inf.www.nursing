// if the database is empty on server start, create some sample data.
var roomNumber = 10;
var bedsPerRoom = 2;
var data = [];
var bedIds = ['A','B'];

Meteor.startup(function() {
	if(Rooms.find().count() === 0){

		for (var i = 0; i < roomNumber; i++){
			var bedlist = [];
			for (var j = 0; j < bedsPerRoom; j++){
				bedlist[bedlist.length] = {
					status : false,
					id : bedIds[j]
				};
			}


			data[data.length] = {
				beds : this.bedlist,
				roomNumber: (i+1)
			};
			Rooms.insert(data[data.length]);
		}
	}

});