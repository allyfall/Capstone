// This script will generate the stories based off of the category selected.
// It will: 1. recive a # with the cat name from the script.js/home click.
// 2. call firebase and recive all stories with that # cat 
// 3. put those stories titles, thumbnail image, and "blurb" in a div
// 4. CSS will use flowbox to style divs. 
// 5. Will generate # links so when you click on the story, it goes to the right place.

console.log("CatGen Firebase Check in action");
 
var db = firebase.firestore();
var stories = db.collection("stories");
var storage = firebase.storage();



function displayImage(img){
	// console.log(img);
	var eachThumb = $('.thumbnailHere');
	var pathRef = storage.ref(img);
	var refURL = "gs://capstone-5899a.appspot.com/"+img+"";
	var gsReference = storage.refFromURL(refURL);
	gsReference.getDownloadURL().then(function(url){
		eachThumb.attr("src", url);
		// this is also something I'll have to get from Firebase I think. 
		eachThumb.attr("alt", "thumbnail for this story.");

	});
}

function pullCat(){
	// console.log("in pole cat.");
	var whichCat = window.location.hash;
	console.log(whichCat);
	whichCat = whichCat.replace(/[_\W]+/g, "");
	console.log(whichCat);
	var title = "";
	var blurb = "";
	var thumbnail = "";
	var id = "";
	var storyList = $(".storyCatGen");
	var prettyDiv = "";

	// now we need to get the title, blurb, and thumbnail from firebase. 
	db.collection("stories").where("category", "==", whichCat)
		.get()
		.then(function(querySnapshot){
			querySnapshot.forEach(function(doc){
				title = doc.data().storyname;
				blurb = doc.data().blurb;
				thumbnail = doc.data().thumbnail;
				id = doc.id;
				console.log(id);
				// need to generate the div before calling displayImage
				prettyDiv = "<div class='oneStory'><h2 class='storyHead'><a href='story.html#"+id+"'class='storyButton' id='"+title+"'>"+title+"</a></h2><img src='#' alt='#' class='thumbnailHere'><p class='storyblurb'>"+blurb+"</p></div>";
				storyList.append(prettyDiv);
				displayImage(thumbnail);
			});
		})
		.catch(function(error){
			console.log("Whoops..", error);
		});
};



$(document).ready(function(){
	pullCat();

	// This is for the sticky nav
	// I think the fade is causing issues, but that can be a polishing problem. (aka later problem)
	var menu = $('.topBar'); 
	var	pos = menu.offset();
	$(window).scroll(function(){
		console.log("sticky entered");
		if($(this).scrollTop() > pos.top+menu.height() && menu.hasClass('noStick')){
			menu.removeClass('noStick').addClass('stick');
		} else if($(this).scrollTop() <= pos.top && menu.hasClass('stick')){
			menu.removeClass('stick').addClass('noStick');
		}
	});
});