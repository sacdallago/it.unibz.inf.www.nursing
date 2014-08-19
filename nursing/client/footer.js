Template.footer.settings = function() {
  return {
   position: "top",
   limit: 5,
   rules: [
     {
       collection: Patients,
       field: "first",
       template: Template.patientPill,
       selector: function(match){
  			var regex = new RegExp("^"+match, 'i');
  			return {$or: [{'first': regex}, {'last': regex}]};},
  		callback : function(doc,element){
  			Session.set('patientFilter', doc._id);
  		}
     },
   ]
  };
};

Template.footer.helpers({
	nameSelected : function(){
		return Session.get('patientFilter');
	},
	patientName: function(){
		var patient = Patients.findOne(Session.get('patientFilter'));
		return niceName(patient.first,patient.last);
	}
});

Template.footer.events({
	'click h4' : function(){
		Session.set('patientFilter', null);
	}
});
