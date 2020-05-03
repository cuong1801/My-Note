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
                db.collection("task").orderBy("time", "desc").get().then(snapshot => {

                    snapshot.docs.forEach(doc => {
                        var status = "" + (doc.data().status);
                        if (doc.data().userID == idUser && status == "done") {

                            var des = doc.data().task;
                            var subDes = des.slice(0, 30);
                            $("#listDones").append(
                                '<div id="' + doc.id + '" data-id="' + doc.id + '" class="alert alert-success" role="alert" style="text-align: initial; width:99%; border-left: #E8DA74 solid 8px;background-color: #EEF7FF;" >' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="deleteNote()">X</span>' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="openNav()">...</span>' +
                                '<p style="margin-bottom: -0.5rem;">' + subDes + '...</p>' +
                                '<div class="row">' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted" style="margin-bottom: 0px;">' + doc.data().category + '.</small>' +
                                '</div>' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted">' + doc.data().timeTaskShow + '</small>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div id="myOverlay' + doc.id + '" data-id="' + doc.id + '" class="w3-overlay w3-animate-opacity" onclick="closeNav2()" style="cursor:pointer" ></div>' +
                                '<div id="mySidebar' + doc.id + '" class="sidebar" style="width: 47%; display:none">' +
                                '<div>' +
                                '<div id="DetailNote' + doc.id + '" tabindex="-1" role="dialog" aria-labelledby="DetailNoteTitle" aria-hidden="true">' +
                                '<h1 id="' + doc.id + 'Linhname" class="modal-title" style="font-family:auto;color: #f60000;text-align:center">' + doc.data().task + '</h1>' +
                                '<div style="text-align: center"><em>' + doc.data().category + '</em> <em>' + doc.data().timeTaskShow + '</em></div>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                '<textarea id="textarea' + doc.id + '"class="form-control" rows="auto" style="background-color:rgb(255, 240, 240); border:none">' + doc.data().task + '</textarea>' +
                                '<img id="imgNote' + doc.id + '" style="width: 50% ; height: 50%; margin-left: 25%"></img>' +
                                '<em style="float: right;">' + doc.data().location + '</em>' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                '<button id="' + doc.id + '" type="button" style="width: 70px;height: 50px;" class="btn btn-info"  data-dismiss="modal" onclick="closeNav()">Close</button>' +
                                '<button type="button" style="width: 70px;height: 50px;" class="btn btn-info" id="' + doc.id + '" onclick="deleteNote()">Delete</button>' +
                                '<button id="' + doc.id + '" type="button" style="width: 70px;height: 50px;" class="btn btn-info"  onclick="save()">Save</button>' +
                                '</div>' +
                                '</div>'



                            );

                            var imgNote = document.getElementById("imgNote" + doc.id);
                            storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function(url) {
                                imgNote.src = url;
                            }).catch(function(error) {});
                        } else if (doc.data().userID == idUser && status == "doing") {
                            var des = doc.data().task;
                            var subDes = des.slice(0, 30);
                            $("#listDoings").append(
                                '<div id="' + doc.id + '" data-id="' + doc.id + '" class="alert alert-success" role="alert" style="text-align: initial; width:99%; border-left: #E8DA74 solid 8px;background-color: #EEF7FF;" >' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="deleteNote()">X</span>' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="openNav()">...</span>' +
                                '<p style="margin-bottom: -0.5rem;">' + subDes + '...</p>' +
                                '<div class="row">' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted" style="margin-bottom: 0px;">' + doc.data().category + '.</small>' +
                                '</div>' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted">' + doc.data().time + '</small>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div id="myOverlay' + doc.id + '" data-id="' + doc.id + '" class="w3-overlay w3-animate-opacity" onclick="closeNav2()" style="cursor:pointer" ></div>' +
                                '<div id="mySidebar' + doc.id + '" class="sidebar" style="width: 47%; display:none">' +
                                '<div>' +
                                '<div id="DetailNote' + doc.id + '" tabindex="-1" role="dialog" aria-labelledby="DetailNoteTitle" aria-hidden="true">' +
                                '<h1 id="' + doc.id + 'Linhname" class="modal-title" style="font-family:auto;color: #f60000;text-align:center">' + doc.data().task + '</h1>' +
                                '<div style="text-align: center"><em>' + doc.data().category + '</em> <em>' + doc.data().time + '</em></div>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                '<textarea id="textarea' + doc.id + '"class="form-control" rows="auto" style="background-color:rgb(255, 240, 240); border:none">' + doc.data().task + '</textarea>' +
                                '<img id="imgNote' + doc.id + '" style="width: 50% ; height: 50%; margin-left: 25%"></img>' +
                                '<em style="float: right;">' + doc.data().location + '</em>' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                '<button id="' + doc.id + '" type="button" style="width: 70px;height: 50px;" class="btn btn-info"  data-dismiss="modal" onclick="closeNav()">Close</button>' +
                                '<button type="button" style="width: 70px;height: 50px;" class="btn btn-info" id="' + doc.id + '" onclick="deleteNote()">Delete</button>' +
                                '<button id="' + doc.id + '" type="button" style="width: 70px;height: 50px;" class="btn btn-info"  onclick="save()">Save</button>' +
                                '</div>' +
                                '</div>'



                            );

                            var imgNote = document.getElementById("imgNote" + doc.id);
                            storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function(url) {
                                imgNote.src = url;
                            }).catch(function(error) {});
                        }
                    });

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

