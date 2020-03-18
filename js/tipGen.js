console.log("Story Firebase Check in action");
 
var db = firebase.firestore();
var stories = db.collection("stories");
var storage = firebase.storage();
var tiphere = $('.tipDiv');
var tipHeader = $('.tipHeader');
var tipImg = $('.storyImg');
var img = '';

// this function is called in pull story, and will fetch the image.
function displayImage(img){
	console.log(img);
	var pathRef = storage.ref(img);
	var refURL = "gs://capstone-5899a.appspot.com/"+img+"";
	var gsReference = storage.refFromURL(refURL);
	gsReference.getDownloadURL().then(function(url){
		tipImg.attr("src", url);
		// this is also something I'll have to get from Firebase I think. 
		tipImg.attr("alt", "header image for this story.");

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
						theStory += '<small class="sidenote"><h3 class="smallH>"'+content.title+'</h3><p class="sideP">'+content.blurb+'</p><a href="tip.html#"'+content.value+' class="smallLink">'+content.buttonText+'</a></small>';
						break;
					case 'fact':
						theStory += '<small class="sidenote"><h3 class="smallH>"'+content.title+'</h3><p class="sideP">'+content.blurb+'</p><a href="tip.html#'+content.value+'" class="smallLink">'+content.buttonText+'</a></small>';
						break;
					case 'list':
						console.log("entered list case");
						var theList = '<ul>';
						console.log(theList);
						doc.data().value.forEach(value => {
							console.log(doc);
							switch(value.type){
								case 'item':
									theList += "<li>" + content.value + "</li>";
									break;
								case 'fact':
									break;
								case 'tip':
									break;
								default:
									//do nothing
							}
							theStory += theList;
						})
						break;
					default: 
						// Do nothing. 
				}
			});

			img = doc.data().image;
			displayImage(img);
			title = doc.data().tipTitle;
			tipHeader.html(title);
			tiphere.html(theStory);
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