/**
 * Created by RoGGeR on 30.05.17.
 */
app.controller('dashboardCtrl',function($scope,$rootScope,$http){
    $scope.reload_carret=function(string){
        $http.post(string).then(function success (response) {
                $scope.currObj=response.data;
                $scope.navStyle="width:"+100/$scope.currObj.length+"%;";

            },function error (response){
                console.log(response);
            }
        );
    };
    $http.post("dashboardConfig.json").then(function success (response) {
            $scope.config=response.data;
        },function error (response){

        }
    );
    $scope.config=1;
    $http.post("dashboard.json").then(function success (response) {
            $scope.currObj=response.data;
            var string=100/$scope.currObj.length+"%";
            $scope.navStyle={width:string};
            console.log($scope.navStyle);

        },function error (response){
            console.log(response);
        }
    );
    $scope.selPar=function(val){
      console.log(val);
    };
    $scope.currentUl=function(index){
      if(index===$scope.currParam) return true;
    };
    $scope.selectParam=function (index) {
        $scope.currParam=index;
    };
    $scope.bla=function(val){
      $scope.config=val;

    };
    $scope.configuration=function(value){
        if(value===1){
            if($scope.config==='navigation'){
                return true;

            }
            else return false;
        }
    };
    console.log($scope.configuration(1));

});