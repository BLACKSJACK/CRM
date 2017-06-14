/**
 * Created by RoGGeR on 30.05.17.
 */
app.controller('loginCtrl', function($scope, $location, $rootScope,$http){
    $scope.username = '';
    $scope.password = '';
    $scope.enter=function(){
        console.log($scope.username+" "+$scope.password);
        if ($scope.username!="" && ($scope.password=="" || $scope.password==undefined)) document.getElementById("password").focus();
        else if($scope.password!="" && ($scope.username=="" || $scope.username==undefined)) document.getElementById("username").focus();
        else if($scope.password!="" && $scope.username!="") $scope.submit();
    };
    $scope.submit=function(){
        var data={};
        data.login=$scope.username;
        data.pwd=$scope.password;
        $http.post("authorization.php", data).then(function success (response) {
            console.log(response);
            if (response.data['loggin'] === true) {
                $rootScope.loggedIn = true;
                $location.path('/dashboard');
                $rootScope.name = response.data['name'];
            }
            else {
                $scope.username = '';
                $scope.password = '';
            }
        },function error (response){
            console.log(response);
        }
        );

    }
});
