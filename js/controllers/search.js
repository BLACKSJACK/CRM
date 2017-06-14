/**
 * Created by RoGGeR on 14.06.17.
 */
app.controller('searchCtrl', function($scope,$rootScope,$http){
    $scope.search = function( values , type) {
        var data={};
        data.values=values;
        data.type=type;

        $http.post("search.php", data).then(function success (response) {
                console.log(response.data);
                $rootScope.search_result=response.data;
            },function error (response){
                console.log(response.data);
            }
        );
    };
});