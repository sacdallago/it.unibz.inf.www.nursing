Alerts = new Meteor.Collection("alerts");

Session.setDefault('deadlineAlerts', 0); // Which are going to end today. Gets calculated when loggingin