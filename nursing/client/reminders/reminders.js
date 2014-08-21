Reminders = new Meteor.Collection("reminders");

Categories = new Meteor.Collection("categories");


// ID of currently selected category
Session.setDefault('categoryName', null);
// When editing a category name, ID of the category
Session.setDefault('editing_categoryname', null);
// When editing reminder text, ID of the reminder
Session.setDefault('editing_reminderName', null);

var categoriesHandle = Meteor.subscribe('categories');


var remindersHandle = null;
// Always be subscribed to the reminders for the selected category.
Deps.autorun(function () {
  var category = Session.get('categoryName');
  if (category)
    remindersHandle = Meteor.subscribe('reminders', category);
  else
    remindersHandle = Meteor.subscribe('reminders');
});

////////// Helpers for in-place editing //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};

// Reminders

Template.reminders.loading = function () {
  return remindersHandle && !remindersHandle.ready();
};

Template.reminders.any_category_selected = function () {
  return !Session.equals('categoryName', null);
};

Template.reminders.events(okCancelEvents(
  '#new-reminder',
  {
    ok: function (text, evt) {
    var tmpCategory = Session.get('categoryName');

    if (Categories.findOne({name : tmpCategory})) {
      console.log("creating new reminder for category " + tmpCategory);
      Reminders.insert({
        message: text,
        category: tmpCategory,
        done: false,
        timestamp: (new Date()).getTime()
      });
    } else {
      Notifications.error("Error", "Pick a Category");
    }
      evt.target.value = '';
    }
  }));

Template.reminders.reminders = function () {
  // Determine which reminders to display in main pane,
  // selected based on category
  var category = Session.get('categoryName');
  var patientFilter = Session.get('patientFilter');
  var reminders;
  var sel = {};
  if(category) {
	sel.category = category;
  }
  if(patientFilter) {
	sel.patientId = patientFilter;
  }
  console.log(sel);

  reminders = Reminders.find(sel, {sort: {time:1}});
	
  var tempHandle = null;
  return reminders.map(function(element) {
	var patient = Patients.findOne({
		_id : element.patientId
	});
	if (patient) {
		//This adds beds to patient names, if the patient is in the ward the message is sent to
		//element.bed = patient.currentHospitalization.bed;
    //TODO: add room and bed to result according to current collection structure
	}
	//This adds a nice formatting of the date the message was written / modified
	element.date = dateFormatter(element.timestamp);
	return element;
  });
};

Template.reminder_item.done_class = function () {
  return this.done ? 'done' : '';
};
Template.reminder_item.isChecked = function(){
  return this.done ? 'checked="checked"' : '';
};

Template.reminder_item.done = function () {
  console.log(this);
  return this.done;
};

Template.reminder_item.editing = function () {
  return Session.equals('editing_reminderName', this._id);
};

Template.reminder_item.events({
  'click .check': function () {
    Reminders.update(this._id, {$set: {done: !this.done}});
  },

  'click .destroy': function () {
    Reminders.remove(this._id);
  },

  'dblclick .display .reminder-text': function (evt, tmpl) {
    Session.set('editing_reminderName', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#reminder-input"));
  },

  'click .remove': function (evt) {
    var id = this._id;

    evt.target.parentNode.style.opacity = 0;
    // wait for CSS animation to finish
    Meteor.setTimeout(function () {
      Reminders.update({_id: id});
    }, 300);
  }
});

Template.reminder_item.events(okCancelEvents(
  '#reminder-input',
  {
    ok: function (value) {
      Reminders.update(this._id, {$set: {text: value}});
      Session.set('editing_reminderName', null);
    },
    cancel: function () {
      Session.set('editing_reminderName', null);
    }
  }));

//Categories

Template.categories.loading = function () {
  return !categoriesHandle.ready();
};

Template.categories.categories = function () {
  return Categories.find({}, {sort: {name: 1}});
};

Template.categories.events({
  'mousedown .category': function (evt) { // select category
    console.log(this.name + 'mousedown');
    Session.set('category', this.name);
  },
  'click .category': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
    console.log(this.name + "onclick");
    Session.set('category', this.name);
  },
  'dblclick .category': function (evt, tmpl) { // start editing category name
    Session.set('editing_categoryname', this.name);
    Deps.flush(); // force DOM redraw, so we can focus the edit field
    activateInput(tmpl.find("#category-name-input"));
  }
});

// Attach events to keydown, keyup, and blur on "New category" input box.
Template.categories.events(okCancelEvents(
  '#new-category',
  {
    ok: function (text, evt) {
      var id = Categories.insert({name: text});
      Session.set('category', id.name);
      evt.target.value = "";
    }
  }));

Template.categories.events(okCancelEvents(
  '#category-name-input',
  {
    ok: function (value) {
      Categories.update(this.name, {$set: {name: value}});
      Session.set('editing_categoryname', null);
    },
    cancel: function () {
      Session.set('editing_categoryname', null);
    }
  }));

Template.categories.selected = function () {
  return Session.equals('category', this.name) ? 'selected' : '';
};

Template.categories.name_class = function () {
  return this.name ? '' : 'empty';
};

Template.categories.editing = function () {
  return Session.equals('editing_categoryname', this.name);
};

