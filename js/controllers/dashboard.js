/**
 * Created by RoGGeR on 30.05.17.
 */
app.controller('dashboardCtrl',function($rootScope,$http,$cookies, myFactory, $filter){
    this.myFactory=myFactory;
    var scope=this;
    this.search_params=[];
    this.isArray = angular.isArray;
    this.checkMult=function(row){

        row.show=false;

    };
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
        for(i=0; i<scope.currObj.length;i++){

            if(scope.currObj[i]['url']===url){
                console.log(scope.currObj[i]);
                scope.currParam=scope.currObj.indexOf(scope.currObj[i]);
            }
        }
    };

    this.currentUl=function(index){//функция проверки для анимации и переключения между ul
        if(index===scope.currParam) return true;
    };
    this.currentProcess={};
    this.selectParam=function (index) { // нажатии на nav
        this.currParam=index;
        $rootScope.search_result=[];

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
    this.currencyFilter = function(value){
        return $filter(value.type)(value.name, '', 0);
    };
    this.loadProcess=function(process){
        for(var i=0;i<scope.currObj.length;i++){
            for(var j=0;j<scope.currObj[i].values.length;j++){

                    delete scope.currObj[i].values[j].selected;


            }
        }
        myFactory.process=process;
        for(var key in process){
            if(myFactory.transportProp.indexOf(key)!=-1){
                if(key=='cost'|| key=='amount'||key=='limit'||key=='franchise'){
                    var karetkaParam=scope.currObj.filter(function(obj){
                        return obj['model']==key;
                    });
                    karetkaParam=karetkaParam[0];
                    for(var i=0;i<karetkaParam.values.length;i++){
                        if(karetkaParam.values[i].name=="input") karetkaParam.values[i].selected=get_value(process[key]);
                        if(karetkaParam.values[i].name==get_value(process[key])){
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
                                break;
                            }
                        }
                    }
                }
            }

        }
        console.log(scope.currObj);
    };
    this.alreadySelected = function(model){
        if($rootScope.mode=="calc")
        return myFactory.process[model]!="";
        else return false;
    };
    this.calc={
        mode:"making new process",
        clicked: function(model, value){
            myFactory.process[model]=value.name;
            if(this.mode=="making new process"){
                var i=0;
                for(var key in myFactory.process){
                    if(myFactory.process[key]==""){
                        scope.currParam=i;
                        return false;
                    }
                    i++;
                }
                //здесь мы имеем уже заполненный процесс, остается только добавить его в массив процессов и посчитать
                //поднянуть так сказать писю так сказать к носу
            }
            if(this.mode=="changing process"){

            }
        },
        loadProcessInKaretka: function(){

        }
    }

});