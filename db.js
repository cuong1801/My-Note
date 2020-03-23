// enable offline data
var notificationCheck = false;
var finish = false;
var notYet = false;
var storageRef = firebase.storage().ref();

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

window.onload = function () {
    var dem = 0;
    $('#listNotes').load('show_not.html');
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            var user = firebase.auth().currentUser;

            if (user != null) {
                var idUser = firebase.auth().currentUser.uid;
                var docRef = db.collection('users').doc(idUser);
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
 
                                '<div class="card card--medium">' +
                                '  <h2 class="card__title">'+subTit+'</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                '  <p class="card__text">'+subDes+'</p>' +
                                '  <div class="card__action-bar">' +
                                '    <button class="card__button">SHARE</button>' +
                                '    <button class="card__button">LEARN MORE</button>' +
                                '  </div>' +
                                '</div>'
                                //ádasd
                                // '<div class="accordion" id="accordion-tab-' + doc.id + '">' +
                                // '<div class="card">' +
                                // '<div class="card-header" id="accordion-tab-' + doc.id + '-heading-' + doc.id + '">' +
                                // '<h5>' +
                                // '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#accordion-tab-' + doc.id + '-content-' + doc.id + '" aria-expanded="false" aria-controls="accordion-tab-' + doc.id + '-content-' + doc.id + '">' + subTit + '</button></h5> ' +
                                // '</div>' +
                                // ' <div class="collapsing " id="accordion-tab-' + doc.id + '-content-' + doc.id + '" aria-labelledby="accordion-tab-1-heading-1" data-parent="#accordion-tab-' + doc.id + '">' +
                                // '<div class="card-body">' +
                                // '<p></p>' +
                                // '<p class="p small ">Content:' + subDes + '</p>' +
                                // '</div>' +
                                // '</div>' +
                                // '<div class="go-corner" >' +
                                // '<div id="' + doc.id + '" class="go-arrow btn btn-outline-danger" onclick="deleteNote()">' +
                                // 'x' +
                                // '</div>' +
                                // '</div>' +
                                // '<div  data-toggle="modal" data-target="#exampleModalScrollable' + doc.id + '">' +

                                // '<h4 id="' + doc.id + 'Linhcategory" class="h4" style="margin-top:20px;">' + doc.data().category + '</h4>' +

                                // '<div class="dimmer"> <h6 class="h6">' + doc.data().timepostShow + '</h6></div>' +
                                // '<div class="dimmer"> <h6 class="h6">' + doc.data().timenotification + '</h6></div>' +

                                // '</div>' +

                                // '</a>' +

                                // '<div class="modal fade" id="exampleModalScrollable' + doc.id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">' +
                                // '<div class="modal-dialog modal-dialog-scrollable" role="document">' +
                                // '<div class="modal-content">' +
                                // '<div class="modal-header">' +
                                // '<h1 id="' + doc.id + 'Linhname" class="modal-title">' + doc.data().name + '</h1>' +
                                // '<small style="padding: 15px;"><em>' + doc.data().category + '</em></small>' +

                                // '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                                // '<span aria-hidden="true">&times;</span>' +
                                // '</button>' +
                                // '</div>' +
                                // '<div class="modal-body">' +
                                // '<small><em>' + doc.data().timepostShow + '</em></small>' +
                                // '<div class="dimmer"> <h6 id="' + doc.id + 'Linhnotification" class="h6">' + doc.data().timenotification + '</h6></div>' +
                                // '<small ><em id="' + doc.id + 'Linhlocation"> ' + doc.data().location + '</em></small><br>' +
                                // '<pre>' + doc.data().content + '</pre>' +

                                // '<textarea id="' + doc.id + 'Linhcontent"class="form-control" rows="7">' + doc.data().content + '</textarea>' +
                                // '<img id="imgNote' + doc.id + '" style="width: 50% ; height: 50%; margin-left: 25%"></img>' +

                                // '</div>' +
                                // '<div class="modal-footer">' +
                                // '<button type="button" style="width: 70px;height: 50px;" class="btn btn-info"  data-dismiss="modal">Close</button>' +
                                // '<button type="button" style="width: 70px;height: 50px;" class="btn btn-info" id="' + doc.id + '" onclick="deleteNote()">Delete</button>' +
                                // '<button type="button" style="width: 70px;height: 50px;" class="btn btn-info"  onclick="save(\'' + doc.id + '\',\'' + doc.data().image + '\')">Save</button>' +

                                // '</div>' +
                                // ' </div>' +
                                // '</div>' +
                                // '</div>' +
                                // ' </div>' +
                                // '</div>' +
                                // '</div>'

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