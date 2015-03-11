
var selection = ''

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.selection != undefined){
		console.log(message.selection)
		selection = message.selection
		console.log(selection)
	}
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request == 'getSelection'){
		console.log("Received Message");
		console.log(selection);
		sendResponse(selection);
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.method == 'getToken' && !!(localStorage['cmdv_token'])){
		sendResponse({token: localStorage['cmdv_token']})
	}
	else{
		sendResponse({error: true})
	}
})


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.method == 'successNotif'){
		chrome.notifications.create('cmdv', {type: 'basic', title: "Success!", message: "Snippet successfully posted to CmdV Ninja", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
	}
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.method == 'failureNotif'){
		chrome.notifications.create('', {type: 'basic', title: "Failure", message: "Snippet failed to post to CmdV Ninja\nPlease check authentication and ", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
	}
})