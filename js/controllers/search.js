/**
 * Created by RoGGeR on 14.06.17.
 */
app.controller('searchCtrl', function($scope,$rootScope,$http,$q){

    $scope.search = function( values , type) {
        if($scope.abort) {
            $scope.abort.resolve();
        }
        $scope.abort = $q.defer();
        var data={};
        data.values=values;
        data.type=type;
        $http.post("search.php", data,{timeout:$scope.abort.promise}).then(function success (response) {
                console.log(response.data);
                $rootScope.search_result=response.data;
            },function error (response){
                console.log("Request cancelled");
            }
        );
    };
});