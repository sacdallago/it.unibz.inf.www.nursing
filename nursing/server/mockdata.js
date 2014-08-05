// if the database is empty on server start, create some sample data.
Meteor.startup(function() {

	if (Patients.find().count() === 0) {
		var c = {
			name : "christian",
			surname : "dallago",
			birthdate : "02/07/1985",
			birthcity : "Bolzano",
			birthprovince : "BZ",
			sex : "m",
			weight : 75.3,
			height : 1.75,
			citizenship : "italian",
			maritalstatus : "married",
			street : "via something",
			streetnumber : "69/c",
			city : "tornoto",
			province : "BZ",
			country : "italy",
			taxcode : "CRDHDJ345JFDS",
			studylevel : "highschool",
			diabetes : false,
			allergies : ["paracetamol", "penicillin"],
		};

		var id = Patients.insert(c);

		/*
		 var myhosp = {
		 patientId: _patientID
		 nurseID: _currentUserId
		 ricoverydate: timestamp (Date.now() with possibility to change)
		 department: User.find(:department), allow to change
		 source: String (none, familydoc, programmed, transferred from other public, transferred from accredited private, transferred from unaccredited private, transferred from elsewhere, transferred from recovery, other)
		 type: String (programmed non urgent, urgent, TSO, voluntary, programmed with prehospitalization)
		 dateOfReservation: timestamp
		 priority: String (30d,60d,180d,1y as in 30 days, 60 days, 180 days, 1 year)
		 proposingDoctor: String (familydoc, hospitaldoc, agreeddoc, outofprovincedoc)
		 poposingDoctorCode: String
		 injuriesFrom: String (workplace, home, car accident, violence, selfviolence, sport injuries, other)
		 departmentOfStay: User.find(:department), allow to change, is the physical department where the patient stays at
		 bed: String
		 reason: String
		 }
		 */
	}

	/* Notifications -- {
	 * 	id: _id
	 * 	hospitalizationId: _idOfhospitalization
	 * 	nurseId: _CurrentUserId
	 * 	message: String
	 * 	attachment: File
	 * 	time: timestamp
	 * 	data : [{
	 * 		type: String (eg. t-cells, weight, insuline,...)
	 * 		value: String/Double (Depending on type)
	 * 		unit: String
	 * 	}]
	 */
	if (Notifications.find().count() === 0) {
		var timestamp = (new Date()).getTime();
		var noti = [{
			hospitalizationId : 1,
			nurseId : 1,
			message : "Blood samples are ready",
			attachment : "/archive/Hzk43m.jpg",
			time : timestamp,
			data : [{
				type : "glucose",
				value : 1.0,
				unit : "mmol/L"
			}, {
				type : "creatinine",
				value : 0.9,
				unit : "mg/dL"
			}]
		}, {

		}];

	/*
		var timestamp = (new Date()).getTime();
		for (var i = 0; i < data.length; i++) {
			var list_id = Lists.insert({
				name : data[i].name
			});
			for (var j = 0; j < data[i].contents.length; j++) {
				var info = data[i].contents[j];
				Todos.insert({
					list_id : list_id,
					text : info[0],
					timestamp : timestamp,
					tags : info.slice(1)
				});
				timestamp += 1;
				// ensure unique timestamp.
			}
		} */
	}
}); 