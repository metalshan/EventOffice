var $EO = function  ($) {
	
	//prototype of $EO which will handle all the extended functions 
	var EventOfficePrototype =function(){	
		this.selector='html';	
		this.trigger=function (eventName, params) {
			var selector = $(this.selector);
			console.log(selector);
		}
	};

	//replacement of $ for our custom work
	var $EO=function (selectorName) {
		return Object.create(Selector.prototype,{selector:selectorName});
	};

	var Selector =function  (params) {
		EventOfficePrototype.call(this);
		this.selector = params.selector;
	};

	//making prototype
	Selector.prototype = Object.create(EventOfficePrototype.prototype);



	return $EO;
}(jQuery)