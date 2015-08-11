/**
 * Created by dmitry on 30/06/15.
 */
mapApp.controller("bodyController", ["$scope","$rootScope","$location","tmhDynamicLocale", function ($scope, $rootScope, $location, tmhDynamicLocale) {
    $rootScope.$watch("isRTL",function (){
        $scope.isRTL = $rootScope.isRTL;
    });

    $scope.switchDir = function(isRTL,lang){
        $scope.isRTL = isRTL;
        var url = $location.url().substr(3);
        $location.url('/' + lang + url);
    };

    $scope.onKeyEvent = function(event){
        if(event.keyCode === 17 || event.key === "Control"){
            $rootScope.isControlPressed = event.ctrlKey;
        }
    };

}]);