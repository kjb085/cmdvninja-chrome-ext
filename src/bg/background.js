Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

var selection = ''

// Refresh current selection when user edits the range
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.selection != undefined){
		selection = message.selection
	}
})


// Browser action snippet preview event listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request == 'getSelection'){
		sendResponse(selection);
	}
});


// Pass user id to the content script for utilization of the hot key functionality 

// Old version for the above
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
// 	if (request.method == 'getToken' && !!(localStorage['cmdv_token'])){
// 		sendResponse({token: localStorage['cmdv_token']})
// 	}
// 	else{
// 		sendResponse({error: true})
// 	}
// })

// New version of the above
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.method == 'getToken' && Date.now >= localStorage['token_timeout']){

		var answer = false

		$.ajax({
			type: 'GET',
			url: 'http://cmdvninja.herokuapp.com/auth/current',
			statusCode: {
				404: function(){
					console.log('404')
					// sendResponse({error: true})
				}
			},
			success: function(response){
				localStorage['cmdv_token'] = response._id
				localStorage['cmdv_username'] = response.username
				localStorage['token_timeout'] = new Date().addHours(3)
				console.log(localStorage['token_timeout'])
				// sendResponse({token: localStorage['cmdv_token']})
			},
			failure: function(){
				console.log('User is not logged in')
			// sendResponse({error: true})
			}
		})
// .success(function(response){
		// 	console.log('Working')
		// 	localStorage['cmdv_token'] = response._id
		// 	localStorage['cmdv_username'] = response.username
		// 	localStorage['token_timeout'] = new Date().addHours(3)
		// 	console.log(localStorage['token_timeout'])
		// 	// chrome.storage.set({error: false }, function(){})
		// 	chrome.storage.local.set({cmdv_token: response._id }, function(){})
		// }).fail(function(){
		// 	console.log('Working')
		// 	console.log('Error occurred')
		// 	// chrome.storage.local.set({error: true}, function(){})
		// })

	}	
	else if (request.method == 'getToken'){
		sendResponse({token: localStorage['cmdv_token']})
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
