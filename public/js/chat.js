const socket = io();
//Elements
const $messageForm = document.querySelector("#Message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocation = document.querySelector("#send-Location");
const $messages = document.querySelector('#messages')
const $locationmessage = document.querySelector('#locationmessage')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationtemplate = document.querySelector('#location-message-template').innerHTML
//Options
const  {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
});
socket.on('locationmessage', (urlmessage) => {
  console.log(urlmessage)
  const html = Mustache.render(locationtemplate, {
    urlmessage:urlmessage.url,
    createdAt:moment(urlmessage.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)

})
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  //disable
  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    //enable
    if (error) {
      return console.log(error);
    }
    console.log("Message Delivered !");
  });
});

$sendLocation.addEventListener("click", () => {
  if (window.isSecureContext) {
    if (navigator.geolocation) {
      return alert("GeoLocation is not supported by your browser");
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit( "sendLocation", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },  () => {
          $sendLocationButton.removeAttribute('disabled')
          console.log("prining location shared");
        }
      );
    });
  }
});
socket.emit('join',{username,room})
