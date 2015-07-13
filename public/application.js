'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});


angular.module(ApplicationConfiguration.applicationModuleName).controller('LanguageController' , function($scope){
	$scope.language = 'it';
	this.langSwitch = function(value){
		$scope.language = value;
	};
	this.openMenu = false;
	this.toggleMenu = function(){
		this.openMenu = !this.openMenu;
	}
});

angular.module(ApplicationConfiguration.applicationModuleName).directive('multiLanguage' , function(){
	return {
		restrict: 'A',
		link: function(scope, elem , attrs , ctrl){
			scope.$watch('language' , function(){
				if(attrs.multiLanguage == scope.language){
					elem.fadeIn()
				}
				else {
					elem.hide();
				}
			})
		}
	}
});
