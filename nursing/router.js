(function() {
	Router.configure({
		templateNameConverter : 'upperCamelCase'
	});

	//Router.onBeforeAction('loading');

	Router.map(function() {
		this.route('registrationform', {
			path : '/signup',
			onBeforeAction : function() {
				this.next();
			},
			onAfterAction : function() {
			},
			onRun : function() {
				if (Meteor.userId())
					this.redirect('home');
			}
		});
		this.route('loginform', {
			path : '/signin',
			onBeforeAction : function() {
				this.next();
			},
			onAfterAction : function() {
			},
			onRun : function() {
				if (Meteor.userId())
					this.redirect('home');
			}
		});
		this.route('goodbye', {
			path : '/goodbye',
			onBeforeAction : function() {
				this.next();
			},
			onAfterAction : function() {
			},
			onRun : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('home', {
			path : '/',
			onBeforeAction : function() {
				Meteor.subscribe('journal', {
					subject : {
						$exists : true
					}
				}, {});
				this.next();
			},
			onAfterAction : function() {
			},
			onRun : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('reminders', {
			path : '/reminders',
			onBeforeAction : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
				this.next();
			},
			onAfterAction : function() {
			},
			onRun : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('journal', {
			path : '/journal',
			onBeforeAction : function() {
				if (Meteor.userId()) {
					Session.set('newJournals', 0);
				}
				this.next();
			},
			onAfterAction : function() {
			},
			onRun : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('measures', {
			path : '/measures',
			onBeforeAction : function() {
				if (Meteor.userId()) {

				}
				this.next();
			},
			onAfterAction : function() {
			},
			onRun : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('problems', {
			path : '/problems',
			onBeforeAction : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
				this.next();
			},
			onRun : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
			},
			onAfterAction : function() {
			}
		});
	});
})();
