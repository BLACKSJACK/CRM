/**
 * Created by RoGGeR on 30.05.17.
 */
app.controller('loginCtrl', function($scope, $location, $rootScope,$http){
    $scope.submit=function(){
        var data={};
        data.login=$scope.username;
        data.pwd=$scope.password;
        $http.post("authorization.php", data).then(function success (response) {
                if(response.data==="permission denied"){
                    $scope.username='';
                    $scope.password='';
                }
                else{

                    $rootScope.loggedIn = true;
                    $location.path('/dashboard');

                    $rootScope.name=response.data['name'];

                }

            },function error (response){
                console.log(response);
            }
        );

    }
});