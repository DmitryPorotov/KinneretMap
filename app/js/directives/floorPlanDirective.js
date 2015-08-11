/**
 * Created by dmitry on 01/07/15.
 */
mapApp.directive("kmFloorPlans",["$rootScope", function($rootScope) {
    return {
        restrict:"E",
        templateUrl:"templates/floor-plans.html",
        link: function ( $scope, element, attrs ) {
            $scope.selectRoom = function(room) {
                if($scope.isCubiclesShown) return;
                $scope.curRoom = room;
                $scope.curCubicle = null;
                $scope.isRoomDetailsShown = true;
            };
            $scope.isCubiclesShown = false;

            $scope.floorAdd = function(n){
                var floor = _.find($scope.curFloor.building.children,function(f){
                    return f.buildingId === $scope.curFloor.buildingId && f.number == $scope.curFloor.number + n;
                });
                if(floor) {
                    $scope.curFloor = floor;
                    $scope.curRoom = null;
                    $scope.curCubicle = null;
                    $scope.isRoomDetailsShown = false;
                }
            };

            $scope.toggleDock = function () {
                $scope.isDocked = !$scope.isDocked;
            };
            $rootScope.$watch("isControlPressed",function(ctrlKey){
                $scope.isCubiclesShown = ctrlKey;
            });

            $scope.selectCubicle = function(cub){
                $scope.handleSelectionChange(null,$scope.curBuilding,$scope.curFloor,null,cub,$scope.isSearchShown,$scope.isBuildingsCatalogShown,true,true,$scope.isBuildingDetailsShown);
            };
        }
    }
}]);