# Event-Office.js: to simplify your DOM event managemnet

## The problem
Often in widget based web development, we find it hard to communicate between widgets. The only way we have is raising DOM events. But this approach also have issues. Suppose widget 'A' listens an event raised by widget 'B' and then displayes himself. But widget B fired the event before A came into the DOM. So what will happen is, A will wait for the event to be raised, and B will think he already raised the event. Thus the commication will break.

## The solution
event-office.js manages the DOM events by storring them and assigning to the appropriate listener even if the event was raised before listener registers himself for lsitening. Lets see how event-office handles the problem dictated above.

Once B raised the event (suppose 'x'), event-office will save it in it's store. Thus, when widget A comes into the DOM and registers himself to listen to the event 'x'; event-office finds; oh, the event was already raised a while ago. The he immidiately call the listerer callback of A. Thus no mis communication happens.

## How to use?
This is really simple to use. While registering or triggering any event, just use $EO instead of $ and event-office will handle everything else.

	$EO('p').trigger('anEvent',{name:'Void Canvas'});
	$EO('p').on('anEvent',function(e,params){
		//write you code here
	});

	