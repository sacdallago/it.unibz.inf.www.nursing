// if the database is empty on server start, create some sample data.
Meteor.startup(function() {
	var msg = [];
	msg.push("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut odio. Nam sed est. Nam a risus et est iaculis adipiscing. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer ut justo. In tincidunt viverra nisl. Donec dictum malesuada magna. Curabitur id nibh auctor tellus adipiscing pharetra. Fusce vel justo non orci semper feugiat. Cras eu leo at purus ultrices tristique.\n\n"); 
	msg.push("Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\n\n"); 
	msg.push("Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.\n\n"); 
	msg.push("Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\n\n"); 
	msg.push("Cras consequat magna ac tellus. Duis sed metus sit amet nunc faucibus blandit. Fusce tempus cursus urna. Sed bibendum, dolor et volutpat nonummy, wisi justo convallis neque, eu feugiat leo ligula nec quam. Nulla in mi. Integer ac mauris vel ligula laoreet tristique. Nunc eget tortor in diam rhoncus vehicula. Nulla quis mi. Fusce porta fringilla mauris. Vestibulum sed dolor. Aliquam tincidunt interdum arcu. Vestibulum eget lacus. Curabitur pellentesque egestas lectus. Duis dolor. Aliquam erat volutpat. Aliquam erat volutpat. Duis egestas rhoncus dui. Sed iaculis, metus et mollis tincidunt, mauris dolor ornare odio, in cursus justo felis sit amet arcu. Aenean sollicitudin. Duis lectus leo, eleifend mollis, consequat ut, venenatis at, ante.\n\n"); 
	msg.push("Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\n"); 
	
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
	
	Accounts.createUser({
		username : 'test1',
		profile : {
			department : "oncology",
			first : "some",
			last : "dude"
		},
		password : 'password'
	});
	
	Accounts.createUser({
		username : 'test2',
		profile : {
			department : "odontology",
			first : "hey",
			last : "imcool"
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
			readBy: 0,
			target : 'cardiology',
			message : "Message n."+i+": "+msg[i%6],
			attachment : "/archive/Hzk43m.jpg",
			timestamp : (new Date(2014, 8, 7+i%9).getTime()),
			date: dateFormatter(new Date(2014, 8, 7+i).getTime()),
			data : [{
				type : "glucose" + i % 5,
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
	for (var i = 0; i < 50; i++) {
		var noti = {
			hospitalizationId : hosp,
			patientId : pid,
			bed : myhosp.bed,
			patientName : niceName(patient.first, patient.last),
			nurseId : user,
			nurseName : niceName(user.profile.first, user.profile.last),
			readBy: 0,
			target : 'odontology',
			message : "Message n."+i+": "+msg[i%6],
			attachment : "/archive/Hzk43m.jpg",
			timestamp : (new Date(2014, 8, 7+i%9).getTime()),
			date: dateFormatter(new Date(2014, 8, 7+i).getTime()),
			data : [{
				type : "glucose" + i % 5,
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
	for (var i = 0; i < 50; i++) {
		var noti = {
			hospitalizationId : hosp,
			patientId : pid,
			bed : myhosp.bed,
			patientName : niceName(patient.first, patient.last),
			nurseId : user,
			nurseName : niceName(user.profile.first, user.profile.last),
			readBy: 0,
			target : 'oncology',
			message : "Message n."+i+": "+msg[i%6],
			attachment : "/archive/Hzk43m.jpg",
			timestamp : (new Date(2014, 8, 7+i%9).getTime()),
			date: dateFormatter(new Date(2014, 8, 7+i).getTime()),
			data : [{
				type : "glucose" + i % 5,
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
