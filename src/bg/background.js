
var selection = ''

// Refresh current selection when user edits the range
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.selection != undefined){
		console.log(message.selection)
		selection = message.selection
		// console.log(selection)
	}
})


// Browser action snippet preview event listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request == 'getSelection'){
		console.log("Received Message");
		// console.log(selection);
		sendResponse(selection);
	}
});


// User id => hot key posting event listener 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.method == 'getToken' && !!(localStorage['cmdv_token'])){
		sendResponse({token: localStorage['cmdv_token']})
	}
	else{
		sendResponse({error: true})
	}
})


// Notification event listeners
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.method == 'successNotif'){
		chrome.notifications.clear('cmdv_success', function(){})
		chrome.notifications.create('cmdv_success', {type: 'basic', title: "Success!", message: "Snippet successfully posted to CmdV Ninja", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
	}
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.method == 'failureNotif'){
		chrome.notifications.clear('cmdv_failure', function(){})
		chrome.notifications.create('cmdv_failure', {type: 'basic', title: "Failure", message: "Snippet failed to post to CmdV Ninja\nPlease check your internet connection and verify authentication.", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
	}
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.method == 'unauthNotif'){
		chrome.notifications.clear('cmdv_unauth', function(){})
		chrome.notifications.create('cmdv_unauth', {type: 'basic', title: "Unauthorized Access", message: "Snippet failed to post to CmdV Ninja\nPlease log in via the settings page.", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
	}
})
