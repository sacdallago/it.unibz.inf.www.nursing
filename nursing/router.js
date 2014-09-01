(function() {
	Router.configure({
		templateNameConverter : 'upperCamelCase'
	});

	//Router.onBeforeAction('loading');

	Router.map(function() {
		this.route('registrationform', {
			path : '/signup',
			onBeforeAction : function() {
			},
			onAfterAction : function() {
			},
			onRun: function(){
				if (Meteor.userId())
					this.redirect('home');
			}
		});
		this.route('loginform', {
			path : '/signin',
			onBeforeAction : function() {
			},
			onAfterAction : function() {
			},
			onRun: function(){
				if (Meteor.userId())
					this.redirect('home');
			}
		});
		this.route('goodbye', {
			path : '/goodbye',
			onBeforeAction : function() {
			},
			onAfterAction : function() {
			},
			onRun: function(){
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('home', {
			path : '/',
			onBeforeAction : function() {
			},
			onAfterAction : function() {
			},
			onRun: function(){
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('reminders', {
			path : '/reminders',
			onBeforeAction : function() {
				if (!Meteor.userId())
					this.redirect('loginform');
			},
			onAfterAction : function() {
			},
			onRun: function(){
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('journal', {
			path : '/journal',
			onBeforeAction : function() {
				if (Meteor.userId()){
					Session.set('newJournals',0);
				}
			},
			onAfterAction : function() {
			},
			onRun: function(){
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('measures', {
			path : '/measures',
			onBeforeAction : function() {
				if (Meteor.userId()){
					
				}
			},
			onAfterAction : function() {
			},
			onRun: function(){
				if (!Meteor.userId())
					this.redirect('loginform');
			}
		});
		this.route('problems',{
			path : '/problems',
			onBeforeAction : function(){
				if (!Meteor.userId())
					this.redirect('loginform');
			},
			onRun : function(){
				if (!Meteor.userId())
					this.redirect('loginform');
			},
			onAfterAction : function(){}
		});
	});
})();
