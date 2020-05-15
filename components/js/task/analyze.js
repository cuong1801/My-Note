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
    var countnote = 0;
    var counttask = 0;
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
                                '<span id="' + doc.id + '" class="btn badge badge-danger badge-pill" style="float: right; cursor: pointer;"  onclick="deletetask()">X</span>' +
                                '<span style="cursor: pointer;pointer; float: right" class=" btn badge badge-danger badge-pill" data-toggle="modal" data-target="#editcategory' + doc.id + '">Edit</span>' +
                                '<span id="' + doc.id + '" class="btn badge badge-danger badge-pill" style="float: right; cursor: pointer;"  onclick="doing()">Doing</span>' +
                                '<p style="margin-bottom: -0.5rem;">' + subDes + '...</p>' +
                                '<div class="row">' +
                                '<div class="col-lg-4" style="width: auto;">' +
                                '<small class="text-muted" style="margin-bottom: 0px;">' + doc.data().category + '.</small>' +
                                '</div>' +
                                '<div class="col-lg-4" style="width: auto;">' +
                                '<small class="text-muted">' + doc.data().timeTaskShow + '</small>' +
                                '</div>' +
                                '<div  class="col-lg-4" style="width: auto;">' +
                                '<small class="text-muted">' + doc.data().location + '</small>' +
                                '</div>' +

                                '</div>' +

                                '</div>' +

                                ' <div class="modal fade" id="editcategory' + doc.id + '" tabindex="-1" role="dialog" aria-labelledby="editcategoryLabel" aria-hidden="true">' +
                                '<div class="modal-dialog" role="document">' +
                                ' <div class="modal-content">' +
                                ' <div class="modal-header">' +
                                '<h5 class="modal-title" id="editcategoryLabel">Edit Category</h5>' +
                                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                                ' <span aria-hidden="true">&times;</span>' +
                                ' </button>' +
                                ' </div>' +
                                ' <div class="modal-body">' +
                                '<textarea class="form-control" id="task' + doc.id + '" type="ghichu" name="message" placeholder="' + doc.data().task + '" style="width:100%; height:auto;"></textarea>' +
                                '<hr>' +
                                '<div class="container row">' +
                                '<div class="col-md-2">' +
                                '<p>Begin:</p>' +
                                '</div>' +
                                '<div class="col-md-6">' +
                                ' <input id="day_no' + doc.id + '" type="date" class="form-control " name="bday" >' +
                                '</div>' +
                                '<div class="col-md-4">' +
                                '<input id="time_no' + doc.id + '" type="time" class="form-control " name="bday">' +
                                '</div>' +
                                '</div>' +

                                '<div class="row">' +
                                ' <div class="col-md-6">' +
                                '<select class="form-control" id="listtaskcategory2">' +
                                '<option active="">' + doc.data().category + '</option>' +
                                '</select>' +
                                '<br>' +
                                '</div>' +
                                '<div class="col-md-6">' +
                                '<div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">' +
                                '<div class="input-group">' +
                                '<input id="location' + doc.id + '" type="text" class="form-control" placeholder="' + doc.data().location + '" aria-label="Location" aria-describedby="basic-addon2">' +
                                ' <div>' +
                                '<button input id="submit2" class="btn btn-primary">My Location</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                ' </div>' +
                                '</div>' +
                                ' </div>' +
                                '<div class="modal-footer">' +
                                '  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
                                ' <button id="' + doc.id + '" type="button" class="btn btn-primary" onclick= "edittask()">Save changes</button>' +
                                ' </div>' +
                                '</div>' +
                                '</div>'
                            );
                        } else if (doc.data().userID == idUser && status == "doing") {
                            var des = doc.data().task;

                            var subDes = des.slice(0, 30);
                            $("#listDoings").append(
                                '<div id="' + doc.id + '" data-id="' + doc.id + '" class="alert alert-success" role="alert" style="text-align: initial; width:99%; border-left: #E8DA74 solid 8px;background-color: #EEF7FF;" >' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right; cursor: pointer;"  onclick="deletetask()">X</span>' +
                                '<span style="cursor: pointer;pointer; float: right" class=" btn badge badge-primary badge-pill" data-toggle="modal" data-target="#editcategory' + doc.id + '">Edit</span>' +

                                // '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right; cursor: pointer;"  onclick="deletetask()">Edit</span>' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right; cursor: pointer;"  onclick="done()">Done</span>' +
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



                                ' <div class="modal fade" id="editcategory' + doc.id + '" tabindex="-1" role="dialog" aria-labelledby="editcategoryLabel" aria-hidden="true">' +
                                '<div class="modal-dialog" role="document">' +
                                ' <div class="modal-content">' +
                                ' <div class="modal-header">' +
                                '<h5 class="modal-title" id="editcategoryLabel">Edit Category</h5>' +
                                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                                ' <span aria-hidden="true">&times;</span>' +
                                ' </button>' +
                                ' </div>' +
                                ' <div class="modal-body">' +
                                '<textarea class="form-control" id="task' + doc.id + '" type="ghichu" name="message" placeholder="' + doc.data().task + '" style="width:100%; height:auto;"></textarea>' +
                                '<hr>' +
                                '<div class="container row">' +
                                '<div class="col-md-2">' +
                                '<p>Begin:</p>' +
                                '</div>' +
                                '<div class="col-md-6">' +
                                ' <input id="day_no' + doc.id + '" type="date" class="form-control " name="bday" >' +
                                '</div>' +
                                '<div class="col-md-4">' +
                                '<input id="time_no' + doc.id + '" type="time" class="form-control " name="bday">' +
                                '</div>' +
                                '</div>' +

                                '<div class="row">' +
                                ' <div class="col-md-6">' +
                                '<select class="form-control" id="listtaskcategory">' +
                                '<option active="">' + doc.data().category + '</option>' +
                                '</select>' +
                                '<br>' +
                                '</div>' +
                                '<div class="col-md-6">' +
                                '<div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">' +
                                '<div class="input-group">' +
                                '<input id="location' + doc.id + '" type="text" class="form-control" placeholder="' + doc.data().location + '" aria-label="Location" aria-describedby="basic-addon2">' +
                                ' <div>' +
                                '<button input id="submit2" class="btn btn-primary">My Location</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                ' </div>' +
                                '</div>' +
                                ' </div>' +
                                '<div class="modal-footer">' +
                                '  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
                                ' <button id="' + doc.id + '" type="button" class="btn btn-primary" onclick= "edittaskdoing()">Save changes</button>' +
                                ' </div>' +
                                '</div>' +
                                '</div>'



                            );

                        }

                    });
                    db.collection("category").get().then(snapshot => {

                        snapshot.docs.forEach(doc => {
                            if (doc.data().userID == idUser) {

                                var category = doc.data().category;

                                $("#listtaskcategory").append(
                                    '<option id="list3' + doc.id + '">' + category + '</option>'


                                );
                                $("#listtaskcategory2").append(
                                    '<option id="list3' + doc.id + '">' + category + '</option>'


                                );

                            }
                        });

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
                            storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function(url) {
                                imgNote.src = url;
                            }).catch(function(error) {});
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

function edittaskdoing() {
    var id = event.target.id;

    var day_no = "day_no" + id;

    var time_no = "time_no" + id;
    var taskDateExecute = document.getElementById(day_no).value;
    var taskTimeExecute = document.getElementById(time_no).value;
    var taskDateTimeExecute = taskDateExecute + " " + taskTimeExecute;
    var task_timeExecute = new Date(taskDateTimeExecute);
    var DDtask = task_timeExecute.getDate();
    var MMtask = task_timeExecute.getMonth() + 1;
    var YYYYtask = task_timeExecute.getFullYear();

    var htask = task_timeExecute.getHours();
    var mtask = task_timeExecute.getMinutes();
    DDtask = checkTime(DDtask);
    MMtask = checkTime(MMtask);
    YYYYtask = checkTime(YYYYtask);

    htask = checkTime(htask);
    mtask = checkTime(mtask);
    var taskTimeShow = MMtask + "/" + DDtask + "/" + YYYYtask + " " + htask + ":" + mtask;
    var idUser = firebase.auth().currentUser.uid;
    var batch = db.batch();
    // alert("ssd")
    var inputedit = document.getElementById("task" + id).value;
    var category = document.getElementById("listtaskcategory").value;
    var location = document.getElementById("location" + id).value;

    // var status = document.getElementById("status" + id).value;

    var task = document.getElementById("task" + id).value;
    // console.log(location);
    // console.log(task);
    // console.log(task_timeExecute)
    // console.log(taskTimeShow)



    // var time = document.getElementById("time" + id).value;

    // var timeTaskShow = document.getElementById("timeTaskShow" + id).value;


    // console.log(inputedit);
    // alert(document.getElementById( "editcategory"+id).value)
    // var docRef = db.collection("category").doc(id);
    var batch = db.batch();

    var newUserRef = db.collection("task").doc(id);
    batch.update(newUserRef, {
        "task": task,
        "time": task_timeExecute,
        "timeTaskShow": taskTimeShow,
        "category": category,
        "location": location,
        // "status": "doing",

    });
    batch.commit();
    // setTimeout(function() {
    //     window.location.href = "task.html";
    // }, 1500);

}

function done() {
    var batch = db.batch();
    var id = event.target.id;
    console.log(id);
    var newUserRef = db.collection("task").doc(id);
    batch.update(newUserRef, {
        "status": "done",
    });
    batch.commit();
    setTimeout(function() {
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
    setTimeout(function() {
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
    firebase.auth().signOut().then(function() {
        window.location.assign("index.html");
    }).catch(function(error) {
        window.alert(error.message)
    });

}