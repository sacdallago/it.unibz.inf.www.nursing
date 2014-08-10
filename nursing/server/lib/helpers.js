capitalize = function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

niceName = function(first, last) {
    return capitalize(first) + " " + capitalize(last);
};

dateFormatter = function(timestamp){
	var date = new Date(timestamp);
	return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
};
