Measures = new Meteor.Collection("measures");

measuresHandle = null;

Template.measures.helpers({
	measureSelected : function() {
		return Session.get('measureFilter');
	},
	patientSelected : function() {
		return Session.get('patientFilter');
	},
});

Template.chart.rendered = function() {
	var filter = {};
	if (Session.get('patientFilter')) {
		filter.patientId = Session.get('patientFilter');
	}
	if (Session.get('measureFilter')) {
		filter.type = Session.get('measureFilter');
	}
	var labels = [];
	var charts = Measures.findOne(filter).fields.length;
	console.log(charts);
	var dataset = [];
	for (var i = 0; i < charts; i++) {
		color = (100 + ((i + 1) * 10)) % 220;
		dataset.push({
			fillColor : "rgba(" + color + "," + color + "," + color + ",0.5)",
			strokeColor : "rgba(" + color + "," + color + "," + color + ",1)",
			pointColor : "rgba(" + color + "," + color + "," + color + ",1)",
			pointStrokeColor : "#fff",
			data : []
		});
	}
	var measures = Measures.find(filter, {
		sort : {
			timestamp : 1
		}
	}).forEach(function(element) {
		labels.push(dayTimeFormatter(element.timestamp));
		var count = 0;
		_.each(element.fields, function(field) {
			dataset[count].data.push(field.value);
			count++;
		});
	});
	console.log(labels);
	console.log(dataset);
	var data = {
		labels : labels,
		datasets : dataset
	};

	//Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#chart").get(0).getContext("2d");
	//ctx.canvas.width  = .innerWidth;
	//ctx.canvas.height = window.innerHeight;
	//This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);

	new Chart(ctx).Line(data);
};

Template.measureItems.measures = function() {
	var filter = {};
	if (Session.get('patientFilter')) {
		filter.patientId = Session.get('patientFilter');
	}
	if (Session.get('measureFilter')) {
		filter.type = Session.get('measureFilter');
	}
	return Measures.find(filter, {
		sort : {
			timestamp : -1
		}
	}).map(function(element) {

		var patient = Patients.findOne(element.patientId);
		element.patientName = niceName(patient.first, patient.last);

		var room = Rooms.findOne({
			'patientId' : element.patientId
		});
		element.bed = room.number + "" + room.bed;

		element.date = dateFormatter(element.timestamp);

		if (element.journalId) {
			element.problemSubject = Journal.findOne(element.journalId).subject.capitalize();
		}

		_.each(element.fields, function(field) {
			if (!field.unit) {
				field.checkbox = field.value == 0 ? "No" : "Yes";
			}
		});

		element.type = element.type.capitalize();

		var nurse = Meteor.users.findOne(element.nurseId);
		element.nurseName = niceName(nurse.profile.first, nurse.profile.last);

		return element;
	});
};

Template.measureItems.helpers({
	noPatientSelected : function() {
		return !Session.get('patientFilter');
	},
	problems : function() {
		return Journal.find({
			subject : {
				$exists : true
			},
			patientId : this.patientId,
			$or : [{
				solved : false
			}, {
				solved : {
					$exists : false
				}
			}]
		});
	}
});

Template.measureItems.events({
	'change select' : function(event) {
		var problemId = $(event.currentTarget).find(':selected').data("problemid");
		Measures.update({
			_id : this._id
		}, {
			$set : {
				journalId : problemId
			}
		});
	},
	'click .label' : function(event) {
		event.preventDefault();
		Measures.update({
			_id : this._id
		}, {
			$unset : {
				journalId : ""
			}
		});
	},
	'click .delete' : function(event) {
		event.preventDefault();
		Measures.remove(this._id, function(error) {
			if (error) {
				Notifications.error("Whops", "Couldn't remove measurement");
			} else {
				Notifications.success("Success", "Removed measurement");
			}
		});
	}
});

Template.measureTags.destroyed = function() {
	delete Session.keys['measureFilter'];
};

Template.measureTags.tags = function() {
	var tag_infos = [];
	var total_count = 0;

	var filter = {};
	if (Session.get('patientFilter')) {
		filter.patientId = Session.get('patientFilter');
	}

	Measures.find(filter).forEach(function(measure) {
		var tag_info = _.find(tag_infos, function(element) {
			return element.type === measure.type;
		});
		if (!tag_info)
			tag_infos.push({
				type : measure.type,
				count : 1
			});
		else
			tag_info.count++;

		total_count++;
	});

	tag_infos = _.sortBy(tag_infos, function(x) {
		return x.type;
	});

	tag_infos.unshift({
		type : null,
		count : total_count
	});

	return tag_infos;
};

Template.measureTags.events({
	'click .tag' : function(event) {
		var now = Session.get('measureFilter');
		if (now == this.type) {
			Session.set('measureFilter', null);
		} else {
			Session.set('measureFilter', this.type);
		}
	}
});
