/**
 * Created by dmitry on 30/06/15.
 */
mapApp.controller("bodyController", ["$scope","$rootScope","$location", function ($scope, $rootScope, $location) {
    $rootScope.$watch("isRTL",function (){
        $scope.isRTL = $rootScope.isRTL;
    });

    $scope.switchDir = function(isRTL,lang){
        $scope.isRTL = isRTL;
        var url = $location.url().substr(3);
        $location.url('/' + lang + url);
    };

    //$scope.onKeyEvent = function(event){
    //    if(event.keyCode === 17 || event.key === "Control"){
    //        $rootScope.isControlPressed = event.ctrlKey;
    //    }
    //};

    $scope.onClickEvent = function(event){
        if(event){
            var el = angular.element(event.target);
            if(!el.hasClass("link-url") && !el.hasClass("link-container")){
                $scope.$broadcast("closeLink", event.target);
            }
            if(!el.hasClass("svg-cubicle-path")){
                $scope.$broadcast("exitCubicleMode");
            }
        }
    }
}]);