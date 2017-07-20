/**
 * Created by RoGGeR on 14.06.17.
 */
app.controller('matrixCtrl', function($rootScope,$http,$q, myFactory){
    $rootScope.cacheTemplate={};

    this.loadCalculation= function(id){ //нажимаем на строку расчета в результате поиска
        console.log(id);
        var data ={};
        data.type="load_calculation";
        data.id=id;
        var scope=this;
        myFactory.urlJSON="transortation_cals.json";
        $http.post("search.php", data).then(function success(response){
            console.log(response.data);
            $rootScope.search_result_type="transoprtCalculation";
            scope.parks=JSON.parse(response.data.parks);

            scope.processes=[];
            var mass=JSON.parse(response.data.processes);
            for(var key in mass){
                scope.processes[key]=mass[key];
            }

            scope.payment=response.data.payment;
            scope.total_price=response.data.total_price;
            scope.total_amout=response.data.amount;
            console.log(scope.parks);
        },function error(response){
            console.log(response)
        });

        //$location.path('/calc');
        //var url="https://capitalpolis.ru/corp_clients/cargo_insurance_transport_operators/kalkulyatortest/2412/project10.php?id="+id;
        //$rootScope.srcqwe=$sce.trustAsResourceUrl(url);

        //location.href = "https://capitalpolis.ru/corp_clients/cargo_insurance_transport_operators/kalkulyatortest/2412/project10.php?id="+id;
    };
});