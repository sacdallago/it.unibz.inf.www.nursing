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

//Database stuff:

/* Notifications -- {
 * 	id: _id
 * 	message: String
 * 	attachment: File
 * 	time: timestamp
 * 	hospitalizationId: _idOfhospitalization
 */
Notifications = new Meteor.Collection("notifications");

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
 * 	name: String
 * 	surname: String
 * 	birthdate: timestamp
 *  street: String
 * 	streetnumber: String (could be '7A')
 * 	diabetes: boolean
 * 	allergies: [String]
 * 	hospitalizationIds: _idOfhospitalization1, _idOfhospitalization2,...
 */
Patients = new Meteor.Collection("patients");