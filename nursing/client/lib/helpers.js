String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

Departments = ['cardiology'];

niceName = function(first, last) {
	return first.capitalize() + " " + last.capitalize();
};

dateFormatter = function(timestamp) {
	var date = new Date(timestamp);
	return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
};

dayTimeFormatter = function(timestamp) {
	var date = new Date(timestamp);
	return date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + "\n" + date.getDate() + "/" + (date.getMonth() + 1);
};

dayYearFormatter = function(timestamp) {
	var date = new Date(timestamp);
	return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
};

htmlDate = function(timestamp) {
	var date = new Date(timestamp);
	return date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' : '') + date.getDate();
};

getRandomColor = function() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

validatePatientData = function(field, value) {
	switch(field) {
		case "first" :
			if (/^[a-zA-Z]+$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','First should be one word of only letters');
			return false;
		case "last" :
			if (/^[a-zA-Z]+$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Last should be one word of only letters');
			return false;
		case "birthdate" :
			if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Birthdate should be a valid date!');
			return false;
		case "residenceAddress" :
			if (/^[a-zA-Z ]+$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Address should be a combination of only words');
			return false;
		case "residenceNumber" :
			if (/^[0-9]+ *[a-zA-Z]?$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Residence number should be a number');
			return false;
		case "residenceCity" :
			if (/^[a-zA-Z]+$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Residence city should be one word of only letters');
			return false;
		case "residenceProvince" :
			if (/^[a-zA-Z]+$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Residence province should be one word of only letters');
			return false;
		case "sex" :
			if (/^[m|f|M|F]$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Sex should be one letter: m/f/M/F');
			return false;
		case "height" :
			if (/^[0-9]+([\.|,][0-9]+)?$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Height should be a valid number');
			return false;
		case "maritalstatus" :
			if (/^[a-zA-Z]+$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Marital status should be one word of only letters');
			return false;
		case "referencePhone" :
			if (/^[0-9]{9,16}$/.test(value)) {
				return true;
			}
			Notifications.warn('Whops','Reference phone should be a number (use 00 instead of +)');
			return false;
	}
};

///INFINITE SCROLL
//Set the 'handle' variable equal to the actual paginated subscription handle on page load! (use iron-router onBeforeAction)
/* Eg.:
* messagesHandle = Meteor.subscribeWithPagination("messages", 10);
* handle = messagesHandle;
*/
handle = null;
/////////////////
$(window).scroll(function() {
	if (handle) {
		var threshold, target = $("#more");
		if (!target.length)
			return;

		threshold = $(window).scrollTop() + $(window).height() - target.height();

		if (target.offset().top < threshold) {
			if (!target.data("visible")) {
				// console.log("target became visible (inside viewable area)");
				target.data("visible", true);
				handle.loadNextPage();
				//Notifications.info('Loading next messages');
			}
		} else {
			if (target.data("visible")) {
				// console.log("target became invisible (below viewable arae)");
				target.data("visible", false);
			}
		}
	}
});
