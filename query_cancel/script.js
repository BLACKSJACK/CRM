var magic = {
  controller: MagicController,
  template:`
    <input type="text" placeholder="Find a card" ng-model="$ctrl.cardName" ng-change="$ctrl.findCard()" />
    <ul>
      <li ng-repeat="card in $ctrl.cards">{{ card.name }}</li>
    </ul>
  `
}

function MagicController($http, $q) {
  var vm = this;
  var request = "https://api.magicthegathering.io/v1/cards?name=";
  var abort;
  
  this.cardName = "";
  this.findCard = findCard;
  this.cards = [];
  
  
  function findCard() {
    // with $http config option timeout and promises,
    // each time the search function is called we can abort the previous request
    if(abort) {
      abort.resolve();
    }
    abort = $q.defer();
    
    $http.get(request + vm.cardName, {timeout: abort.promise})
      .then(function successCallback(result) {
        vm.cards = result.data.cards;
      }, function errorCallback(response) {
          console.log("Request cancelled");
    });
  }
}

angular.module('myApp', []);
angular.module('myApp')
  .component('magic', magic)
  .controller('MagicController', MagicController);