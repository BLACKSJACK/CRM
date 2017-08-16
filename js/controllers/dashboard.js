/**
 * Created by RoGGeR on 30.05.17.
 */

"use strict";
app.controller('dashboardCtrl',function($rootScope,$http,$cookies, myFactory, $filter, $timeout){

    this.myFactory=myFactory;
    var scope=this;
    this.search_params=[];
    this.isArray = angular.isArray;
    this.checkMult=function(row){
        row.show=false;
    };

    //*************

    this.Confirm=function(){
        this.calc.mode="confirm refresh";

        $timeout(function () {
            scope.calc.mode="listener"
        },4000);
    };
    //**************

    this.checkMulti=function(row){
        if(row.contact.length>1){
            if(!row.show)  row.show=true;
            else row.show=false;
        }
        else return false;
    };
    this.consolelog=function (val) {
        console.log(val);
    };
    this.clean=function(){
        for(var i=0;i<scope.currObj.length;i++){
            delete scope.currObj[i].selected;
            for(var j=0;j<scope.currObj[i].values.length;j++) delete scope.currObj[i].values[j].selected;
        }
        this.currParam="";
        this.myFactory.cleanProcess();
        this.calc.mode="listener";
        myFactory.finalCalc();
    };
    this.alert=function(val){

        alert(val);
    };
    this.isValue=function(ctx){
        var val = ctx.phone;
        return val!="" && val!=undefined && val!=null && val!=NaN && !angular.equals("", val)
    };
    this.isMulti=function(row){
        return row.contact.length>1;
    };
    this.multiHeight=function(contacts){
        var height=100/contacts.length;
        height="{height:"+height+"%;}";
        return height;
    };
    this.reloadDashboard=function(string, type){
        if(typeof type !="undefined") scope.myFactory.matrixType=type;
        $http.post(string).then(function success (response) {
                scope.currObj=response.data;
                scope.navStyle="width:"+100/scope.currObj.length+"%;";
                scope.currParam=0;
                scope.config=string;
                scope.myFactory.currObj=response.data;
            },function error (response){
                console.log(response);

            }
        );
    };
    this.config="dashboard.json";
    $http.post("dashboard.json").then(function success (response) {//устанавливаем каретку управления и заполняем ее из файла dashboard.json
            scope.currObj=response.data;
            if($cookies.get('currentObj')){
                scope.currObj=$cookies.get('currentObj');
                $cookies.remove('currentObj');
            }


        },function error (response){
            console.log(response);
        }
    );
    this.relocatePage=function(url){//переход на другую страницу(как в случае с калькулятором который не написан)
        location.href = url;
    };
    this.relocateHere=function(url){//переход в углубление вверху каретки
        for(let i=0; i<scope.currObj.length;i++){

            if(scope.currObj[i]['url']===url){
                console.log(scope.currObj[i]);
                scope.currParam=scope.currObj.indexOf(scope.currObj[i]);
            }
        }
    };

    this.currentUl=function(index){//функция проверки для анимации и переключения между ul
        if(index===scope.currParam) return true;
    };
    this.setCurrentUl=function(key){
        return transportProp.indexOf(key);
    };
    this.currentProcess={};
    this.selectParam=function (index) { // нажатии на nav
        this.currParam=index;
        $rootScope.search_result=[];

    };
    this.checkTransportProp=function (key) {
        return transportProp.indexOf(key);
    };
    this.configuration=function(value){
        if(value===1){
            return scope.config==='navigation';
        }
    };
    function get_value(text){// функция получения из "100 500 рублей" значения "100500"
        text=text.split(' ');
        var result="";
        for (var i = 0; i < text.length; i++) {
            if(!isNaN(text[i])) result+=text[i];
        }
        return result*1;
    }
    this.applyFilter = function(value, key){
        if(typeof key == "undefined"){
            if(value.type=="currency") return $filter(value.type)(value.name, '', 0);
            else if(value.type=="amount"){
                if(this.myFactory.amountType=="Тягачей") return $filter("currency")(value.name/24, '', 0);
                else if(this.myFactory.amountType=="Рейсов") return $filter("currency")(value.name, '', 0);
            }
            else return value.name;
        }
        else{
            if(key=="cost" || key =="limit" || key=="franchise") return $filter("currency")(value, '', 0) + " Р";
            else if(key=="amount"){
                if(this.myFactory.amountType=="Тягачей") return $filter("currency")(value/24, '', 0)+" "+myFactory.amountType;
                else if(this.myFactory.amountType=="Рейсов") return $filter("currency")(value, '', 0)+" "+myFactory.amountType;
            }
            else return value;
        }

    };
    this.loadProcess=function(process,prop){
        process.changing=true;//для выделения строки которую меняем
        this.calc.mode="changing process";
        for(var i=0;i<scope.currObj.length;i++) for(var j=0;j<scope.currObj[i].values.length;j++) delete scope.currObj[i].values[j].selected;//selected параметр позволяет подсветить то значение, которое выбрано в процессе


        this.currParam = transportProp.indexOf(prop);

        myFactory.process=process;
        for(var key in process){
            if(transportProp.indexOf(key)!=-1){
                if(key=='cost'|| key=='amount'||key=='limit'||key=='franchise'){
                    var karetkaParam=scope.currObj.filter(function(obj){
                        return obj['model']==key;
                    });
                    karetkaParam=karetkaParam[0];
                    for(var i=0;i<karetkaParam.values.length;i++){
                        if(karetkaParam.values[i].name=="input") karetkaParam.values[i].selected=process[key];
                        if(karetkaParam.values[i].name==process[key]){
                            karetkaParam.values[i].selected=true;
                            break;
                        }

                    }
                }
                else{
                    for(var i=0;i<scope.currObj.length;i++){
                        for(var j=0;j<scope.currObj[i].values.length;j++){
                            if(scope.currObj[i].values[j].name==process[key]){
                                scope.currObj[i].values[j].selected=true;
                                if(key==prop) scope.currParam=i;
                                break;
                            }
                        }
                    }
                }
            }

        }

    };
    this.alreadySelected = function(model){
        if($rootScope.mode=="calc") return !(myFactory.process[model]==="");
        else return false;
    };
    this.calc={
        mode:"listener",
        clicked: function(param, value){
            if(this.mode=="listener") this.mode="making new process";
            myFactory.process[param.model]=value.name;

            if(this.mode=="making new process"){
                param.selected=value.name;
                var i=0;
                for(var key in myFactory.process){
                    if(myFactory.process[key]===""){
                        scope.currParam=i;
                        return false;
                    }
                    i++;

                }
                //здесь мы имеем уже заполненный процесс, остается только добавить его в массив процессов и посчитать
                //поднянуть так сказать писю так сказать к носу
                myFactory.addNewProcess();
                myFactory.finalCalc();
                scope.clean();
            }
            if(this.mode=="changing process"){
                delete scope.myFactory.process.changing;//убираем выделение строки которую меняли
                scope.clean();
            }
        },
    }

});