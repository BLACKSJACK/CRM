/**
 * Created by RoGGeR on 14.06.17.
 */
app.controller('matrixCtrl', function($rootScope,$http,$q, myFactory){
    $rootScope.cacheTemplate={};
    this.isEmptyObject = function(obj) {//функция проверки объекта на пустоту
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };
    this.searchFilter=function(values){

        for(var i=0; i<values.length; i++){
            var obj=values[i];
            $rootScope.cacheTemplate[obj.model]=obj.val;
        }

    };
    this.template={};//объект шаблон, необходимый для запроса к бд и дальнейшему решению искать ли в кэше или заново обращаться к бд
    this.checkTemplate=function(values){
        var obj;
        for(var i=0;i<values.length;i++){
            if(values[i].model===this.template.model){

                obj=values[i];
                i=values.length;
            }
        }
        if(obj) return obj.val.search(this.template.txt)==0;
        else return false;
    };
    this.search = function( values , type) {
        var data={};

        data.type=type;

        if(this.abort){
            this.abort.resolve();
        }
        this.abort = $q.defer();
        var flag = values.find(function(element){// функция проверяет введено ли хоть в одно поле поиска значение, если нет - обнуляется массив
            return element.val != '' && element.val!=undefined && element.val.length>1
        });
        data.value=flag;
        console.log(data);
        this.template.txt=flag.val;
        this.template.model=flag.model;
        $http.post("search.php", data,{timeout:this.abort.promise}).then(function success (response) {

                console.log(response.data);
                $rootScope.search_result_type=type;

                $rootScope.search_result=response.data;
            },function error (response){
                console.log(response);
            }
        );
    };
    this.clean=function(){//очищаем все результаты поиска
        $rootScope.search_result=[];//<==== обнуляется массив
        this.template={};
    };
    this.isEmptyQuery=function(values){

        var data={};
        data.values=values;
        var flag = data.values.find(function(element){// функция проверяет введено ли хоть в одно поле поиска значение, если нет - обнуляется массив
            return element.val != '' && element.val!=undefined && element.val.length>1
        });
        return flag;
    };

    this.loadCalculation= function(id){ //нажимаем на строку расчета в результате поиска
        console.log(id);
        var data ={};
        data.type="load_calculation";
        data.id=id;
        var scope=this;
        myFactory.urlJSON="transortation_cals.json";
        $http.post("search.php", data).then(function success(response){
            console.log(response.data);
            $rootScope.search_result_type="load_calculation";
            scope.parks=JSON.parse(response.data.parks);

            scope.processes=[];
            var mass=JSON.parse(response.data.processes);
            for(var key in mass){
                scope.processes[key]=mass[key];
            }

            scope.payment=response.data.payment;
            scope.total_price=response.data.total_price;
            scope.total_amout=response.data.amount;
            console.log(this.parks);
        },function error(response){
            console.log(response)
        });

        //$location.path('/calc');
        //var url="https://capitalpolis.ru/corp_clients/cargo_insurance_transport_operators/kalkulyatortest/2412/project10.php?id="+id;
        //$rootScope.srcqwe=$sce.trustAsResourceUrl(url);

        //location.href = "https://capitalpolis.ru/corp_clients/cargo_insurance_transport_operators/kalkulyatortest/2412/project10.php?id="+id;



    };
});