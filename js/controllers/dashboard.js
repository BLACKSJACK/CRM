/**
 * Created by RoGGeR on 30.05.17.
 */
app.controller('dashboardCtrl',function($rootScope,$http,$cookies){
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
    this.reloadDashboard=function(string){
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
    this.selectParam=function (index) { // нажатии на nav
        scope.currParam=index;
        $rootScope.search_result=[];
    };

    this.configuration=function(value){
        if(value===1){
            return scope.config==='navigation';
        }
    };


});