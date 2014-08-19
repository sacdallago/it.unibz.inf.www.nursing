

Meteor.startup(function() {
		// if the database is empty on server start, create some sample data.
		

		//Rooms
		var roomNumber = 10;
		var bedsPerRoom = 2;
		var bedIds = ['A','B'];
		var data=[];
		Rooms.remove({});

		var bedlist = [];
		for (var i = 0; i < roomNumber; i++){
			
			for (var j = 0; j < bedsPerRoom; j++){
				bedlist[j] = {
					'status' : "free",
					'id' : bedIds[j]
				};
				
			}

			data[i] = {
				'beds' : bedlist,
				'roomNumber' : i
			};
			
			Rooms.insert(data[i]);
		}

		//Lists
		Lists.remove({});
		var names = ['prelivevi','digiuni','diabetici','medicazioni','urine','peso','pic-midline-cvc', 'echi-ecg'];
		var lists_ids = [];
		for (i = 0; i < names.length; i++){
			lists_ids[i] = Lists.insert({
				'name' : names[i]
			});
		}

		//Alerts
		Alerts.remove({});
		var sampleAlerts = [];
        var maxAlerts = 5;
        for (i =0; i < maxAlerts; i++){
       		var alert = {
        		message: "text" + i,
        		done: (i%2===0)?true:false,
        		list_id: lists_ids[0],
        		timestamp: (new Date()).getTime()
        	};
        	Alerts.insert(alert);
       }

});
