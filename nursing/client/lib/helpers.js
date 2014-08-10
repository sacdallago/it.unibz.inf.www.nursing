String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Departments = ['cardiology','oncology','odontology'];

function nicename(first, last) {
    return capitalize(first) + " " + capitalize(last);
};

function dateformatter(timestamp){
	var date = new Date(timestamp);
	return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
};
