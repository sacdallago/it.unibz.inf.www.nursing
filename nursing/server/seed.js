

Meteor.startup(function() {
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

			data[i] = {
				'beds' : bedlist,
				'roomNumber' : i
			};
			
			Rooms.insert(data[i]);
		}

		Lists.remove({});
		var names = ['prelivevi','digiuni','diabetici','medicazioni','urine','peso','pic-midline-cvc', 'echi-ecg'];
		for (i = 0; i < names.length; i++){
			Lists.insert({
				name : names[i]
			});
		}

});
