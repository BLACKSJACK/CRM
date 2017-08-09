/**
 * Created by RoGGeR on 25.05.17.
 */
var app=angular.module('mainApp', ['ngRoute','ngCookies']);
app.config(function($routeProvider,$sceDelegateProvider){//с помощью .config мы определяем маршруты приложения. Для конфигурации маршрутов используется объект $routeProvider.
    /*
    Метод $routeProvider.when принимает два параметра: название маршрута и объект маршрута.
    Объект маршрута задает представление и обрабатывающий его контроллер с помощью параметров
    templateUrl и controller. Поэтому для представлений нам не надо определять контроллер с помощью директивы.
    */
    $routeProvider
        .when('/',{
            resolve:{
                "check": function($location,$cookies,$rootScope){
                    if(!$cookies.get('loggedIn')){
                        $location.path('/login');
                    }
                    if($cookies.get('loggedIn')){
                        $rootScope.loggedIn=$cookies.get('loggedIn');
                        $rootScope.name=$cookies.get('username');
                        $location.path('/dashboard');
                    }
                }
            },
            templateUrl: 'dashboard.html'
        })
        .when('/login',{
            resolve:{
                "check": function($location,$cookies,$rootScope){
                    if($cookies.get('loggedIn')){
                        $rootScope.loggedIn=$cookies.get('loggedIn');
                        $rootScope.name=$cookies.get('username');
                        $location.path('/dashboard');
                    }
                }
            },
            templateUrl: 'login.html'
        })
        .when('/dashboard',{
            resolve:{
                "check": function($location,$cookies,$rootScope){
                    if(!$cookies.get('loggedIn')){
                        $location.path('/login');
                    }
                    if($cookies.get('loggedIn')){
                        $rootScope.loggedIn=$cookies.get('loggedIn');
                        $rootScope.name=$cookies.get('username');

                    }
                }
            },
            templateUrl: 'dashboard.html',
            controller: 'dashboardCtrl as dashboardCtrl'
        })
        .when('/calc',{

            templateUrl: '2412/project10.php'

        })
        .otherwise({
            redirectTo: '/login'
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

app.directive('karetka', function(){
    return{
        restrict: 'A',
        templateUrl: 'templates/karetka.html'
    };
});
app.directive('findCompany', function () {
        return{
            restrict: 'A',
            templateUrl: 'templates/matrix/find_company.html',
            link: function(scope, elements, attrs, ctrl){

            }
        }

});
app.directive('findCalculation', function () {
   return{
       restrict: 'A',
       templateUrl: 'templates/matrix/find_calculation.html'
   }
});
app.directive('calculation', function(){
   return{
       restrict: 'A',
       templateUrl: 'templates/matrix/calculation.html'
   }
});

app.factory('myFactory', function(){
    return{
        matrixType: "find",
        process: {
            cost:"",
            amount:"",
            wrapping:"",
            risk:"",
            limit:"",
            franchise:""
        },
        cleanProcess: function(){
            this.process={};
            for(var i=0;i<transportProp.length;i++) this.process[transportProp[i]]=""

        },
        amountType: "Тягачей",
        changeAmountType: function(){
            if(this.amountType=="Тягачей") this.amountType="Рейсов";
            else this.amountType="Тягачей";
        },
        parks: [],
        addNewProcess: function(){
            if(this.parks.length==0){
                this.parks.push(new Park(new Process(this.process)));
            }
            else if(this.parks[this.parks.length-1].risks.indexOf(this.process.risk)!=-1){
                this.parks.push(new Park(new Process(this.process)));
            }
            else{
                console.log(this.parks[this.parks.length-1]);
                this.parks[this.parks.length-1].processes.push(new Process(this.process));
            }
            console.log(this.parks);
            this.cleanProcess();
        }
        finalCalc: function(){

        }


    }
});
