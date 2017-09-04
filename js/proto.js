/**
 * Created by RoGGeR on 08.08.17.
 */
"use strict";
const transportProp=["cost","amount","wrapping","risk","limit","franchise"];
let LimKoef=1;
let totalAmount=0;
class Park{
    constructor(process){
        this.processes=[process];

        this.amount=process.amount;
        this.risks=[process.risk];
        this.wrappings=[process.wrapping];
        this.base=process.basePremia;
        process.park=this;
    }
    isMulti(){
        this.multi=false;
        this.processes.forEach(function (process) {
            if(process[multi]!=false) this.multi=true;
        });
    }
    findMaxLimit(){
        let max=0;
        this.processes.forEach(function (process){
            max=Math.max(process.limit, max);
        });
        return max;
    }
    calculateAmount(){
        let max=0;
        this.processes.forEach(function (process){
            max=Math.max(process.amount, max);
        });
        this.amount=max;
        return max;
    }
    clear(){
        this.risks=[];
        this.wrappings=[];
        this.base=0;
        this.riskKoef=0;
    }
    replaceBase(){
        let base;
        if(this.processes[0].risk=="Базовые риски") return;
        this.processes.forEach(function(process,i, mass){
            if(process.risk=="Базовые риски"){
                base=mass.splice(i,1);
                mass.splice(0,0,base[0]);
                return false;
            }
        })
    }
    check(){
        this.clear();
        let wraps={};
        let mass=[];
        let sum=0,amount=0,risksum=0;
        for(let i=0;i<this.processes.length;i++){
            delete this.processes[i].changing;//на всякий случай убираем выделение строки
            if(this.risks.indexOf(this.processes[i].risk)==-1){
                this.risks.push(this.processes[i].risk);
                if(!wraps.hasOwnProperty(this.processes[i].wrapping)) wraps[this.processes[i].wrapping]=this.processes[i].amount;
                else if(wraps.hasOwnProperty(this.processes[i].wrapping) && wraps[this.processes[i].wrapping]<this.processes[i].amount) wraps[this.processes[i].wrapping]=this.processes[i].amount;


             /*
                sum+=this.processes[i].amount*risks[this.processes[i].wrapping];
                amount+=this.processes[i].amount;
                risksum+=risks[this.processes[i].wrapping];
             */

            }
            else{
                mass.push(new Process(this.processes.splice(i,1)[0]));
                i--;
            }
            if(this.wrappings.indexOf(this.processes[i].wrapping)==-1) this.wrappings.push(this.processes[i].wrapping);


        }
        for(let key in wraps){
            risksum+=risks[key];
            amount+=wraps[key];
            sum+=risks[key]*wraps[key];
        }
        if(amount==0 || risksum==0) this.riskKoef=0;
        else this.riskKoef=sum/(amount*risksum);

        return mass;
    }
    cutDownLimits(a_limit){
        this.processes.forEach(function (process) {
            if(process.limit>a_limit) process.limit=a_limit;
        })
    }
    calculateWithA_limit(a_limit){
        let overall=0;
        this.processes.forEach(function (process) {
            let cost=process.cost;
            let limit=process.limit;
            if(process.cost<a_limit) process.cost=a_limit;
            process.limit=a_limit;
            process.calculateBase();
            overall+=process.totalPremia*1;
            process.cost=cost;
            process.limit=limit;
        });
        return overall;
    }
    calculate(){
        this.processes.forEach(function (process) {
            process.calculateBase();
        })
    }
    getTotal(){
        let sum=0;
        this.processes.forEach(function(process){
            sum+=process.totalPremia;
        });
        return sum;
    }
}
class Process{
    constructor(process, multi){
        console.log(process);
        for(let key in process){
            this[key]=process[key];
        }
        if(multi) this.multi=multi;
    }
    calculateBase(){
        for(let i=0;i<transportProp.length;i++){
            if(typeof this[transportProp[i]]  == "undefined"){
                console.log("Объект не полный, не хватает свойства "+ transportProp[i]);
                return false;
            }
        }
        this.turnover=this.cost*this.amount;
        let spline = Spline(this.cost, Points.cost, 1);
        let spline1 = Spline(totalAmount, Points.amount, 0);
        let price = spline*(1+spline1/100);

        price *= Franchise(this.cost, this.franchise);
        if(this.cost>=this.limit){
            price*=Limit(this.limit*totalAmount*(1+((this.cost-this.limit)/this.limit)), this.limit);
        }
        else price*=Limit(this.cost*totalAmount*(1+((this.limit-this.cost)/this.limit)), this.limit);
        this.baseStavka=price;
        this.basePremia=this.turnover*price/100;
        //******************до сюда мы посчитали стоимость без вычетов и надбавок за риск
        console.log((risks[this.wrapping]*this.park.riskKoef+risks[this.risk])/2);
        let spline2 = Spline((risks[this.wrapping]*this.park.riskKoef+risks[this.risk])/2, Points.risk, 2);//риски надо еще обработать
        price *= 1 + spline2 / 100;
        this.riskStavka=price;
        this.riskPremia=this.turnover*price/100;
        if(this.basePremia>this.park.base){
            this.totalPremia=this.riskPremia-this.park.base;
            this.park.base=this.basePremia;
        }
        else{
            this.totalPremia=this.riskPremia-this.basePremia;
        }
        if(this.park.wrappings.indexOf(this.wrapping)!=-1){
            this.park.wrappings.splice(this.park.wrappings.indexOf(this.wrapping),1);
            if(this.risk!="Базовые риски"){
                let spline2 = Spline((risks[this.wrapping]*this.park.riskKoef)/2, Points.risk, 2);
                this.totalPremia+=this.turnover*(this.baseStavka*spline2/100)/100;
            }
        }
        this.totalPremia*=LimKoef;
        //if(this.risk=="Базовые риски" && )
        //this.totalStavka=this.turnover*(this.riskStavka-this.baseStavka)/100; //пока не понятно что это такое вообще
        //this.totalPremia=this.riskPremia-this.basePremia; // -//-
    }
}

