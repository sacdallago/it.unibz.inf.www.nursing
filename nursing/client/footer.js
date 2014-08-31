Template.footer.settings = function() {
	return {
		position : "top",
		limit : 5,
		rules : [{
			collection : Patients,
			field : "first",
			template : Template.patientPill,
			selector : function(match) {
				var regex = new RegExp("^" + match, 'i');
				return {
					$or : [{
						'first' : regex
					}, {
						'last' : regex
					}]
				};
			},
			callback : function(doc, element) {
				Session.set('patientFilter', doc._id);
				Session.set('hospitalizationFilter', Hospitalizations.findOne({
					patientId : doc._id
				})._id);
			}
		}]
	};
};

Template.patientPill.helpers({
	room : function() {
		var room = Rooms.findOne({
			patientId : this._id
		});
		if (room) {
			return room.number + room.bed;
		}
		return null;
	}
});

Template.footer.helpers({
	nameSelected : function() {
		return Session.get('patientFilter');
	},
	patientName : function() {
		var patient = Patients.findOne(Session.get('patientFilter'));
		var room = Rooms.findOne({
			'patientId' : patient._id
		});
		if (room) {
			return niceName(patient.first, patient.last) + ", " + room.number + "" + room.bed;
		}
		return niceName(patient.first, patient.last);
	}
});

Template.footer.events({
	'click h4' : function() {
		Session.set('patientFilter', null);
		Session.set('hospitalizationFilter', null);
	}
});
