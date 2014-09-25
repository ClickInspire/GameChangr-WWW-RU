switch (window.location.host) {
	case 'gamechangr.ca':
	case 'coaches.gamechangr.ca':
		apiBaseUrl = 'https://gamechangr.jit.su/api';
		break;
	default: 
		apiBaseUrl = 'http://localhost:3000/api';
		break;
}

(function($) {
  
    var App = {
 
    /**
    * Init Function
    */
    init: function() {
        App.HomeOpacity();
        App.ScrollToContact();
        App.ScrollBack();
        App.Preloader();
        App.Animations();
        App.Carousel();
        App.Lightbox();
			App.availabilityToggle();
			App.CoachSubmitBinding();
			App.FindMatchSubmitBinding();
			
			$('.main-site').click(function() {
				analytics.track('To Main Site');
			});
    },

 
    HomeOpacity: function() {
        var h = window.innerHeight;
        $(window).on('scroll', function() {
            var st = $(this).scrollTop();
            $('#home').css('opacity', (1-st/h) );
        });
    },


    /**
    * Scroll To Contact
    */
    ScrollToContact: function() {
    $('#button_more').click(function () { $.scrollTo('#about',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#about_arrow_back').click(function () { $.scrollTo('0px',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#about_arrow_next').click(function () { $.scrollTo('#features_1',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#features_1_arrow_back').click(function () { $.scrollTo('#about',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#features_1_arrow_next').click(function () { $.scrollTo('#features_2',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#features_2_arrow_back').click(function () { $.scrollTo('#features_1',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#features_2_arrow_next').click(function () { $.scrollTo('#features_3',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#features_3_arrow_back').click(function () { $.scrollTo('#features_2',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#features_3_arrow_next').click(function () { $.scrollTo('#gallery',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#gallery_arrow_back').click(function () { $.scrollTo('#features_3',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#gallery_arrow_next').click(function () { $.scrollTo('#dev_blog',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    $('#dev_blog_arrow_back').click(function () { $.scrollTo('0px',1000,{easing:'easeInOutExpo',offset:0,'axis':'y'});});
    },
			
		availabilityToggle: function() {
			$('.availability li').click(function(e) {
				$(e.currentTarget).toggleClass('active');
			});
		},
			
		FindMatchSubmitBinding: function() {
			var fields = {};
			
			assignFields();
			
			$('#find-match button[type=submit]').click(function() {
				var data;
				
				if (validateForm()) {
					data = gatherFormData();
					
					$.ajax({
						url: apiBaseUrl + '/matchrequests', 
						type: 'POST', 
						data: data, 
						
						success: function(response) {
							data.type = 'Player';
							analytics.identify(response.id.toString(), data);

							analytics.track('Find Match');
						}
					});
						
					$('#find-match .thank-you').prev().fadeOut(function() {
						$('#find-match .thank-you').fadeIn();
					});
				}
			});
			
			function assignFields() {
				var keys;
				
				fields['firstName'] = $('#find-match [name=first-name]');
				fields['lastName'] = $('#find-match [name=last-name]');
				fields['gamertag'] = $('#find-match [name=gamertag]');
				fields['email'] = $('#find-match [name=email]');
				fields['mmr'] = $('#find-match [name=mmr]');
				fields['role'] = $('#find-match [name=role]');
				fields['character'] = $('#find-match [name=character]');
				fields['regions'] = $('#find-match [name^=region]');
				fields['languages'] = $('#find-match [name^=language]');
				
				keys = Object.keys(fields);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					
					fields[key].on('keyup', function(e) {
						var target = $(e.currentTarget);
						
						if (key !== 'regions' && key !== 'languages') {
							target.removeClass('field-error');	
						}
					});
				}
			}
			
			function validateForm() {
				var isValid = true, 
						regionsValid = false, 
						availabilityValid = false, 
						languagesValid = false;
				
				$('#find-match .form-error').hide();	
				
				fields['firstName'].removeClass('field-error');
				fields['lastName'].removeClass('field-error');
				fields['gamertag'].removeClass('field-error');
				fields['mmr'].removeClass('field-error');
				fields['email'].removeClass('field-error');
				fields['role'].removeClass('field-error');
				fields['character'].removeClass('field-error');
				$('#find-match [data-error=regions]').hide();
				$('#find-match [data-error=languages]').hide();
				
				if (fields['firstName'].val() === '' || fields['firstName'].val() === null) {
					fields['firstName'].addClass('field-error');
					isValid = false;
				}
				
				if (fields['lastName'].val() === '' || fields['lastName'].val() === null) {
					fields['lastName'].addClass('field-error');
					isValid = false;
				}
				
				if (fields['gamertag'].val() === '' || fields['gamertag'].val() === null) {
					fields['gamertag'].addClass('field-error');
					isValid = false;
				}
				
				if (fields['email'].val() === '' || fields['email'].val() === null) {
					fields['email'].addClass('field-error');
					isValid = false;
				}
				
				if (fields['mmr'].val() === '' || fields['mmr'].val() === null || isNaN(parseInt(fields['mmr'].val()))) {
					fields['mmr'].addClass('field-error');
					isValid = false;
				}
				
				for (var i = 0; i < fields['regions'].length && regionsValid == false; i++) {
					if ($(fields.regions[i]).prop('checked')) 
						regionsValid = true;
				}
				
				for (var i = 0; i < fields['languages'].length && languagesValid == false; i++) {
					if ($(fields.languages[i]).prop('checked')) 
						languagesValid = true;
				}
				
				if (!languagesValid) {
					$('#coach-application [data-error=langauges]').show();
					isValid = false;
				}
				
				if (!regionsValid) {
					$('#find-match [data-error=regions]').show();
					isValid = false;
				}
				
				if (!isValid) {
					$('#find-match .form-error').show();	
				}
				
				return isValid;
			}
			
			function gatherFormData() {
				var data = {};
				
				data.firstName = fields['firstName'].val();
				data.lastName = fields['lastName'].val();
				data.gamertag = fields['gamertag'].val();
				data.email = fields['email'].val();
				data.role = fields['role'].val();
				data.character = fields['character'].val();
				data.mmr = parseInt(fields['mmr'].val());
				data.regions = getFromCheckboxes('regions');
				data.languages = getFromCheckboxes('languages');
				data.budget = $('#find-match #price-range').val();
				data.optin = $('#find-match [name=opt-in]').prop('checked');
				
				if (data.budget) { // Conver to cents
					data.budget[0] = parseFloat(data.budget[0]) * 100;
					data.budget[1] = parseFloat(data.budget[1]) * 100;
				}
				
				return data;
			}
			
			function getFromCheckboxes(key) {
				var values = [];

				for (var i = 0; i < fields[key].length; i++) {
					if ($(fields[key][i]).prop('checked')) {
						values.push($(fields[key][i]).val());	
					}
				}
				
				return values;
			}
		},
			
		CoachSubmitBinding: function() {
			var fields = {};
			
			assignFields();
			
			$('#coach-application button[type=submit]').click(function() {
				var data;
				
				if (validateForm()) {
					data = gatherFormData();
					
					$.ajax({
						url: apiBaseUrl + '/coaches', 
						type: 'POST', 
						data: data, 
						
						success: function(response) {
							data.type = 'Coach';
							analytics.identify(response.id.toString(), data);

							analytics.track('Coach Apply', {
								location: window.location.host
							});	
						}, 
						error: function(jqXHR, textStatus, errThrown) {
							console.log("ERROR");
							console.error(errThrown);
						}
					});
						
					$('#coach-application .thank-you').prev().fadeOut(function() {
						$('#coach-application .thank-you').fadeIn();
					});
				}
			});
			
			function assignFields() {
				var keys;
				
				fields['firstName'] = $('#coach-application [name=first-name]');
				fields['lastName'] = $('#coach-application [name=last-name]');
				fields['gamertag'] = $('#coach-application [name=gamertag]');
				fields['email'] = $('#coach-application [name=email]');
				fields['mmr'] = $('#coach-application [name=mmr]');
				fields['regions'] = $('#coach-application [name^=region]');
				fields['languages'] = $('#coach-application [name^=language]');
				fields['availability'] = $('#coach-application .availability li');
				
				keys = Object.keys(fields);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					
					fields[key].on('keyup', function(e) {
						var target = $(e.currentTarget);
						
						if (key !== 'regions' && key !== 'availability' && key !== 'languages') {
							target.removeClass('field-error');	
						}
					});
				}
			}
			
			function validateForm() {
				var isValid = true, 
						regionsValid = false, 
						availabilityValid = false, 
						languagesValid = false;
				
				$('#coach-application .form-error').hide();	
				fields['firstName'].removeClass('field-error');
				fields['lastName'].removeClass('field-error');
				fields['gamertag'].removeClass('field-error');
				fields['mmr'].removeClass('field-error');
				fields['email'].removeClass('field-error');
				$('#coach-application [data-error=regions]').hide();
				$('#coach-application [data-error=languages]').hide();
				$('#coach-application [data-error=availability]').hide();
				
				if (fields['firstName'].val() === '' || fields['firstName'].val() === null) {
					fields['firstName'].addClass('field-error');
					isValid = false;
				}
				
				if (fields['lastName'].val() === '' || fields['lastName'].val() === null) {
					fields['lastName'].addClass('field-error');
					isValid = false;
				}
				
				if (fields['gamertag'].val() === '' || fields['gamertag'].val() === null) {
					fields['gamertag'].addClass('field-error');
					isValid = false;
				}
				
				if (fields['email'].val() === '' || fields['email'].val() === null) {
					fields['email'].addClass('field-error');
					isValid = false;
				}
				
				if (fields['mmr'].val() === '' || fields['mmr'].val() === null || isNaN(parseInt(fields['mmr'].val()))) {
					fields['mmr'].addClass('field-error');
					isValid = false;
				}
				
				for (var i = 0; i < fields['regions'].length && regionsValid == false; i++) {
					if ($(fields.regions[i]).prop('checked')) 
						regionsValid = true;
				}
				
				if (!regionsValid) {
					$('#coach-application [data-error=regions]').show();
					isValid = false;
				}
				
				for (var i = 0; i < fields['languages'].length && languagesValid == false; i++) {
					if ($(fields.languages[i]).prop('checked')) 
						languagesValid = true;
				}
				
				if (!languagesValid) {
					$('#coach-application [data-error=langauges]').show();
					isValid = false;
				}
				
				for (var i = 0; i < fields['availability'].length && availabilityValid == false; i++) {
					if ($(fields.availability[i]).hasClass('active')) 
						availabilityValid = true;
				}
				
				if (!availabilityValid) {
					$('#coach-application [data-error=availability]').show();
					isValid = false;
				}
				
				if (!isValid) {
					$('#coach-application .form-error').show();	
				}
				
				return isValid;
			}
			
			function gatherFormData() {
				var data = {};
				
				data.firstName = fields['firstName'].val();
				data.lastName = fields['lastName'].val();
				data.gamertag = fields['gamertag'].val();
				data.email = fields['email'].val();
				data.mmr = parseInt(fields['mmr'].val());
				data.regions = getFromCheckboxes('regions');
				data.languages = getFromCheckboxes('languages');
				data.optin = $('#coach-application [name=opt-in]').prop('checked');
				data.availability = getAvailability();
				data.rate = parseFloat($('#rate-range').val()) * 100;
				
				return data;
			}
			
			function getFromCheckboxes(key) {
				var values = [];

				for (var i = 0; i < fields[key].length; i++) {
					if ($(fields[key][i]).prop('checked')) {
						values.push($(fields[key][i]).val());	
					}
				}
				
				return values;
			}
			
			function getAvailability() {
				var availability = [];

				for (var i = 0; i < fields.availability.length; i++) {
					if ($(fields.availability[i]).hasClass('active')) {
						availability.push(parseInt($(fields.availability[i]).attr('data-value')));	
					}
				}
				
				return availability;
			}
		},
 
 
 
    /**
    * Scroll Back
    */
    ScrollBack: function() {
        $('#arrow_back').click(function () {
            $.scrollTo('#home',1500,{easing:'easeInOutExpo',offset:0,'axis':'y'});
        });
    },
 
 
    /**
    * Preloader
    */
    Preloader: function() {
        $(window).load(function() {
            $('#status').delay(100).fadeOut('slow');
            $('#preloader').delay(500).fadeOut('slow');
            $('body').delay(500).css({'overflow':'visible'});
            setTimeout(function(){$('#logo').addClass('animated fadeInDown')},500);
            setTimeout(function(){$('#logo_header').addClass('animated fadeInDown')},600);
            setTimeout(function(){$('#slogan').addClass('animated fadeInDown')},700);
            setTimeout(function(){$('#home_image').addClass('animated fadeInUp')},900);
        })
    },


    /**
    * Animations
    */
    Animations: function() {
        $('#about').waypoint(function() {
            setTimeout(function(){$('#about_intro').addClass('animated fadeInDown')},0);
            setTimeout(function(){$('#service_1').addClass('animated fadeInDown')},300);
            setTimeout(function(){$('#service_2').addClass('animated fadeInDown')},500);
            setTimeout(function(){$('#service_3').addClass('animated fadeInDown')},700);
        }, { offset: '50%' });
 
        $('#features_1').waypoint(function() {
            setTimeout(function(){$('#features_1_content').addClass('animated fadeInDown')},0);
            setTimeout(function(){$('#features1a_image').addClass('animated fadeInRight')},1100);
            setTimeout(function(){$('#features1b_image').addClass('animated fadeInRight')},600);
        }, { offset: '50%' });
 
        $('#features_2').waypoint(function() {
            setTimeout(function(){$('#features_2_content').addClass('animated fadeInDown')},0);
            setTimeout(function(){$('#features2a_image').addClass('animated fadeInLeft')},1100);
            setTimeout(function(){$('#features2b_image').addClass('animated fadeInLeft')},600)
        }, { offset: '50%' });
 
        $('#features_3').waypoint(function() {
            setTimeout(function(){$('#features_3_intro').addClass('animated fadeInDown')},0);
            setTimeout(function(){$('#features_3_content_left, #features_3_content_right').addClass('animated fadeInUp')},700);
            setTimeout(function(){$('#features_3_content_center').addClass('animated fadeInDown')},600)
        }, { offset: '50%' });
 
        $('#gallery').waypoint(function() {
            setTimeout(function(){$('#gallery_intro').addClass('animated fadeInDown')},0);
            setTimeout(function(){$('#gallery_carousel').addClass('animated fadeInUp')},700)
        }, { offset: '50%' });
 
        $('#dev_blog').waypoint(function() {
            setTimeout(function(){$('#dev_blog_intro').addClass('animated fadeInDown')},0);
            setTimeout(function(){$('#dev_blog_content').addClass('animated fadeInDown')},700)
        }, { offset: '50%' });

        $('#blog_header').waypoint(function() {
            setTimeout(function(){$('#title').addClass('animated fadeInDown')},0);
        }, { offset: '50%' });


    },


    /**
    * Carousel
    */
    Carousel: function() {
        $('#owl-gallery').owlCarousel({
            items : 5,
            itemsDesktop : [1199,5],
            itemsDesktopSmall : [980,5],
            itemsTablet: [768,5],
            itemsTabletSmall: [550,2],
            itemsMobile : [480,2],
        });
    },

    /**
    * Nivo Lightbox
    */
    Lightbox: function() {
        $('#owl-gallery a').nivoLightbox({
            effect: 'fall',                             // The effect to use when showing the lightbox
        });
    },
 

 }

$(function() {
  App.init();
  });


})(jQuery);