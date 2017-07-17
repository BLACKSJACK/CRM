/**
 * Created by RoGGeR on 17.07.17.
 */
app.controller("tCalcCtrl", function ($http) {
    var scope=this;
    function Limit(cost, limit){return Math.pow(limit/cost, 1/koef_pow)};
    var Points={
        cost:[],
        amount:[],
        risk:[],
        payment: [[0,100],[100000, 70],[500000,30],[50000000, 0]]
    };
    var koef_pow;
    console.log(Points);
    $http.post("loadPoints.php").then(function success(response){
        console.log(response.data);
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


    }, function error(response) {
        console.log(response.data);
    });


    this.Process=function(cost, amount, package, risk, limit, franchise){//конструктор процессов
        this.cost=cost;
        this.amount=amount;
        this.package=package;
        this.risk=risk;
        this.limit=limit;
        this.franchise=franchise;
    };
    this.Process.prototype.calculate=function(){//расчет

    }
});
