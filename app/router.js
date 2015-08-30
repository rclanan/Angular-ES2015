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
        .state('objectliterals', {
            url: '/objectliterals',
            controller : 'ObjectLiteralsCtrl as objectLiteralsCtrl',
            templateUrl: 'components/object-literals/object-literals.html'
        })
        .state('details', {
            url: '/details',
            controller : 'DetailsCtrl as detailsCtrl',
            templateUrl: 'components/home/details.html'
        });
}

export var Router = Router;
