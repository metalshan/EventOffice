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
			if(typeof dynamicElement === "function")
				callback=dynamicElement;

			var previousEventResponse = helpers.findFromStore(this.selector, eventName, dynamicElement); //return the previous response object if you have it
			if(previousEventResponse){
				setTimeout(function () {
					callback.apply(this,previousEventResponse);
				}.bind(this),20);
				
			}

			// //register events normally
			// if(typeof dynamicElement !== "function"){
			// 	$(this.selector).on(eventName, dynamicElement, $.proxy(callback,this));
			// 	$(this.selector).on(eventName, dynamicElement, );
			// }
			// else{
			// 	$(this.selector).on(eventName, $.proxy(callback,this));				
			// 	$(this.selector).on(eventName, $.proxy(helpers.storeEventResponse,this));				
			// }
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

			Store.eventResponseStack.push({eventName:eventName, arguments:arguments});
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
					Store.saveEventResponse(arguments);
				}

				var newEventListenerObj = {
					name: selectorName,
					eventName:eventName,
					listenerFunc: eventListenerFunc
				}
				helpers.saveEvent(selectorName,eventName, newEventListenerObj);
				
				$(selectorName).on(eventName, newEventListenerObj.listenerFunc);
				return Store.eventListeners[newEventId];
			}
		},

		//find an event against a given 
		findEvent:function (selectorName,eventName) {
			return Store.eventListeners[selectorName+"$EO$"+eventName];
		},

		saveEvent:function (selectorName,eventName, newEventListenerObj) {
			Store.eventListeners[selectorName+"$EO$"+eventName] = newEventListenerObj;
		},

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