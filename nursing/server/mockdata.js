// if the database is empty on server start, create some sample data.
Meteor.startup(function() {
	//Db reset
	Meteor.users.remove({});
	Patients.remove({});
	Hospitalizations.remove({});
	Notifications.remove({});

	//Db mockdata
	Accounts.createUser({
		username : 'test',
		profile : {
			department : "cardiology",
			first : "mily",
			last : "serious"
		},
		password : 'password'
	});
	
	var c = {
		first : "hanna",
		last : "montana",
		birthdate : (new Date(1982, 11, 7).getTime()),
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
		allergies : ["paracetamol", "penicillin"]
	};

	var pid = Patients.insert(c);
	var user = Meteor.users.findOne({
		"username" : "test"
	});
	var timestamp = (new Date()).getTime();

	var myhosp = {
		patientId : pid,
		nurseID : user,
		ricoverydate : timestamp,
		department : user.profile.department,
		source : "programmed",
		type : "urgent",
		dateOfReservation : timestamp - 24,
		priority : "30d",
		proposingDoctor : "hospitaldoc",
		poposingDoctorCode : "TB",
		injuriesFrom : "other",
		departmentOfStay : user.profile.department,
		bed : "7B",
		reason : "Cardio-ventricular failure"
	}

	var hosp = Hospitalizations.insert(myhosp);
	Patients.update({'_id' : pid}, { $set: {hospitalizationIds: [hosp] }});
	
	var noti = [{
		hospitalizationId : hosp,
		nurseId : user,
		message : "Blood samples are ready",
		attachment : "/archive/Hzk43m.jpg",
		time : timestamp+2,
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
		hospitalizationId : hosp,
		nurseId : user,
		message : "Patient was wighted somewhere else!",
		time : timestamp+4,
		data : [{
			type : "weight",
			value : 45,
			unit : "kg"
		}]
	}];
	
	for(var i = 0; i<noti.length; i++){
		Notifications.insert(noti[i]);
	}

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
});
