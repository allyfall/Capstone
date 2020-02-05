console.log("Main Firebase Check in action");
 
var db = firebase.firestore();
var stories = db.collection("stories");
var storage = firebase.storage();

// What needs to happen: 1. read in all story titles from Firebase
// 2. Fill list on home page with story titles from firebase
// 3. when you click on the story, recall story from firebase with that title.
// 4. display that story in the story page. 


function pullStory(whichStory){

}

// this function will get all the story names from firebase 
// and put them in the list on the homepage, id = homeNEStories

function displayStories(){
	// var listTitle = stories.where("title", "==", )
	db.collection("stories")
		.get()
		.then(function(querySnapshot){
			var title = "";
			var fillHome = $('#homeNEStories');
			var prettyList = "";
			querySnapshot.forEach(function(doc){
				console.log(doc.id, "=>", doc.data());
				title = doc.data().storyname;
				// prettyList = "<li id='"+title+"'>"+title+"</li>";
				// prettyList = "<li><button type='button' class='storyButton' id='"+title+"'>"+title+"</button></li>";
				prettyList = "<li><a href='story.html#"+title+"'class='storyButton' id='"+title+"'>"+title+"</a></li>";
				fillHome.append(prettyList);
			});
		})
		.catch(function(error){
			console.log("you messed up.", error);
		});
}


// var navBar = $('.topBar');
// var sticky = navBar.offsetTop;

$(document).ready(function(){
	displayStories();
	var menu = $('.topBar'); 
	var	pos = menu.offset();
	$(window).scroll(function(){
		console.log("sticky entered");
		if($(this).scrollTop() > pos.top+menu.height() && menu.hasClass('noStick')){
			menu.fadeOut('fast', function(){
				$(this).removeClass('noStick').addClass('stick').fadeIn('fast');
			})
		} else if($(this).scrollTop() <= pos.top && menu.hasClass('stick')){
			menu.fadeOut('fast', function(){
				$(this).removeClass('stick').addClass('noStick').fadeIn('fast');
			});
		}
	});
});