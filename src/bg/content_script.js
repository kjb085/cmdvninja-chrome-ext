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


	// if( ( key[17] === true ) && (key[67] === true) ) && (key[86] === true ) ){
		// console.log('Hot keys')

		$(document).on('click', function(event){ // Change this to 
			var snippet = window.selection
			console.log(snippet)
		// 	// var userId = localStorage['cmdv_token']
		// 	// console.log(userId)

			var userId = "54fd06dc365422f72471319a" // Need a way to access localStorage

			$.ajax({
				type: 'POST',
				url: 'http://localhost:3000/api/users/' + userId + '/snippets',
				data: { content: snippet, user: userId },
				success: function(response){
					alert('Successfully posted snippet!');
				},
				failure: function(){
					console.log('Snippet failed to post');
				}
			});

		});

	// }

