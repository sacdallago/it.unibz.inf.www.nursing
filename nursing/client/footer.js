Template.patientPill.helpers({
    room : function() {
        var room = Rooms.findOne({
            patientId : this._id
        });
        if (room) {
            return room.number + room.bed;
        }
        return null;
    },
    hospitalization : function(){
        var hospitalization = Hospitalizations.findOne({
            patientId : this._id
        });
        if (hospitalization) {
            return hospitalization;
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
    },
    settings : function() {
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
                }
            }]
        };
    }
});

Template.footer.events({
    'click .pointer' : function() {
        Session.set('patientFilter', null);
        Session.set('hospitalizationFilter', null);
    },
    'click .plus.icon' : function(event) {
       $('#addOptions').modal('show');
    },
    "autocompleteselect input": function(event, template, doc) {
        Session.set('patientFilter', doc._id);
        var hosp = Hospitalizations.findOne({
            patientId : doc._id
        });
        if(hosp){
            Session.set('hospitalizationFilter', hosp._id);
        }
    }
});
