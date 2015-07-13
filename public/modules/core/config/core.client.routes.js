'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			views: {
				"top": { templateUrl: "modules/core/views/hp-top-bar.html" },
				"": { templateUrl: 'modules/core/views/home.client.view.html'}
			}
		}).
		state('about', {
			url: '/about-me',
			views: {
				"top": { templateUrl: "modules/core/views/top-bar.html" },
				"": { templateUrl: 'modules/core/views/about.client.view.html'}
			}
			}).
		state('contacts', {
			url: '/contacts',
			views: {
				"top": { templateUrl: "modules/core/views/top-bar.html" },
				"": { templateUrl: 'modules/core/views/contacts.client.view.html'}
			}
		});
	}
]);
