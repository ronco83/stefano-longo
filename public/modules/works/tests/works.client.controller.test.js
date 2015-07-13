'use strict';

(function() {
	// Works Controller Spec
	describe('Works Controller Tests', function() {
		// Initialize global variables
		var WorksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Works controller.
			WorksController = $controller('WorksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Work object fetched from XHR', inject(function(Works) {
			// Create sample Work using the Works service
			var sampleWork = new Works({
				name: 'New Work'
			});

			// Create a sample Works array that includes the new Work
			var sampleWorks = [sampleWork];

			// Set GET response
			$httpBackend.expectGET('works').respond(sampleWorks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.works).toEqualData(sampleWorks);
		}));

		it('$scope.findOne() should create an array with one Work object fetched from XHR using a workId URL parameter', inject(function(Works) {
			// Define a sample Work object
			var sampleWork = new Works({
				name: 'New Work'
			});

			// Set the URL parameter
			$stateParams.workId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/works\/([0-9a-fA-F]{24})$/).respond(sampleWork);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.work).toEqualData(sampleWork);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Works) {
			// Create a sample Work object
			var sampleWorkPostData = new Works({
				name: 'New Work'
			});

			// Create a sample Work response
			var sampleWorkResponse = new Works({
				_id: '525cf20451979dea2c000001',
				name: 'New Work'
			});

			// Fixture mock form input values
			scope.name = 'New Work';

			// Set POST response
			$httpBackend.expectPOST('works', sampleWorkPostData).respond(sampleWorkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Work was created
			expect($location.path()).toBe('/works/' + sampleWorkResponse._id);
		}));

		it('$scope.update() should update a valid Work', inject(function(Works) {
			// Define a sample Work put data
			var sampleWorkPutData = new Works({
				_id: '525cf20451979dea2c000001',
				name: 'New Work'
			});

			// Mock Work in scope
			scope.work = sampleWorkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/works\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/works/' + sampleWorkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid workId and remove the Work from the scope', inject(function(Works) {
			// Create new Work object
			var sampleWork = new Works({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Works array and include the Work
			scope.works = [sampleWork];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/works\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWork);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.works.length).toBe(0);
		}));
	});
}());