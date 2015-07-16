'use strict';

// Works controller
angular.module('works').controller('WorksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Works',

	function($scope, $stateParams, $location, Authentication, Works) {

		$scope.authentication = Authentication;
		this.projectImages = [];
		// Create new Work

		$scope.create = function() {
			var work = new Works ({
				projectName: this.projectName,
				projectDescription: this.projectDescription,
				projectShortDescription: this.projectShortDescription,
				projectDescriptionen: this.projectDescriptionen,
				projectShortDescriptionen: this.projectShortDescriptionen,
				projectImages: this.projectImages,
				projectSliderImg: this.projectSliderImg,
				projectOrder: this.projectOrder
			});

			// Redirect after save
			work.$save(function(response) {
				$location.path('works/' + response._id);

				// Clear form fields
				$scope.projectName = '';
				$scope.projectDescription = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Work
		$scope.remove = function(work) {
			if ( work ) { 
				work.$remove();

				for (var i in $scope.works) {
					if ($scope.works [i] === work) {
						$scope.works.splice(i, 1);
					}
				}
			} else {
				$scope.work.$remove(function() {
					$location.path('works');
				});
			}
		};

		this.selectWork = function(value){
			Works.selectedWork = value
		};

		// Update existing Work
		$scope.update = function() {
			var work = $scope.work;
			work.$update(function() {
				$location.path('works/' + work._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Works
		$scope.find = function() {
			$scope.works = Works.query();
		};

		// Find existing Work
		$scope.findOne = function() {
			$scope.work = Works.get({ 
				workId: $stateParams.workId
			});
		};
	}
])
.directive('addPhoto', function($compile){
	return{
		restrict: 'A',
		link: function(scope , elem, attrs , ctrl){
			scope.counter = 0;
			elem.find('a').on('click',function(event){
				event.preventDefault();
				if (attrs.update == 'true'){
					var input = angular.element("<input type='text' data-ng-model='work.projectImages[" + scope.counter + "]' class='form-control' placeholder='Images' required>");
				}
				else {
					var input = angular.element("<input type='text' data-ng-model='projectImages[" + scope.counter + "]' class='form-control' placeholder='Images' required>");
				}
				var compile = $compile(input)(scope);
				elem.append(input);
				scope.counter++;
			})
		}
	}
})
.directive('single', function(Works){
	return{
		restrict: 'A',
		controller: function($scope , Works) {
			$scope.selectedWork = Works.get({
				workId: Works.selectedWork
			});
		},
		link: function(scope, elem , attrs){
			setTimeout(function(){
				if (scope.selectedWork.projectName == "" || scope.selectedWork.projectName == null){
					window.location.href = "/#!/works"
				}
			},4000);
		}
	}
})
.directive('portfolioSlider', function () {
	return{
		restrict:'A',
		link : function(scope, elem, attrs){

			scope.mode = attrs.portfolioSlider;

			setTimeout(function(){

				elem.find('ul').bxSlider({
					mode: scope.mode,
					nextText: ">",
					prevText: "<",
					auto: true,
					tickerHover: true
				});

				elem.find('.carousel-caption').on({
					"mouseenter": function(){$('.carousel-caption').css('opacity' , 1); $('.sliders img').css('opacity' , 0.1);},
					"mouseleave": function(){$('.carousel-caption').css('opacity' , 0); $('.sliders img').css('opacity' , 1);}
				});

			},2000);

		}
	}
})
.directive('workBoxes' , function(){
	return {
		restrict: "A",
		link: function(scope , elem , attrs , ctrl){
			setTimeout(function(){
				elem.find('.works').on({
					"mouseenter": function(){$(this).addClass('open');},
					"mouseleave": function(){$(this).removeClass('open');}
				});
			},300);
		}
	}
});

//if ("ontouchstart" in window || navigator.msMaxTouchPoints)
//{
//	isTouch = true;
//} else {
//	isTouch = false;
//}
