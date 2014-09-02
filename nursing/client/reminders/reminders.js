Reminders = new Meteor.Collection("reminders");
Categories = new Meteor.Collection("categories");

// ID of currently selected category
Session.setDefault('categoryName', null);
// When editing a category name, ID of the category
Session.setDefault('editing_categoryName', null);
// When editing reminder text, ID of the reminder
Session.setDefault('editing_reminderName', null);

remindersHandle = Meteor.subscribe('reminders');

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

Template.reminders.helpers({
  
});

Template.reminders.events(okCancelEvents(
  '#new-reminder',
  {
    ok: function (text, evt) {
    var tmpCategory = Session.get('categoryName');

    if (Categories.findOne({name : tmpCategory})) {
   
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

reminders = function () {
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


    reminders = Reminders.find(sel, {sort: {done:1,journalId:-1,dueDate:1}});
    
    var tempHandle = null;
    return reminders.map(function(element) {
      var patient = Patients.findOne({
        _id : element.patientId
      });

      var room = Rooms.findOne({
        patientId : element.patientId
      });

      var nurse = Meteor.users.findOne({
        _id : element.nurseId
      });
      
      if (element.journalId){
        var journalentry = Journal.findOne(element.journalId);
        element.problemSubject = journalentry.subject;
        if (journalentry.solved){
          element.solved = journalentry.solved;
        }
      }
      
      if (patient) {
        element.patientName = niceName(patient.first, patient.last);
      }

      if (room) {
        element.roomNumber = room.number;
        element.bed = room.bed;
      }

      if (nurse) {
        element.nurseName = niceName(nurse.profile.first, nurse.profile.last);
      }
      //This adds a nice formatting of the date the message was written / modified
      console.log("Remapping");
      element.date = dateFormatter(element.timestamp);
      element.niceDue = dateFormatter(element.dueDate);
      return element;
    });
};

Template.reminders.reminders = reminders;
 

Template.reminderItem.helpers({
  doneStyle: function () {
    
    return (this.done)?'label-info':'';
  },

  doneCheck : function() {
    return (this.done)?'fa-check-square-o':'fa-square-o';
  },

  isProblem : function(){
    var isProblem = (this.journalId)?true:false;
    return isProblem;
  },

  editing : function () {
  return Session.equals('editing_reminderName', this._id);
  },

  problems : function() {
    var sel = {};
    var patientFilter = Session.get('patientFilter');
    if (patientFilter){
     sel.patientId = patientFilter;
    } else{
      sel.patientId = this.patientId;
    }
    sel.subject = {$exists: true};
    var problems = Journal.find(sel);
    return problems;
  }
});

var getFutureTime = function(date, days){
  var tmp = new Date(date);
  tmp.setDate(tmp.getDate()+days);
  return tmp;
};

var setDueDate = function(element){
  console.log(element);
  
  Reminders.update(element._id,{$set:{dueDate: element.dueDate, done: false}},function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "Due date updated!");
      }
    });
};

Template.reminderItem.events({
  'click .check': function () {
    var set;
    if (!this.hasOwnProperty('done')){
      set = true;
    } else {
      set = !this.done;
    }
    console.log(set);
    Reminders.update(this._id,{$set:{done: set}},function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "Task updated!");
      }
    });

  },
  'click .postpone1' : function(){
    var newDueDate = getFutureTime(this.dueDate,1);
    this.dueDate = newDueDate.getTime();
    setDueDate(this);
  },
  'click .postpone2' : function(){
    var newDueDate = getFutureTime(this.dueDate,2);
    this.dueDate = newDueDate.getTime();
    setDueDate(this);
  },
  'click .postpone3' : function(){
    var newDueDate = getFutureTime(this.dueDate,3);
    this.dueDate = newDueDate.getTime();
    setDueDate(this);
  },

  'click .category': function (evt) {
    var categoryCurrent = Session.get('categoryName');
    if (categoryCurrent && categoryCurrent=== this.category){
      Session.set('categoryName', null);
    } else {
      Session.set('categoryName', this.category);
    }
  },

  'click .delete': function(){
    Reminders.remove(this._id,function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "Task removed!");
      }
    });
  },
  'click .detach': function(){
    Reminders.update(this._id, {$set:{journalId:null}},function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "Problem deattachment successful");
      }
    });
  },

  'dblclick .display .reminder-text': function (evt, tmpl) {
    Session.set('editing_reminderName', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#reminder-input"));
  },
  'taphold .display .reminder-text': function (evt, tmpl) {
    Session.set('editing_reminderName', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#reminder-input"));
  },

  'change select' : function(event){
    var problemId = $(event.currentTarget).find(':selected').data("problemid");
   
    Reminders.update(this._id,{$set:{journalId:problemId}},function(error) {
      if (error) {
        Notifications.error("Error", "An error occoured. Please try again");
      } else {
        Notifications.success("", "Marked as Problem!");
      }
    });
  }
});

Template.reminderItem.events(okCancelEvents(
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
   
    if(!this.name) {
      Session.set('categoryName',null);
    } else {
      Session.set('categoryName', this.name);
    }
  },
  'click .category': function (evt) {
 
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
Template.categories.allSelected = function (){
  return (!Session.get('categoryName'))?'label-info':'';
};
Template.categories.totalReminders = function(){
  var sel = {};
  var pid = Session.get('patientFilter');
  if(pid){
    sel.patientId = pid;
  }
  return Reminders.find(sel).count();
};

Template.reminders.destroyed = function(){
  delete Session.keys['categoryName'];
};