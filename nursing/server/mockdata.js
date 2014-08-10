// if the database is empty on server start, create some sample data.
Meteor.startup(function() {
	//Db reset
	Meteor.users.remove({});
	Patients.remove({});
	Hospitalizations.remove({});
	Messages.remove({});

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
		birthdate : dateFormatter((new Date(1982, 11, 7).getTime())),
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
	var patient = Patients.findOne(pid);
	var user = Meteor.users.findOne({
		"username" : "test"
	});
	var timestamp = (new Date()).getTime();

	var myhosp = {
		patientId : pid,
		nurseId : user,
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
	};

	var hosp = Hospitalizations.insert(myhosp);
	Patients.update({
		'_id' : pid
	}, {
		$set : {
			hospitalizationIds : [hosp]
		}
	});
	
	for (var i = 0; i < 50; i++) {
		var noti = {
			hospitalizationId : hosp,
			patientId : pid,
			bed : myhosp.bed,
			patientName : niceName(patient.first, patient.last),
			nurseId : user,
			nurseName : niceName(user.profile.first, user.profile.last),
			target : 'cardiology',
			message : "Blood samples are ready",
			attachment : "/archive/Hzk43m.jpg",
			timestamp : (new Date(2014, 8, 7+i).getTime()),
			date: dateFormatter(new Date(2014, 8, 7+i%9).getTime()),
			data : [{
				type : "glucose",
				value : 1.0,
				unit : "mmol/L"
			}, {
				type : "creatinine",
				value : 0.9,
				unit : "mg/dL"
			}]
		};
		Messages.insert(noti);
	}
});
