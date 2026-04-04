/**
*	Myour - Personal Portfolio Template (HTML)
*	Author: Billel Attafi
*	Author URL: https://billelattafi.rf.gd
*	Copyright © Billel Attafi. All Rights Reserved.
**/

( function( $ ) {
	'use strict';

	window.addEventListener('pageshow', function(event) { if (event.persisted) { window.location.reload(); } });

	$(window).on("load", function() {

		/*
			Preloader
		*/
		const preload = $('.preloader');
		setTimeout(function(){
			preload.find('.spinner').velocity({
				opacity: '0',
				translateY: '-40px'
			}, {
				duration: 400,
				complete: function(){
					preload.find('.box-1').velocity({
						translateY: '-100%'
					}, {
						duration: 1000,
						easing: [0.7,0,0.3,1]
					});
					preload.find('.box-2').velocity({
						translateY: '-100%'
					}, {
						duration: 400,
						easing: [0.7,0,0.3,1]
					});
				}
			});
		}, 500);

		/*
			Typed Subtitle
		*/
		if(($('.typed-subtitle').length) && ($('.h-subtitle p').length > 1)){
			$('.typed-subtitle').each(function(){
				$(this).typed({
					stringsElement: $(this).prev('.typing-subtitle'),
					loop: true
				});
			});
		}

		/*
			One Page Nav
		*/
		const url_hash = location.hash;
		const sectionElem = $(url_hash);
		if(url_hash.indexOf('#section-') === 0 && sectionElem.length){
			$('body, html').animate({scrollTop: $(url_hash).offset().top - 115}, 400);
		}

	});

	/*
		Set full height in blocks
	*/
	let width = $(window).width();
	let height = $(window).height();

	/*
		Set Height Started Section
	*/
	if(width < 783) {
		$('.section.started').css({'height': height});
	}

	/*
		Started Slider
	*/
	if($('.started-carousel').length){
		const started_slider = new Swiper ('.started-carousel .swiper-container', {
			init: false,
			loop: false,
			spaceBetween: 0,
			effect: 'fade',
			slidesPerView: 1,
			simulateTouch: false,
			autoplay: {
				delay: 6000,
				disableOnInteraction: false,
				waitForTransition: false,
			}
		});
		started_slider.on('slideChange', function () {
			const index = started_slider.realIndex;
			const total = started_slider.slides.length;

			$('.started-carousel .swiper-slide').removeClass('first');
			$('.started-carousel .swiper-slide').each(function(i, slide){
				if((index-1)>=i) {
					$(slide).addClass('swiper-clip-active');
				} else {
					$(slide).removeClass('swiper-clip-active');
				}
			});
			$('.started-carousel .swiper-slide').each(function(i, slide){
				$(slide).css({'z-index': total - i});
			});
		});
		started_slider.init();
	}

	/*
		Content Carousel
	*/
	if($('.content-carousel').length){
		const $carousel = $('.owl-carousel');
		$carousel.each(function(){
			const $this = $(this);
			const slidesview = $this.data('slidesview');
			const slidesview_mobile = $this.data('slidesview_mobile');
			$this.owlCarousel({
				margin: 40,
				items: slidesview,
				autoplay: false,
				autoplayTimeout: 5000,
				autoplayHoverPause: true,
				loop: false,
				rewind: true,
				nav: false,
				dots: false,
				responsive: {
					0 : {
						margin: 40,
						items: slidesview_mobile
					},
					720 : {
						margin: 40,
						items: slidesview
					},
					1200 : {
						margin: 40,
						items: slidesview
					}
				}
			});
			$this.closest('.content-carousel').find('.next').click(function() {
				$(this).closest('.content-carousel').find('.owl-carousel').trigger('next.owl.carousel', [800]);
			});
			$this.closest('.content-carousel').find('.prev').click(function() {
				$(this).closest('.content-carousel').find('.owl-carousel').trigger('prev.owl.carousel', [800]);
			});
		});
	}

	/*
		Button Hover
	*/
	$('.animated-button span').each(function () {
		const characters = $(this).text().split("");
		const label = $(this);
		label.empty();
		$.each(characters, function (_i, el) {
			label.append("<em>" + el + "</em>");
		});
	});

	/*
		One Page Menu
	*/
	$('header .top-menu').on('click', 'a', function(){
		let link = $(this).attr('href');
		if(link.indexOf('/#section-') !== -1) {
			link = link.replace('/#section-', '#section-');
		}

		if(link.indexOf('#section-') === 0){
			if(!$('body').hasClass('home')){
				location.href = '/'+link;
			}

			$('body, html').animate({scrollTop: $(link).offset().top - 115}, 400);
			if($('header').hasClass('active')){
				$('.menu-btn').trigger('click');
			}
		}
		else {
			const preload = $('.preloader');
			preload.find('.box-1').velocity({
				translateY: '0%'
			}, {
				duration: 400,
				easing: [0.7,0,0.3,1]
			});
			preload.find('.box-2').velocity({
				translateY: '0%'
			}, {
				duration: 1000,
				easing: [0.7,0,0.3,1],
				complete: function(){
					location.href = link;
				}
			});
		}
		return false;
	});
	if($('.section').length && $('.top-menu li a').length) {
		$(window).on('scroll', function(){
			const scrollPos = $(window).scrollTop();
			$('.top-menu ul li a').each(function () {
				if($(this).attr('href').indexOf('#section-') == 0){
					const currLink = $(this);
					const refElement = $(currLink.attr("href"));
					if(refElement.length){
						if (refElement.offset().top <= scrollPos + 120) {
							$('.top-menu ul li').removeClass("current-menu-item");
							currLink.closest('li').addClass("current-menu-item");
						}
					}
				}
			});
		});
	}

	/*
		Header On Scroll (throttled)
	*/
	let lastScrollTime = 0;
	$(window).on('scroll', function(){
		const now = Date.now();
		if (now - lastScrollTime < 100) return;
		lastScrollTime = now;

		if (($(this).scrollTop() >= 100) && ($('.section').length>1)) {
			$('.header').addClass('fixed');
			$('.mouse-btn').fadeOut();
		}
		if (($(this).scrollTop() <= 100) && ($('.section').length>1)) {
			$('.header').removeClass('fixed');
			$('.mouse-btn').fadeIn();
		}
	});

	/*
		Menu on Mobile — with focus trap
	*/
	let focusTrapHandler = null;

	function getFocusableElements(container) {
		return Array.from(container.querySelectorAll(
			'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
		));
	}

	function openMenu($btn) {
		$('header').addClass('active');
		$btn.attr('aria-expanded', 'true');
		$('.footer .soc').hide();
		$('body').removeClass('loaded').removeClass('background-enabled');

		const focusable = getFocusableElements(document.querySelector('header'));
		if (focusable.length) {
			focusable[0].focus();
			focusTrapHandler = function(e) {
				if (e.key !== 'Tab') return;
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			};
			document.addEventListener('keydown', focusTrapHandler);
		}

		document.addEventListener('keydown', function escHandler(e) {
			if (e.key === 'Escape') {
				closeMenu($btn);
				document.removeEventListener('keydown', escHandler);
			}
		});
	}

	function closeMenu($btn) {
		$('header').removeClass('active');
		$btn.attr('aria-expanded', 'false');
		$('.footer .soc').fadeIn();
		$('body').addClass('loaded');
		if ($('.video-bg').length) {
			$('body').addClass('background-enabled');
		}
		if (focusTrapHandler) {
			document.removeEventListener('keydown', focusTrapHandler);
			focusTrapHandler = null;
		}
		$btn[0].focus();
	}

	$('header').on('click', '.menu-btn', function(){
		const $btn = $(this);
		if ($('header').hasClass('active')) {
			closeMenu($btn);
		} else {
			openMenu($btn);
		}
		return false;
	});

	/*
		Mouse Button Scroll
	*/
	$('.section').on('click', '.mouse-btn', function(){
		$('body, html').animate({
			scrollTop: height - 150
		}, 800);
	});
	if($('.section').length>1){
		$('.mouse-btn').show();
	}

	/*
		Initialize portfolio items
	*/
	const $container = $('.section.works .box-items');
	$container.imagesLoaded(function() {
		$container.isotope({
			itemSelector: '.box-col'
		});
	});

	/*
		Filter items on button click
	*/
	$('.filters').on( 'click', '.btn-group', function() {
		const filterValue = $(this).find('input').val();
		$container.isotope({ filter: filterValue });
		$('.filters .btn-group label').removeClass('glitch-effect');
		$(this).find('label').addClass('glitch-effect');
	});

	/*
		Gallery popup — with null check
	*/
	if($('.gallery-item').length && $('.gallery-item:first a').attr('href') && /\.(?:jpg|jpeg|gif|png)$/i.test($('.gallery-item:first a').attr('href'))){
		$('.gallery-item a').magnificPopup({
			gallery: {
				enabled: true
			},
			type: 'image',
			closeBtnInside: false,
			mainClass: 'mfp-fade'
		});
	}

	/*
		Media popup
	*/
	$('.has-popup-media').magnificPopup({
		type: 'inline',
		overflowY: 'auto',
		closeBtnInside: true,
		mainClass: 'mfp-fade'
	});

	/*
		Image popup
	*/
	$('.has-popup-image').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		mainClass: 'mfp-fade',
		image: {
			verticalFit: true
		}
	});

	/*
		Video popup
	*/
	$('.has-popup-video').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		iframe: {
            patterns: {
                youtube_short: {
                  index: 'youtu.be/',
                  id: 'youtu.be/',
                  src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                }
            }
        },
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		mainClass: 'mfp-fade',
		callbacks: {
			markupParse: function(template) {
				template.find('iframe').attr('allow', 'autoplay');
			}
		}
	});

	/*
		Music popup
	*/
	$('.has-popup-music').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		mainClass: 'mfp-fade'
	});

	/*
		Gallery popup
	*/
	$('.has-popup-gallery').on('click', function() {
        const gallery = $(this).attr('href');

        $(gallery).magnificPopup({
            delegate: 'a',
            type:'image',
            closeOnContentClick: false,
            mainClass: 'mfp-fade',
            removalDelay: 160,
            fixedContentPos: false,
            gallery: {
                enabled: true
            }
        }).magnificPopup('open');

        return false;
    });

	/*
		Background video
	*/
	if($('.jarallax-video').length){
		$('.jarallax-video').each(function(){
			$(this).jarallax();
		});
	}

	/*
		Dotted Skills Line
	*/
	function skills(){
		const skills_dotted = $('.skills.dotted .progress');
		const skills_dotted_w = skills_dotted.width();
		if(skills_dotted.length){
			skills_dotted.append('<span class="dg"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>');
			skills_dotted.find('.percentage').append('<span class="da"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>');
			skills_dotted.find('.percentage .da').css({'width':skills_dotted_w});
		}
	}
	setTimeout(skills, 1000);

	/*
		Circle Skills Line
	*/
	const skills_circles = $('.skills.circles .progress');
	if(skills_circles.length){
		skills_circles.append('<div class="slice"><div class="bar"></div><div class="fill"></div></div>');
	}

	/*
		Resize (debounced)
	*/
	let resizeTimer;
	$(window).resize(function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {

		width = $(window).width();
		height = $(window).height();

		if(width < 783) {
			$('.section.started').css({'height': height});
		}

		const skills_dotted = $('.skills-list.dotted .progress');
		const skills_dotted_w = skills_dotted.width();
		if(skills_dotted.length){
			skills_dotted.find('.percentage .da').css({'width':skills_dotted_w+1});
		}

		}, 150);
	});

	/*
		Validate Contact Form
	*/
	$('#cform').validate({
		rules: {
			name: {
				required: true
			},
			message: {
				required: true
			},
			email: {
				required: true,
				email: true
			}
		},
		success: 'valid',
		submitHandler: function() {
			return false;
		}
	});

	/*
		Sidebar Show/Hide
	*/
	$('header').on('click', '.sidebar_btn', function(){
		$('.s_overlay').fadeIn();
		$('.content-sidebar').addClass('active');
		$('body').addClass('scroll_hidden');

		return false;
	});
	$('.content-sidebar, .container').on('click', '.close, .s_overlay', function(){
		$('.s_overlay').fadeOut();
		$('.content-sidebar').removeClass('active');
		$('body').removeClass('scroll_hidden');
	});

	/*
		Widget Title
	*/
	$('.widget-title').wrapInner('<span class="widget-title-span"></span>');

} )( jQuery );
