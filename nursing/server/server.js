/* Use if you want to have email in app. In that case users MUST register email and it shall be limited to the domain name (hospita-server.local)
Meteor.startup(function () {
process.env.MAIL_URL = 'smtp://nurse%40hospital-server.unibz.it:password@hospital-server.unibz.it:25';
});
*/

// Validate username, sending a specific error message on failure.
Accounts.validateNewUser(function(user) {
	if (user.username && user.username.length >= 3 && user.username.length <= 15)
		return true;
	throw new Meteor.Error(403, "Username must have at least 3 characters and not more than 15!");
});

// Validate username, without a specific error message.
Accounts.validateNewUser(function(user) {
	return user.username !== "root";
});

//Disable user registration
Accounts.config({
	//Activate the following and users will not be able to register!
	//forbidClientAccountCreation : true,
	sendVerificationEmail : true
});

//Helper collections
Navigation = new Meteor.Collection("navigation");

Meteor.publish('navigation', function(language) {
	if(this.userId){
		return Navigation.find({'language': { $regex:'^'+language}}); 
	} else {
		return null;
	}
});

Warnings = new Meteor.Collection("warnings");

Meteor.publish('warnings', function() {
	if(this.userId){
		return Warnings.find({});
	} else {
		return null;
	}
});

//Have a look at this!
Warnings.allow({
  insert: function (userId, party) {
    return false;
  }
});

Warnings.remove({});

Meteor.methods({
	removeWarnings: function(){
		Warnings.remove({});
		console.log("Removed warnings...");
		return true;
	}
});

//Database stuff:

/* Messages -- {
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
Messages = new Meteor.Collection("messages");

/* Alerts -- {
 * 	id: _id
 * 	message: String
 * 	time: timestamp
 * 	due: due-date
 * 	hospitalizationId: _idOfhospitalization
 */
Alerts = new Meteor.Collection("alerts");

/* Patients -- {
 * 	id: _id
 * 	first: String
 * 	last: String
 * 	birthdate: timestamp
 * 	birthcity: String
 * 	birthprovince: String
 * 	sex: String (m/f)
 * 	weight: double (in kg)
 * 	height: double (in meters)
 * 	citizenship: String
 * 	maritalstatus: String (single, married, separated, divorced, vidow, undeclared)
 *  street: String
 * 	streetnumber: String (could be '7A')
 * 	city: String
 * 	province: String
 * 	country: String
 * 	taxcode: String
 * 	studylevel: String (none or elementary, middleschool, highschool, undergraduate, graduate)
 * 	diabetes: boolean
 * 	allergies: [String]
 * 	hospitalizationIds: _idOfhospitalization1, _idOfhospitalization2,...
 */
Patients = new Meteor.Collection("patients");

/* Hospitalizations -- {
 * 	id: _id
 * 	patientId: _patientID
 * 	nurseID: _currentUserId
 * 	ricoverydate: timestamp (Date.now() with possibility to change)
 * 	department: User.find(:department), allow to change
 *  source: String (none, familydoc, programmed, transferred from other public, transferred from accredited private, transferred from unaccredited private, transferred from elsewhere, transferred from recovery, other)
 * 	type: String (programmed non urgent, urgent, TSO, voluntary, programmed with prehospitalization)
 * 	dateOfReservation: timestamp
 * 	priority: String (30d,60d,180d,1y as in 30 days, 60 days, 180 days, 1 year)
 * 	proposingDoctor: String (familydoc, hospitaldoc, agreeddoc, outofprovincedoc)
 * 	poposingDoctorCode: String
 * 	injuriesFrom: String (workplace, home, car accident, violence, selfviolence, sport injuries, other)
 * 	departmentOfStay: User.find(:department), allow to change, is the physical department where the patient stays at
 * 	bed: String
 * 	reason: String
 * 	... (see 5 with marina and some examples)
 * 	
 */
Hospitalizations = new Meteor.Collection("hospitalizations");

/* Notes (as in infermieristic note. Here go copies of all messages + the infermieristic notes (consegna))-- {
 * 	id: _id
 * 	hospitalizationId: _hospitalizationId
 *	nurseId: _currentUserId
 * 	message: String
 * 	attachment: File
 * 	time: timestamp
 * 	data : [{
 * 		type: String (eg. t-cells, weight, insuline, temperature,...)
 * 		value: String/Double (Depending on type)
 * 		unit: String
 * 	}]
 */
Notes = new Meteor.Collection("notes");

//Security first
Meteor.publish('notes', function() {
  if(this.userId){
		return Notes.find(); 
	} else {
		return null;
	} 
});
Meteor.publish('messages', function() {
  if(this.userId){
		return Messages.find(); 
	} else {
		return null;
	}
});
Meteor.publish('hospitalizations', function() {
  if(this.userId){
		return Hospitalizations.find(); 
	} else {
		return null;
	}
});
Meteor.publish('patients', function() {
  if(this.userId){
		return Patients.find(); 
	} else {
		return null;
	} 
});
Meteor.publish('alerts', function() {
  if(this.userId){
		return Alerts.find(); 
	} else {
		return null;
	} 
});

