/**
 * Created by RoGGeR on 30.05.17.
 */

"use strict";
app.controller('dashboardCtrl',function($rootScope,$http,$cookies, myFactory, $filter, $timeout, $document, $scope){
    this.span=1;
    this.myFactory=myFactory;
    let scope=this;
    this.search_params=[];
    this.isArray = angular.isArray;

    //*************//*************//*************

    //*************Обработчик управления с клавиатуры
    this.addQwertyKey=function(index){
        return qwerty[index];
    };
    this.addNumberKey=function(value, param){
        if(param.model=='cost'|| param.model=='amount'||param.model=='limit'||param.model=='franchise'){
            if(param.values.indexOf(value)!=0 && param.values.indexOf(value)!=1) return param.values.indexOf(value)-1;
        }
        else return param.values.indexOf(value)+1;
    };
    this.keyboard=function($event){

        let key=$event.keyCode;
        if(key==1081) key=113;
        else if(key==1094) key=119;
        else if(key==1091) key=101;
        else if(key==1082) key=114;
        else if(key==1077) key=116;
        else if(key==1085) key=121;
        else if(key==1075) key=117;
        else if(key==1096) key=105;
        else if(key==1097) key=111;
        else if(key==1079) key=112;

        let keyCodes=myFactory.keyCodes;
        console.log(keyCodes.number.mass.indexOf(key), keyCodes.number.length);
        if(scope.myFactory.foc){
            if(keyCodes.number.mass.indexOf(key)!=-1 && keyCodes.number.mass.indexOf(key)<keyCodes.number.length){
                let param=scope.currObj[this.myFactory.document.currParam];
                if(transportProp.indexOf(param.model)!=-1){
                    if(param.model=='cost'|| param.model=='amount'||param.model=='limit'||param.model=='franchise'){
                        console.log(param.values[keyCodes.number.mass.indexOf(key)+2]);
                        scope.calc.clicked(param,param.values[keyCodes.number.mass.indexOf(key)+2]);
                    }
                    else scope.calc.clicked(param,param.values[keyCodes.number.mass.indexOf(key)]);
                }
                //else if(param.values[keyCodes.number.mass.indexOf(key)])
            }
            else if(keyCodes.qwerty.mass.indexOf(key)!=-1 && keyCodes.qwerty.mass.indexOf(key)<keyCodes.qwerty.length){
                this.selectParam(keyCodes.qwerty.mass.indexOf(key));

            }
            else if(keyCodes.tab.mass.indexOf(key)!=-1){

            }
        }
    };
    //*************

    this.Confirm=function(){
        this.calc.mode="confirm refresh";

        $timeout(function () {
            scope.calc.mode="listener"
        },4000);
    };
    //**************

    this.alert=function(str){
      alert(str);
    };
    this.consolelog=function (val) {
        console.log(val);
    };
    this.clean=function(){//очищаем каретку и возвращаем ее в исходное состояние
        for(let i=0;i<scope.currObj.length;i++){
            delete scope.currObj[i].selected;//убираем подсвечивание нижней части
            for(let j=0;j<scope.currObj[i].values.length;j++) delete scope.currObj[i].values[j].selected;//убираем подсвечивание верхней части
        }
        myFactory.parks.forEach(function (park) {
            park.processes.forEach(function (process) {
                delete process.changing;
            })
        });
        this.myFactory.document.currParam="";
        this.myFactory.cleanProcess();
        this.calc.mode="listener";
        myFactory.finalCalc();
    };
    this.isValue=function(ctx){//что то для контактов, при создании мульти выбора нужно изменить
        let val = ctx.phone;
        return val!="" && val!=undefined && val!=null && val!=NaN && !angular.equals("", val)
    };
    this.isMulti=function(row){//это тоже изменить
        return row.contact.length>1;
    };
    this.multiHeight=function(contacts){//и это изменить
        let height=100/contacts.length;
        height="{height:"+height+"%;}";
        return height;
    };
    this.reloadDashboard=function(string, type){
        if(typeof type !="undefined") scope.myFactory.matrixType=type;
        $http.post(string).then(function success (response) {
                scope.currObj=response.data;
                scope.myFactory.keyCodes.qwerty.length=scope.currObj.filter(function (obj) {
                    return obj["name"]!=undefined;
                }).length;
                scope.navStyle="width:"+100/scope.currObj.length+"%;";
                scope.selectParam(0);
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
            scope.myFactory.keyCodes.qwerty.length=scope.currObj.filter(function (obj) {
                return obj["name"]!=undefined;
            }).length;
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
                scope.selectParam(scope.currObj.indexOf(scope.currObj[i]));
            }
        }
    };

    this.currentUl=function(index){//функция проверки для анимации и переключения между ul
        if(index===scope.myFactory.document.currParam) return true;
    };
    this.setCurrentUl=function(key){
        return transportProp.indexOf(key);
    };
    this.currentProcess={};
    this.selectParam=function (index) { // нажатии на nav
        this.myFactory.document.currParam=index;
        $rootScope.search_result=[];
        this.myFactory.keyCodes.number.length=this.currObj[this.myFactory.document.currParam].values.length+1;



    };
    this.selectNextParam=function(){
        let i=0;
        for(let key in myFactory.process){
            if(myFactory.process[key]===""){
                scope.selectParam(i);
                return false;
            }
            i++;
        }
        return true;
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
        let result="";
        for (let i = 0; i < text.length; i++) {
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
            else if(key=="badAssAmount") return $filter("currency")(value, '', 0)+" "+myFactory.amountType;
            else return value;
        }

    };
    this.loadProcess=function(process,prop){//загрузка расчета в каретку
        myFactory.parks.forEach(function (park) {
            park.processes.forEach(function (process) {
                delete process.changing;
            })
        });
        process.changing=true;//для выделения строки которую меняем
        this.calc.mode="changing process";
        for(let i=0;i<scope.currObj.length;i++) for(let j=0;j<scope.currObj[i].values.length;j++) delete scope.currObj[i].values[j].selected;//selected параметр позволяет подсветить то значение, которое выбрано в процессе


        this.myFactory.document.currParam = transportProp.indexOf(prop);
        let a=this.currParam;
        let b=transportProp.indexOf(prop);
        myFactory.process=process;
        for(let key in process){
            if(transportProp.indexOf(key)!=-1){
                if(key=='cost'|| key=='amount'||key=='limit'||key=='franchise'){
                    let karetkaParam=scope.currObj.filter(function(obj){
                        return obj['model']==key;
                    });
                    karetkaParam=karetkaParam[0];
                    for(let i=0;i<karetkaParam.values.length;i++){
                        if(karetkaParam.values[i].name=="input"){
                            if(key=='amount' && scope.myFactory.amountType=="Тягачей"){
                                karetkaParam.selected=process[key]/24;
                            }
                            else karetkaParam.selected=process[key];
                        }
                        if(karetkaParam.values[i].name==process[key]){
                            karetkaParam.values[i].selected=true;
                            break;
                        }

                    }
                }
                else{
                    for(let i=0;i<scope.currObj.length;i++){
                        for(let j=0;j<scope.currObj[i].values.length;j++){
                            if(scope.currObj[i].values[j].name==process[key]){
                                scope.currObj[i].values[j].selected=true;
                                if(key==prop) scope.selectParam(i);
                                break;
                            }
                        }
                    }
                }
            }
        }
        console.log(scope.myFactory.document.currParam);

    };
    this.alreadySelected = function(model){
        if($rootScope.mode=="calc") return !(myFactory.process[model]==="");
        else return false;
    };
    this.addPropertyToProcess=function(param, value){
        myFactory.process[param.model]=value.name;//заполняем соответствующее свойство создаваемого процесса
        //*****************Заносим выбранное значение в нижнюю часть каретки
        if(!param.name){
            scope.currObj.forEach(function(newParam){
                if(newParam.name && newParam.model==param.model) param=newParam
            })
        }
        if(param.model=='amount' && scope.myFactory.amountType=="Тягачей"){
            param.selected=value.name/24;
        }
        else param.selected=value.name;
        //*****************


        if(scope.selectNextParam()){
            //здесь мы имеем уже заполненный процесс, остается только добавить его в массив процессов и посчитать
            //поднянуть так сказать писю так сказать к носу
            console.log(myFactory.process);
            myFactory.addNewProcess();
            myFactory.finalCalc();
            scope.clean();
        }
    }
    this.calc={
        mode:"listener",
        clicked: function(param, value){
            if(this.mode=="listener") this.mode="making new process";
            //*****************
            if(value.action){
                if(value.action=="selectAll"){
                    scope.myFactory.multi.changeMode(true);
                    let model=param.model;
                    param.values.forEach(function(val){
                        if(val!=value){
                            let obj={};
                            obj[model]=val.name;
                            scope.myFactory.multi.template.push(obj);
                        }
                    });
                    console.log(scope.myFactory.multi.template);
                }
            }
            //*****************


            if(this.mode=="making new process"){
                scope.addPropertyToProcess(param,value);
            }
            if(this.mode=="changing process"){
                delete scope.myFactory.process.changing;//убираем выделение строки которую меняли
                scope.clean();
            }
        },
    }

});