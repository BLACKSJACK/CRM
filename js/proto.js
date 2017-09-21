/**
 * Created by RoGGeR on 08.08.17.
 */
"use strict";
const transportProp=["cost","amount","wrapping","risk","limit","franchise"];
const qwerty=["Q","W","E","R","T","Y","U","I","O","P"];
let LimKoef=1;
let totalAmount=0;
class Multi{
    constructor(array){
        let wrapping=[];
        let risk=[];
        let limit=[];
        let franchise=[];
        let cost=[];
        let amount=[];
        this.processes=[];
        let mult=this;
        this.show=false;
        array.forEach(function (proc) {
            mult.processes.push(proc);
            proc.multi=mult;
            if(wrapping.indexOf(proc.wrapping)==-1) wrapping.push(proc.wrapping);
            if(risk.indexOf(proc.risk)==-1) risk.push(proc.risk);
            limit.push(proc.limit);
            franchise.push(proc.franchise);
            cost.push(proc.cost);
            amount.push(proc.amount);

        });
        if(cost.length==1) this.cost=cost[0];
        else{
            let min=cost[0];
            let max=cost[0];
            for(let i=0;i<cost.length;i++){
                if(cost[i]>max) max=cost[i];
                if(cost[i]<min) min=cost[i];
            }
            if(min==max) this.cost=min;
            else this.cost=min+"-"+max;
        }
        if(amount.length==1) this.franchise=amount[0];
        else{
            let min=amount[0];
            let max=amount[0];
            for(let i=0;i<amount.length;i++){
                if(amount[i]>max) max=amount[i];
                if(amount[i]<min) min=amount[i];
            }
            if(min==max) this.amount=min;
            else this.amount=min+"-"+max;
        }
        if(wrapping.length==1) this.wrapping=wrapping[0];
        else this.wrapping=wrapping.length;
        if(risk.length==1) this.risk=risk[0];
        else this.risk=risk.length;
        if(limit.length==1) this.limit=limit[0];
        else{
            let min=limit[0];
            let max=limit[0];
            for(let i=0;i<limit.length;i++){
                if(limit[i]>max) max=limit[i];
                if(limit[i]<min) min=limit[i];
            }
            if(min==max) this.limit=min;
            else this.limit=min+"-"+max;
        }
        if(franchise.length==1) this.franchise=franchise[0];
        else{
            let min=franchise[0];
            let max=franchise[0];
            for(let i=0;i<franchise.length;i++){
                if(franchise[i]>max) max=franchise[i];
                if(franchise[i]<min) min=franchise[i];
            }
            if(min==max) this.franchise=min;
            else this.franchise=min+"-"+max;
        }

        console.log(this);
    }
    calculatePrice(){
        let total=0;
        this.processes.forEach(function (process) {
            total+=process.totalPrice;
        });
        this.price=total;
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
        this.totalPrice=0;
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
        this.baseRate=price;
        this.basePrice=this.turnover*price/100;
        //******************до сюда мы посчитали стоимость без вычетов и надбавок за риск

        //************  проверяем учли ли мы надбавку за прицеп базовых рисков для данного типа прицепа
        if(this.park.wrappings.indexOf(this.wrapping)!=-1){
            this.park.wrappings.splice(this.park.wrappings.indexOf(this.wrapping),1);
            if(this.risk!="Базовые риски"){
                //this.park.riskSum+=risks[this.wrapping];
                let spline2 = Spline(risks[this.wrapping]*this.park.riskKoef/2, Points.risk, 2);
                this.totalPrice+=this.turnover*(this.baseRate*spline2/100)/100;
            }
        }
        //**************

        //*******************считаем надбавку за риск
        let spline2 = Spline((risks[this.wrapping]*this.park.riskKoef+risks[this.risk])/2, Points.risk, 2);//риски надо еще обработать
        price *= 1 + spline2 / 100;
        this.riskRate=price;
        this.riskPrice=this.turnover*price/100;
        if(this.basePrice>this.park.base){
            this.totalPrice+=this.riskPrice-this.park.base;
            this.park.base=this.basePrice;
        }
        else{
            this.totalPrice+=this.riskPrice-this.basePrice;
        }
    }
}
class Park{
    constructor(process){
        this.processes=[process];
        if(process.constructor.name=="Process"){
            this.amount=process.amount;
            this.risks=[process.risk];
            this.wrappings=[process.wrapping];
            this.base=process.basePrice;
            process.park=this;
        }
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

        for(let i=0; i<this.processes.length; i++){
            let process=this.processes[i];
            if(process.risk=="Базовые риски"){
                base=this.processes.splice(i,1);
                this.processes.splice(0,0,base[0]);
                return false;
            }
        }
    }
    check(){
        this.clear();
        let wraps={};
        let mass=[];
        let sum=0,amount=0,risksum=0;
        let array=this.processes.filter(function(process){
            return process.multi!==undefined
        });
        let park=this;
        array.forEach(function(process){
            if(park.risks.indexOf(process.risk)==-1) park.risks.push(process.risk);
            if(!wraps.hasOwnProperty(process.wrapping)) wraps[process.wrapping]=process.amount;
            else if(wraps.hasOwnProperty(process.wrapping) && wraps[process.wrapping]<process.amount) wraps[process.wrapping]=process.amount;
            sum+=process.amount*risks[process.wrapping];
            amount+=process.amount;
            risksum+=risks[process.wrapping];

            if(park.wrappings.indexOf(process.wrapping)==-1) park.wrappings.push(process.wrapping);
        });
        for(let i=0;i<this.processes.length;i++){
            delete this.processes[i].changing;//на всякий случай убираем выделение строки
            if(this.processes[i].multi===undefined) {
                if (this.risks.indexOf(this.processes[i].risk) == -1) {
                    this.risks.push(this.processes[i].risk);
                    if (!wraps.hasOwnProperty(this.processes[i].wrapping)) wraps[this.processes[i].wrapping] = this.processes[i].amount;
                    else if (wraps.hasOwnProperty(this.processes[i].wrapping) && wraps[this.processes[i].wrapping] < this.processes[i].amount) wraps[this.processes[i].wrapping] = this.processes[i].amount;


                    sum += this.processes[i].amount * risks[this.processes[i].wrapping];
                    amount += this.processes[i].amount;
                    risksum += risks[this.processes[i].wrapping];


                }
                else {
                    mass.push(new Process(this.processes.splice(i, 1)[0]));
                    i--;
                }
                if (this.wrappings.indexOf(this.processes[i].wrapping) == -1) this.wrappings.push(this.processes[i].wrapping);
            }

        }

        for(let key in wraps){
         /*   risksum+=risks[key];
            amount+=wraps[key];
          sum+=risks[key]*wraps[key];
          */
            let flag=true;
            this.processes.forEach(function(process){
                if(process.wrapping==key && process.risk=="Базовые риски") flag=false;
            });
            if(flag){
                risksum+=risks[key];
                amount+=wraps[key];
                sum+=risks[key]*wraps[key];
            }
        }

        if(amount==0 || risksum==0) this.riskKoef=0;
        else this.riskKoef=sum/(amount*risksum);
        //this.riskSum=risksum;
        return mass;
    }
    cutDownLimits(a_limit){
        this.processes.forEach(function (process) {
            if(process.limit>a_limit) process.limit=a_limit;
        })
    }
    calculateMatrixWithAlimit(a_limit, events){//считаем сколько была бы общая премия если вместо лимита и стоимости поставить агрегатный лимит
        let overall=0;
        this.processes.forEach(function (process) {
            let cost=process.cost;
            let limit=process.limit;
            if(events){
                process.limit*=a_limit*0.33;
            }
            else{
                if(process.cost<a_limit) process.cost=a_limit;
                process.limit=a_limit;
            }
            process.calculateBase();
            overall+=process.totalPrice*1;
            process.cost=cost;
            process.limit=limit;
            process.calculateBase();
        });
        return overall;
    }
    applyKoef(koef){
        this.processes.forEach(function(process){
            process.totalPrice*=koef;
        })
    }
    applyPracticalPriceKoef(){
        this.processes.forEach(function(process){
            if(process.practicalPriceKoef) process.totalPrice*=process.practicalPriceKoef;
        })
    }
    calculate(){
        this.processes.forEach(function (process) {
            process.calculateBase();
        })
    }
    getTotal(){
        let sum=0;
        this.processes.forEach(function(process){
            sum+=process.totalPrice;
        });
        return sum;
    }
}


