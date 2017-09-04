/**
 * Created by RoGGeR on 25.05.17.
 */
'use strict';
let app=angular.module('mainApp', ['ngRoute','ngCookies', 'ngAnimate']);
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
            controller: 'dashboardCtrl as dashboard'
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
app.directive('return', function(){
    return{
        restrict: 'A',
        templateUrl: 'templates/return.html'
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
app.directive('bottom', function(){
    return{
        restrict: 'A',
        templateUrl: 'templates/bottom.html'
    }
});
app.directive('currencyInput2', function ($filter, myFactory) {
    return {
        require: '?ngModel',
        link: function (scope, $element, attrs, ctrl) {
            if (!ctrl) {
                return;
            }
            $element.bind('keyup', function(event) {
                let key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

                if(key==13){
                    scope.dashboard.span=2;
                    let target = event.target;

                    // do more here, like blur or other things
                    target.blur();


                }

                console.log("done");
                //$browser.defer(listener); // Have to do this or changes don't get picked up properly

            });
        }
    };
});
app.directive('currencyInput', function ($filter, myFactory) {
    return {
        require: '?ngModel',
        link: function ($scope, $element, $attrs, ctrl) {
            if (!ctrl) {
                return;
            }

            ctrl.$formatters.unshift(function () {
                return $filter('number')(ctrl.$modelValue);

            });

            ctrl.$parsers.unshift(function (viewValue) {
                let plainNumber = viewValue.replace(/[\,\.]/g, ''),
                    b = $filter('number')(plainNumber);

                $element.val(b);

                return plainNumber;
            });
            $element.bind('click', ($event)=>{
               console.log($attrs['param']);
            });
            $element.bind('keydown keypress', ($event) => {
                if($scope.dashboard.calc.mode=="listener") $scope.dashboard.calc.mode="making new process";
                let key = $event.which;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

                if(key==13){
                    let val=$element.val().replace(/,/g, '')*1;
                    if($attrs['param']=="amount" && myFactory.amountType=="Тягачей") myFactory.process[$attrs['param']]=val*24;
                    else myFactory.process[$attrs['param']]=val;
                    if($scope.dashboard.calc.mode=="making new process"){
                        let i=0;
                        for(let key in myFactory.process){
                            if(myFactory.process[key]===""){
                                myFactory.currParam=i;
                                let target = $event.target;
                                target.blur();
                                console.log(myFactory.process);
                                return;

                            }
                            i++;
                        }
                        myFactory.addNewProcess();
                        myFactory.finalCalc();
                    }
                    if($scope.dashboard.calc.mode=="changing process") delete myFactory.process.changing;
                    $scope.dashboard.clean();
                    let target = $event.target;
                    target.blur();

                }
            });
        }
    };
});
app.directive('currencyInput1', function($filter, $browser, myFactory) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            let listener = function() {
                let value = $element.val().replace(/,/g, '');
                $element.val($filter('number')(value, false));
                if(value==0) $element.val('');
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/,/g, '');
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('number')(ngModelCtrl.$viewValue, false))
            };
            $element.bind('change', listener);

            $element.bind('keydown keypress', ($event) => {
                let key = $event.which;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

                if(key==13){
                    let val=$element.val().replace(/,/g, '')*1;
                    if($attrs['param']=="amount" && myFactory.amountType=="Тягачей") myFactory.process[$attrs['param']]=val*24;
                    else myFactory.process[$attrs['param']]=val;
                    let i=0;
                    for(let key in myFactory.process){
                        if(myFactory.process[key]===""){
                            myFactory.currParam=i;
                            let target = $event.target;
                            target.blur();
                            console.log(myFactory.process);
                            return;

                        }
                        i++;
                    }
                    let target = $event.target;
                    target.blur();
                    myFactory.addNewProcess();
                    myFactory.finalCalc();
                    $scope.dashboard.clean();
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });


            $element.bind('paste cut', function() {
                $browser.defer(listener)
            })
        }

    }
});

app.factory('myFactory', function(){
    return{
        //foc:true,
        currParam: 0,
        matrixType: "find",
        a_limit:0,
        process: {
            cost:"",
            amount:"",
            wrapping:"",
            risk:"",
            limit:"",
            franchise:""
        },
        cleanProcess: function(){// очищаем каретку от заполненного процесса
            this.process={};
            for(let i=0;i<transportProp.length;i++) this.process[transportProp[i]]=""

        },
        amountType: "Тягачей",// для фильтра тягачей
        changeAmountType: function(){//для фильтра тягачей
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
            this.totalAmount=totalAmount;
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
        getTotal: function(){
            let sum=0;
            this.parks.forEach(function (park) {
                sum+=park.getTotal();
            });

            return sum;
        },
        cleanUpProcessesInParks: function(){
            let mass=[];
            this.parks.forEach(function (park,i) {
                let arr=park.check();//обнуляем все значения для парка(риски, базовая премия, коэфф риска)
                arr.forEach(function(process){
                    delete process.park;
                    mass.push(new Process(process));
                });

                park.replaceBase();//Базовый риск ставим на первое место
            });
            for(let i=0;i<mass.length;i++){
                this.process=mass[i];
                this.addNewProcess();
                this.parks[this.parks.length-1].check();
                this.parks[this.parks.length-1].replaceBase();
            }
        },
        finalCalc: function(){

            this.cleanUpProcessesInParks();//обнуляем все значения, необходимые для парка:     +//смотрим есть ли повторяющиеся риски                   +
            this.calculateParksAmount();

            this.parks.forEach(function(park,i){
                park.calculate();//считаем каждую строку парка
            });
            this.totalPrice=this.getTotal();


                //риски
                //базовую премию
                //коэффициент риска

                //заполняем массив с рисками и отключаем повторяющиеся     +
                //если риск не повторяющийся - считаем коэффициент     +




        }


    }
});
