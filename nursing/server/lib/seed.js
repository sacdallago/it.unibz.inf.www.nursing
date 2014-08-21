Meteor.startup(function() {
	if (!Rooms.findOne()) {

		// if the database is empty on server start, create some sample data.

		//Rooms
		var roomNumber = 10;
		var bedsPerRoom = 2;
		var bedIds = ['A', 'B'];
		Rooms.remove({});

		var bedlist = [];
		for (var i = 0; i < roomNumber; i++) {
			var data = {
				'patientId' : null,
				'bed' : 'A',
				'number' : i
			};

			Rooms.insert(data);

			var data1 = {
				'patientId' : null,
				'bed' : 'B',
				'number' : i
			};

			Rooms.insert(data1);
		}

		//Lists
		Categories.remove({});
		names = ['prelivevi', 'digiuni', 'diabetici', 'medicazioni', 'urine', 'peso', 'pic-midline-cvc', 'echi-ecg'];
		for ( i = 0; i < names.length; i++) {
			Categories.insert({
				'name' : names[i]
			});
		}

		//Populate units
		Units.remove({});
		Units.insert({
			type : 'weight',
			unit : 'kg'
		});
		Units.insert({
			type : 'height',
			unit : 'm'
		});
		Units.insert({
			type : 'pressure',
			unit : 'mm Hg'
		});
		Units.insert({
			type : 'glucose',
			unit : 'mg/dL'
		});
	}
});
