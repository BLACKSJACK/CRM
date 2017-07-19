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
    this.Process=function(cost, park, wrapping, risk, limit, franchise){//конструктор процессов
        this.cost=cost;
        this.park=park;
        this.wrapping=wrapping;
        this.risk=risk;
        this.limit=limit;
        this.franchise=franchise;
    };
    this.Process.prototype.calculate=function(){//расчет
        this.amount=this.cost*this.park;
        var spline = Spline(this.cost, Points.cost, 1);
        var spline1 = Spline(parks.amount, Points.amount, 0);    // park заменили на dop_park
        var price = spline*(1+spline1/100);
        price *= Franchise(this.cost, this.franchise);
        if(this.cost>=this.limit){
            price*=Limit(this.limit*parks.amount*(1+((this.cost-this.limit)/this.limit)), this.limit);// park заменили на dop_park
        }
        else price*=Limit(this.cost*parks.amount*(1+((this.limit-this.cost)/this.limit)), this.limit);// park заменили на dop_park
        this.stavka=price;
        this.premia=this.amount*price/100;
    };
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
        var proc1=new scope.Process(5000000,120,0,0,5000000,0);
        proc1.calculate();
        console.log(proc1);

    }, function error(response) {
        console.log(response.data);
        console.log(response.data);
    });

    var parks={};
    parks.amount=120;




});
