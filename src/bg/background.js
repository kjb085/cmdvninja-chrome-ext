
var selection = ''

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
		if(message.selection != undefined){
			console.log(message.selection)
			selection = message.selection
			console.log(selection)
		}
	}
)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request == 'getSelection'){
		console.log("Received Message");
		console.log(selection);
		sendResponse(selection);
	}
});