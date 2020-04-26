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
	var pathRef = storage.ref(img);
	var refURL = "gs://capstone-5899a.appspot.com/"+img+"";
	var gsReference = storage.refFromURL(refURL);
	gsReference.getDownloadURL().then(function(url){
		storyImg.attr("src", url);
		// this is also something I'll have to get from Firebase I think. 
		storyImg.attr("alt", "header image for this story.");

	});
}

// // this function gets the tip from the tip name
// function getTip(tipName, theStory){
// 	console.log(tipName);
// 	var docRef = db.collection("stories").doc(tipName);
// 	var addTip = '';
// 	docRef.get().then(function(doc){
// 		if(doc.exists){
// 			var tipTitle = doc.data().tipname;
// 			var tipBlurb = doc.data().blurb;
// 			var tipButtonText = doc.data().button;
// 			addTip = '<small class="sidenote"><h3 class="sideHeader">'+tipTitle+'</h3><p class="sidePara">'+
// 				tipBlurb+'</p><button type="button" class="sideButton">'+tipButtonText+'</button></small>';
// 				// console.log(addTip);
// 			theStory += addTip;
// 			// return '<small class="sidenote"><h3 class="sideHeader">'+tipTitle+'</h3><p class="sidePara">'+
// 				// tipBlurb+'</p><button type="button" class="sideButton">'+tipButtonText+'</button></small>';
// 		}
// 		else{
// 			console.log("no such document");
// 			// var addTip = "";
// 		}
// 	}).catch(function(error){
// 			console.log("error getting doc ", error);
// 	});
// }

function pullStory(){
	var whichStory = window.location.hash;
	whichStory = whichStory.replace(/[_\W]+/g, "");
	var docRef = db.collection("stories").doc(whichStory);
	docRef.get().then(function(doc){
		if (doc.exists){
			// var theStory = doc.data().storytext1;
			// theStory = theStory.replace(/\\n/g,"<br /><br />");
			var theStory = "";
			doc.data().content.forEach(content => {
				switch(content.type){
					case 'copy':
						theStory += "<p>" + content.value + "</p>";
						break;
					case 'img':
						theStory += '<img src="img/' + content.value + '" alt="' + content.alt + '" /><figcaption>'+content.caption+'</figcaption>';
						break;
					case 'blockquote':
						theStory += '<blockquote>' + content.value + '</blockquote>';
						break;
					case 'tip':
						console.log(content.value);
						theStory += '<small class="sidenote"><p class="sideP">'+content.blurb+'</p><a href="tip.html#'+content.value+'" class="smallLink">'+content.buttonText+'</a></small>';
						// theStory += '<small class="sidenote"><h3 class="smallH>"'+content.title+'</h3><p class="sideP">'+content.blurb+'</p><a href="tip.html#'+content.value+'" class="smallLink">'+content.buttonText+'</a></small>';
						break;
					case 'fact':
						theStory += '<small class="sidenote"><p class="sideP">'+content.blurb+'</p><a href="story.html#'+content.value+'" class="smallLink">'+content.buttonText+'</a></small>';
						// theStory += '<small class="sidenote"><h3 class="smallH>"'+content.title+'</h3><p class="sideP">'+content.blurb+'</p><a href="story.html#'+content.value+'" class="smallLink">'+content.buttonText+'</a></small>';
						break;
					case 'link':
						theStory += '<a href="'+content.value+'" class="outsideLink">'+content.linkText+'</a>';						
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
									theList += '<small class="sidenote manytip"><p class="sideP">'+value.blurb+'</p><a href="tip.html#'+value.value+'" class="smallLink">'+value.buttonText+'</a></small>';
									// theList += '<small class="sidenote manytip"><h3 class="smallH>"'+value.title+'</h3><p class="sideP">'+value.blurb+'</p><a href="tip.html#'+value.value+'" class="smallLink">'+value.buttonText+'</a></small>';
									break;
								case 'fact':
									theList += '<small class="sidenote manytip"><p class="sideP">'+value.blurb+'</p><a href="story.html#'+value.value+'" class="smallLink">'+value.buttonText+'</a></small>';
									// theList += '<small class="sidenote manytip"><h3 class="smallH>"'+value.title+'</h3><p class="sideP">'+value.blurb+'</p><a href="story.html#'+value.value+'" class="smallLink">'+value.buttonText+'</a></small>';
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
			// doing the loop to build theStory+make it show up. 


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
	// $('.smallLink').click(function(){
	// 	console.log("smallLink clicked");
	// 	location.reload();
	// });
};
// If type == copy, do this stuff. etc. for img, blockquote. Build theStory as you loop through

// doc.data().content 

// This is a later problem. 
// This function will check if the image is still stock. If yes, put badge. It no, no badge.
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
	var menu = $('.topBar'); 
	var	pos = menu.offset();
	$(window).scroll(function(){
		if($(this).scrollTop() > pos.top && menu.hasClass('noStick')){
			menu.removeClass('noStick').addClass('stick');
		} else if($(this).scrollTop() <= pos.top && menu.hasClass('stick')){
			menu.removeClass('stick').addClass('noStick');
		}
	});
});