'use strict';

// Configuring the Articles module
angular.module('works').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Works', 'works', 'dropdown', '/works(/create)?');
		Menus.addSubMenuItem('topbar', 'works', 'List Works', 'works');
		Menus.addSubMenuItem('topbar', 'works', 'New Work', 'works/create');
	}
]);