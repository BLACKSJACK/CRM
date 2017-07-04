/**
 * Created by RoGGeR on 14.06.17.
 */
app.controller('searchCtrl', function($scope,$rootScope,$http,$q,$location,$sce){
    $rootScope.cacheTemplate={};
    $scope.isEmptyObject = function(obj) {//функция проверки объекта на пустоту
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };
    $scope.searchFilter=function(values){

        for(var i=0; i<values.length; i++){
            var obj=values[i];
            $rootScope.cacheTemplate[obj.model]=obj.val;
        }

    };
    $scope.template={};//объект шаблон, необходимый для запроса к бд и дальнейшему решению искать ли в кэше или заново обращаться к бд
    $scope.checkTemplate=function(values){
        var obj;
        for(var i=0;i<values.length;i++){
            if(values[i].model===$scope.template.model){

                obj=values[i];
                i=values.length;
            }
        }
        if(obj) return obj.val.search($scope.template.txt)==0;
        else return false;
    };
    $scope.search = function( values , type) {
        var data={};

        data.type=type;

        if($scope.abort){
            $scope.abort.resolve();
        }
        $scope.abort = $q.defer();
        var flag = values.find(function(element){// функция проверяет введено ли хоть в одно поле поиска значение, если нет - обнуляется массив
            return element.val != '' && element.val!=undefined && element.val.length>1
        });
        data.value=flag;
        console.log(data);
        $scope.template.txt=flag.val;
        $scope.template.model=flag.model;
        $http.post("search.php", data,{timeout:$scope.abort.promise}).then(function success (response) {

                console.log(response.data);
                $rootScope.search_result_type=type;

                $rootScope.search_result=response.data;
            },function error (response){
                console.log(response);
            }
        );
    };
    $scope.clean=function(){//очищаем все результаты поиска
        $rootScope.search_result=[];//<==== обнуляется массив
        $scope.template={};
    };
    $scope.isEmptyQuery=function(values){

        var data={};
        data.values=values;
        var flag = data.values.find(function(element){// функция проверяет введено ли хоть в одно поле поиска значение, если нет - обнуляется массив
            return element.val != '' && element.val!=undefined && element.val.length>1
        });
        return flag;
    };
    $scope.loadCalculation= function(id){
        //$location.path('/calc');
        var url="https://capitalpolis.ru/corp_clients/cargo_insurance_transport_operators/kalkulyatortest/2412/project10.php?id="+id;
        $rootScope.srcqwe=$sce.trustAsResourceUrl(url);

        //location.href = "https://capitalpolis.ru/corp_clients/cargo_insurance_transport_operators/kalkulyatortest/2412/project10.php?id="+id;
    };
});