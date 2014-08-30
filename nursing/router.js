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
				if (Meteor.userId()){
					categoriesHandle = Meteor.subscribe('categories');
				}
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
					journalDocumentsHandle = Meteor.subscribe('journalDocuments');
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
	});
})();
