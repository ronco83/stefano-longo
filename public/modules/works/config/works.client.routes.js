'use strict';

//Setting up route
angular.module('works').config(['$stateProvider',
	function($stateProvider) {
		// Works state routing
		$stateProvider.
		state('listWorks', {
			url: '/works',
			views: {
				"top": { templateUrl: "modules/core/views/top-bar.html" },
				'':{templateUrl: 'modules/works/views/list-works.client.view.html'}
			}
		}).
		state('createWork', {
			url: '/works/create',
			templateUrl: 'modules/works/views/create-work.client.view.html'
		}).
		state('viewWork', {
			url: '/works/:workId',
			templateUrl: 'modules/works/views/view-work.client.view.html'
		}).
		state('editWork', {
			url: '/works/:workId/edit',
			templateUrl: 'modules/works/views/edit-work.client.view.html'
		}).
		state('singleWork', {
			url: '/work',
			views: {
				"top": { templateUrl: "modules/core/views/top-bar.html" },
				'':{templateUrl: 'modules/works/views/selected-work.client.view.html'}
			}
		})
	}
]);
