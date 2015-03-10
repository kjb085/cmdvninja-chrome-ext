// window.addEvent("domready", function () {
//     // Option 1: Use the manifest:
//     new FancySettings.initWithManifest(function (settings) {
//       settings.manifest.myButton.addEvent("action", function () {
//         alert("You clicked me!");
//       });
//     });

$(document).ready(function(){

  if(!!(localStorage['cmdv_token'])){
    console.log('User is logged in')
    console.log(localStorage.cmdv_token)
    $('#logged_out').hide()
    $('#welcome').append("Welcome " + localStorage['cmdv_username'])
  }
  else {
    console.log('User is logged out')
    $('#logged_in').hide()
  }

  $("#login").on('submit', function(event){
    event.preventDefault();

    $target = $(event.target)
    localStorage['cmdv_token'] = $target.find('input[name="token"]').val()

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/api/users/' + localStorage['cmdv_token'],
      success: function(response){ 
        localStorage['cmdv_username'] = response['username']

        $target.find('input[name="token"]').val('')
        $('#welcome').append("Welcome " + localStorage['cmdv_username'])
        $('#logged_out').toggle(false)
        $('#error').hide()
        $('#logged_in').toggle(true)

      },
      failure: function(){ // Get Gary to change the response of this to an error
        console.log("Incorrect email address or password")
        localStorage.removeItem('cmdv_token')
        $('#error').append('<h3>Token failed. Please try again.</h3>')
      }
    })

  })

  $('#logout').on('click', function(event){
    localStorage.removeItem('cmdv_token')
    localStorage.removeItem('cmdv_username')
    $('#logged_out').toggle(true)
    $('#logged_in').toggle(false)
  })

});
    
    // Option 2: Do everything manually:
    /*
    var settings = new FancySettings("My Extension", "icon.png");
    
    var username = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "username",
        "type": "text",
        "label": i18n.get("username"),
        "text": i18n.get("x-characters")
    });
    
    var password = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "password",
        "type": "text",
        "label": i18n.get("password"),
        "text": i18n.get("x-characters-pw"),
        "masked": true
    });
    
    var myDescription = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "myDescription",
        "type": "description",
        "text": i18n.get("description")
    });
    
    var myButton = settings.create({
        "tab": "Information",
        "group": "Logout",
        "name": "myButton",
        "type": "button",
        "label": "Disconnect:",
        "text": "Logout"
    });
    
    // ...
    
    myButton.addEvent("action", function () {
        alert("You clicked me!");
    });
    
    settings.align([
        username,
        password
    ]);
*/
// });
