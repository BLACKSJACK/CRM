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
    this.multiClicked=function(){
        myFactory.multiChangeMode();
        if(this.karetka.mode=="making new process" && !myFactory.multi.mode){
            if(scope.selectNextParam()){//здесь мы имеем уже заполненный процесс, остается только добавить его в массив процессов и посчитать
                console.log(myFactory.multi);
                console.log(myFactory.process);
                myFactory.addNewProcess();
                myFactory.finalCalc();
                scope.clean();
            }
        }
        else if(this.karetka.mode=="changing process"){
            if(!myFactory.multi.mode){
                myFactory.addNewProcess("changing");
                delete scope.myFactory.process.changing;//убираем выделение строки которую меняли
                scope.clean();
            }
            else{
                if(myFactory.process.wrapping!="" && myFactory.process.wrapping!="multi" && myFactory.multi.arrays.wrapping.indexOf(myFactory.process.wrapping)) myFactory.multi.arrays.wrapping.push(myFactory.process.wrapping);
                if(myFactory.process.risk!="" && myFactory.process.risk!="multi" && myFactory.multi.arrays.risk.indexOf(myFactory.process.risk)) myFactory.multi.arrays.risk.push(myFactory.process.risk);
            }
        }
    };
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
                        scope.karetka.clicked(param,param.values[keyCodes.number.mass.indexOf(key)+2]);
                    }
                    else scope.karetka.clicked(param,param.values[keyCodes.number.mass.indexOf(key)]);
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
        this.karetka.mode="confirm refresh";

        $timeout(function () {
            scope.karetka.mode="listener"
        },4000);
    };
    //**************

    this.alert=function(str){
      alert(str);
    };
    this.console=console;
    this.isNaN=function(val){
        return isNaN(val);
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
        this.myFactory.multi.clean();
        this.karetka.mode="listener";
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
                if(string=="HIP.json"){
                    let pack=scope.currObj.filter(function (param) {
                        return param.url=="Пакеты";
                    });
                    pack=pack[0];
                    scope.myFactory.packages=pack.values;
                }
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
    this.applyFilter = function(value, key, group){
        if(group!==undefined){
            if(!isNumeric(value) && value.indexOf("-")!=-1){
                value=value.split("-");
                if(key=="cost" || key =="limit" || key=="franchise") return $filter("currency")(value[0], '', 0) + " Р"+" - "+$filter("currency")(value[1], '', 0) + " Р";
                else if(key=="amount"){
                    if(this.myFactory.amountType=="Тягачей") return $filter("currency")(value[0]/24, '', 0)+" "+myFactory.amountType+" - "+$filter("currency")(value[1]/24, '', 0)+" "+myFactory.amountType;
                    else if(this.myFactory.amountType=="Рейсов") return $filter("currency")(value[0], '', 0)+" "+myFactory.amountType +" - "+$filter("currency")(value[1], '', 0)+" "+myFactory.amountType;
                }
            }
            else{
                if(key=="cost" || key =="limit" || key=="franchise") return $filter("currency")(value, '', 0) + " Р";
                else if(key=="amount"){
                    if(this.myFactory.amountType=="Тягачей") return $filter("currency")(value/24, '', 0)+" "+myFactory.amountType;
                    else if(this.myFactory.amountType=="Рейсов") return $filter("currency")(value, '', 0)+" "+myFactory.amountType;
                }
                return value;
            }
        }
        else if(typeof key == "undefined"){
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

    this.alreadySelected = function(model){
        if($rootScope.mode=="calc") return !(myFactory.process[model]==="");
        else return false;
    };
    this.addPropertyToProcess=function(param, value){//меняем обычный процесс который у нас в фабрике
        myFactory.process[param.model]=value;//заполняем соответствующее свойство создаваемого процесса


        //*****************Заносим выбранное значение в нижнюю часть каретки
        if(!param.name){
            scope.currObj.forEach(function(newParam){
                if(newParam.name && newParam.model==param.model) param=newParam
            })
        }
        if(param.model=='amount' && scope.myFactory.amountType=="Тягачей"){
            param.selected=value/24;
        }
        else param.selected=value;
        //*****************

    };

    this.clickedSelectAll=function(param, value){
        scope.myFactory.multiChangeMode(true);
        let model=param.model;
        param.values.forEach(function(val){
            if(val!=value){
                val.selected=true;
                scope.myFactory.multi.mode=true; //включаем режим мульти
                let multi=scope.myFactory.multi;
                if(multi.arrays[param.model].indexOf(val.name)==-1){//если такой элемент не был выбран
                    val.selected=true;
                    multi.arrays[param.model].push(val.name);
                }

            }
        });
        console.log(scope.myFactory.multi);
        //this.addPropertyToProcess(param, "multi");
    };
    this.clickedOnMulti=function(param, value){//при нажатии на верх каретки в мульти параметры при режиме мульти
        let multi=scope.myFactory.multi;
        if(value.action=="selectAll"){
            scope.myFactory.multiChangeMode(true);
            param.values.forEach(function(val){
                if(val!=value){
                    val.selected=true;
                    scope.myFactory.multi.mode=true; //включаем режим мульти
                    let multi=scope.myFactory.multi;
                    if(multi.arrays[param.model].indexOf(val.name)==-1){//если такой элемент не был выбран
                        val.selected=true;
                        multi.arrays[param.model].push(val.name);
                    }

                }
            });
            console.log(scope.myFactory.multi);
        }
        else if(multi.arrays[param.model].indexOf(value.name)==-1){//если такой элемент не был выбран
            value.selected=true;
            multi.arrays[param.model].push(value.name);
        }
        else{
            delete value.selected;
            multi.arrays[param.model].splice(multi.arrays[param.model].indexOf(value.name),1);
        }

        //здесь должно быть перестроение шаблона


        //работа с нижней частью каретки и непосредственно с создаваемым объектом
        if(multi.arrays[param.model].length>1){
            scope.addPropertyToProcess(param, "multi");
        }
        else if(multi.arrays[param.model].length==1){
            scope.addPropertyToProcess(param, multi.arrays[param.model][0]);
        }
        else{
            delete value.selected;
            delete param.selected;
            myFactory.process[param.model]="";
        }
        //*********
        console.log(multi.arrays[param.model]);
    };
    this.matrix={
        loadProcess: function (process, prop) {
            myFactory.parks.forEach(function (park) {
                park.processes.forEach(function (process) {
                    delete process.changing;
                })
            });
            process.changing=true;//для выделения строки которую меняем
            scope.karetka.mode="changing process";
            for(let i=0;i<scope.currObj.length;i++) for(let j=0;j<scope.currObj[i].values.length;j++) delete scope.currObj[i].values[j].selected;//selected параметр позволяет подсветить то значение, которое выбрано в процессе


            scope.myFactory.document.currParam = transportProp.indexOf(prop);
            let a=scope.currParam;
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
        },
        loadMulti:function(process, key){
            let multi=process.multi;
            if( !isNumeric(multi[key]) && multi[key].indexOf("-")!=-1 ){
                return;
            }
            else{
                if( (key=="wrapping" || key=="risk") && multi[key].length>1 ){
                    for(let i=0;i<scope.currObj.length;i++){
                        for(let j=0;j<scope.currObj[i].values.length;j++){
                            if( multi[key].indexOf(scope.currObj[i].values[j].name) ){
                                scope.currObj[i].values[j].selected=true;
                            }
                        }
                    }
                    return;
                }
                this.loadProcess(multi, key);
            }


        }
    };
    this.karetka={
        mode:"listener",
        multiClicked: function (param) {
            console.log(param);
        },
        clicked: function(param, value){
            if(this.mode=="listener") this.mode="making new process";


            if(this.mode=="making new process"){
                //если мы выбираем не мульти значения или режим не мульти
                if(!scope.myFactory.multi.mode || (scope.myFactory.multi.mode && param.model!="wrapping" && param.model!="risk" ) ){
                    scope.addPropertyToProcess(param,value.name);
                    value.selected=true;
                    //выбрать все - отключение надо доделать
                    if(value.action=="selectAll"){
                        scope.clickedSelectAll(param, value);
                    }

                    //если выбран пакет
                    else if(value.action=="package"){
                        let multi=scope.myFactory.multi;
                        multi.template=value.values;
                    }





                    if(scope.selectNextParam()){//здесь мы имеем уже заполненный процесс, остается только добавить его в массив процессов и посчитать
                        console.log(myFactory.multi);
                        console.log(myFactory.process);
                        myFactory.addNewProcess();
                        myFactory.finalCalc();
                        scope.clean();
                    }
                }
                else{
                    scope.clickedOnMulti(param, value);
                }

            }
            if(this.mode=="changing process"){
                if(myFactory.process.constructor.name=="Multi"){
                    let multi=myFactory.process;
                    param=param.model;
                    if( isNumeric(multi[param]) || multi[param].length==1){
                        if(value.action=="package" || value.action=="selectAll"){

                        }
                        else{
                            multi.changeProperty(param, value.name);
                            delete scope.myFactory.process.changing;//убираем выделение строки которую меняли
                            scope.clean();
                        }
                    }

                }
                else if(!scope.myFactory.multi.mode) {
                    if(value.action=="selectAll"){
                        scope.clickedSelectAll(param, value);
                        if(myFactory.process.wrapping!="" && myFactory.process.wrapping!="multi" && myFactory.multi.arrays.wrapping.indexOf(myFactory.process.wrapping)) myFactory.multi.arrays.wrapping.push(myFactory.process.wrapping);
                        if(myFactory.process.risk!="" && myFactory.process.risk!="multi" && myFactory.multi.arrays.risk.indexOf(myFactory.process.risk)) myFactory.multi.arrays.risk.push(myFactory.process.risk);
                    }

                    //если выбран пакет
                    else if(value.action=="package"){
                        let multi=scope.myFactory.multi;
                        multi.template=value.values;
                        myFactory.addNewProcess("changing");
                        delete scope.myFactory.process.changing;//убираем выделение строки которую меняли
                        scope.clean();
                    }
                    else{
                        scope.addPropertyToProcess(param, value.name);
                        delete scope.myFactory.process.changing;//убираем выделение строки которую меняли
                        scope.clean();
                    }
                }
                else{
                    scope.clickedOnMulti(param, value);
                }
            }
        },
    }

});