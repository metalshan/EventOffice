var $EO = function  ($) {
	
	//prototype of $EO which will handle all the extended functions 
	var EventOfficePrototype =function(){	
		//the default selector 
		this.selector='html';	
		//custom trigger function for event emitting
		this.trigger=function (eventName, params) {
			var selector = $(this.selector);			
			helpers.checkAndRegisterEvent(this.selector, eventName, params);
			selector.trigger(eventName, params);
			console.log('event '+eventName+' is triggered on '+this.selector);
		};
		//custom on function for event listing
		this.on=function (eventName, dynamicElement, callback) {

			if(typeof dynamicElement === "function"){
				callback=dynamicElement;
				dynamicElement=null;
			}

			//register events normally
			if(dynamicElement)
				$(this.selector).on(eventName, dynamicElement, callback);
			else
				$(this.selector).on(eventName, callback);	
	

			var allElements = $(this.selector);
			for (var i = allElements.length - 1; i >= 0; i--) {
				var selector=allElements[i];
				var previousEventResponse = helpers.findFromStore(selector, eventName, dynamicElement); //return the previous response object if you have it
				if(previousEventResponse){
					(function (selector,previousEventResponse) {
						setTimeout(function () {
							callback.apply(selector,previousEventResponse);
						}.bind(this),0);
					})(selector,previousEventResponse);
									
				}
			};
			
		}
	};

	//The object to handle 
	var Selector =function  (params) {
		EventOfficePrototype.call(this);
		this.selector = params.selector;
	};

	//making prototype
	Selector.prototype = Object.create(EventOfficePrototype.prototype);

	var helpers={
		saveEventResponse:function () {
			var theEvent = arguments[0];
			var eventName = theEvent.type;

			Store.eventResponseStack.push({eventName:eventName, arguments:arguments, e: theEvent});
		},

		//check if EO already has an event listener to listen the event if not, create
		checkAndRegisterEvent:function  (selectorName, eventName, params) {
			var storedEvent = helpers.findEvent(selectorName, eventName);
			if(storedEvent){
				return storedEvent;
			}
			else{
				//the custon event listener just listens and shores in the eventResponse stack without any business logic
				var eventListenerFunc = function () {
					helpers.saveEventResponse.apply(this,arguments);
				}

				var newEventListenerObj = {
					name: selectorName,
					eventName:eventName,
					listenerFunc: eventListenerFunc
				}
				helpers.saveEvent(selectorName,eventName, newEventListenerObj);
				
				$(selectorName).on(eventName, newEventListenerObj.listenerFunc);
				return newEventListenerObj;
			}
		},

		//find an event against a given 
		findEvent:function (selectorName,eventName) {
			var listenersList = Store.eventListeners;
			for (var i = listenersList.length - 1; i >= 0; i--) {
				var eventObj = listenersList[i]
				if(eventObj.id === selectorName+"$EO$"+eventName)
					return eventObj;
			};			
		},

		saveEvent:function (selectorName,eventName, newEventListenerObj) {
			newEventListenerObj.id = selectorName+"$EO$"+eventName; 
			Store.eventListeners.push(newEventListenerObj);
		},

		findFromStore:function (selector, eventName, dynamicElement) {
			var filteredEvents = $.grep(Store.eventResponseStack,function (eventObj, i) {
				return eventObj.eventName === eventName;
			}); 
			var eventResponse = null;
			for (var i = filteredEvents.length - 1; i >= 0; i--) {
				var obj = filteredEvents[i];
				//if(!dynamicElement){
					//if same node or a child node, than it's true
					if($(obj.e.target).is(selector) || $(selector).parent(obj.e.target).length){
						eventResponse = obj.arguments;
						return eventResponse;
					}
				//}
			};;

			return eventResponse;
		}

	};

	//an object to store all raised events
	var Store={
		eventListeners:[],
		eventResponseStack:[]
	};  

	//replacement of $ for our custom work
	var $EO=function (selectorName) {
		return new Selector({selector:selectorName});
	};
	return $EO;
}(jQuery)