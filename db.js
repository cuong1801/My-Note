// enable offline data
var notificationCheck = false;
var finish = false;
var notYet = false;
var storageRef = firebase.storage().ref();
var temp = "";

db.enablePersistence()
    .catch(function (err) {
        if (err.code == 'failed-precondition') {
            // probably multible tabs open at once
            console.log('persistance failed');
        } else if (err.code == 'unimplemented') {
            // lack of browser support for the feature
            console.log('persistance not available');
        }
    });

var searchBar = document.querySelector(".page-banner .search__input");
console.log(searchBar)
searchBar.onkeyup = function () {
    // console.log(searchBar)

    var searchItem = searchBar.value.toLowerCase();
    // console.log(searchItem)

    var books = document.querySelectorAll(".alert");
    // console.log(books)

    books.forEach(book => {
        var title = book.textContent;
        //indexOf returns -1 if an element can't be found in an array. So if the result is not -1, the elemnt exist and should be shown. Otherwise, it is hidden. 
        if (title.toLowerCase().indexOf(searchItem) != -1) {
            book.style.display = 'block';
        } else {
            book.style.display = "none";
        }
    });
};
window.onload = function () {
    var dem = 0;
    $('#listNotes').load('show_not.html');
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var user = firebase.auth().currentUser;
            if (user != null) {
                var idUser = firebase.auth().currentUser.uid;
                var docRef = db.collection('users').doc(idUser);
                document.getElementById("register").style.display = "none";
                document.getElementById("login").style.display = "none";

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
                // var listcategory = document.getElementById("ListNotes_category").value;
                db.collection("notelist").orderBy("timepost", "desc").get().then(snapshot => {

                    snapshot.docs.forEach(doc => {
                        if (doc.data().userID == idUser) {

                            var des = doc.data().content;
                            var tit = doc.data().name;
                            var subTit = tit.slice(0, 30);
                            var subDes = des.slice(0, 30);
                            $("#name_notes").append(
                                '<div id="' + doc.id + '" data-id="' + doc.id + '" class="alert alert-success" role="alert" style="text-align: initial; width:99%; border-left: #E8DA74 solid 8px;background-color: #EEF7FF;" >' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="deleteNote()">X</span>' +
                                '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="openNav()">...</span>' +
                                '<p style="margin-bottom: -0.5rem;">' + subTit + '...</p>' +
                                '<div class="row">' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted" style="margin-bottom: 0px;">' + doc.data().category + '.</small>' +
                                '</div>' +
                                '<div class="col-lg-6" style="width: auto;">' +
                                '<small class="text-muted">' + doc.data().timepostShow + '</small>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div id="myOverlay' + doc.id + '" data-id="' + doc.id + '" class="w3-overlay w3-animate-opacity" onclick="closeNav2()" style="cursor:pointer" ></div>' +
                                '<div id="mySidebar' + doc.id + '" class="sidebar" style="width: 47%; display:none">' +
                                '<div>' +
                                '<div id="DetailNote' + doc.id + '" tabindex="-1" role="dialog" aria-labelledby="DetailNoteTitle" aria-hidden="true">' +
                                '<h1 id="' + doc.id + 'Linhname" class="modal-title" style="font-family:auto;color: #f60000;text-align:center">' + doc.data().name + '</h1>' +
                                '<div style="text-align: center"><em>' + doc.data().category + '</em> <em>' + doc.data().timepostShow + '</em></div>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                '<textarea id="textarea' + doc.id + '"class="form-control" rows="auto" style="background-color:rgb(255, 240, 240); border:none">' + doc.data().content + '</textarea>' +
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
                            storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                imgNote.src = url;
                            }).catch(function (error) {});
                        }
                    });

                });
                db.collection("category").get().then(snapshot => {

                    snapshot.docs.forEach(doc => {
                        if (doc.data().userID == idUser) {

                            var category = doc.data().category;
                            $("#ListNotes_category").append(
                                '<option id="list1' + doc.id + '">' + category + '</option>'
                            );
                            $("#ListNotes_category1").append(
                                '<option id="list2' + doc.id + '">' + category + '</option>'


                            );
                            $("#ListNotes_categorytask").append(
                                '<option id="list3' + doc.id + '">' + category + '</option>'


                            );
                            // $("#color").append(
                            //     '<span class="badge badge-primary badge-pill">color</span>'


                            // );

                            $("#todos").append(

                                '<li id="list3' + doc.id + '">' +
                                ' <input id="checkbox-1" type="checkbox">' +
                                '<label for="checkbox-1">' +
                                category +
                                '<span style="background-color: #EEF7FF" class="box"></span>' +
                                '<span style="cursor: pointer; float: right" id="' + doc.id + '" class="badge badge-primary badge-pill" onclick="deleteCategory()">Del</span>' +
                                '<span style="cursor: pointer;pointer; float: right" class="badge badge-primary badge-pill" data-toggle="modal" data-target="#editcategory' + doc.id + '">Edit</span>' +
                                '</label>' +
                                '</li>' +

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
                                ' <input class="input input-control form-control" type="text" placeholder="' + category + '"id="input' + doc.id + '" ></input>' +
                                ' </div>' +
                                '<div class="modal-footer">' +
                                '  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
                                ' <button id="' + doc.id + '" type="button" class="btn btn-primary" onclick= "editCategory()">Save changes</button>' +
                                ' </div>' +
                                '</div>' +
                                '</div>'


                            );
                        }
                    });

                });

            }
        } else {
            document.getElementById("logout").style.display = "none";
        }
    });
}
$(document).ready(function () {
    $(".menu-button").click(function () {
        $(".menu-bar").toggleClass("open");
    })
})

function openNav() {
    var id = "mySidebar" + event.target.id;
    var myOverlay = "myOverlay" + event.target.id;
    document.getElementById(id).style.display = "block";
    document.getElementById(myOverlay).style.display = "block";
}

function closeNav() {
    var id = "mySidebar" + event.target.id;
    var myOverlay = "myOverlay" + event.target.id;
    document.getElementById(id).style.display = "none";
    document.getElementById(myOverlay).style.display = "none";
}

function closeNav2() {
    var id = event.target.id;
    var myOverlay = document.getElementById(id).dataset.id;
    var mySidebar = "mySidebar" + myOverlay;
    var myOverlay = "myOverlay" + myOverlay;
    document.getElementById(mySidebar).style.display = "none";
    document.getElementById(myOverlay).style.display = "none";
}

function deleteNote() {
    if (confirm('You want to delete note?')) {
        var id = event.target.id;
        alert(id);
        db.collection('notelist').doc(id).delete();
        // var hidden1 =  id;
        // document.getElementById(hidden1).style.display = 'none';
        setTimeout(function () {
            window.location.href = "index.html";
        }, 2000);

    } else {}
}
var NewNotes_name = document.getElementById("NewNotes_name");
var NewNotes_location = document.getElementById("location_Name");
var NewNotes_content = document.getElementById("NewNotes_content");
var category_Name = document.getElementById("category_Name");
var ListNotes_category = document.getElementById("ListNotes_category");
var quicknote_content = document.getElementById("new-quick-note")

function addnewcategory() {
    var category_Name_text = category_Name.value;
    var category_Name_text_value = category_Name_text.trim();
    if (category_Name_text_value.length === 0 || category_Name_text_value.length > 20) {
        alert('Title are required to continue!');
    } else {
        var n = 0;
        db.collection('category').add({
                category: document.getElementById("category_Name").value,
                color: '',
                userID: firebase.auth().currentUser.uid,
            })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                alert(error);
                console.error("Error adding document: ", error);
            });
    }
    setTimeout(function () {
        window.location.href = "index.html";
    }, 1500);
}

function addquicknote() {
    var quick_name_note = quicknote_content.value;
    var quick_name_note_text_value = quick_name_note.trim();
    if (quick_name_note_text_value.length === 0 || quick_name_note_text_value.length > 10) {
        alert('Title are required to continue!');
    } else {
        var n = 0;
        db.collection('quicknote').add({
                content: document.getElementById("new-quick-note").value,
                userID: firebase.auth().currentUser.uid,
                image: temp
            })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                alert(error);
                console.error("Error adding document: ", error);
            });
    }

}

function deleteCategory() {
    if (confirm('You want to delete note?')) {
        // var idUser = firebase.auth().currentUser.uid;

        var id = event.target.id;
        // alert(id);
        // var docRef = db.collection("category").doc(id);
        // docRef.get().then(function (doc) {
        //     if (doc.exists) {
        //         if (doc.data().userID == idUser) {
        //             var namecategory = doc.data().category;
        //             // console.log(namecategory)

        //             db.collection("notelist").get().then(snapshot => {

        //                 snapshot.docs.forEach(doc => {
        //                     if (doc.data().userID == idUser && doc.data().category == namecategory) {
        //                         console.log("doc.data().name")

        //                     }
        //                 });

        //             });
        //         }
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //     }
        // }).catch(function (error) {
        //     console.log("Error getting document:", error);
        // });
        db.collection('category').doc(id).delete();

        var hidden1 = 'list1' + id;
        var hidden2 = 'list2' + id;
        var hidden3 = 'list3' + id;

        document.getElementById(hidden2).style.display = 'none';
        document.getElementById(hidden1).style.display = 'none';
        document.getElementById(hidden3).style.display = 'none';
        // db.collection("category").doc(id).get().then(snapshot => {
        //     snapshot.docs.forEach(doc => {

        //     });
        // });

        // setTimeout(function () {
        //     window.location.href = "index.html";
        // }, 1500);
    } else {


    }

}

function editCategory() {
    var batch = db.batch();
    // alert("ssd")
    var id = event.target.id;
    var inputedit = document.getElementById("input" + id).value;
    // console.log(inputedit);
    // alert(document.getElementById( "editcategory"+id).value)

    var newUserRef = db.collection("category").doc(id);
    batch.update(newUserRef, {
        "category": inputedit,
    });
    batch.commit();
    setTimeout(function () {
        window.location.href = "index.html";
    }, 1500);

}


function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
document.getElementById('NewNotes_checkTime').onclick = function (e) {
    var check = false;
    if (this.checked) {
        document.getElementById('notification').style.display = 'block';
    } else {
        document.getElementById('notification').style.display = 'none';
    }

};

function save() {

    var batch = db.batch();
    // alert("ssd")
    var id = event.target.id;
    var inputedit = document.getElementById("textarea" + id).value;
    // console.log(id);
    // alert(document.getElementById( "editcategory"+id).value)

    var newUserRef = db.collection("notelist").doc(id);
    batch.update(newUserRef, {
        "content": inputedit,
    });
    batch.commit();
    setTimeout(function () {
        window.location.href = "index.html";
    }, 1500);

}

function writeNotesData() {
    var today = new Date();
    var timepost;

    var DD = today.getDate();
    var MM = today.getMonth() + 1;
    var YYYY = today.getFullYear();

    var h = today.getHours();
    var m = today.getMinutes();
    DD = checkTime(DD);
    MM = checkTime(MM);
    YYYY = checkTime(YYYY);

    h = checkTime(h);
    m = checkTime(m);
    timepost = MM + "/" + DD + "/" + YYYY + " " + h + ":" + m;
    var Note_timepost = new Date(timepost);

    var NewNotes_name_text = NewNotes_name.value;
    var NewNotes_location_text = NewNotes_location.value;
    var NewNotes_name_text_value = NewNotes_name_text.trim();

    var dateExecute = document.getElementById("day_no").value;
    var timeExecute = document.getElementById("time_no").value;
    var dateTimeExecute = dateExecute + " " + timeExecute;
    var Note_timeExecute = new Date(dateTimeExecute);

    var DD2 = Note_timeExecute.getDate();
    var MM2 = Note_timeExecute.getMonth() + 1;
    var YYYY2 = Note_timeExecute.getFullYear();

    var h2 = Note_timeExecute.getHours();
    var m2 = Note_timeExecute.getMinutes();
    DD2 = checkTime(DD2);
    MM2 = checkTime(MM2);
    YYYY2 = checkTime(YYYY2);

    h2 = checkTime(h2);
    m2 = checkTime(m2);
    timepost2 = MM2 + "/" + DD2 + "/" + YYYY2 + " " + h2 + ":" + m2;
    var Note_timepost2;
    if (timepost2.includes("NaN")) {
        timepost2 = "";
        Note_timepost2 = "";
    } else {
        Note_timepost2 = new Date(timepost2);
    }

    alert(timepost2);
    if (NewNotes_name_text_value.length === 0 || NewNotes_name_text_value.length > 20) {
        alert('Title are required to continue!');
    } else {
        var n = 0;
        db.collection('notelist').add({
                name: document.getElementById("NewNotes_name").value,
                location: document.getElementById("location_Name").value,
                timepost: Note_timepost,
                timepostShow: timepost,
                timenotification: timepost2,
                timepostNotification: Note_timepost2,
                content: document.getElementById("NewNotes_content").value,
                category: document.getElementById("ListNotes_category1").value,
                userID: firebase.auth().currentUser.uid,
                image: temp

            })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                alert(error);
                console.error("Error adding document: ", error);
            });
    }
    setTimeout(function () {
        window.location.href = "index.html";
    }, 2000);
    //window.location="index.html";
}

//listen for image profile selection
var tempProfile = "";
var userImg = document.getElementById('profile-image-upload');
userImg.addEventListener('change', function (e) {
    //get file
    var file = e.target.files[0];
    //create a storage ref

    var storageRef = firebase.storage().ref('/userImage/' + file.name);
    //upload file
    var task = storageRef.put(file);
    tempProfile = file.name;
    // upload progress bar
    task.on('state_changed',
        function progress(snapshot) {
            var percentage = (snapshot.bytedTransferred / snapshot.totalByles) * 100;
            // uploader.value = percentage;
        },
        function error(err) {
            alert(err);

        },
        function complete() {

        }
    );
});
var category_selected = "";

function Category_select(category) {
    // document.getElementById("search").value = "";
    var options = category.children;
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
            category_selected = options[i].value;
            // category_Name.value = category_selected;
            $('#listNotes').load('show_not.html');
            if (finish) {
                done();
            } else if (notYet) {
                doing();
            } else if (notificationCheck) {
                Notificationshow();
            } else {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {

                        var user = firebase.auth().currentUser;

                        if (user != null) {
                            var idUser = firebase.auth().currentUser.uid;
                            // var listcategory = document.getElementById("ListNotes_category").value;


                            db.collection("notelist").where('category', '==', category_selected).orderBy("timepost", "desc").get().then(snapshot => {
                                snapshot.docs.forEach(doc => {

                                    if (doc.data().userID == idUser) {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="' + doc.id + '" data-id="' + doc.id + '" class="alert alert-success" role="alert" style="text-align: initial; width:99%;cursor: pointer; border-left: #E8DA74 solid 8px;background-color: #EEF7FF;" onclick="openNav()">' +
                                            '<span id="' + doc.id + '" class="btn badge badge-primary badge-pill" style="float: right"  onclick="deleteNote()">X</span>' +
                                            '<p style="margin-bottom: -0.5rem;">' + subTit + '...</p>' +
                                            '<div class="row">' +
                                            '<div class="col-lg-6" style="width: auto;">' +
                                            '<small class="text-muted" style="margin-bottom: 0px;">' + doc.data().category + '.</small>' +
                                            '</div>' +
                                            '<div class="col-lg-6" style="width: auto;">' +
                                            '<small class="text-muted">' + doc.data().timepostShow + '</small>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '<div id="myOverlay' + doc.id + '" data-id="' + doc.id + '" class="w3-overlay w3-animate-opacity" onclick="closeNav2()" style="cursor:pointer" ></div>' +
                                            '<div id="mySidebar' + doc.id + '" class="sidebar" style="width: 70%; display:none">' +
                                            '<div id="DetailNote' + doc.id + '" tabindex="-1" role="dialog" aria-labelledby="DetailNoteTitle" aria-hidden="true">' +
                                            '<h1 id="' + doc.id + 'Linhname" class="modal-title" style="font-family:auto;color: #f60000;text-align:center">' + doc.data().name + '</h1>' +
                                            '<div style="text-align: center"><em>' + doc.data().category + '</em> <em>' + doc.data().timepostShow + '</em></div>' +
                                            '</div>' +
                                            '<div class="modal-body">' +
                                            '<textarea id="textarea' + doc.id + '"class="form-control" rows="7" style="background-color:rgb(255, 240, 240); border:none">' + doc.data().content + '</textarea>' +
                                            '<img id="imgNote' + doc.id + '" style="width: 50% ; height: 50%; margin-left: 25%"></img>' +
                                            '<em style="float: right;">' + doc.data().location + '</em>' +
                                            '</div>' +
                                            '<div class="modal-footer">' +
                                            '<button id="' + doc.id + '" type="button" style="width: 70px;height: 50px;" class="btn btn-info"  data-dismiss="modal" onclick="closeNav()">Close</button>' +
                                            '<button type="button" style="width: 70px;height: 50px;" class="btn btn-info" id="' + doc.id + '" onclick="deleteNote()">Delete</button>' +
                                            '<button id="' + doc.id + '" type="button" style="width: 70px;height: 50px;" class="btn btn-info"  onclick="save()">Save</button>' +
                                            '</div>'


                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }
    }
}

var searchBar = document.querySelector(".search__input");
console.log(document.querySelector(".search__input"))
// alert("ád")
// searchBar.onkeyup = function(){      
//   var searchItem = searchBar.value.toLowerCase(); 
//  var books = document.querySelectorAll("li"); 
//   books.forEach(book =>{
//     var title = book.textContent;
//     //indexOf returns -1 if an element can't be found in an array. So if the result is not -1, the elemnt exist and should be shown. Otherwise, it is hidden. 
//     if(title.toLowerCase().indexOf(searchItem)!= -1){
// book.style.display = 'block';      
//     }
//      else{
//       book.style.display = "none";
//     }
//   });
// };

function search() {
    $('#listNotes').load('show_not.html');
    var tim = document.getElementById("search").value;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var user = firebase.auth().currentUser;

            if (user != null) {
                var idUser = firebase.auth().currentUser.uid;
                // var listcategory = document.getElementById("ListNotes_category").value;
                db.collection("notelist").orderBy("timepost", "desc").get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        var tim2 = "" + (doc.data().name).toLowerCase();
                        if (finish) {
                            if (doc.data().userID == idUser) {
                                var des = doc.data().content;
                                var tit = doc.data().name;
                                var subTit = tit.slice(0, 30);
                                var subDes = des.slice(0, 30);
                                var curDay = new Date();
                                var linhDay = new Date(doc.data().timenotification);
                                if (linhDay < curDay) {
                                    if (tim == "" && category_selected == "") {
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim == "" && category_selected == doc.data().category) {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim2.includes(tim.toLowerCase()) && category_selected == "") {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim2.includes(tim.toLowerCase()) && category_selected == doc.data().category) {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    }
                                }
                            }
                        } else if (notYet) {
                            if (doc.data().userID == idUser) {
                                var des = doc.data().content;
                                var tit = doc.data().name;
                                var subTit = tit.slice(0, 30);
                                var subDes = des.slice(0, 30);
                                var curDay = new Date();
                                var linhDay = new Date(doc.data().timenotification);
                                if (linhDay >= curDay) {
                                    if (tim == "" && category_selected == "") {
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim == "" && category_selected == doc.data().category) {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim2.includes(tim.toLowerCase()) && category_selected == "") {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim2.includes(tim.toLowerCase()) && category_selected == doc.data().category) {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    }
                                }
                            }
                        } else if (notificationCheck) {
                            if (doc.data().userID == idUser) {
                                var curDay = new Date();
                                var linhDay = new Date(doc.data().timenotification);
                                var des = doc.data().content;
                                var tit = doc.data().name;
                                var subTit = tit.slice(0, 30);
                                var subDes = des.slice(0, 30);
                                if (curDay.getFullYear() == linhDay.getFullYear() && curDay.getMonth() == linhDay.getMonth() && curDay.getDate() == linhDay.getDate() && linhDay.getTime() >= curDay.getTime()) {
                                    if (tim == "" && category_selected == "") {
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim == "" && category_selected == doc.data().category) {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim2.includes(tim.toLowerCase()) && category_selected == "") {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    } else if (tim2.includes(tim.toLowerCase()) && category_selected == doc.data().category) {
                                        var des = doc.data().content;
                                        var tit = doc.data().name;
                                        var subTit = tit.slice(0, 30);
                                        var subDes = des.slice(0, 30);
                                        $("#name_notes").append(
                                            '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                            '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                            '  <p class="card__text">' + subDes + '</p>' +
                                            '  <div class="card__action-bar">' +
                                            '    <button class="card__button">OPEN</button>' +
                                            '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                            '  </div>' +
                                            '</div>'

                                        );

                                        var imgNote = document.getElementById("imgNote" + doc.id);
                                        storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                            imgNote.src = url;
                                        }).catch(function (error) {});
                                    }
                                }
                            }
                        } else {
                            var des = doc.data().content;
                            var tit = doc.data().name;
                            var subTit = tit.slice(0, 30);
                            var subDes = des.slice(0, 30);
                            if (tim == "" && category_selected == "") {
                                $("#name_notes").append(
                                    '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                    '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                    '  <p class="card__text">' + subDes + '</p>' +
                                    '  <div class="card__action-bar">' +
                                    '    <button class="card__button">OPEN</button>' +
                                    '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                    '  </div>' +
                                    '</div>'

                                );

                                var imgNote = document.getElementById("imgNote" + doc.id);
                                storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                    imgNote.src = url;
                                }).catch(function (error) {});
                            } else if (tim == "" && category_selected == doc.data().category) {
                                var des = doc.data().content;
                                var tit = doc.data().name;
                                var subTit = tit.slice(0, 30);
                                var subDes = des.slice(0, 30);
                                $("#name_notes").append(
                                    '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                    '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                    '  <p class="card__text">' + subDes + '</p>' +
                                    '  <div class="card__action-bar">' +
                                    '    <button class="card__button">OPEN</button>' +
                                    '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                    '  </div>' +
                                    '</div>'

                                );

                                var imgNote = document.getElementById("imgNote" + doc.id);
                                storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                    imgNote.src = url;
                                }).catch(function (error) {});
                            } else if (tim2.includes(tim.toLowerCase()) && category_selected == "") {
                                var des = doc.data().content;
                                var tit = doc.data().name;
                                var subTit = tit.slice(0, 30);
                                var subDes = des.slice(0, 30);
                                $("#name_notes").append(
                                    '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                    '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                    '  <p class="card__text">' + subDes + '</p>' +
                                    '  <div class="card__action-bar">' +
                                    '    <button class="card__button">OPEN</button>' +
                                    '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                    '  </div>' +
                                    '</div>'

                                );

                                var imgNote = document.getElementById("imgNote" + doc.id);
                                storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                    imgNote.src = url;
                                }).catch(function (error) {});
                            } else if (tim2.includes(tim.toLowerCase()) && category_selected == doc.data().category) {
                                var des = doc.data().content;
                                var tit = doc.data().name;
                                var subTit = tit.slice(0, 30);
                                var subDes = des.slice(0, 30);
                                $("#name_notes").append(
                                    '<div id="del' + doc.id + '" data-id="' + doc.id + '" class="card card--medium">' +
                                    '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                    '  <p class="card__text">' + subDes + '</p>' +
                                    '  <div class="card__action-bar">' +
                                    '    <button class="card__button">OPEN</button>' +
                                    '    <button id="' + doc.id + '" class="card__button" onclick="deleteNote()">DELETE</button>' +
                                    '  </div>' +
                                    '</div>'

                                );

                                var imgNote = document.getElementById("imgNote" + doc.id);
                                storageRef.child('NoteImage/' + doc.data().image + '').getDownloadURL().then(function (url) {
                                    imgNote.src = url;
                                }).catch(function (error) {});
                            }
                        }
                    });
                });
            }
        }
    });
}

var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');
//listen for file selection
fileButton.addEventListener('change', function (e) {
    //get file
    var file = e.target.files[0];
    //create a storage ref
    console.log(file);
    var storageRef = firebase.storage().ref('NoteImage/' + file.name);
    //upload file
    var task = storageRef.put(file);
    temp = file.name;
    alert(temp);
    // upload progress bar
    task.on('state_changed',
        function progress(snapshot) {
            var percentage = (snapshot.bytedTransferred / snapshot.totalByles) * 100;
            // uploader.value = percentage;
        },
        function error(err) {

        },
        function complete() {

        }
    );
});

function addtask() {
    var NewTask_content_text = NewTask_content.value;
    var NewTask_content_text_value = NewTask_content_text.trim();
    var taskDateExecute = document.getElementById("day_no").value;
    var taskTimeExecute = document.getElementById("time_no").value;
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
    if (NewTask_content_text_value.length === 0) {
        alert('Title are required to continue!');
    } else {
        var n = 0;
        db.collection('task').add({
                task: document.getElementById("NewTask_content").value,
                time: task_timeExecute,
                timeTaskShow: taskTimeShow,
                category: document.getElementById("ListNotes_categorytask").value,
                location: document.getElementById("location_Name").value,
                status: "doing",
                userID: firebase.auth().currentUser.uid,
            })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                alert(error);
                console.error("Error adding document: ", error);
            });
        setTimeout(function () {
            window.location.href = "main.html";
        }, 1500);
    }
}