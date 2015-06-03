Measures = new Meteor.Collection("measures");
measureslHandle = Meteor.subscribe('measures',{active:true},{});

Template.chart.helpers({
	graphTitle : function() {
		return Session.get('graphTitle');
	},
	display : function() {
		return Session.get('patientFilter') && Session.get('measureFilter');
	}
});

function showTooltip(x, y, contents, z) {
	$('<div id="flot-tooltip">' + contents + '</div>').css({
		position : "absolute",
		top : y - 30,
		//left : x - 135,
		'border-color' : z,
	}).appendTo(".card").fadeIn(200);
}

function showGraph() {
	var filter = {};
	//If I have selected a patient and ONE kind of measure
	if (Session.get('patientFilter')) {
		filter.patientId = Session.get('patientFilter');
	}
	if (Session.get('measureFilter')) {
		filter.type = Session.get('measureFilter');
	}
	/*  I find out the NAME of the measure and set it to some session variable
	 *  Here the structure of a measure in the database is helpful:
	 * 	
	 *	Measure: {
	 * 	  type : 'preassure',
	 *		fields : [{
	 *			preText: "Maximum preassure",
	 *			type: "number",
	 *			step: "any",
	 *			unit: "mmHg",
	 *			required: "required"
	 *		},
	 *		{
	 *			preText: "Minimum preassure",
	 *			type: "number",
	 *			step: "any",
	 *			unit: "mmHg",
	 *			required: "required"
	 *		}
	 *		]  }
	 */
	 var measure = Measures.findOne(filter);
	 Session.set('graphTitle',measure.type);

	 var labels = [];

	var charts = measure.fields; // Is an array, look above. This is used later to determine how many lines I have to draw
	
	var dataset = [];
	for (var i = 0; i < charts.length; i++) { //In weight I have one chart, in pressure I have two, aso...
		// USELESS--
		color = (100 + ((i + 1) * 10)) % 220;
		// --USELESS
		var obj = {
			label : charts[i].type,
			color : getRandomColor(), // Defined in client/lib/helpers.js
			data : []
		};
		if (!charts[i].unit) { //Measures can have no unit, like "YES/NO". For yes or no a line graph doesn't make sense, se we only display bar graphs, 1 meaning yes, 0 meaning no
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
				radius : 20,
				show : true
			};
			obj.yaxis = 2; // Axis 2 is defined as yes or no, se below
		} else {
			obj.lines = {
				show : true,
				fill: true
			};
			obj.points = {
				radius : 15,
				show : true,
				fill : true
			};
			obj.yaxis = 1; // This is conventional Y axis that adapts to the data
		}
		dataset.push(obj);
	}
	//The next find will find ALL elements (not just one like above) of that measure type for that patient
	Measures.find(filter, {
		sort : {
			timestamp : 1
		}
	}).forEach(function(element) {
		// For each of this elements, format the date and put it on the X axis...
		labels.push(dayTimeFormatter(element.timestamp));
		var count = 0;
		// ...and push the right data to the right graph (remember, I can have one measure with multiple lines)
		_.each(element.fields, function(field) {
			dataset[count].data.push([element.timestamp, field.value]);
			count++;
		});
	});

	// Plot is a library. These are just some settings
	$.plot($("#placeholder"), dataset, {
		xaxis : {
			mode : "time"
		},
		yaxes : [{
			axisLabel : "Right", //Conventional Y axis, adapts minumum and maximum to data
		}, {
			ticks : [[0, "No"], [1, "Yes"]], //The famous yes or no axis, where max is 1 == yes and min is 0 == no
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
	var previousPoint = null;
	// This is some fancy code that is responsible for clicks on points (dots). It basically just shows a box if you click on a point, and in the box there is a repetition of that data attribute
	$("#placeholder").bind("plotclick", function(event, pos, item) {
		if (item) {
			if ((previousPoint != item.dataIndex) || (previousLabel != item.series.label)) {
				previousPoint = item.dataIndex;
				previousLabel = item.series.label;

				$("#flot-tooltip").remove();

				var x = dayTimeFormatter(item.datapoint[0]), y = item.datapoint[1];
				z = item.series.color;

				if (!item.series.lines.show) {
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
	// The following big IF is the one responsible for the drawing of the graph if all conditions are met: patient selected, measure selected, all measures are loaded
	if (Session.get('patientFilter') && Session.get('measureFilter') && typeof measureslHandle !== 'undefined' && measureslHandle.ready()) {
		showGraph();
		// This next guy tells us to observe if I insert new data in the collection, I need to redraw the graph. Do you see a problem here?
		// EXACTLY! what happens if data is deleted? I should also redraw! This kinds of "mistakes" are the ones that need to be refactored! (but I'm not gonna add it, just to show you :D)
		Measures.find({}).observeChanges({
			added : function(item) {
				showGraph();
			}
		});
	}
});

//Accordion management
Template.measuresAccordion.onCreated(function(){
	this.opened = new ReactiveVar(false);
});

Template.measuresAccordion.onRendered(function(){
	var template = this;
	this.$(".ui.accordion").accordion({
		onOpen:function(){
			template.opened.set(true);
		},
		onClose:function(){
			template.opened.set(false);
		}
	});
});

Template.measuresAccordion.helpers({
	opened:function(){
		return Template.instance().opened.get();
	}
});

Template.measures.helpers({
	measures : function() {
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
			if (room) {
				element.bed = room.number + "" + room.bed;
			} else {
				element.bed = "NO BED ASSIGNED";
			}

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
	}
}); 

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

Template.measureTags.helpers({
	destroyed : function() {
		delete Session.keys['measureFilter'];
	},
	selected : function () {
		return Session.equals('measureFilter', this.type) ? 'label-info' : '';
	},  
	allSelected : function (){
		return (!Session.get('measureFilter'))?'label-info':'';
	},
	tags : function() {
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
	}
});

Template.measureTags.events({
	'click .tagFilter' : function(event) {
		var now = Session.get('measureFilter');
		if (now == this.type) {
			Session.set('measureFilter', null);
		} else {
			Session.set('measureFilter', this.type);
		}
	}
});