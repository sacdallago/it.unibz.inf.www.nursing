Reminders = new Meteor.Collection("reminders");
Categories = new Meteor.Collection("categories");
Accounts = Meteor.users;

// ID of currently selected category
Session.setDefault('categoryName', null);
// When editing a category name, ID of the category
Session.setDefault('editing_categoryName', null);
// When editing reminder text, ID of the reminder
Session.setDefault('editing_reminderName', null);

categoriesHandle = null;
remindersHandle = null;
usersHandle = null;

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
      },function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "New Reminder successfully inserted!");
      }
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

  reminders = Reminders.find(sel, {sort: {dueDate:1}});
	
  var tempHandle = null;
  return reminders.map(function(element) {
    var patient = Patients.findOne({
      _id : element.patientId
    });

    var room = Rooms.findOne({
      patientId : element.patientId
    });

    var nurse = Accounts.findOne({
      _id : element.nurseId
    });

    if (patient) {
      element.patientName = niceName(patient.first, patient.last);
    }

    if (room) {
      element.roomNumber = room.number;
      element.bed = room.bed;
    }
    console.log(nurse);
    if (nurse) {
      element.nurseName = niceName(nurse.profile.first, nurse.profile.last);
    }
    //This adds a nice formatting of the date the message was written / modified
    element.date = dateFormatter(element.timestamp);
    element.niceDue = dateFormatter(element.dueDate);
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
    Reminders.remove(this._id,function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "Task completed!");
      }
    });

  },

  'dblclick .display .reminder-text': function (evt, tmpl) {
    Session.set('editing_reminderName', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#reminder-input"));
  }
});

Template.reminder_item.events(okCancelEvents(
  '#reminder-input',
  {
    ok: function (value) {
      Reminders.update(this._id, {$set: {message: value}},function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "Reminder successfully updated!");
      }
    });
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
  var categories = Categories.find();
  return categories.map(function(element){
    var sel ={};
    sel.category = element.name;
    var pid = Session.get('patientFilter');
    if (pid){
      sel.patientId = pid;
    }
    element.count = Reminders.find(sel).count();
    return element;
  });

};

Template.categories.events({
  'mousedown .category': function (evt) { // select category
    console.log(this.name + 'mousedown');
    if(!this.name) {
      Session.set('categoryName',null);
    } else {
      Session.set('categoryName', this.name);
    }
  },
  'click .category': function (evt) {
    console.log(this.name + "onclick");
    if(!this.name) {
      Session.set('categoryName',null);
    } else {
      Session.set('categoryName', this.name);
    }
  },
  'dblclick .category': function (evt, tmpl) { // start editing category name
    
    if (!this.name){
      Session.set('editing_categoryName', this.name);
      Deps.flush(); // force DOM redraw, so we can focus the edit field
      activateInput(tmpl.find("#category-name-input"));
    }
  }
});

// Attach events to keydown, keyup, and blur on "New category" input box.
Template.categories.events(okCancelEvents(
  '#new-category',
  {
    ok: function (text, evt) {
      var id = Categories.insert({name: text},function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "New Category successfully inserted!");
      }
    });
      Session.set('categoryName', id.name);
      evt.target.value = "";
    }
  }));

Template.categories.events(okCancelEvents(
  '#category-name-input',
  {
    ok: function (value) {
      Categories.update(this.name, {$set: {name: value}},function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "Category successfully updated!");
      }
    });
      Session.set('editing_categoryName', null);
    },
    cancel: function () {
      Session.set('editing_categoryName', null);
    }
  }));

Template.categories.selected = function () {
  return Session.equals('categoryName', this.name) ? 'label-info' : '';
};

Template.categories.editing = function () {
  return Session.equals('editing_categoryName', this.name);
};

Template.categories.totalReminders = function(){
  var sel = {};
  var pid = Session.get('patientFilter');
  if(pid){
    sel.patientId = pid;
  }
  return Reminders.find(sel).count();
};
