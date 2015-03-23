// I think I need to have a js script that is running 
var snippet = ""

$(document).ready(function(){
  
  if(!(localStorage['cmdv_token'])){
    $('#authenticated').hide()
    var id = chrome.runtime.id
    $('#login').attr('href', 'chrome-extension://' + id + '/src/options_custom/settings.html')
  } // Maybe change to on click jquery event to open a new tab in the options page
  else{
    $('#error').hide()
    chrome.runtime.sendMessage('getSelection', function(response){
      $('#content').append(response)
      snippet = response
    })
  }


  var userId = localStorage['cmdv_token']

  // API call to populate use groups
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


  var dropDownPartial = function(name, groupId){
    return "<option value=" + groupId + ">" + name + "</option>"
  }

  $('#submit_snip').on('click', function(event) {
    event.preventDefault();

    var title = document.getElementById('title').value
    var groupId = document.getElementById('group').value
    var tags = document.getElementById('tags').value.split(" ")

    if(snippet == ""){
      chrome.notifications.clear('cmdv_no_text', function(){})
      chrome.notifications.create('cmdv_no_text', {type: 'basic', title: "Failure", message: "No text selected", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
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
        chrome.notifications.clear('cmdv_success', function(){})
        chrome.notifications.create('cmdv_success', {type: 'basic', title: "Success!", message: "Snippet successfully posted to CmdV Ninja", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
        window.close();
      },
      faiure: function(){
        console.log("Item failed to post")
        chrome.notifications.clear('cmdv_success')
        chrome.notifications.create('cmdv_failure', {type: 'basic', title: "Failure", message: "Snippet failed to post to CmdV Ninja\nPlease check your internet connection and try again.", iconUrl: '../../icons/ninja-small.png', priority: 0}, function(){})
        // Append an error message to the bottom of the popup
      }
    })


  });

});
