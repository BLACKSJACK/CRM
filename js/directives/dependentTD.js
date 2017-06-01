/**
 * Created by RoGGeR on 01.06.17.
 */
app.directive("dependentTD", function($scope){
    console.log($scope);
    return function(scope,element,attrs){
        console.log(scope);
        console.log(element);
        console.log(attrs);
    }
});