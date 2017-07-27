/**
 * Created by RoGGeR on 14.06.17.
 */
app.controller('matrixCtrl', function($rootScope,$http,$q, myFactory){
    $rootScope.cacheTemplate={};
    this.myFactory=myFactory;
    this.loadCalculation= function(id){ //нажимаем на строку расчета в результате поиска
        console.log(id);
        var data ={};
        data.type="load_calculation";
        data.id=id;
        var scope=this;
        myFactory.urlJSON="transortation_cals.json";
        $http.post("search.php", data).then(function success(response){
            console.log(response.data);
            myFactory.matrixType="transoprtCalculation";
            scope.parks=JSON.parse(response.data.parks);

            scope.processes=[];
            var mass=JSON.parse(response.data.processes);
            console.log(mass);
            for(var key in mass){
                scope.processes[key]=mass[key];
            }
            for(var i=1;i<scope.processes.length;i++){
                if(typeof scope.processes[i] !="undefined"){
                    var process=scope.processes[i];
                    process.cost=process[1];
                    process.amount=process[2];
                    process.wrapping=process[3];
                    process.risk=process[4];
                    process.limit=process[5];
                    process.franchise=process[6];
                }
            }
            console.log(scope.processes);
            scope.payment=response.data.payment;
            scope.total_price=response.data.total_price;
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