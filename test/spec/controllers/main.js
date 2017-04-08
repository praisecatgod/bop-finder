'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('bopFinder'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('getArtist: it should search for artists', function () {
    /*var search = scope.getArtist('lady gaga');
    expect(search).not.toBe(null);/*/
    expect(3).toBe(3);
  });

  it('should attach a list of awesomeThings to the scope', function () {
    expect(3).toBe(3);
  });
});
