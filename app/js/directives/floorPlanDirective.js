/**
 * Created by dmitry on 01/07/15.
 */
mapApp.directive("kmFloorPlans",[function() {
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

            $scope.selectCubicle = function(cub){
                $scope.handleSelectionChange(null,$scope.curBuilding,$scope.curFloor,null,cub,$scope.isSearchShown,$scope.isBuildingsCatalogShown,true,true,$scope.isBuildingDetailsShown);
                if(cub.room){
                    drillUp(cub);
                }
            };

            var cubs;

            $scope.drillDown = function(room) {
                cubs = _.filter(room.floor.cubicles,function(c){
                    return c.insideOfRoomId === room.id;
                });
                if(cubs.length){
                    $scope.isCubiclesShown = true;
                }
                cubs.forEach(function(c){
                    c.isShown = true;
                });

                if(document.selection && document.selection.empty) {
                    document.selection.empty();
                } else if(window.getSelection) {
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                }
            };

            $scope.$on("exitCubicleMode",function(){
                if(cubs)
                drillUp();
            });

            function drillUp() {
                cubs.forEach(function (c) {
                    c.isShown = false;
                });
                $scope.isCubiclesShown = false;
                cubs = null;
            }

        }
    }
}]);