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
                                '  <h2 class="card__title">' + subTit + '</h2><span class="card__subtitle">By Mattia Astorino</span>' +
                                '  <p class="card__text">' + subDes + '</p>' +
                                '  <div class="card__action-bar">' +
                                '    <button class="card__button">OPEN</button>' +
                                '    <button class="card__button">DELETE</button>' +
                                '  </div>' +
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
$(document).ready(function () {
    $(".menu-button").click(function () {
        $(".menu-bar").toggleClass("open");
    })
})
// In your Javascript (external .js resource or <script> tag)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        var user = firebase.auth().currentUser;

        if (user != null) {

            var idUser = firebase.auth().currentUser.uid;
            db.collection('category').onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added' && change.doc.data().userID === idUser) {
                        $("#ListNotes_category").append('<option>' + change.doc.data().category + '</option>');
                        $("#ListNotes_category1").append('<option ">' + change.doc.data().category + '</option>');
                    }
                });
            });
        }
    }
});