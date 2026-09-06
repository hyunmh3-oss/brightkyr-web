if(/iPhone|iPod|Android|iPad/.test(window.navigator.platform)){
	$(document)
	.on('focus', 'textarea,input,select', function(e) {
		$('#header').css('position', 'absolute');
	})
	.on('blur', 'textarea,input,select', function(e) {
		$('#header').css('position', '');
	});
}
$(document).ready(function() {
	stageResize();

	//스크롤 내려오면
	$(window).scroll(function(){
		if($(document).scrollTop()>0){
			$("html").addClass("header-scroll");
		}else{
			$("html").removeClass("header-scroll");
		}
	});

	//language
	jQuery(".language>a").bind("click", function(){
		var t = jQuery(this).parent("div");
		if(!t.hasClass("active")){
			jQuery(".language").removeClass("active").find("ul").slideUp(100);
			t.addClass("active").find("ul").slideDown(200);
		}else{
			t.removeClass("active").find("ul").slideUp(100);
		}
		return false		
	});

	// 타이틀 변환
	var homeTile = jQuery('title').text();
	var replaceTitle = jQuery('.lnb .active').text();
	arrTitle = jQuery('.lnb .active').text();
	arrTitle2 = jQuery('.sub-title h2').text();
	if($(".lnb").length>0){
		document.title=arrTitle + " | " + homeTile;
	}else if($(".sub-title").length>0){
		document.title=arrTitle2 + " | " + homeTile;
	};

	// 텝
	jQuery(".tab-content").hide();
	jQuery("ul.tabs>li:first").addClass("active"); 	
	jQuery(".tab-content:first").show();

	jQuery("ul.tabs>li").click(function(e) {
		e.preventDefault();
		jQuery("ul.tabs>li").removeClass("active");
		jQuery(this).addClass("active");
		jQuery(".tab-content").hide();		

		var activeTab = jQuery(this).find("a").attr("href");
		jQuery(activeTab).fadeIn();
		return false;
	});

	// slider
	$('.main-visual .items').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		speed: 800,
		arrows: true,
		fade: true,
		dots: true,
		pauseOnHover: false,
		autoplay: true,
		autoplaySpeed: 3000
	});
	$('.main-notice .cnt').each(function(){ 
		var big = $(this).find('.items'); 
		var big_paging = $(this).find('.custom_paging'); 
		big.on('init', function(event, slick) {
		  big_paging.html('<span class="current">1</span>' + ' <span> / </span> <span class="total">' + slick.slideCount +'</div>')
		}).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 500,
			arrows: true,
			appendArrows: $(this).find('.main-notice-ctrl .roll-btn'),
			dots: false
		}).on('afterChange', function(event, slick, currentSlide){
		  var current  = currentSlide +1;
		  big_paging.html('<span class="current">' + current +'</span>' + ' <span> / </span> <span class="total">' + slick.slideCount +'</div>')
		});
	}); 
	$('.notice-list .items').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		speed: 500,
		arrows: true,
		dots: false,
		autoplay: true,
		autoplaySpeed: 3000
	});
	var parterSwiper = new Swiper('.main-partner .swiper-container', {   
		slidesPerView: 6,   
		paginationClickable: true,   
		preventClicks: false,
		spaceBetween: 9,
		nextButton: '.main-partner .slide-btn.next',
        prevButton: '.main-partner .slide-btn.prev',
		speed: 450,
        autoplay: 1500,
        autoplayDisableOnInteraction: false,
		loop: true
	});   
	$('.main-partner .swiper-slide').on('mouseover', function(){
	  parterSwiper.stopAutoplay();
	});
	$('.main-partner .swiper-slide').on('mouseout', function(){
	  parterSwiper.startAutoplay();
	});



	// 메인 - 홍보자료 슬라이드
	$('.main-post .slider .items').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		speed: 300,
		arrows: true,
		dots: false,
		autoplay: true,
		autoplaySpeed: 4000
	});
	$(".main-post .content").hide();
	$(".main-post .tab li").eq(0).addClass("active"); 	
	$(".main-post .content").eq(0).show();
	$(".main-post .tab li a").click(function(e) {
		e.preventDefault();
		$(".main-post .tab li").removeClass("active");
		$(this).parent("li").addClass("active");
		$(".main-post .content").hide();		

		var activeTab = jQuery(this).attr("href");
		$(activeTab).show();
		$('.main-post .slider .items').slick('setPosition');
		return false;
	});

	var tabIndex = $('.sub-tab2 .tab-list li.active').index();
	$('.sub-tab2 .tab-list').slick({
		infinite: false,
		slidesToShow: 6,
		slidesToScroll: 1,
		dots: false,
		initialSlide:tabIndex
	});

	// fancybox
	$(".pop_email").fancybox({
		padding     : 0,
		margin      : 10,
		fitToView	: false,
		openEffect	: 'none',
		closeEffect	: 'none',
		type		: 'ajax',
		helpers:  {
			overlay: {
				locked: false
			}
		}
	});

	$(".pop_privacy").fancybox({
		padding     : 0,
		margin      : 10,
		fitToView	: false,
		openEffect	: 'none',
		closeEffect	: 'none',
		type		: 'ajax',
		helpers:  {
			overlay: {
				locked: false
			}
		}
	});

	$("a.zoom").fancybox({
		 padding     : 0,
		 margin      : 10,
		 fitToView   : true,
		 autoSize    : true,
		 autoScale   : true,
		 closeClick  : false,
		 openEffect  : 'none',
		 closeEffect : 'none'
	});

	// datepicker
	$(".datepicker").datepicker({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
		,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
		,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시    
		,changeMonth: true //월 선택 표시
		,changeYear: true //년도 선택 표시
		,minDate: '-100y' // 현재날짜로부터 100년이전까지 년을 표시
		,yearRange: 'c-100:c+10' // 년도 선택 셀렉트박스를 현재 년도에서 이전, 이후로 얼마의 범위를 표시할것인가.
		//,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
		,prevText: "이전달"
		,nextText: "다음달"
		,buttonText: "날짜선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
		,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
		,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
		,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
		,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
	}); 

	$(".datepicker2").datepicker({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
		,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
		,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시    
		,changeMonth: true //월 선택 표시
		,changeYear: true //년도 선택 표시
		,minDate: '-100y' // 현재날짜로부터 100년이전까지 년을 표시
		,yearRange: 'c-100:c+10' // 년도 선택 셀렉트박스를 현재 년도에서 이전, 이후로 얼마의 범위를 표시할것인가.
		,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
		,prevText: "이전달"
		,nextText: "다음달"
		,buttonText: "날짜선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
		,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
		,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
		,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
		,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
	}); 

	// input
    $("input[type=tel], input[numberOnly]").on("input", function() {
        $(this).val($(this).val().replace(/[^0-9\- \+]/g,""));
    });

});


$(window).bind("load resize", function(){
	stageResize();
});
function stageResize(){
	var winH = $(window).height(),
		headH = $("#header").outerHeight(),
		footH = $("#footer").outerHeight();

	$("#container").css("min-height",winH-footH-headH);

	if($(window).width()<640){
		jQuery(".board-view .body iframe").css("min-height",(jQuery(".board-view .body").width()-30)*.5625);
	}
}