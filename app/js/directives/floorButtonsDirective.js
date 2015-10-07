/**
 * Created by Dmitry on 15/08/2015.
 */
mapApp.directive("kmFloorButtons",["$rootScope", function($rootScope) {
    return {
        restrict: "E",
        template:'<div class="floor-buttons"><div ng-repeat="fl in hoveredBuilding.children" ng-click="selectFloorFromMap(fl)">{{fl[langPrefix + "Name"]}}</div></div>',
        //templateUrl: "templates/floor-plans.html",
        link: function ($scope, element, attrs) {
            $scope.hoveredBuilding = null;
            $rootScope.$on("openFloors",function(event,obj){
                element.children().eq(0).css({left:obj.center[0] /*obj.pixel[0]*/ + 1 + "px",top:obj.center[1] /*obj.pixel[1]*/ + "px",display:"block"});
                $scope.$apply(function(){
                   $scope.hoveredBuilding = obj.location;
                });
            });
            $scope.selectFloorFromMap = function(floor){
                $scope.handleSelectionChange(floor.building,floor.building,floor,null,null,false,false,false,floor,true);
            };
            $rootScope.$on("closeFloors",function(){
                element.children().eq(0).css({display:"none"});
            });
        }
    }
}]);