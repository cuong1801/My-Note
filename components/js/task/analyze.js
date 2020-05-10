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
typeof (dateTime);
console.log(dateTime)
window.onload = function () {
    var dem = 0;
    var countnote = 0;
    var counttask = 0;
    // $('#listNotes').load('show_not.html');
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
                        $("#nameuser").append(
                            doc.data().lastName +
                            ' ' +
                            doc.data().firstName
                        )
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
                            countnote++;
                        }
                    })
                })
                db.collection("task").get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        if (doc.data().userID == idUser) {
                            counttask++;
                        }
                    })
                })
                db.collection("task").orderBy("time", "asc").get().then(snapshot => {

                    snapshot.docs.forEach(doc => {
                        var status = "" + (doc.data().status);
                        if (doc.data().userID == idUser && status == "done") {

                            var des = doc.data().task;
                            var subDes = des.slice(0, 30);
                            $("#listDones").append(
                                '<div id="' + doc.id + '" data-id="' + doc.id + '" class="alert alert-success" role="alert" style="text-align: initial; width:99%; border-left: #E8DA74 solid 8px;background-color: #EEF7FF;" >' +
                                '<span id="' + doc.id + '" class="btn badge badge-danger badge-pill" style="float: right"  onclick="deletetask()">X</span>' +
                                '<span id="' + doc.id + '" class="btn badge badge-danger badge-pill" style="float: right"  onclick="doing()">Doing</span>' +
                                '<p style="margin-bottom: -0.5rem;">' + subDes + '...</p>' +
                                '<div class="row">' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted" style="margin-bottom: 0px;">' + doc.data().category + '.</small>' +
                                '</div>' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted">' + doc.data().timeTaskShow + '</small>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            );
                        } else if (doc.data().userID == idUser && status == "doing") {
                            var des = doc.data().task;

                            var subDes = des.slice(0, 30);
                            $("#listDoings").append(
                                '<div id="' + doc.id + '" data-id="' + doc.id + '" class="alert alert-success" role="alert" style="text-align: initial; width:99%; border-left: #E8DA74 solid 8px;background-color: #EEF7FF;" >' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="deletetask()">X</span>' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="done()">Done</span>' +
                                '<p style="margin-bottom: -0.5rem;">' + subDes + '...</p>' +
                                '<div class="row">' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted" style="margin-bottom: 0px;">' + doc.data().category + '.</small>' +
                                '</div>' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted">' + doc.data().timeTaskShow + '</small>' +
                                '</div>' +
                                '</div>' +
                                '</div>'



                            );
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
                                        // console.log(demtask)


                                    });
                                    var tisonote = demnote / countnote * 100;
                                    var tisotask = demtask / counttask * 100;
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
                                    $("#count-chart").append(
                                        '<h4 class="small font-weight-bold">' + categorycount + '</h4>' +
                                        '<div class="progress mb-4">' +
                                        '<div class="progress-bar bg-danger" role="progressbar" style="width: ' + demnote + '%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>' +
                                        '<span class="float-right">' + tisonote.toFixed(2) + '% - (Note)</span>' +
                                        '</div>' +
                                        '<div class="progress mb-4">' +
                                        '<div class="progress-bar bg-warning" role="progressbar" style="width: ' + demtask + '%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>' +
                                        '<span class="float-right">' + tisotask.toFixed(2) + '% - (Task) </span>' +
                                        '</div>'


                                    );
                                });
                            });


                            var imgNote = document.getElementById("imgNote" + doc.id);
                            storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                imgNote.src = url;
                            }).catch(function (error) {});
                        }
                    });
                });
          
                // db.collection("task").get().then(snapshot => {

                //     snapshot.docs.forEach(doc => {
                //         // demnote++;
                //         console.log(doc.data().time)


                //     });
                // });


            }
        }
    });
}

function done() {
    var batch = db.batch();
    // alert("ssd")
    var id = event.target.id;
    // var inputedit = document.getElementById("input" + id).value;
    console.log(id);
    // alert(document.getElementById( "editcategory"+id).value)

    var newUserRef = db.collection("task").doc(id);
    batch.update(newUserRef, {
        "status": "done",
    });
    batch.commit();
    setTimeout(function () {
        window.location.href = "task.html";
    }, 1000);
}

function doing() {
    var batch = db.batch();
    // alert("ssd")
    var id = event.target.id;
    // var inputedit = document.getElementById("input" + id).value;
    // console.log(id);
    // alert(document.getElementById( "editcategory"+id).value)

    var newUserRef = db.collection("task").doc(id);
    batch.update(newUserRef, {
        "status": "doing",
    });
    batch.commit();
    setTimeout(function () {
        window.location.href = "task.html";
    }, 1000);
}

function deletetask() {
    if (confirm('You want to delete note?')) {
        var id = event.target.id;
        // alert(id);
        db.collection('task').doc(id).delete();
        // var hidden1 = 'del' + id;
        // document.getElementById(hidden1).style.display = 'none';
        // setTimeout(function () {
        //     window.location.href = "index.html";
        // }, 2000);

    } else {}
}

function logout() {
    firebase.auth().signOut().then(function () {
        window.location.assign("index.html");
    }).catch(function (error) {
        window.alert(error.message)
    });

}