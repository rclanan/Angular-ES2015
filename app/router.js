Router.$inject = ['$stateProvider', '$urlRouterProvider'];

function Router($stateProvider, $urlRouterProvider) {

    'use strict';

    // For any unmatched url, redirect to /home
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            controller : 'HomeCtrl as homeCtrl',
            templateUrl: 'components/home/home.html'
        })
        .state('class', {
            url: '/class',
            controller : 'ClassCtrl as classCtrl',
            templateUrl: 'components/class/class.html'
        })
        .state('scope', {
            url: '/scope',
            controller : 'ScopeCtrl as scopeCtrl',
            templateUrl: 'components/scope/scope.html'
        })
        .state('arrow', {
            url: '/arrow',
            controller : 'ArrowCtrl as arrowCtrl',
            templateUrl: 'components/arrow/arrow.html'
        })
        .state('mapssets', {
            url: '/mapssets',
            controller : 'MapsSetsCtrl as mapsSetsCtrl',
            templateUrl: 'components/maps-sets/maps-sets.html'
        })
        .state('default', {
            url: '/default',
            controller : 'DefaultCtrl as defaultCtrl',
            templateUrl: 'components/default/default.html'
        })
        .state('objectliterals', {
            url: '/objectliterals',
            controller : 'ObjectLiteralsCtrl as objectLiteralsCtrl',
            templateUrl: 'components/object-literals/object-literals.html'
        })
        .state('destructuring', {
            url: '/destructuring',
            controller : 'DestructuringCtrl as destructuringCtrl',
            templateUrl: 'components/destructuring/destructuring.html'
        })
        .state('spread', {
            url: '/spread',
            controller : 'SpreadCtrl as spreadCtrl',
            templateUrl: 'components/spread/spread.html'
        })
        .state('templates', {
            url: '/templates',
            controller : 'TemplatesCtrl as templatesCtrl',
            templateUrl: 'components/templates/templates.html'
        })
        .state('misc', {
            url: '/misc',
            controller : 'MiscCtrl as miscCtrl',
            templateUrl: 'components/misc/misc.html'
        })
        .state('details', {
            url: '/details',
            controller : 'DetailsCtrl as detailsCtrl',
            templateUrl: 'components/home/details.html'
        });
}

export var Router = Router;
