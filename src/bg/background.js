// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });

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


	function getContentFromClipboard() {
    var result = '';
    var sandbox = document.getElementById('sandbox');
    sandbox.value = '';
    sandbox.select();
    if (document.execCommand('paste')) {
        result = sandbox.value;
        console.log('got value from sandbox: ' + result);
    }
    sandbox.value = '';
    return result;
	}

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		console.log("Received Message");
		if(request.clipboard){
			sendResponse(getContentFromClipboard())
		}
	})


