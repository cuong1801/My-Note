var curToken;
messaging.usePublicVapidKey('BDUDGf1Xw7Dn1NXRzNBiEG-6qT0wQCRR2pnTsK4GtbYTj-wYR8JKbzcBR_Sw4gjo0aPGjmE6AwneQJLGke8kn2A');

console.log('Requesting permission...');
// [START request_permission]
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    // [START_EXCLUDE]
    // In many cases once an app has been granted notification permission,
    // it should update its UI reflecting this.
    resetUI();
    // [END_EXCLUDE]
  } else {
    console.log('Unable to get permission to notify.');
  }
});
// [END request_permission]

// Clear the messages element of all children.
//  function clearMessages() {
//   const messagesElement = document.querySelector('#messages');
//   while (messagesElement.hasChildNodes()) {
//     messagesElement.removeChild(messagesElement.lastChild);
//   }
// }

function resetUI() {
  //clearMessages();
  // showToken('loading...');
  // [START get_token]
  // Get Instance ID token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  messaging.getToken().then((currentToken) => {
    if (currentToken) {
      curToken = currentToken;
      console.log(currentToken);
      sendTokenToServer(currentToken);
      // updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      setTokenSentToServer(false);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });
  // [END get_token]
}

// function showToken(currentToken) {
//   // Show token in console and UI.
//   const tokenElement = document.querySelector('#token');
//   tokenElement.textContent = currentToken;
// }

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
      'unless it changes');
  }

}

function updateUIForPushEnabled(currentToken) {
  showHideDiv(tokenDivId, true);
  showHideDiv(permissionDivId, false);
  showToken(currentToken);
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1';
}

// messaging.onMessage(function(payload){
//   console.log("Message receive:.... " + payload.data);
//   // var title = payload.data.title ;
//   // var options = {
//   //   body: payload.data.body,
//   //   icon: payload.data.icon,
//   //   image: payload.data.image,
//   // };
//   // var myNotification = new Notification(title, options);
// });

messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  var title = payload.notification.title;
  var options = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  var myNotification = new Notification(title, options);
});