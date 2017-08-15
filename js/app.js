/**
 * Created by RoGGeR on 25.05.17.
 */
'use strict';
let app=angular.module('mainApp', ['ngRoute','ngCookies']);
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
            for(let i=0;i<transportProp.length;i++) this.process[transportProp[i]]=""

        },
        amountType: "Тягачей",
        changeAmountType: function(){
            if(this.amountType=="Тягачей") this.amountType="Рейсов";
            else this.amountType="Тягачей";
        },
        parks: [],
        calculateParksAmount: function(){
            let sum=0;
            this.parks.forEach(function(park,i){
                sum+=park.calculateAmount();
            });
            totalAmount=sum;
        },
        addNewProcess: function(){
            if(this.parks.length==0){
                this.parks.push(new Park(new Process(this.process)));
            }
            else if(this.parks[this.parks.length-1].risks.indexOf(this.process.risk)!=-1){
                this.parks.push(new Park(new Process(this.process)));
            }
            else{
                this.process.park=this.parks[this.parks.length-1];
                this.parks[this.parks.length-1].processes.push(new Process(this.process));
            }
            console.log(this.parks);
            this.cleanProcess();
            //this.finalCalc();
        },
        finalCalc: function(){
            let mass=[];
            this.parks.forEach(function (park,i) {
                let arr=park.check();
                arr.forEach(function(process){
                    delete process.park;
                    mass.push(new Process(process));
                });

                park.replaceBase();
            });
            for(let i=0;i<mass.length;i++){
                this.process=mass[i];
                this.addNewProcess();
                this.parks[this.parks.length-1].check();
                this.parks[this.parks.length-1].replaceBase();
            }
            this.calculateParksAmount();
            this.parks.forEach(function(park,i){
                park.calculate();
            });
            //обнуляем все значения, необходимые для парка:     +
                //риски
                //базовую премию
                //коэффициент риска
            //Базовый риск ставим на первое место                +
            //смотрим есть ли повторяющиеся риски                   +
                //заполняем массив с рисками и отключаем повторяющиеся     +
                //если риск не повторяющийся - считаем коэффициент     +


            //считаем каждую строку парка

        }


    }
});
