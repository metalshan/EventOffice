var $EO = function  ($) {
	
	//prototype of $EO which will handle all the extended functions 
	var EventOfficePrototype =function(){	
		this.selector='html';	
		this.trigger=function (eventName, params) {
			var selector = $(this.selector);			
			helpers.storeEvent(this.selector, eventName, params);
			selector.trigger(eventName, params);
			console.log('event '+eventName+' is triggered on '+this.selector);
		};
		this.on=function (eventName, dynamicElement, callback) {
			if(typeof dynamicElement === "function")
				callback=dynamicElement;

			var previousEventResponse = helpers.findFromStore(this.selector, eventName, dynamicElement); //return the previous response object if you have it
			if(previousEventResponse){
				setTimeout(function () {
					callback.apply(this,previousEventResponse);
				}.bind(this),20);
				
			}
		}
	};

	//
	var Selector =function  (params) {
		EventOfficePrototype.call(this);
		this.selector = params.selector;
	};

	//making prototype
	Selector.prototype = Object.create(EventOfficePrototype.prototype);

	var helpers={
		storeEvent:function (selectorName, eventName, params) {
			Store[selectorName+'$EO$'+eventName] = {
				selectorName:selectorName,
				eventName:eventName,
				params:params,
				lastRaised: new Date()
			}
		},

		findFromStore:function (selector, eventName, dynamicElement) {
			return arguments;
		}

	};

	var Store={}; //an object to store all raised events 

	//replacement of $ for our custom work
	var $EO=function (selectorName) {
		return new Selector({selector:selectorName});
	};
	return $EO;
}(jQuery)