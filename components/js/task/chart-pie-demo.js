// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
// var  category =  new Array();
// category =["xxx"];
var category = [];
var count = [];
var backgroundCategory = [];

// var newLength = category.push('Orange1');
// var newLength = category.push('Orange2');
// var newLength = category.push('Orange3');

// var newLength = count.push('0');
// var newLength = count.push('0');
// var newLength = count.push('0');

// var newLength = backgroundCategory.push('#4e73df');
// var newLength = backgroundCategory.push('#1cc88a');
// var newLength = backgroundCategory.push('#36b9cc');
// ['#4e73df', '#1cc88a', '#36b9cc']
// count = count.push(xx)
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      var idUser = firebase.auth().currentUser.uid;
      var docRef = db.collection('users').doc(idUser);
      // document.getElementById("register").style.display = "none";
      // document.getElementById("login").style.display = "none";

      docRef.get().then(function (doc) {

        if (doc.exists) {
          console.log("Document user profile:", doc.data());
          $('#first_Name').val(doc.data().firstName);
          $('#last_Name').val(doc.data().lastName);
          $('#nationality').val(doc.data().nationality);
          $('#national').text(doc.data().nationality);
          $('#full_Name').text((doc.data().firstName) + " " + (doc.data().lastName));
          $('#DropDownTimezone').val(doc.data().timeZone);
         
          var imgProfile = document.getElementById("profile-image1");
          storageRef.child('userImage/' + doc.data().temp).getDownloadURL().then(function (url) {
            imgProfile.src = url;
          }).catch(function (error) {
            // Handle any errors
          });

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
        alert(error);
      });
      db.collection("category").get().then(snapshot => {

        snapshot.docs.forEach(doc => {
          if (doc.data().userID == idUser) {
            var newLength = category.push(doc.data().category);
            var newLength = backgroundCategory.push(doc.data().color);
            
            $("#charttask").append(
              '<span class="mr-2">' +
              '<i class="fas fa-circle" style="color: '+doc.data().color+'"></i> ' + doc.data().category + '</span>'
          );
          }
        });
        // console.log(category)

        for (var i = 0; i < category.length; i++) {

          categoryfind = category[i];
          var demtask = 0;

          db.collection("task").where("category", "==", categoryfind).get().then(snapshot => {

            snapshot.docs.forEach(doc => {
              demtask++;
              var newLength = count.push(demtask);
            });
            console.log(count)

            var ctx = document.getElementById("myPieChart");

            var myPieChart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: category,
                datasets: [{
                  data: count,
                  backgroundColor: backgroundCategory,
                  // hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                  hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
              },
              options: {
                maintainAspectRatio: false,
                tooltips: {
                  backgroundColor: "rgb(255,255,255)",
                  bodyFontColor: "#858796",
                  borderColor: '#dddfeb',
                  borderWidth: 1,
                  xPadding: 15,
                  yPadding: 15,
                  displayColors: false,
                  caretPadding: 10,
                },
                legend: {
                  display: false
                },
                cutoutPercentage: 80,
              },
            });
          });

        }

      });

    }
  }
});
// console.log(category)

var ctx = document.getElementById("myPieChart");

var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: category,
    datasets: [{
      data: count,
      backgroundColor: backgroundCategory,
      // hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});