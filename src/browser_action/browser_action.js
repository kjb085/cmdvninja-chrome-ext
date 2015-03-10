// I think I need to have a js script that is running 

$(document).ready(function(){

  chrome.runtime.sendMessage({clipboard: true}, function(response){
      $('#content').append(response)
      var content = response
  })

  // var userId = "54fd06dc365422f72471319a" // Need to include this from another js file where it is 

  var userId = localStorage['cmdv_token']
  console.log(userId)


  // API call to populate use groups


  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/users/" + userId + "/groups", // Need this route to return an array of all a user's groups
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
    // NEED A VAR THAT CAN ACCESS THE TOKEN THAT WE STORE SOMEWHERE
    var title = document.getElementById('title').value
    var groupId = document.getElementById('group').value
    var groupId = "54fd06dc365422f72471319d"
    var tags = document.getElementById('tags').value.split(" ")
    
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/groups/" + groupId + "/snippets",
      data: { unique_handle: title, group: groupId, tags: JSON.stringify(tags), user: userId, content: content.innerHTML }, // Need to parse the tags array on the server side
      success: function(data){
        alert("Snippet successfully posted!")
        // console.log("Snippet successfully posted")
      },
      faiure: function(){
        console.log("Item failed to post")
        // Append an error message to the bottom of the popup
      }
    })

    $("#title").val("");
    // $("#group").val() = "";
    $("#tags").val("");

  });

});
