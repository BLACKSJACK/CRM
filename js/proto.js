/**
 * Created by RoGGeR on 08.08.17.
 */
var transportProp=["cost","amount","wrapping","risk","limit","franchise"];

function Park(process){//создание нового парка
    this.processes=[process];

    this.amount=process.amount;
    this.risks=[process.risk];
    this.base=process.basePremia;
    process.park=this;
}
Park.prototype.setBase=function(number){//установка в каком процессе мы учли базовую ставку
    var arr=processes.filter(function (obj) {
        return obj['park']===number;
    });


};
function Process(process){//конструктор процессов
    for(var key in process){
        this[key]=process[key];
    }
};

Process.prototype.calculateBase=function(){//расчет
    for(var i=0;i<transportProp.length;i++){
        if(typeof this[transportProp[i]]  == "undefined"){
            console.log("Объект не полный, не хватает свойства "+ transportProp[i]);
            return false;
        }
    }
    this.turnover=this.cost*this.amount;
    var spline = Spline(this.cost, Points.cost, 1);
    var spline1 = Spline(parks.amount, Points.amount, 0);
    var price = spline*(1+spline1/100);
    var spline2 = Spline(4, Points.risk, 2);//риски надо еще обработать
    price *= Franchise(this.cost, this.franchise);
    if(this.cost>=this.limit){
        price*=Limit(this.limit*parks.amount*(1+((this.cost-this.limit)/this.limit)), this.limit);
    }
    else price*=Limit(this.cost*parks.amount*(1+((this.limit-this.cost)/this.limit)), this.limit);
    this.baseStavka=price;
    this.basePremia=this.turnover*price/100;
    price *= 1 + spline2 / 100;
    this.riskStavka=price;
    this.riskPremia=this.turnover*price/100;
    this.totalStavka=this.turnover*(this.riskStavka-this.baseStavka)/100;
    this.totalPremia=this.riskPremia-this.basePremia;


};
