/**
 * Created by dmitry on 30/06/15.
 */
mapApp.controller("bodyController", ["$scope","$rootScope", function ($scope, $rootScope) {
    $rootScope.$watch("isRTL",function (){
        $scope.isRTL = $rootScope.isRTL;
    });

    $scope.switchDir = function(isRTL){
        $scope.isRTL = isRTL;
    };

}]);