/**
 * Created by RoGGeR on 25.05.17.
 */
var app=angular.module('mainApp', ['ngRoute']);
app.config(function($routeProvider,$sceDelegateProvider){//с помощью .config мы определяем маршруты приложения. Для конфигурации маршрутов используется объект $routeProvider.
    /*
    Метод $routeProvider.when принимает два параметра: название маршрута и объект маршрута.
    Объект маршрута задает представление и обрабатывающий его контроллер с помощью параметров
    templateUrl и controller. Поэтому для представлений нам не надо определять контроллер с помощью директивы.
    */
    $routeProvider
        .when('/',{
            templateUrl: 'login.html'
        })
        .when('/dashboard',{
            resolve:{
                "check": function($location,$rootScope){
                    if(!$rootScope.loggedIn){
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'dashboard.html',
            controller: 'dashboardCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'https://capitalpolis.ru/corp_clients/cargo_insurance_transport_operators/kalkulyatortest/2412/project10.php'
    ]);

    // The blacklist overrides the whitelist so the open redirect here is blocked.
    $sceDelegateProvider.resourceUrlBlacklist([
        'http://myapp.example.com/clickThru**'
    ]);
});
