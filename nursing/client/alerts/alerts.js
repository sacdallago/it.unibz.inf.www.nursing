Alerts = new Meteor.Collection("alerts");

Lists = new Meteor.Collection("lists");


// ID of currently selected list
Session.setDefault('list_id', null);
// When editing a list name, ID of the list
Session.setDefault('editing_listname', null);
// When editing alert text, ID of the alert
Session.setDefault('editing_alertname', null);

var listsHandle = Meteor.subscribe('lists');


var alertsHandle = null;
// Always be subscribed to the alerts for the selected list.
Deps.autorun(function () {
  var list_id = Session.get('list_id');
  if (list_id)
    alertsHandle = Meteor.subscribe('alerts', list_id);
  else
    alertsHandle = Meteor.subscribe('alerts');
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

// Alerts

Template.alerts.loading = function () {
  return alertsHandle && !alertsHandle.ready();
};

Template.alerts.any_list_selected = function () {
  return !Session.equals('list_id', null);
};

Template.alerts.events(okCancelEvents(
  '#new-alert',
  {
    ok: function (text, evt) {
    var tmplist_id = Session.get('list_id');

    if (Lists.findOne({_id : tmplist_id})) {
      console.log("creating new alert for list " + tmplist_id);
      Alerts.insert({
        message: text,
        list_id: tmplist_id,
        done: false,
        timestamp: (new Date()).getTime()
      });
    } else {
      Notifications.error("Error", "Pick a Category");
    }
      evt.target.value = '';
    }
  }));

Template.alerts.alerts = function () {
  // Determine which alerts to display in main pane,
  // selected based on list_id
  var list_id = Session.get('list_id');
  var patientFilter = Session.get('patientFilter');
  var alerts;
  var sel = {};
  if(list_id) {
	sel.list_id = list_id;
  }
  if(patientFilter) {
	sel.patientId = patientFilter;
  }
  console.log(sel);

  alerts = Alerts.find(sel, {sort: {time:1}});
	
  var tempHandle = null;
  return alerts.map(function(element) {
	var patient = Patients.findOne({
		_id : element.patientId
	});
	if (patient) {
		//This adds beds to patient names, if the patient is in the ward the message is sent to
		element.bed = patient.currentHospitalization.bed;
	}
	//This adds a nice formatting of the date the message was written / modified
	element.date = dateFormatter(element.timestamp);
	return element;
  });
};

Template.alert_item.done_class = function () {
  return this.done ? 'done' : '';
};
Template.alert_item.isChecked = function(){
  return this.done ? 'checked="checked"' : '';
};

Template.alert_item.done = function () {
  console.log(this);
  return this.done;
};

Template.alert_item.editing = function () {
  return Session.equals('editing_itemname', this._id);
};

Template.alert_item.events({
  'click .check': function () {
    Alerts.update(this._id, {$set: {done: !this.done}});
  },

  'click .destroy': function () {
    Alerts.remove(this._id);
  },

  'dblclick .display .alert-text': function (evt, tmpl) {
    Session.set('editing_itemname', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#alert-input"));
  },

  'click .remove': function (evt) {
    var id = this.alert_id;

    evt.target.parentNode.style.opacity = 0;
    // wait for CSS animation to finish
    Meteor.setTimeout(function () {
      Alerts.update({_id: id});
    }, 300);
  }
});

Template.alert_item.events(okCancelEvents(
  '#alert-input',
  {
    ok: function (value) {
      Alerts.update(this._id, {$set: {text: value}});
      Session.set('editing_itemname', null);
    },
    cancel: function () {
      Session.set('editing_itemname', null);
    }
  }));

//Lists

Template.lists.loading = function () {
  return !listsHandle.ready();
};

Template.lists.lists = function () {
  return Lists.find({}, {sort: {name: 1}});
};

Template.lists.events({
  'mousedown .list': function (evt) { // select list
    console.log(this._id + 'mousedown');
    Session.set('list_id', this._id);
  },
  'click .list': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
    console.log(this._id + "onclick");
    Session.set('list_id', this._id);
  },
  'dblclick .list': function (evt, tmpl) { // start editing list name
    Session.set('editing_listname', this._id);
    Deps.flush(); // force DOM redraw, so we can focus the edit field
    activateInput(tmpl.find("#list-name-input"));
  }
});

// Attach events to keydown, keyup, and blur on "New list" input box.
Template.lists.events(okCancelEvents(
  '#new-list',
  {
    ok: function (text, evt) {
      var id = Lists.insert({name: text});
      Session.set('list_id', id._id);
      evt.target.value = "";
    }
  }));

Template.lists.events(okCancelEvents(
  '#list-name-input',
  {
    ok: function (value) {
      Lists.update(this._id, {$set: {name: value}});
      Session.set('editing_listname', null);
    },
    cancel: function () {
      Session.set('editing_listname', null);
    }
  }));

Template.lists.selected = function () {
  return Session.equals('list_id', this._id) ? 'selected' : '';
};

Template.lists.name_class = function () {
  return this.name ? '' : 'empty';
};

Template.lists.editing = function () {
  return Session.equals('editing_listname', this._id);
};

