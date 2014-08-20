Meteor.startup(function() {
		// if the database is empty on server start, create some sample data.
		

		//Rooms
		var roomNumber = 10;
		var bedsPerRoom = 2;
		var bedIds = ['A','B'];
		var data=[];
		Rooms.remove({});

		var bedlist = [];
		for (var i = 0; i < roomNumber; i++){
			
			for (var j = 0; j < bedsPerRoom; j++){
				bedlist[j] = {
					'patientId' : null,
					'name' : bedIds[j]
				};
				
			}

			data[i] = {
				'beds' : bedlist,
				'number' : i
			};
			
			Rooms.insert(data[i]);
		}

		//Lists
		Categories.remove({});
		names = ['prelivevi','digiuni','diabetici','medicazioni','urine','peso','pic-midline-cvc', 'echi-ecg'];
		for (i = 0; i < names.length; i++){
			Categories.insert({
				'name' : names[i]
			});
		}
       
       //Populate units
		Units.remove({});
		Units.insert({type: 'weight', unit:'kg'});
		Units.insert({type: 'height', unit:'m'});
		Units.insert({type: 'pressure', unit:'mm Hg'});
		Units.insert({type: 'glucose', unit:'mg/dL'});

});
