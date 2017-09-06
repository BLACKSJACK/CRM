/**
 * Created by RoGGeR on 17.07.17.
 */
"use strict";
app.controller("HIP", function ($http, myFactory, $rootScope, $scope) {
    $rootScope.cacheTemplate={};

    this.myFactory=myFactory;
    this.delete=function(process){
        if(process.park.processes.length>1) process.park.processes.splice(process.park.processes.indexOf(process),1);
        else myFactory.parks.splice(myFactory.parks.indexOf(process.park));
        myFactory.finalCalc();
    };
    this.copy=function(process){
        let proc=new Process(process);
        process.park.processes.splice(process.park.processes.indexOf(process)+1,0,proc);
        for(let key in proc){
            if(transportProp.indexOf(key)==-1 && key!="park" && key!="totalPrice") delete proc[key];
        }
        return proc;
    };
    for(let i=0;i<this.myFactory.currObj.length; i++){
        let currObj=myFactory.currObj;
        for(let j=0; j<currObj[i].values.length;j++){
            if(currObj[i].values[j].type=="risk") risks[currObj[i].values[j].name]=currObj[i].values[j].value;
        }
    }
    $scope.$on('$destroy', function() {
        myFactory.cleanProcess();
        $rootScope.mode="";
    });
    this.consolelog=function (val) {
        console.log(val);
    };



        //let proc1=new Process({cost:5000000,amount:120, wrapping: 0, risk: 0, limit:5000000,franchise:0});
        //proc1.calculateBase();
        //console.log(proc1);


    $rootScope.mode="calc";
    let scope=this;


    this.loadCalculation= function(id){ //нажимаем на строку расчета в результате поиска
        console.log(id);
        let data ={};
        data.type="load_calculation";
        data.id=id;
        let scope=this;
        myFactory.urlJSON="transortation_cals.json";
        $http.post("search.php", data).then(function success(response){
            console.log(response.data);
            myFactory.matrixType="HIP";
            scope.parks=JSON.parse(response.data.parks);

            scope.processes=[];
            let mass=JSON.parse(response.data.processes);
            console.log(mass);
            for(let key in mass){
                scope.processes[key]=mass[key];
            }
            for(let i=1;i<scope.processes.length;i++){
                if(typeof scope.processes[i] !="undefined"){
                    let process=scope.processes[i];
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


});
