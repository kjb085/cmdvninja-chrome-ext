'use strict';

console.log("Content Script Refreshed!");

window.selection = "";

document.addEventListener('selectionchange', function(){

	selection = window.getSelection().toString();
	console.log(selection);
	chrome.runtime.sendMessage({selection: selection})

});


var userId = ""

chrome.runtime.sendMessage({method: 'getToken'},function(response){
	if (response.token){
		console.log(response.token)
		userId = response.token
	}
	else if (response.error){
		console.log('error')
	}
})

document.addEventListener('keydown', function(event1) {

	var keys = []

	 onkeydown = onkeyup = function(event2) {
	keys[event2.keyCode] = event2.type == 'keydown';

	console.log(keys) // Leave for later testing later refactors to clean up below if statement

	if ( (keys[91] === true || keys[91] === false) && (keys[69] === true || keys[69] === false) && (keys[16] === true || keys[16] === false) ) {
		  
			event2.preventDefault();

			var snippet = window.selection

			if(snippet == ""){
				throw new Error("No selection made")
			}
			else if (!(userId)){
				chrome.runtime.sendMessage({method: 'unauthNotif'})
				throw new Error("Unauthorized access")
			}

		  $.ajax({
					type: 'POST',
					url: 'http://localhost:3000/api/users/' + userId + '/snippets',
					data: { content: snippet, user: userId },
					success: function(response){
						console.log('Successfully posted snippet!');
						chrome.runtime.sendMessage({method: 'successNotif'})
					},
					failure: function(){
						console.log('Snippet failed to post');
						chrome.runtime.sendMessage({method: 'failureNotif'})
					}
				});
		};
	};
});



