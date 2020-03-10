//EXERCICE MADE ACCORDING TO THE NET NINJA JAVCASCRIPT TUTORIAL.
//SELECTORS
var deletebtn = document.querySelectorAll(".delete")

var booklist = document.querySelector(".book-list ul");

var addinput = document.querySelector(".add-book input");

var addbtn = document.querySelector(".addbtn");

//FUNCTIONS


//add book
addbtn.onclick = function(){
  var newbook = document.createElement("li");
  newbook.innerHTML = '<span class="name">' + addinput.value + ' </span><span class="delete">delete</span>';
  booklist.appendChild(newbook);
  console.log(deletebtn);
  
  deletebtn = document.querySelectorAll(".delete");

}

//delete book
deletebtn.forEach(btn=>{
  btn.onclick = function (e){
    btn.parentNode.remove();
  }
})
                  

//SEARCH FILTER
var searchBar = document.querySelector(".page-banner input");

searchBar.onkeyup = function(){      
  var searchItem = searchBar.value.toLowerCase(); 
 var books = document.querySelectorAll("li"); 
  books.forEach(book =>{
    var title = book.textContent;
    //indexOf returns -1 if an element can't be found in an array. So if the result is not -1, the elemnt exist and should be shown. Otherwise, it is hidden. 
    if(title.toLowerCase().indexOf(searchItem)!= -1){
book.style.display = 'block';      
    }
     else{
      book.style.display = "none";
    }
  });
};