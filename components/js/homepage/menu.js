// $(function () {
//     var top =
//         $("#menu").offset().top -
//         parseFloat(
//             $("#menu")
//             .css("marginTop")
//             .replace(/auto/, 0)
//         );
//     var footTop =
//         $("#footer").offset().top -
//         parseFloat(
//             $("#footer")
//             .css("marginTop")
//             .replace(/auto/, 0)
//         );

//     var maxY = footTop - $("#menu").outerHeight();

//     $(window).scroll(function (evt) {
//         var y = $(this).scrollTop();
//         if (y > top) {
//             if (y < maxY) {
//                 $("#menu")
//                     .addClass("fixed")
//                     .removeAttr("style");
//             } else {
//                 $("#menu")
//                     .removeClass("fixed")
//                     .css({
//                         position: "absolute",
//                         top: maxY - top + "px"
//                     });
//             }
//         } else {
//             $("#menu").removeClass("fixed");
//         }
//     });
// });