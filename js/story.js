console.log("Story Firebase Check in action");
 
var db = firebase.firestore();
var stories = db.collection("stories");
var storage = firebase.storage();
var storyhere = $('.storyDiv');
var storyHeader = $('.storyHeader');
var storyImg = $('.storyImg');
var img = '';

// this function is called in pull story, and will fetch the image.
function displayImage(img){
	console.log(img);
	var pathRef = storage.ref(img);
	var refURL = "gs://capstone-5899a.appspot.com/"+img+"";
	var gsReference = storage.refFromURL(refURL);
	gsReference.getDownloadURL().then(function(url){
		storyImg.attr("src", url);
		// this is also something I'll have to get from Firebase I think. 
		storyImg.attr("alt", "header image for this story.");

	});
}

function pullStory(){
	var whichStory = window.location.hash;
	console.log(whichStory);
	whichStory = whichStory.replace(/[_\W]+/g, "");
	console.log(whichStory);

	// now we need to get the text from firebase. and also the image.
	db.collection("stories").where("storyname", "==", whichStory)
		.get()
		.then(function(querySnapshot){
			querySnapshot.forEach(function(doc){
				// console.log("im in here");
				// console.log(doc.data());
				var theStory = doc.data().storytext1;
				img = doc.data().image;
				displayImage(img);
				// console.log(img);
				title = whichStory;
				storyHeader.html(title);
				storyhere.html(theStory);
				// var prettyP = "<h2>"+title+"</h2><p>"+theStory+"</p>";
				// storyhere.html(prettyP);
			});
		})
		.catch(function(error){
			console.log("Whoops..", error);
		});
};
// var navBar = $('.topBar')
// var sticky = navBar.offsetTop;
// function stickyBar(){
// 	console.log("sticky entered");
// 	if(window.pageYOffset >= sticky){
// 		navBar.classList.add("sticky")
// 	} else {
// 		navBar.classList.remove("sticky");
// 	}
// }

// This is a later problem. 
// Thisfunction will check if the image is still stock. If yes, put badge. It no, no badge.
// function imgCheck(){
// 	var imgsrc = storyImg.attr("src");
// 	console.log()
// 	if(imgsrc == "img/stock.jpg"){
// 		$('.imgCredit').html('<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@lukealrich?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Luke Richardson"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Luke Richardson</span></a>');
// 	} else {
// 		$('.imgCredit').html("");
// 	}
// }

$(document).ready(function(){
	pullStory();
	// displayImage("test2.jpg");
	// imgCheck();
});