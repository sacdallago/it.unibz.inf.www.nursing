//Subscribe to the nurses, so you know the nurses of the hospital
//To subscribe you must also activate the publication in the server part (server/collections.js)
//Meteor.subscribe("nurses");

//Login
Template.loginform.events({
	'submit #login-form' : function(e, t) {
		e.preventDefault();

		var username = t.find('#login-username').value, password = t.find('#login-password').value;

		Meteor.loginWithPassword(username, password, function(err) {
			if (err) {
				Notifications.warn('Errore di login', 'Controlla le tue credenziali di accesso');
			} else {
				Router.go('registrationform');
			}
		});
		return false;
	},
	'click #create-account' : function(e, t) {
		e.preventDefault();
		Router.go('registrationform');
	}
});

//Registration
Template.registrationform.departments = Departments;
//See client/lib/helpers.js

Template.registrationform.events({
	'submit #register-form' : function(e, t) {
		e.preventDefault();
		// retrieve the input field values
		var first = t.find('#account-first').value,
		last = t.find('#account-last').value,
		username = t.find('#account-username').value,
		//email = t.find('#account-email').value,
		password = t.find('#account-password').value,
		passwordCheck = t.find('#account-password-repeat').value,
		admin = t.find('#admin-password').value,
		department = t.find('#account-department').value;

		if (first && last && username && password && passwordCheck && admin && department) {
			if (password == passwordCheck) {
				if (admin % 2 == 0) {
					if (username.length >= 3 && username.length <= 15) {
						//Yay, it worked!

						Accounts.createUser({
							profile : {
								first : first,
								last : last,
								department : department,
								message : {
									message : "",
									data : [{
										type : "",
										value : "",
										unit : ""
									}]
								}
							},
							username : username,
							//email : email,
							password : password
						}, function(err) {
							if (err) {
								Notifications.error('Error!', "Tentativo di creare l'utente fallito contattare gli amministratori");
							} else {
								//autoroute
							}
						});

						return false;
					} else {
						Notifications.warn('Warning:', 'Username deve avere almeno 3 caratteri e non più di 15!');
						throw new Meteor.Error(403, "Username deve avere almeno 3 caratteri e non più di 15!");
					}
				} else {
					Notifications.warn('Warning:', 'Ci dispiace, ma non è autorizzato a registrarsi');
					throw new Meteor.Error(403, "Ci dispiace, ma non è autorizzato a registrarsi");
				}
			} else {
				Notifications.warn('Warning:', 'La password e la conferma non corrispondono');
				throw new Meteor.Error(403, "La password e la conferma non corrispondono");
			}
		} else {
			Notifications.warn('Warning:', 'Per favore compilare tutti i campi');
			throw new Meteor.Error(403, "Per favore compilare tutti i campi");
		}
	},
	'click #account-signin' : function(e, t) {
		e.preventDefault();
		Router.go('loginform');
	}
}); 