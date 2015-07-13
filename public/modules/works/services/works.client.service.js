'use strict';

//Works service used to communicate Works REST endpoints
angular.module('works').factory('Works', ['$resource',
	function($resource) {
		return $resource('works/:workId', { workId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
