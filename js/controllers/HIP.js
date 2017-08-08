/**
 * Created by RoGGeR on 17.07.17.
 */
app.controller("HIP", function ($http, myFactory, $rootScope, $scope) {
    $rootScope.cacheTemplate={};

    this.myFactory=myFactory;
    this.risks=[];
    for(var i=0;i<this.myFactory.currObj.length; i++){
        var currObj=myFactory.currObj;
        for(var j=0; j<currObj[i].values.length;j++){
            if(currObj[i].values[j].type=="risk") this.risks[currObj[i].values[j].name]=currObj[i].values[j].value;
        }
    }
    console.log(this.risks);
    $scope.$on('$destroy', function() {
        myFactory.cleanProcess();
        $rootScope.mode="";
    });
    this.consolelog=function (val) {
        console.log(val);
    };
    $http.post("loadPoints.php").then(function success(response){

        var ar=response.data;
        for(var i=0;i<ar.length;i++){
            if(ar[i]['number']*1==1) Points.amount.push([ar[i]['x']*1,ar[i]['y']*1]);
            else if(ar[i]['number']*1==2) Points.cost.push([ar[i]['x']*1,ar[i]['y']*1]);
            else if(ar[i]['number']*1==3) Points.risk.push([ar[i]['x']*1,ar[i]['y']*1]);
            else if(ar[i]['number']*1==4) koef_pow=ar[i]['x']*1;
        }

        SplineKoeff(0, Points.amount);
        SplineKoeff(1, Points.cost); //интерполируем как жОские пацаны
        SplineKoeff(2, Points.risk); //продолжаем интерполировать как жОские пацаны
        SplineKoeff(3, Points.payment);
        var proc1=new Process(5000000,120,0,0,5000000,0);
        proc1.calculateBase();
        console.log(proc1);

    }, function error(response) {
        console.log(response.data);
        console.log(response.data);
    });


    $rootScope.mode="calc";
    var scope=this;
    function Limit(cost, limit){return Math.pow(limit/cost, 1/koef_pow)};

    this.loadCalculation= function(id){ //нажимаем на строку расчета в результате поиска
        console.log(id);
        var data ={};
        data.type="load_calculation";
        data.id=id;
        var scope=this;
        myFactory.urlJSON="transortation_cals.json";
        $http.post("search.php", data).then(function success(response){
            console.log(response.data);
            myFactory.matrixType="HIP";
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
            scope.payment=response.data.payment;
            scope.total_price=response.data.total_price;
        },function error(response){
            console.log(response)
        });



    };

    var Points={
        cost:[],
        amount:[],
        risk:[],
        payment: [[0,100],[100000, 70],[500000,30],[50000000, 0]]
    };

    var parks={};
    parks.amount=120;
    this.parks=this.myFactory.parks;
});
