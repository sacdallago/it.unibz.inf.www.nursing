(function() {
	Router.configure({
		templateNameConverter : 'upperCamelCase'
	});

	//Router.onBeforeAction('loading');

	Router.map(function() {
		this.route('registrationform', {
			path : '/signup',
			onBeforeAction : function() {
				if (Meteor.user())
					this.redirect('home');
			},
			onAfterAction : function() {
				if (Meteor.user())
					this.redirect('home');
			}
		});
		this.route('loginform', {
			path : '/',
			onBeforeAction : function() {
				if (Meteor.user())
					this.redirect('home');
			},
			onAfterAction : function() {
				if (Meteor.user())
					this.redirect('home');
			}
		});
		this.route('goodbye', {
			path : '/goodbye',
			onBeforeAction : function() {
				if (!Meteor.user())
					this.redirect('loginform');
			},
			onAfterAction : function() {
				if (!Meteor.user())
					this.redirect('loginform');
			}
		});
		this.route('home', {
			path : '/home',
			onBeforeAction : function() {
				if (!Meteor.user())
					this.redirect('loginform');
			},
			onAfterAction : function() {
				if (!Meteor.user())
					this.redirect('loginform');
			}
		});
		this.route('reminders', {
			path : '/reminders',
			onBeforeAction : function() {
				if (!Meteor.user())
					this.redirect('loginform');
			},
			onAfterAction : function() {
				if (!Meteor.user())
					this.redirect('loginform');
			}
		});

		this.route('journal', {
			path : '/journal',
			onBeforeAction : function() {
				if (!Meteor.user()){
					this.redirect('loginform');
				} else {
					journalHandle = Meteor.subscribe('journal');
				}
			},
			onAfterAction : function() {
				if (!Meteor.user())
					this.redirect('loginform');
			}
		});
	});
})();
