var EventOffice = function  ($) {
	var eventOffice ={
		
		trigger:function (eventName, extraParams) {
			helpers.storeEvent(eventName,extraParams);
			$.trigger(eventName,extraParams);
		}
	};

	var helpers={
		storeEvent:function (eventName, extraParams) {
			storage[eventName]={
				name:eventName,
				params:extraParams,
				savedOn:new Date()
			}
		}
	}

	var storage={
	}

}(jQuery)