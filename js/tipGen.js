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
	var docRef = db.collection("stories").doc(whichStory);
	docRef.get().then(function(doc){
		if (doc.exists){
			var theStory = "";
			doc.data().content.forEach(content => {
				switch(content.type){
					case 'copy':
						theStory += "<p>" + content.value + "</p>";
						break;
					case 'img':
						theStory += '<img src="img/' + content.value + '" alt="' + content.alt + '" />';
						break;
					case 'blockquote':
						theStory += '<blockquote>' + content.value + '</blockquote>';
						break;
					case 'tip':
						theStory += '<small class="sidenote"><p class="sideP">'+content.blurb+'</p><a href="story.html#"'+content.value+' class="smallLink">'+content.buttonText+'</a></small>';
						// theStory += '<small class="sidenote"><h3 class="smallH>"'+content.title+'</h3><p class="sideP">'+content.blurb+'</p><a href="story.html#"'+content.value+' class="smallLink">'+content.buttonText+'</a></small>';
						break;
					case 'fact':
						theStory += '<small class="sidenote"><p class="sideP">'+content.blurb+'</p><a href="fact.html#'+content.value+'" class="smallLink">'+content.buttonText+'</a></small>';
						// theStory += '<small class="sidenote"><h3 class="smallH>"'+content.title+'</h3><p class="sideP">'+content.blurb+'</p><a href="fact.html#'+content.value+'" class="smallLink">'+content.buttonText+'</a></small>';
						break;
					case 'list':
						console.log("entered list case");
						var theList = '<ul class="innerList">';
						content.value.forEach(value => {
							console.log(value.type);
							switch(value.type){
								case 'item':
									theList += "<li>" + value.value + "</li>";
									break;
								case 'tip':
									theList += '<small class="sidenote manytip"><p class="sideP">'+value.blurb+'</p><a href="story.html#'+value.value+'" class="smallLink">'+value.buttonText+'</a></small>';
									// theList += '<small class="sidenote manytip"><h3 class="smallH>"'+value.title+'</h3><p class="sideP">'+value.blurb+'</p><a href="story.html#'+value.value+'" class="smallLink">'+value.buttonText+'</a></small>';
									break;
								case 'fact':
									theList += '<small class="sidenote manytip"><p class="sideP">'+value.blurb+'</p><a href="fact.html#'+value.value+'" class="smallLink">'+value.buttonText+'</a></small>';
									// theList += '<small class="sidenote manytip"><h3 class="smallH>"'+value.title+'</h3><p class="sideP">'+value.blurb+'</p><a href="fact.html#'+value.value+'" class="smallLink">'+value.buttonText+'</a></small>';
									break;
								default:
									//do nothing
							}
						})
						theStory += theList;
						break;
					default: 
						// Do nothing. 
				}
			});

			img = doc.data().image;
			displayImage(img);
			title = doc.data().storyname;
			storyHeader.html(title);
			storyhere.html(theStory);
		} else{
			console.log("no such document");
		}
	}).catch(function(error){
		console.log("error getting doc ", error);
	});
};


$(document).ready(function(){
	pullStory();
	var menu = $('.topBar'); 
	var	pos = menu.offset();
	$(window).scroll(function(){
		console.log("sticky entered");
		if($(this).scrollTop() > pos.top && menu.hasClass('noStick')){
			menu.removeClass('noStick').addClass('stick');
		} else if($(this).scrollTop() <= pos.top && menu.hasClass('stick')){
			menu.removeClass('stick').addClass('noStick');
		}
	});
});