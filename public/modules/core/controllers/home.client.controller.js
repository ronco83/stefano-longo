'use strict';


angular.module('core')
	.controller('HomeController', ['$scope', 'Authentication',
		function($scope, Authentication) {
			// This provides Authentication context.
			$scope.authentication = Authentication;
		}
	])
	.controller('FormController' , ['$scope' , '$http',
		function($scope , $http){

			this.reset = function(){
				$scope.result = null;
				$scope.contacts.$setPristine();
				$scope.formCtrl.subject="";
				$scope.formCtrl.message="";
			};

			this.sendMail = function(){

				var data = ({
					contactName: this.contactName,
					contactEmail: this.email,
					contactSubject: this.subject,
					contactMessage: this.message
				});

				console.log(data);

				$http.post('/contact-form', data).
					success(function(data, status, headers, config) {
						if ($scope.language == 'it' ){
							$scope.result = "Messaggio inviato!";
						}
						else {
							$scope.result = "Your message has been sent!";
						}
					}).
					error(function(data, status, headers, config) {
						$scope.result = "messaggio non inviato"
					});
			}
		}
	])
	.directive('buttonAnimation', function(){
		return {
			restrict: 'A',
			link: function(scope , elem , attrs , ctrl){

				TweenMax.set(elem.find('div'), {perspective:800});
				TweenLite.set([".back", ".front"], {transformStyle:"preserve-3d"});

				elem.on('mouseenter' , function(){
					TweenMax.fromTo(elem.find("span"), 1.5, {scale: 1}, {scale:0 , rotationY:180, ease:Back.easeInOut.config(1.5)});
					TweenMax.fromTo(elem.find("a"), 1.5, {scale: 0}, {scale:1 , rotationY:360, ease:Back.easeInOut.config(1.5)});
				});

				elem.on('mouseleave' , function() {
					TweenMax.fromTo(elem.find("span"), 1.5, {scale: 0} , { scale: 1, rotationY: 0, transformStyle: "preserve-3d" , ease: Back.easeInOut.config(1)});
					TweenMax.to(elem.find("a"), 1.5, {scale:0 , rotationY:180 , transformStyle: "preserve-3d",  ease:Back.easeInOut.config(1)});
				});
			}
		}
	})
	.directive('background', function(){
		return {
			restrict: 'E',
			templateUrl: '/modules/core/views/background.html',
			link: function(){
				TweenMax.staggerFromTo(".bg", 20, { scale: 1 , transformOrigin:"right top",  autoAlpha:0 , repeat:-1 , yoyo:true}, { scale: 1.3 , transformOrigin:"left bottom", autoAlpha:1 , repeat:-1 , yoyo:true}, 10);
			}
		}
	})
	.directive('menu', function(){
		return {
			restrict: 'E',
			templateUrl: '/modules/core/views/menu.html'
		}
	})
	.directive('content', function(){
		return {
			restrict: 'A',
			link: function(scope , elem){

				scope.lngCtrl.openMenu = false;

				if ($(window).width()< 1280 ){

					var myElement = document.getElementById('content');

					var mc = new Hammer(myElement);

					mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

					mc.on("panup", function(ev) {
						$('.content').css('border-top-width' , 0);
						$("#header").css('opacity',  0);
					});

					mc.on("pandown", function(ev) {
						$('.content').css('border-top-width' , 100), $("#header").css('opacity' , 1)
					});

				}
			}
		}
	})
	.directive('generalMenu' , function(){
		return {
			restrict: 'A',
			link: function(scope, elem , attrs , ctrl){

				scope.url = window.location.href;
				scope.url = scope.url.substring(scope.url.indexOf('/#!/'));

				scope.reopen = function(){
					TweenMax.to(".content", 0.7, {scale:1, autoAlpha:1 ,ease: Back.easeOut.config(1)});
				};
				scope.close = function(){
					TweenMax.to(".content", 0.7, {scale:0.5, autoAlpha:0.05, ease: Back.easeOut.config(1)});
				};
				scope.closeAll = function(){
					TweenMax.to(".content", 0.1, {scale:0, autoAlpha:0});
				};

				elem.find('h3 a').on('click' , function(){
					scope.closeAll();
				});

				scope.$watch('lngCtrl.openMenu' , function(){
					setTimeout(function(){
						elem.find('.active').on('click', function(){
							scope.reopen()
						});
						elem.find('#menuButton:not(.active)').on('click', function(){
							scope.close();
						});
						elem.find('h2 a').on('click', function(){
							if ($(this).attr('href') == scope.url) {
								scope.reopen();
							}
							else {
								scope.closeAll();
							}
						});
					},50)
				})
			}
		}
	})
	.directive('contactForm', function(){
		return {
			restrict: 'A',
			link: function(scope, elem, attrs , ctrl) {


				scope.$watch('formCtrl.surname' , function(){
					if (scope.formCtrl.surname == null) {
						console.log("ok, you're not a bot");
					}
					else {
						scope.contacts.$setValidity(false);
					}
				});

				scope.placeholder = {};

				scope.$watch('language' , function(){

					if (scope.language == 'it') {
						scope.placeholder.name = 'nome';
						scope.placeholder.email = 'indirizzo email';
						scope.placeholder.subject = 'oggetto';
						scope.placeholder.message = 'messaggio'

					}
					else {
						scope.placeholder.name = 'name';
						scope.placeholder.email = 'email address';
						scope.placeholder.subject = 'subject';
						scope.placeholder.message = 'message'
					}

				})

			}
		}
	})
	.directive('cube', function(){
		return {
			restrict: 'E',
			templateUrl: '/modules/core/views/cube.html',
			link: function(){
				setTimeout(function(){

					var myElement = document.getElementById('cubeContainer');

					var options = {
						preventDefault: true
					};

					var mc = new Hammer(myElement , options);

					mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

					mc.on("panleft", function(ev) {
						ev.preventDefault();
						TweenMax.to(document.getElementById('cube'), 1.5, {rotationY:'-=60'});
					});

					mc.on("panright", function(ev) {
						TweenMax.to(document.getElementById('cube'), 1.5, {rotationY:'+=60'});
					});

					mc.on("panup", function(ev) {
						TweenMax.to(document.getElementById('cube'), 1.5, {rotationX:'+=60'});
					});

					mc.on("pandown", function(ev) {
						TweenMax.to(document.getElementById('cube'), 1.5, {rotationX:'-=60'});
					});

				},100)
			}
		}
	});
