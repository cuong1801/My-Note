var settings = {
    "url": "https://fcm.googleapis.com/fcm/send",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": "key=AAAAH4iSNQw:APA91bGYEM1uy5f_xaVj60_So9JLpqTJ07Fx-Q07CWG7b79ozB-FD8zDmauMsXmPdPloFNnSORC8GYlejIK9satnveR2OArLnhxyz8zygMwMxOpsibreaf-iqwmFv6rpLRqgUa9PlnOh",
      "Content-Type": ["application/json", "text/plain"]
    },
    "data": "{\r\n\"notification\": {\r\n\t\"title\": \"firebase\",\r\n\t\"body\" :\"firebase is awsome\",\r\n\t\"click_action\": \"https://t-notelist.web.app/main.html\",\r\n\t\"icon\": \"https://t-notelist.web.app/firebase-logo.png\"\r\n\t},\r\n\t\"to\":\"fdhK_C11tftD7Rjis92z3J:APA91bFYLjrf75CT1nxNhuIYFG4QxNw2D3lDke_c_PvbmbkoqvkY1PQXx925sDeo9KfZCwb34G15IBa5BzQCj98yBkP2H3ezT0VnPPo5BWA_HKDpZsY8IkiwvhLrl-4Dbexd4q-Ji9Bm\"\r\n}\r\n",
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });