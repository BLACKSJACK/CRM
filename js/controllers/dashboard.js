/**
 * Created by RoGGeR on 30.05.17.
 */
app.controller('dashboardCtrl',function($scope,$rootScope,$http,$cookies){

    $scope.search_params=[];
    $scope.isArray = angular.isArray;
    $scope.checkMult=function(row){

        row.show=false;

    };
    $scope.checkMulti=function(row){
        if(row.contact.length>1){
            if(!row.show)  row.show=true;
            else row.show=false;
        }
        else return false;
    };
    $scope.alert=function(val){

        alert(val);
    };
    $scope.isValue=function(ctx){
        var val = ctx.phone;
        return val!="" && val!=undefined && val!=null && val!=NaN && !angular.equals("", val)
    };
    $scope.isMulti=function(row){
        return row.contact.length>1;
    };
    $scope.multiHeight=function(contacts){
        var height=100/contacts.length;
        height="{height:"+height+"%;}";
        return height;
    };
    $scope.reload_carret=function(string){
        $http.post(string).then(function success (response) {
                $scope.currObj=response.data;
                $scope.navStyle="width:"+100/$scope.currObj.length+"%;";

            },function error (response){
                console.log(response);

            }
        );
    };
    $http.post("dashboardConfig.json").then(function success (response) {
            $scope.config=response.data;
        },function error (response){

        }
    );
    $scope.config=1;
    $http.post("dashboard.json").then(function success (response) {//устанавливаем каретку управления и заполняем ее из файла dashboard.json
            $scope.currObj=response.data;
            if($cookies.get('currentObj')){
                $scope.currObj=$cookies.get('currentObj');
                $cookies.remove('currentObj');
            }


        },function error (response){
            console.log(response);
        }
    );
    $scope.relocatePage=function(url){//переход на другую страницу(как в случае с калькулятором который не написан)
        location.href = url;
    };
    $scope.relocateHere=function(url){//переход в углубление вверху каретки
        for(i=0; i<$scope.currObj.length;i++){

            if($scope.currObj[i]['url']===url){
                console.log($scope.currObj[i]);
                $scope.currParam=$scope.currObj.indexOf($scope.currObj[i]);
            }
        }
    };

    $scope.currentUl=function(index){//функция проверки для анимации и переключения между ul
        if(index===$scope.currParam) return true;
    };
    $scope.selectParam=function (index) { // нажатии на nav
        $scope.currParam=index;
        $rootScope.search_result=[];
    };

    $scope.configuration=function(value){
        if(value===1){
            if($scope.config==='navigation'){
                return true;

            }
            else return false;
        }
    };


});