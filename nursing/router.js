(function() {
	Router.configure({
		templateNameConverter : 'upperCamelCase',
		layoutTemplate: 'scheleton',
		loadingTemplate: 'loading'
	});
	Router.map(function() {
		this.route('home', {
			path : '/',
			waitOn: function () {
		      return Meteor.subscribe('journal', {
		          subject : {
		            $exists : true
		          }
		        }, {});
		    },
			onRun : function() {
				if (!Meteor.userId()){
					this.redirect('/signin');
				}
				this.next();
			},
			action: function () {
    			//regions
    			this.render('modals', {to: 'modals'});
    			this.render('navigation', {to: 'navigation'});
    			this.render('footer', {to: 'footer'});
    			//main
    			this.render('home');
  			}
		});
		this.route('loginform', {
			path : '/signin',
			onRun : function() {
				if (Meteor.userId()){
						this.redirect('/');
				}
				this.next();
			},
			action: function () {
    			this.render('loginform');
  			}
		});
		this.route('registrationform', {
			path : '/signup',
			onRun : function() {
				if (Meteor.userId()){
						this.redirect('/');
				}
				this.next();
			},
			action: function () {
    			this.render('registrationform');
  			}
		});
		this.route('goodbye', {
			path : '/goodbye',
			onRun : function() {
				if (!Meteor.userId()){
					this.redirect('/signin');
				}
				this.next();
			},
			action: function () {
    			this.render('goodbye');
  			}
		});
		this.route('reminders', {
			path : '/reminders',
			onRun : function() {
				if (!Meteor.userId()){
					this.redirect('/signin');
				}
				this.next();
			},
			action: function () {
    			this.render('reminders');
    			//regions
    			this.render('modals', {to: 'modals'});
    			this.render('navigation', {to: 'navigation'});
    			this.render('footer', {to: 'footer'});
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
			onRun : function() {
				if (!Meteor.userId()){
					this.redirect('/signin');
				}
				this.next();
			},
			action: function () {
    			this.render('journal');
    			//regions
    			this.render('modals', {to: 'modals'});
    			this.render('navigation', {to: 'navigation'});
    			this.render('footer', {to: 'footer'});
  			}
		});
		this.route('measures', {
			path : '/measures',
			onRun : function() {
				if (!Meteor.userId()){
					this.redirect('/signin');
				}
				this.next();
			},
			action: function () {
    			this.render('measures');
    			//regions
    			this.render('modals', {to: 'modals'});
    			this.render('navigation', {to: 'navigation'});
    			this.render('footer', {to: 'footer'});
  			}
		});
		this.route('problems', {
			path : '/problems',
			onRun : function() {
				if (!Meteor.userId()){
					this.redirect('/signin');
				}
				this.next();
			},
			action: function () {
    			this.render('problems');
    			//regions
    			this.render('modals', {to: 'modals'});
    			this.render('navigation', {to: 'navigation'});
    			this.render('footer', {to: 'footer'});
  			}
		});
	});
})();
