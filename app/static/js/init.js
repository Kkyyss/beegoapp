/*
	@Event    	 : load
	@Usage	 	 : Implement the preloading event.
	@$window 	 : DOM object.
	@$body  	 : body object.
	@animationEnd: To detect the end of the animation.
*/
// $window = $(window);
// $body = $('body');
// var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd ' +
// 				   'oanimationend animationend';
/*
	@Usage: Initialize method when DOM loaded.
*/
// $(function() {
// 	// Initialize Phone code
// 	// $("#phone").intlTelInput({
// 	//   initialCountry: "auto",
// 	//   geoIpLookup: function(callback) {
// 	//     $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
// 	//       var countryCode = (resp && resp.country) ? resp.country : "";
// 	//       callback(countryCode);
// 	//     });
// 	//   },
// 	//   utilsScript: "../static/js/utils.js" // just for formatting/placeholders etc
// 	// });

// 	// $('<div/>', {
// 	//     class: "preload",
// 	// }).prependTo('body');

// 	// var mySwiper = new Swiper ('.swiper-container', {
// 	// 	// Optional parameters
// 	// 	direction: 'horizontal',
// 	// 	loop: true,

// 	// 	// If we need pagination
// 	// 	pagination: '.swiper-pagination',

// 	// 	// Navigation arrows
// 	// 	nextButton: '.swiper-button-next',
// 	// 	prevButton: '.swiper-button-prev',
// 	//     // Disable preloading of all images
// 	//     preloadImages: false,
// 	//     // Enable lazy loading
// 	//     lazyLoading: true
// 	// });
// });

// $window.load(function() {
// 	IsLogined($(location).attr('pathname'))
// 	function IsLogined(urlPath) {
// 		ajax({
// 		  url: urlPath,
// 		  cache: false,
// 		  success: function(res, ts, request) {
// 		    if (request.getResponseHeader('IsLogined') === 'FALSE') {
// 		      $('#user-btn').remove();
// 		      $('#sidebar-user-item').remove();
// 			    // /login_register
// 					if (request.getResponseHeader('recap') === 'TRUE') {
// 						$('#log-recap').removeClass('hide').addClass('show');
// 					}
// 		    } else {
// 			    var isUser = request.getResponseHeader("IsUser");
// 			    // /user
// 			    if (isUser === 'TRUE') {
// 			      $('#account-item').remove();
// 			      var dateJoined = request.getResponseHeader('DateJoined');
// 			      var avatarURL = request.getResponseHeader('AvatarURL');
// 			      var isAccount = request.getResponseHeader('IsAccount');
// 			      var provider = request.getResponseHeader('Provider');
// 			      var email = request.getResponseHeader('Email');
// 			      var activated = request.getResponseHeader('Activated');
// 			      var username = request.getResponseHeader('Username');
// 			      $('#sidebar-user-avatar, #user-avatar').attr('src', avatarURL);
// 			      // /user/account
// 			      if (isAccount === 'TRUE') {
// 			        if (provider) {
// 			          $('#password-tab').remove();
// 			          $('#account-tab')
// 			          .css('width', '100%')
// 			          .parent()
// 			          .next()
// 			          .children()
// 			          .css('width', '100%');
// 			        } else {
// 			          $('#password-email').val(email);
// 			        }
// 			        if (activated === 'Activated') {
// 			          $('#resend-btn').remove();
// 			        }
// 			        $('#joined-date').text(moment(dateJoined).format('MMMM Do YYYY'));
// 			        $('#user-img').attr('src', avatarURL);
// 			        $('#status').text(activated);
// 			        $('#user-provider').val(provider);
// 			        $('#reg-email').val(email);
// 			        $('#user-name').val(username);
// 			      }
// 			    }		    	
// 		    }
// 		  },
// 		  complete: function() {
// 				$(".preload").addClass("animated fadeOut").one(animationEnd, function() {
// 					$(this).remove();
// 				});
// 		  }
// 		});
// 	}	
// });

/*
	@Adapter
*/
// $.fn.extend({
// 	animateOnce: function (animationName) {
// 		$(this).addClass("animated " + animationName)
// 		  .one(animationEnd, function(){
// 			$(this).removeClass("animated " + animationName);
// 		});
// 	},
// 	animateAddClasses: function (animationName, classesName) {
// 		updateAdded(true);
// 		// setObjectCss($body, "padding-top", "70px");
// 		setObjectCss(this, "background-color", "#f8f8f8");
// 		setObjectCss(this, "border-color", "#e7e7e7");
// 		$(this).addClass(classesName).addClass("animated " + animationName)
// 		  .one(animationEnd, function(){
// 		  	$(this).removeClass("animated " + animationName);
// 	  	});
// 	    refreshScrollSpy();
// 	},
// 	animateRemoveClasses: function (animationName, classesName) {
// 		updateAdded(false);
// 		// setObjectCss($body, "padding-top", "0");
// 		setObjectCss(this, "background-color", "transparent");
// 		setObjectCss(this, "border-color", "transparent");		
// 		$(this).removeClass(classesName).addClass("animated " + animationName)
// 		  .one(animationEnd, function(){
// 		  	$(this).removeClass("animated " + animationName);
// 	  	});
// 	} 	 
// });

/* 
	@Function : set css selector.
	@Usage    : a wrapper function to change the DOM css.
*/ 
// function setObjectCss(object, selector, value) {
// 	$(object).css(selector, value);
// }
// /*
// 	@Usage: Used to show error/hide message. 
// */
// function showErrorMessage(object, message) {
// 	object.text(message).removeClass("text-success")
// 		.addClass("text-danger");
// }
// function hideErrorMessage(object) {
// 	object.removeClass("text-danger")
// 		.addClass("text-success");
// }
// function setMessage(object, message) {
// 	object.text(message);
// }

// function loadingSwitch(switcher) {
// 	if (switcher) {
// 		$('<div id="wrapper" class="loading-screen">'+ 
// 			'<div class="loadingPos"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>' + 
// 			'</div>'
// 		).prependTo('body');
// 		return;
// 	}
// 	$('#wrapper').remove()
// }

// function lockScreen(btnObj, formObj, decision) {
// 	btnObj.prop('disabled', decision);
// 	lockForm(formObj, decision);
// 	loadingSwitch(decision);
// }
// function lockForm(obj, decision) {
// 	obj.each(function(){
// 	    $(this).find(':input').prop('readonly', decision);
// 	});
// }

// function verifiedInput(object, verified) {
// 	if (verified) {
// 		object.removeClass("text-danger");
// 		return;
// 	}
// 	object.addClass("text-danger");
// }

// function basicValidation(valid, msgObj, message, object) {
// 	if (!valid) {
// 		showErrorMessage(msgObj, message);
// 		verifiedInput(object, false);
// 		return false;
// 	}
// 	hideErrorMessage(msgObj);
// 	verifiedInput(object, true);
// 	return true;
// }
// function meetRequirement(object, msgObj, message) {
// 	hideErrorMessage(msgObj);
// 	setMessage(msgObj, message);
// 	verifiedInput(object, true);
// }

// function validFunc(func) {
// 	func;
// 	if (isValid) {
// 		return true;
// 	}
// 	return false;
// }

// var ajax = $.ajax;

// function resetCap(object) {
// 	grecaptcha.reset(object);
// }

// function disabledFormSubmitByEnterKeyDown(obj) {
// 	obj.on('keyup keypress', function(e) {
// 	  var keyCode = e.keyCode || e.which;
// 	  if (keyCode === 13) { 
// 	    e.preventDefault();
// 	    return false;
// 	  }
// 	});
// }

// function alertStatus(title, text, type, allowOutsideClick, allowEscapeKey) {
// 	swal({
// 		title: title,
//   		text: text,
//   		type: type,
//   		allowOutsideClick: allowOutsideClick,
//   		allowEscapeKey: allowEscapeKey,
// 	}).done();
// }
