

Meteor.startup(function() {
<<<<<<< HEAD
	var totRooms = Rooms.find().count();
	for (var i = 0; i< totRooms ; i++){
		Rooms.remove(Rooms.findOne());
	}
=======

		// if the database is empty on server start, create some sample data.
		var roomNumber = 10;
		var bedsPerRoom = 2;
		var bedIds = ['A','B'];
		var data=[];
		Rooms.remove({});

		var bedlist = [];
		for (var i = 0; i < roomNumber; i++){
			
			for (var j = 0; j < bedsPerRoom; j++){
				bedlist[j] = {
					'status' : "free",
					'id' : bedIds[j]
				};
				
			}
>>>>>>> faac102e43c23c5744b3bae237bf4c3e19911797

	

<<<<<<< HEAD
	for (var i = 0; i < roomNumber; i++){
		var bedlist = [];
		for (var j = 0; j < bedsPerRoom; j++){
			bedlist[bedlist.length] = {
				status : "empty",
				id : bedIds[j]
			};
		}


		data[data.length] = {
			beds : bedlist,
			roomNumber: i
		};
		console.log(data[data.length]);
		Rooms.insert(data[data.length]);
	}
=======
			data[i] = {
				'beds' : bedlist,
				'roomNumber' : i
			};
			
			Rooms.insert(data[i]);
		}
	
>>>>>>> faac102e43c23c5744b3bae237bf4c3e19911797

}); 
