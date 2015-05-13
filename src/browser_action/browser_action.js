// I think I need to have a js script that is running 
var snippet = ""

var dropDownPartial = function(name, groupId){
  return "<option value=" + groupId + ">" + name + "</option>"
}

// API call to populate use groups
var populateDropDown = function(userId){
  $.ajax({
    type: "GET",
    url: "http://cmdvninja.herokuapp.com/api/users/" + userId + "/groups", // Need this route to return an array of all a user's groups
    success: function(groupsAry){
      groupsAry.forEach(function(group){
        var name = group['name']
        var groupId = group['_id']
        $('#group').append(dropDownPartial(name, groupId))
      })
    },
    failure: function(){ 
      console.log("User's groups failed to load")
    }
  })
}

// Set response equal to snippet variable
var setHighlightedText = function(){
  chrome.runtime.sendMessage('getSelection', function(response){
    snippet = response
  })
}

// Modify window 
var showPreview = function(snippetText){
  $('#error').hide()
  $('#content').append(snippetText)
}

var userId = null

$(document).ready(function(){

  chrome.storage.local.get('cmdv_token', function(result){ userId = result.cmdv_token })
  console.log("Initial: " + userId)

  if(!userId){
    chrome.runtime.sendMessage({method: 'getToken'}, function(){ console.log('ajax request completed')})
    chrome.storage.local.get('cmdv_token', function(result){ userId = result.cmdv_token })
    console.log("After message sent: " + userId)
    if (userId){
      setHighlightedText()
      showPreview(snippet)
      populateDropDown(userId)
      console.log("Receiving token: " + userId)
    }
    else {
      $('#authenticated').hide()
      var id = chrome.runtime.id
      $('#login').attr('href', 'chrome-extension://' + id + '/src/options_custom/settings.html')
      console.log("No user auth")
    }
    // Maybe change to on click jquery event to open a new tab in the options page
  }
  else {
    setHighlightedText()
    showPreview(snippet)
    populateDropDown(userId)
    console.log("User token exists")
  }

  //#########################################################################

  $('#submit_snip').on('click', function(event) {
    event.preventDefault();

    var title = document.getElementById('title').value
    var groupId = document.getElementById('group').value
    var tags = document.getElementById('tags').value.split(" ")

    if(snippet == ""){
      chrome.notifications.clear('cmdv', function(){})
      chrome.notifications.create('cmdv', {type: 'basic', title: "Failure", message: "No text selected", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
      throw new Error("No selection made")
      window.close()
    }

    // Need a way to dynamically send tags is a user enters anything, maybe an if statement in data if you can do that?
    $.ajax({
      type: "POST",
      url: "http://cmdvninja.herokuapp.com/api/groups/" + groupId + "/snippets",
      data: { unique_handle: title, group: groupId, tags: JSON.stringify(tags), user: userId, content: snippet }, // Need to parse the tags array on the server side
      success: function(data){
        // This only works for every other notification if a user is on the same page
        // The issue is not the same with the hot keys and if window.close() is commented out, the issue is resolved
        // As such, I'm not sure how to fix this as the window closing upon successfully creating a snippet is key to UX
        chrome.notifications.clear('cmdv', function(){})
        chrome.notifications.create('cmdv', {type: 'basic', title: "Success!", message: "Snippet successfully posted to CmdV Ninja", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
        window.close();
      },
      faiure: function(){
        console.log("Item failed to post")
        chrome.notifications.clear('cmdv')
        chrome.notifications.create('cmdv', {type: 'basic', title: "Failure", message: "Snippet failed to post to CmdV Ninja\nPlease check your internet connection and try again.", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
        // Append an error message to the bottom of the popup
      }
    })

  });

});
