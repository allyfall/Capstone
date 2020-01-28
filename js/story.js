console.log("Story Firebase Check in action");
 
var db = firebase.firestore();
var stories = db.collection("stories");
var storage = firebase.storage();
var storyhere = $('.storyDiv');

function pullStory(){
	var whichStory = window.location.hash;
	console.log(whichStory);
	whichStory = whichStory.replace(/[_\W]+/g, "");
	console.log(whichStory);

	// now we need to get the text from firebase. 
	db.collection("stories").where("storyname", "==", whichStory)
		.get()
		.then(function(querySnapshot){
			querySnapshot.forEach(function(doc){
				console.log("im in here");
				console.log(doc.data());
				var theStory = doc.data().storytext1;
				title = whichStory;
				var prettyP = "<h2>"+title+"</h2><p>"+theStory+"</p>";
				storyhere.html(prettyP);
			});
		})
		.catch(function(error){
			console.log("Whoops..", error);
		});
};

$(document).ready(function(){
	pullStory();
});