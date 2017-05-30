/**
 * Created by RoGGeR on 30.05.17.
 */
app.controller('dashboardCtrl',function($scope,$rootScope,$http){
    $scope.currObj=[
        {
            "name":"Найти",
            "values":[
                {
                    "name":"Расчет",
                    "url":"asdad"
                },
                {
                    "name":"Клиента",
                    "url":"qwe"
                }
            ]
        },
        {
            "name":"Создать",
            "values":[
                {
                    "name":"Расчет1",
                    "url":"asdad1"
                },
                {
                    "name":"Клиента",
                    "url":"qwe1"
                }
            ]
        }
    ];

    $scope.currentUl=function(index){
      if(index===$scope.currParam) return true;
    };
    $scope.selectParam=function (index) {
        $scope.currParam=index;
    };
    console.log($scope.currObj);
});