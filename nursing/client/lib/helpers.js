String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

Departments = ['cardiology', 'oncology', 'odontology'];

niceName = function(first, last) {
	return first.capitalize() + " " + last.capitalize();
};

dateFormatter = function(timestamp) {
	var date = new Date(timestamp);
	return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
};

///INFINITE SCROLL
//Set the 'handle' variable equal to the actual paginated subscription handle on page load! (use iron-router onBeforeAction)
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