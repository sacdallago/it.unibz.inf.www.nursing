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
            identifier : 'last',
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
        },
        passwordRepeat: {
            identifier : 'passwordRepeat',
            rules: [
                {
                    type   : 'match[password]',
                    prompt : 'Your passwords don\'t match!'
                }
            ]
        },
        passwordRepeat: {
            identifier : 'authPassword',
            rules: [
                {
                    type   : 'is[22]',
                    prompt : 'Wrong auth password'
                },
            ]
        }
    }, {
        onSuccess: function(){
            Accounts.createUser({
                profile : {
                    first : first.value,
                    last : last.value,
                    department : department.value,
                    message : {
                        message : "",
                        data : [{
                            type : "",
                            value : "",
                            unit : ""
                        }]
                    }
                },
                username : username.value,
                password : password.value
            }, function(err) {
                if (err) {
                    Notifications.error('Error!', 'Failed to create user. Please contact administrators.');
                } else {
                    location.reload();
                }
            });
        }
    });
};

Template.registrationform.events({
    'click .ui.blue.button' : function(e, t) {
        e.preventDefault();
        Router.go('loginform');
    }
}); 