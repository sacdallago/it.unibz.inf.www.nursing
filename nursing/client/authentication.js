//Subscribe to the nurses, so you know the nurses of the hospital
//To subscribe you must also activate the publication in the server part (server/collections.js)
//Meteor.subscribe("nurses");

//Login
Template.loginform.events({
    'click .ui.blue.button' : function(e, t) {
        e.preventDefault();
        Router.go('registrationform');
    }
});

Template.loginform.rendered = function() {
    this.$('.ui.form').form({
        username: {
            identifier : 'username',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a username'
                }
            ]
        },
        password: {
            identifier : 'password',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a password'
                },
                {
                    type   : 'length[6]',
                    prompt : 'Your password must be at least 6 characters'
                }
            ]
        }
    }, {
        onSuccess: function(){
            Meteor.loginWithPassword(username.value, password.value, function(err) {
                if (err) {
                    Notifications.warn('Could not login!', 'Please check your credentials.');
                } else {
                    location.reload();
                }
            });
        }
    });
};

//Registration
Template.registrationform.departments = Departments;
//See client/lib/helpers.js

Template.registrationform.rendered = function() {
    this.$('.ui.search.dropdown').dropdown();
    this.$('.ui.form').form({
        first: {
            identifier : 'first',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter your First Name'
                }
            ]
        },
        last: {
            identifier : 'username',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter your Last Name'
                }
            ]
        },
        department: {
            identifier : 'department',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a department'
                }
            ]
        },
        username: {
            identifier : 'username',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a username'
                }
            ]
        },
        password: {
            identifier : 'password',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a password'
                },
                {
                    type   : 'length[6]',
                    prompt : 'Your password must be at least 6 characters'
                }
            ]
        }
    }, {
        onSuccess: function(){
            Meteor.loginWithPassword(username.value, password.value, function(err) {
                if (err) {
                    Notifications.warn('Could not login!', 'Please check your credentials.');
                } else {
                    location.reload();
                }
            });
        }
    });
};

Template.registrationform.events({
    'submit #register-form' : function(e, t) {
        e.preventDefault();
        // retrieve the input field values
        var first = t.find('#account-first').value, last = t.find('#account-last').value, username = t.find('#account-username').value, email = t.find('#account-email').value, password = t.find('#account-password').value, passwordCheck = t.find('#account-password-repeat').value, admin = t.find('#admin-password').value, department = t.find('#account-department').value;

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
                            email : email,
                            password : password
                        }, function(err) {
                            if (err) {
                                Notifications.error('Error!', 'Failed to create user. Please contact administrators.');
                            } else {
                                //autoroute
                            }
                        });

                        return false;
                    } else {
                        Notifications.warn('Warning:', 'Username must have at least 3 characters and not more than 15!');
                        throw new Meteor.Error(403, "Username must have at least 3 characters and not more than 15!");
                    }
                } else {
                    Notifications.warn('Warning:', 'Sorry, you are not authorized to register!');
                    throw new Meteor.Error(403, "Sorry, you are not authorized to register!");
                }
            } else {
                Notifications.warn('Warning:', 'The password and its check do not match!');
                throw new Meteor.Error(403, "The password and its check do not match!");
            }
        } else {
            Notifications.warn('Warning:', 'Please fill out all fields');
            throw new Meteor.Error(403, "Please fill out all fields");
        }
    },
    'click #account-signin' : function(e, t) {
        e.preventDefault();
        Router.go('loginform');
    }
}); 