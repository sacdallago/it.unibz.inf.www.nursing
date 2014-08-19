(function(){Router.configure({
	templateNameConverter : 'upperCamelCase'
});

//Router.onBeforeAction('loading');

Router.map(function() {
	this.route('registrationform', {
		path : '/signup',
		onBeforeAction: function() {
      		if (Meteor.user())
        	this.redirect('beds');
   		},
   		onAfterAction: function() {
      		if (Meteor.user())
        	this.redirect('beds');
   		}
	});
	this.route('loginform', {
		path: '/',
		onBeforeAction: function() {
      		if (Meteor.user())
        	this.redirect('beds');
   		},
   		onAfterAction: function() {
      		if (Meteor.user())
        	this.redirect('beds');
   		}
	});
	this.route('goodbye', {
		path : '/goodbye',
		onBeforeAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		},
   		onAfterAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		}
	});
	this.route('beds', {
		path : '/beds',
		onBeforeAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		},
   		onAfterAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		}
	});
	this.route('messages', {
		path : '/messages',
		onBeforeAction: function() {
      		if (!Meteor.user()){
      			this.redirect('loginform');
      		} else {
      		}
   		},
   		onAfterAction: function() {
      		if (!Meteor.user()){
      			this.redirect('loginform');
      		} else {
      			Session.set('unreadMessages', 0);
      		}
   		}
	});
	this.route('alerts', {
		path : '/alerts',
		onBeforeAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		},
   		onAfterAction: function() {
      		if (!Meteor.user())
        	this.redirect('loginform');
   		}
	});

  this.route('rooms', {
    path : '/rooms',
    onBeforeAction: function() {
          if (!Meteor.user())
          this.redirect('loginform');
      },
      onAfterAction: function() {
          if (!Meteor.user())
          this.redirect('loginform');
      }
  });
});

})();
