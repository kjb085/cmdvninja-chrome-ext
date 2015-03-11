'use strict';

// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.executeScript(tab.id, {file: "js/test.js"});
// });

// chrome.browserAction.addListener("copy", function(e) {
//           console.log("Copy event", e);
//           var text = e.clipboardData.getData("text/plain");
//           console.log("Copy event", text);
//           $scope.snippetPastedText = text;
//           var activeGroup = $('.activegroup');
//           $scope.groupId = activeGroup.data("id");
//           $scope.pasteSnippet();
//           //focusHiddenArea();
//           //e.preventDefault();
//       });


	// function getContentFromClipboard() {
 //    var result = '';
 //    var sandbox = document.getElementById('sandbox');
 //    sandbox.value = '';
 //    sandbox.select();
 //    if (document.execCommand('paste')) {
 //        result = sandbox.value;
 //        console.log('got value from sandbox: ' + result);
 //    }
 //    sandbox.value = '';
 //    return result;
	// }

	// chrome.tabs.executeScript({
	// 	code: "window.getSelection().toString();"
	// }, function(selection){
	// 	document.getElementById('sandbox').value = selection[0]
	// });


	console.log("Content Script Refreshed!");

	window.selection = "";

	document.addEventListener('selectionchange', function(){

		selection = window.getSelection().toString();
		console.log(selection);
		chrome.runtime.sendMessage({selection: selection})

	});


	// document.addEventListener('keydown', function(){

	// 	console.log('keydown')

	// 	chrome.runtime.sendMessage('check', function(response){
	// 		if(response == 1){
	// 			console.log('hot keys')
	// 			var userId = '54ff8a956c5dded1131aa173'
	// 			$.ajax({
	// 				type: 'POST',
	// 				url: 'http://localhost:3000/api/users/' + userId + '/snippets',
	// 				data: { content: snippet, user: userId },
	// 				success: function(response){
	// 					alert('Successfully posted snippet!');
	// 				},
	// 				failure: function(){
	// 					console.log('Snippet failed to post');
	// 				}
	// 			});

	// 		}
	// 	})

	// })

	// if( (key[91] === true) && (key[16] === true) ) && (key[76] === true ) ){

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



