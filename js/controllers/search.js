/**
 * Created by RoGGeR on 14.06.17.
 */
app.controller('searchCtrl', function($rootScope,$http,$q,$location,myFactory){
    this.myFactory=myFactory;

    $rootScope.cacheTemplate={};
    var scope=this;
    this.isEmptyObject = function(obj) {//функция проверки объекта на пустоту
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };

    this.searchFilter=function(values){
        console.log(values);
        for(var i=0; i<values.length; i++){
            var obj=values[i];
            if(obj.val=="") $rootScope.cacheTemplate[obj.model]=undefined;
            else if(obj.model=="contact"){
                $rootScope.cacheTemplate.contact={};
                if(isNaN(obj.val)) $rootScope.cacheTemplate.contact["name"]=obj.val;
                else $rootScope.cacheTemplate.contact["phone"]=obj.val;
            }
            else $rootScope.cacheTemplate[obj.model]=obj.val;
            console.log($rootScope.cacheTemplate);
        }

    };
    this.template={};//объект шаблон, необходимый для запроса к бд и дальнейшему решению искать ли в кэше или заново обращаться к бд
    this.checkTemplate=function(values){//проверка шаблона
        var obj;
        for(var i=0;i<values.length;i++){
            if(values[i].model===scope.template.model){

                obj=values[i];
                i=values.length;
            }
            console.log(scope.template);
        }
        if(obj) return obj.val.search(scope.template.txt)==0;
        else return false;
    };
    this.search = function( values , type) {
        var data={};

        data.type=type;

        if(scope.abort){
            scope.abort.resolve();
        }
        scope.abort = $q.defer();
        var flag=this.isEmptyQuery(values);
        data.value=flag;

        scope.template.txt=flag.val;
        scope.template.model=flag.model;
        console.log(data);
        console.log(scope.template);
        $http.post("search.php", data,{timeout:scope.abort.promise}).then(function success (response) {



                scope.myFactory.matrixType=type;

                $rootScope.cacheTemplate={};

                $rootScope.search_result=response.data;
                console.log($rootScope.search_result);
            },function error (response){
                console.log(response);
            }
        );
    };
    this.clean=function(){//очищаем все результаты поиска
        $rootScope.search_result=[];//<==== обнуляется массив
        scope.template={};
    };
    this.isEmptyQuery=function(values){

        var data={};
        data.values=values;
        var flag = data.values.find(function(element){// функция проверяет введено ли хоть в одно поле поиска значение, если нет - обнуляется массив
            return element.val != '' && element.val!=undefined && element.val.length>1
        });
        return flag;
    };


});