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
app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        let fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
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
                console.log($element);
                $event.target.select();
            });
            $element.bind('keydown keypress', ($event) => {

                let key = $event.which;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;
                if($attrs['currencyInput']=="a_limit"){
                    if(key==13){
                        LimKoef=1;
                        let a_limit=myFactory.a_limit;
                        a_limit.hand=true;
                        myFactory.finalCalc();


                        let val=$element.val().replace(/,/g, '')*1;
                        a_limit.value=val;
                        if(a_limit.value=="" || a_limit.value==0){
                            a_limit.type="Агр. лимит";
                            a_limit.value=a_limit.max_limit;
                            a_limit.hand=false;
                            LimKoef=1;
                        }
                        else if(a_limit.value<a_limit.max_limit && a_limit.type=="Агр. лимит"){
                            myFactory.parks.forEach(function (park) {
                                park.cutDownLimits(a_limit.value);
                            });
                            a_limit.hand=false;
                            LimKoef=1;
                        }
                        else{
                            let overall=0;
                            myFactory.cleanUpProcessesInParks();
                            if(a_limit.type=="Кол-во случаев"){
                                myFactory.parks.forEach(function (park) {
                                    overall+=park.calculateMatrixWithAlimit(a_limit.value,true)*1;
                                });
                                LimKoef=overall/myFactory.totalPrice;
                            }
                            else{
                                myFactory.parks.forEach(function (park) {
                                    overall+=park.calculateMatrixWithAlimit(a_limit.value,false)*1;
                                });
                                overall-=myFactory.totalPrice;
                                overall*=a_limit.max_limit/a_limit.value;
                                overall+=myFactory.totalPrice;
                                overall=overall/myFactory.totalPrice;
                                LimKoef=overall;
                            }
                        }
                        myFactory.finalCalc();
                    }
                }
                else if($attrs.currencyInput=="payment"){
                    if(key==13){
                        if($element.val()<=0 || $element.val()==""){
                            $element.val(1);
                            myFactory.payment.hand=false;
                        }
                        else{
                            if($element.val()>12) $element.val(12);
                            myFactory.payment.hand=true;
                        }
                        myFactory.finalCalc();

                    }
                }
                else if($attrs.currencyInput=="practicalPrice"){
                    if(key==13){
                        if($element.val()==0 || $element.val()==""){
                            //если мы очистили форму для фактической премии
                            myFactory.checkPracticalPriceKoef(false);
                        }
                        else{
                            //если мы что-то ввели в фактическую премию
                            if(myFactory.single){
                                myFactory.practicalPrice.val*=(myFactory.totalAmount/myFactory.totalAmountForSingle);
                            }
                            myFactory.practicalPrice.koef=myFactory.practicalPrice.val/myFactory.totalPrice;
                            myFactory.checkPracticalPriceKoef(true);
                        }
                        myFactory.finalCalc();
                    }
                }
                else if($attrs.currencyInput=="agents"){
                    if(key==13){
                        myFactory.finalCalc();
                    }
                }
                else{
                    if($scope.dashboard.karetka.mode=="listener") $scope.dashboard.karetka.mode="making new process";
                    if(key==13){
                        let val=$element.val().replace(/,/g, '')*1;
                        if($attrs['param']=="amount" && myFactory.amountType=="Тягачей") myFactory.process[$attrs['param']]=val*24;
                        else myFactory.process[$attrs['param']]=val;
                        if($scope.dashboard.karetka.mode=="making new process"){
                            let i=0;
                            for(let key in myFactory.process){
                                if(myFactory.process[key]===""){
                                    $scope.dashboard.selectParam(i);
                                    let target = $event.target;
                                    target.blur();
                                    document.querySelector(".dashboard_container").focus();

                                    console.log(myFactory.process);
                                    return;

                                }
                                i++;
                            }
                            myFactory.addNewProcess();
                            myFactory.finalCalc();
                        }
                        if($scope.dashboard.karetka.mode=="changing process") delete myFactory.process.changing;
                        $scope.dashboard.clean();
                        let target = $event.target;
                        target.blur();
                    }
                }
            });
        }
    };
});

app.factory('myFactory', function(){
    return{
        multi:{
            multies:[],
            mode:false,
            count:0,
            template:[],
            arrays:{
                risk:[],
                wrapping:[]
            },
            clean: function () {
                this.arrays.risk=[];
                this.arrays.wrapping=[];
                this.mode=false;
                this.template=[];
            }

        },
        multiChangeMode: function (mode) {
            if(mode===undefined){
                if(this.multi.mode==false){
                    if(this.process.wrapping!="" && this.process.wrapping!="multi" && this.multi.arrays.wrapping.indexOf(this.process.wrapping)) this.multi.arrays.wrapping.push(this.process.wrapping);
                    if(this.process.risk!="" && this.process.risk!="multi" && this.multi.arrays.risk.indexOf(this.process.risk)) this.multi.arrays.risk.push(this.process.risk);
                    this.multi.mode=true;
                }
                else this.multi.mode=false;
            }
            else this.multi.mode=mode;
            console.log(this.multi.mode);
        },
        keyCodes:{
            qwerty:{
                mass:[113,119,101,114,116,121,117,105,111,112],
                length:0
            },
            number:{
                mass:[49,50,51,52,53,54,55,56,57,48],//длину придется пока задавать
                length:7
            },
            tab:{
                mass:[60,62,167,177]
            }
        },
        document:{
            currParam: 0,
        },
        single:false,
        matrixType: "find",

        a_limit:{
            max_limit:0,
            value:0,
            type:"Агр. лимит",
            hand: false,
            changeType: function(){
                if(this.type=="Агр. лимит"){
                    this.type="Кол-во случаев";
                    this.value=1;
                }
                else{
                    this.type="Агр. лимит";
                    if(!this.hand) this.value=this.max_limit;
                }
                //factory.finalCalc();
            }
        },
        payment:{
            val:0,
            hand:false,
            mode:"ON",
            changeMode:function(){
                if(this.mode=="ON") this.mode="OFF";
                else this.mode="ON";
            }
        },
        agents:{
            val:"",
            getKoef: function(totalPrice){
                this.val*=1;
                if(this.mode=="%"){
                    let newPrice=totalPrice/(1-this.val/100);
                    return newPrice/totalPrice;
                }
                else{
                    let newPrice=totalPrice+this.val;
                    return newPrice/totalPrice;
                }
            },
            mode:"Р",
            changeMode: function(){
                if(this.mode=="Р") this.mode="%";
                else this.mode="Р";
            }
        },
        practicalPrice:{
            val:"",
            koef:1
        },
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
        checkPracticalPriceKoef: function(mode){
            let myFactory=this;
            if(mode){
                this.parks.forEach(function(park){
                    park.processes.forEach(function(process){
                        process.practicalPriceKoef=myFactory.practicalPrice.koef;
                        console.log(process);
                    })
                })
            }
            else{
                this.parks.forEach(function(park){
                    park.processes.forEach(function(process){
                        delete process.practicalPriceKoef;
                    })
                })
            }
        },
        calculateParksAmount: function(){
            let sum=0;
            this.parks.forEach(function(park){
                sum+=park.calculateAmount();
            });
            totalAmount=sum;
            this.totalAmount=totalAmount;
        },
        findMaxLimit: function(){
            let max=0;
            this.parks.forEach(function(park){
                max=Math.max(park.findMaxLimit(), max);
            });
            this.a_limit.max_limit=max;
            //if(!this.a_limit.hand) this.a_limit.value=max;
        },
        makePackage: function(){
            let array=[];
            this.process.risk="Базовые риски";
            //this.process.multi=this.multi.count;
            array.push(new Process(this.process));
            let myFactory=this;

            this.multi.template.forEach(function (proc) {
                let newProcess={};
                for(let key in myFactory.process) newProcess[key]=myFactory.process[key];
                for(let key in proc){
                    if(key=="limit" || key=="franchise") newProcess[key]=proc[key]*myFactory.process.cost;
                    else newProcess[key]=proc[key];
                }
                //newProcess.park=myFactory.parks[myFactory.parks.length-1];
                //newProcess.multi=myFactory.multi.count;
                array.push(new Process(newProcess));
                //myFactory.parks[myFactory.parks.length-1].processes.push(new Process(newProcess));
            });
            return array;

        },
        makeMulti: function (park, index) {
            if(this.multi.arrays.risk.length==0){
                this.multi.arrays.risk.push(this.process.risk);
            }
            if(this.multi.arrays.wrapping.length==0){
                this.multi.arrays.wrapping.push(this.process.wrapping);
            }
            let array=[];

            for(let i=0; i<this.multi.arrays.wrapping.length; i++){
                for(let j=0; j<this.multi.arrays.risk.length; j++){
                    this.process.wrapping=this.multi.arrays.wrapping[i];
                    this.process.risk=this.multi.arrays.risk[j];
                    let risk=this.process.risk;
                    let packages=this.packages.filter(function (pack) {
                        return pack.name==risk;
                    });
                    if(packages.length>0){
                        this.multi.template=packages[0].values;
                        let mass=this.makePackage();
                        mass.forEach(function (proc) {
                            array.push(proc);
                        });
                    }
                    else{
                        array.push(new Process(this.process));
                    }
                }
            }
            console.log(array);

            let newParkFlag=false;
            let myFactory=this;
            this.multi.multies.push(new Multi(array));
            if(park){
                array.forEach(function (process) {
                    process.park=park;
                    park.processes.splice(0,index,process);
                });
            }
            else{
                if(this.parks.length==0) newParkFlag=true;
                else{
                    array.forEach(function (process) {
                        if(myFactory.parks[0].risks.indexOf(process.risk)!=-1) newParkFlag=true;
                    });
                }
                if(newParkFlag){
                    for(let i=0;i<array.length;i++){
                        if(i==0){
                            this.parks.splice(0,0,new Park(array[i]));
                        }
                        else{
                            array[i].park=this.parks[0];
                            this.parks[0].processes.push(array[i]);
                        }
                    }
                }
                else{ //если таких рисков в первом парке нету
                    for(let i=0;i<array.length;i++){
                        array[i].park=this.parks[0];
                        this.parks[0].processes.push(array[i]);
                    }
                }
            }



        },
        addNewProcess: function(mode){
            //если мульти
            if(mode=="changing"){
                let park=this.process.park;
                let process=park.processes[park.processes.indexOf(this.process)];
                this.cleanProcess();
                for(let key in process){
                    if(transportProp.indexOf(key)!=-1) this.process[key]=process[key];
                }
                let index=park.processes.indexOf(process);
                park.processes.splice(park.processes.indexOf(process), 1);
                if(this.multi.template.length>0){
                    let array=this.makePackage();
                    this.multi.multies.push(new Multi(array));
                    array.forEach(function (process) {
                        process.park=park;
                        park.processes.splice(0,index,process);
                    });
                }
                else if(this.multi.arrays.risk.length>0 || this.multi.arrays.wrapping.length>0){
                    this.makeMulti(park, index);
                }
            }

            else if(this.multi.arrays.risk.length>0 || this.multi.arrays.wrapping.length>0){
                this.makeMulti();
            }
            else if(this.multi.template.length>0){
                let array=this.makePackage();
                this.multi.multies.push(new Multi(array));

                let newParkFlag=false;
                let myFactory=this;
                if(this.parks.length==0) newParkFlag=true;
                else{
                    array.forEach(function (process) {
                        if(myFactory.parks[0].risks.indexOf(process.risk)!=-1) newParkFlag=true;
                    })
                }
                //если мы создаем новый парк тк риски в первом парке такие уже есть
                if(newParkFlag){
                    for(let i=0;i<array.length;i++){
                        if(i==0){
                            this.parks.splice(0,0,new Park(new Process(array[i])));
                        }
                        else{
                            array[i].park=this.parks[0];
                            this.parks[0].processes.push(new Process(array[i]));
                        }
                    }
                }
                else{ //если таких рисков в первом парке нету
                    for(let i=0;i<array.length;i++){
                        array[i].park=this.parks[0];
                        this.parks[0].processes.push(new Process(array[i]));
                    }
                }

            }
            //если не мульти
            else if(this.parks.length==0){
                this.parks.push(new Park(new Process(this.process)));
            }
            else if(this.parks[0].risks.indexOf(this.process.risk)!=-1){
                this.parks.splice(0,0,new Park(new Process(this.process)));
            }
            else{
                this.process.park=this.parks[0];
                this.parks[0].processes.push(new Process(this.process));
            }
            //console.log(this.parks[0].processes[0].constructor.name);
            this.cleanProcess();

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
            }
            this.parks.forEach(function (park) {
                park.check();
                park.replaceBase();
            })
        },
        finalCalc: function(){

            this.cleanUpProcessesInParks();//обнуляем все значения, необходимые для парка:     +//смотрим есть ли повторяющиеся риски                   +
            this.calculateParksAmount();
            this.findMaxLimit();

            this.parks.forEach(function(park,i){
                park.calculate();//считаем каждую строку парка
            });
            //подсчет премии с агрегатным лимитом, отличным от обычного

            //***************** считаем Агр. лимит
            if(this.a_limit.hand){
                this.parks.forEach(function(park){
                    park.applyKoef(LimKoef);
                })
            }
            else{
                this.a_limit.value=this.a_limit.max_limit;
                this.a_limit.type="Агр. лимит";
            }
            this.totalPrice=this.getTotal();
            //****************

            //****************считаем этапы платежей
            if(this.payment.mode=="ON"){
                if(!this.payment.hand){
                    let a=this.totalPrice/30000;
                    a-=a%1;
                    if(a==0) a=1;
                    else if(a>12) a=12;
                    else{
                        while(a!=1 && a!=2 && a!=4 && a!=6 && a!=12){
                            a--;
                        }
                    }

                    this.payment.val=a;
                }
                let spline=Spline(this.totalPrice, Points.payment, 3);
                spline/=100*(12-1);
                spline=spline*this.payment.val-spline;
                this.payment.koef=1+spline;
                this.parks.forEach(function(park){
                    park.applyKoef(1+spline);
                });
                this.totalPrice=this.getTotal();
            }
            //****************

            //****************Агентские
            if(this.agents.val!=0){
                let koef=this.agents.getKoef(this.totalPrice);
                this.parks.forEach(function(park){
                    park.applyKoef(koef);
                });
            }
            //****************

            //****************Для одного тягача
            this.totalPrice=this.getTotal();

            if(this.amountType=="Тягачей"){
                this.totalAmountForSingle=24;


            }
            else{
                this.totalAmountForSingle=1;

            }
            this.totalPriceForSingle=this.totalPrice/(this.totalAmount/this.totalAmountForSingle);
            //****************

            //****************Фактическая премия
            if(this.practicalPrice.val!=0 && this.practicalPrice.val!=""){
                this.parks.forEach(function(park){
                    park.applyPracticalPriceKoef();
                });
                let val=this.getTotal();
                this.practicalPrice.val=val-(val%1);
                if(this.single) this.practicalPrice.val/=(this.totalAmount/this.totalAmountForSingle);
            }
            //****************
            this.multi.multies.forEach(function (multi) {
                multi.calculatePrice();
            });

            //риски
            //базовую премию
            //коэффициент риска

            //заполняем массив с рисками и отключаем повторяющиеся     +
            //если риск не повторяющийся - считаем коэффициент     +




        }


    }
});
