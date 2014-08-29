Measures = new Meteor.Collection("measures");

measuresHandle = null;

Template.chart.helpers({
	graphTitle : function() {
		return Session.get('graphTitle');
	}
});

function showTooltip(x, y, contents, z) {
	$('<div id="flot-tooltip">' + contents + '</div>').css({
		position : "absolute",
		top : y - 30,
		left : x - 135,
		'border-color' : z,
	}).appendTo(".card").fadeIn(200);
}

function showGraph() {
	var filter = {};
	if (Session.get('patientFilter')) {
		filter.patientId = Session.get('patientFilter');
	}
	if (Session.get('measureFilter')) {
		filter.type = Session.get('measureFilter');
	}
	var labels = [];
	var measure = Measures.findOne(filter);
	Session.set('graphTitle',measure.type);
	var charts = measure.fields;
	var dataset = [];
	for (var i = 0; i < charts.length; i++) {
		color = (100 + ((i + 1) * 10)) % 220;
		var obj = {
			label : charts[i].type,
			color : getRandomColor(),
			data : []
		};
		if (!charts[i].unit) {
			obj.bars = {
				show : true,
				align : "center",
				barWidth : 0,
				lineWidth : 0
			};
			obj.lines = {
				show : false
			};
			obj.points = {
				radius : 9,
				show : true
			};
			obj.yaxis = 2;
		} else {
			obj.lines = {
				show : true
			};
			obj.points = {
				radius : 6,
				show : true,
				fill : true
			};
			obj.yaxis = 1;
		}
		dataset.push(obj);
	}
	Measures.find(filter, {
		sort : {
			timestamp : 1
		}
	}).forEach(function(element) {
		labels.push(dayTimeFormatter(element.timestamp));
		var count = 0;
		_.each(element.fields, function(field) {
			dataset[count].data.push([element.timestamp, field.value]);
			count++;
		});
	});

	$.plot($("#placeholder"), dataset, {
		xaxis : {
			mode : "time"
		},
		yaxes : [{
			axisLabel : "Right",

		}, {
			ticks : [[0, "No"], [1, "Yes"]],
			max : 1,
			min : 0
		}],

		grid : {
			hoverable : true,
			clickable : true
		},
		legend : {
			show : true,
			container : '#legendholder'
		}
	});
	$("#placeholder").bind("plothover", function(event, pos, item) {
		if (item) {
			if ((previousPoint != item.dataIndex) || (previousLabel != item.series.label)) {
				previousPoint = item.dataIndex;
				previousLabel = item.series.label;

				$("#flot-tooltip").remove();

				var x = dayTimeFormatter(item.datapoint[0]), y = item.datapoint[1];
				z = item.series.color;

				if (item.datapoint[2] != null) {
					y = y == 0 ? "No" : "Yes";
				}

				showTooltip(item.pageX, item.pageY, "<b>" + item.series.label + "</b><br /> " + x + " = " + y, z);
			}
		} else {
			$("#flot-tooltip").remove();
			previousPoint = null;
		}
	});
}

Deps.autorun(function(c) {
	if (Session.get('patientFilter') && Session.get('measureFilter') && typeof measureslHandle !== 'undefined' && measureslHandle.ready()) {
		showGraph();
		Measures.find({}).observeChanges({
			added : function(item) {
				showGraph();
			}
		});
	}
});

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
	delete Session.keys['measureFilter','graphTitle'];
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
