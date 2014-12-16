Meteor.startup(function() {
	if (!Rooms.findOne()) {

		// if the database is empty on server start, create some sample data.

		//Rooms
		var roomNumber = 10;
		var starter = 1;
		var bedsPerRoom = 2;
		var bedIds = ['A', 'B'];
		Rooms.remove({});

		var bedlist = [];
		for (var i = starter; i <= roomNumber+starter; i++) {
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
		names = ['prelivevi', 'digiuni', 'diabetici', 'medicazioni', 'urine', 'peso', 'pic-midline-cvc', 'echi-ecg','igiene intima','igiene personale','controllo accessi venosi periferici'];
		for ( i = 0; i < names.length; i++) {
			Categories.insert({
				'name' : names[i]
			});
		}

		//Populate units
		Units.remove({});
		Units.insert({
			type : 'peso',
			fields : [{
				preText: "Peso in kg",
				type: "number",
				step: "any",
				unit: "kg",
				required: "required"
			}]
		});
		Units.insert({
			type : 'pressione',
			fields : [{
				preText: "Massima",
				type: "number",
				step: "any",
				unit: "mmHg",
				required: "required"
			},
			{
				preText: "Minima",
				type: "number",
				step: "any",
				unit: "mmHg",
				required: "required"
			}
			]
		});
		Units.insert({
			type : 'temperatura',
			fields : [{
				preText: "Temperatura in Celsius",
				type: "number",
				step: "any",
				unit: "C",
				required: "required"
			}]
		});
		Units.insert({
			type : 'edema',
			fields : [{
				preText: "Dimensioni edema",
				type: "number",
				step: "any",
				unit: "cm",
				required: "required"
			},
			{
				preText: "È foveale?",
				type: "checkbox"
			}
			]
		});
		Units.insert({
			type : 'glucosio',
			fields : [{
				preText: "Livello di glucosio",
				type: "number",
				step: "any",
				unit: "mg/dl",
				required: "required"
			}]
		});
		Units.insert({
			type : 'ritmo cardiaco',
			fields : [{
				preText: "Ritmo cardiaco in bpm",
				type: "number",
				step: "any",
				unit: "bpm",
				required: "required"
			}]
		});
		Units.insert({
			type : 'evacuato',
			fields : [{
				preText: "Il paziente ha evacuato?",
				type: "checkbox"
			}]
		});
		Units.insert({
			type : 'dolore',
			fields : [{
				preText: "Dolore da 0 a 10",
				type: "number",
				step: "1",
				min: "0",
				max: "10",
				unit: "0-10",
				required: "required"
			}]
		});
		Units.insert({
			type : 'difficoltà respiratoria',
			fields : [{
				preText: "Il paziente ha difficoltà respiratorie?",
				type: "checkbox"
			}]
		});
		Units.insert({
			type : 'urine',
			fields : [{
				preText: "Urine prodotte in ml",
				type: "number",
				step: "any",
				unit: "ml",
				required: "required"
			}]
		});
		Units.insert({
			type : 'liquidi consumati',
			fields : [{
				preText: "Liquidi consumati in ml",
				type: "number",
				step: "any",
				unit: "ml",
				required: "required"
			}]
		});
	}
});
