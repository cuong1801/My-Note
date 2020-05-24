var settings = {
  "url": "https://fcm.googleapis.com/fcm/send",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": "key=AAAAH4iSNQw:APA91bGYEM1uy5f_xaVj60_So9JLpqTJ07Fx-Q07CWG7b79ozB-FD8zDmauMsXmPdPloFNnSORC8GYlejIK9satnveR2OArLnhxyz8zygMwMxOpsibreaf-iqwmFv6rpLRqgUa9PlnOh",
    "Content-Type": ["application/json", "text/plain"]
  },
  "data": "{\r\n\"notification\": {\r\n\t\"title\": \"firebase\",\r\n\t\"body\" :\"firebase is awsome\",\r\n\t\"click_action\": \"https://t-notelist.web.app/main.html\",\r\n\t\"icon\": \"https://t-notelist.web.app/firebase-logo.png\"\r\n\t},\r\n\t\"to\":\"ezHMspgbhOYNA_U0EiFFtj:APA91bFBfTtE3Y4iBETmZ-dpWPGz6Eh7ZVOVAVnR75trzsm1Jy4d1eifTK-6uO9GFFqP7AHepVk4NU0zXj3G52E7GobHoGShAhUvlHxgRfxVqsaxfg1YWQ1wTfLXCH8BSsklA-2L-cua\"\r\n}\r\n",
};

$.ajax(settings).done(function (response) {
  console.log(response);
});