// enable offline data
var notificationCheck = false;
var finish = false;
var notYet = false;
var storageRef = firebase.storage().ref();
var temp = "";
var today = new Date();
var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;
typeof(dateTime);
console.log(dateTime)
window.onload = function() {
    var dem = 0;
    // $('#listNotes').load('show_not.html');
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var user = firebase.auth().currentUser;
            if (user != null) {
                var idUser = firebase.auth().currentUser.uid;
                var docRef = db.collection('users').doc(idUser);
                // document.getElementById("register").style.display = "none";
                // document.getElementById("login").style.display = "none";

                docRef.get().then(function(doc) {

                    if (doc.exists) {
                        console.log("Document user profile:", doc.data());
                        $('#first_Name').val(doc.data().firstName);
                        $('#last_Name').val(doc.data().lastName);
                        $('#nationality').val(doc.data().nationality);
                        $('#national').text(doc.data().nationality);
                        $('#full_Name').text((doc.data().firstName) + " " + (doc.data().lastName));
                        $('#DropDownTimezone').val(doc.data().timeZone);
                        $("#nameuser").append(
                            doc.data().lastName +
                            ' ' +
                            doc.data().firstName
                        )
                        var imgProfile = document.getElementById("profile-image1");
                        storageRef.child('userImage/' + doc.data().temp).getDownloadURL().then(function(url) {
                            imgProfile.src = url;
                        }).catch(function(error) {
                            // Handle any errors
                        });

                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                    alert(error);
                });
                // var listcategory = document.getElementById("ListNotes_category").value;
                db.collection("category").get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        if (doc.data().userID == idUser) {
                            var categorycount = doc.data().category;
                            console.log(categorycount)
                            var demnote = 0;
                            var demtask = 0;

                            db.collection("notelist").where("category", "==", categorycount).get().then(snapshot => {

                                snapshot.docs.forEach(doc => {
                                    demnote++;
                                    // console.log(dem)


                                });
                                db.collection("task").where("category", "==", categorycount).get().then(snapshot => {
                                    snapshot.docs.forEach(doc => {
                                        demtask++;
                                        // console.log(dem)


                                    });
                                    $("#count-category").append(
                                        '<div class="col-xl-3 col-md-6 mb-4">' +
                                        '<div class="card border-left-primary shadow h-100 py-2">' +
                                        ' <div class="card-body">' +
                                        '<div class="row no-gutters align-items-center">' +
                                        '<div class="col mr-2">' +
                                        '<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">' + categorycount + '</div>' +
                                        '<div class="h8 mb-0 font-weight-bold text-gray-800">Note: ' + demnote + ' - Task: ' + demtask + ' </div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>'


                                    );
                                });
                            });


                            var imgNote = document.getElementById("imgNote" + doc.id);
                            storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function(url) {
                                imgNote.src = url;
                            }).catch(function(error) {});
                        }
                    });

                });
                db.collection("task").get().then(snapshot => {

                    snapshot.docs.forEach(doc => {
                        // demnote++;
                        console.log(doc.data().time)


                    });
                });


            }
        }
    });
}

function logout() {
    firebase.auth().signOut().then(function() {
        window.location.assign("index.html");
    }).catch(function(error) {
        window.alert(error.message)
    });

}