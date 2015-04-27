Meteor.startup(function() {
	if (!Rooms.findOne()) {

		// if the database is empty on server start, create some sample data.

		//Rooms
		var roomNumber = 11;
		var bedsPerRoom = 2;
		var bedIds = ['A', 'B'];
		Rooms.remove({});

		var bedlist = [];
		for (var i = 1; i <= roomNumber; i++) {
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

		//Categories
		Categories.remove({});
		names = ['blood tests', 'fasts', 'diabetics', 'dressings', 'urine', 'weight', 'pic-midline-cvc', 'echi-ecg','hygiene','personal hygiene','peripheral venous access control'];
		for ( i = 0; i < names.length; i++) {
			Categories.insert({
				'name' : names[i]
			});
		}

		//Populate units
		Units.remove({});
		Units.insert({
			type : 'weight',
			fields : [{
				preText: "Weight in kg",
				type: "number",
				step: "any",
				unit: "kg",
				required: "required"
			}]
		});
		Units.insert({
			type : 'pressure',
			fields : [{
				preText: "Maximum pressure",
				type: "number",
				step: "any",
				unit: "mmHg",
				required: "required"
			},
			{
				preText: "Minimum pressure",
				type: "number",
				step: "any",
				unit: "mmHg",
				required: "required"
			}
			]
		});
		Units.insert({
			type : 'temperature',
			fields : [{
				preText: "Temperature in Celsius",
				type: "number",
				step: "any",
				unit: "C",
				required: "required"
			}]
		});
		Units.insert({
			type : 'edema',
			fields : [{
				preText: "Size of edema",
				type: "number",
				step: "any",
				unit: "cm",
				required: "required"
			},
			{
				preText: "Is foveal?",
				type: "checkbox"
			}
			]
		});
		Units.insert({
			type : 'glucose',
			fields : [{
				preText: "Level of glucose",
				type: "number",
				step: "any",
				unit: "mg/dl",
				required: "required"
			}]
		});
		Units.insert({
			type : 'heart rate',
			fields : [{
				preText: "Heart rate in bpm",
				type: "number",
				step: "any",
				unit: "bpm",
				required: "required"
			}]
		});
		Units.insert({
			type : 'evacuated',
			fields : [{
				preText: "Has patient evacuated?",
				type: "checkbox"
			}]
		});
		Units.insert({
			type : 'pain',
			fields : [{
				preText: "Pain from 0 to 10",
				type: "number",
				step: "1",
				min: "0",
				max: "10",
				unit: "0-10",
				required: "required"
			}]
		});
		Units.insert({
			type : 'respiratory difficulties',
			fields : [{
				preText: "Has the patient problems breathing?",
				type: "checkbox"
			}]
		});
		Units.insert({
			type : 'urine',
			fields : [{
				preText: "Ml of urine produced",
				type: "number",
				step: "any",
				unit: "ml",
				required: "required"
			}]
		});
		Units.insert({
			type : 'Intaken liquids',
			fields : [{
				preText: "Ml of liquids taken in",
				type: "number",
				step: "any",
				unit: "ml",
				required: "required"
			}]
		});
	}
});
