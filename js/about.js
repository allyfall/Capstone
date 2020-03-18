


function revealInfo(){
	$(this).next('.response').slideToggle("slow");
	// $(this).toggleClass('close'); 
} 


$(document).ready(function(){
	// This is for the sticky nav
	// I think the fade is causing issues, but that can be a polishing problem. (aka later problem)
	var menu = $('.topBar'); 
	var	pos = menu.offset();
	var where = menu.height();
	console.log(where);
	var sticky = pos.top;
	console.log(sticky);
	$(window).scroll(function(){
		if($(this).scrollTop() > pos.top && menu.hasClass('noStick')){
			menu.removeClass('noStick').addClass('stick');
		} else if($(this).scrollTop() <= pos.top && menu.hasClass('stick')){
			menu.removeClass('stick').addClass('noStick');
		}
	});
	// for the about page faq
	$('.response').hide();
	$('.question').click(revealInfo);
});