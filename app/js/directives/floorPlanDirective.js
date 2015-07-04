/**
 * Created by dmitry on 01/07/15.
 */
mapApp.directive("kmFloorPlans",["$rootScope", function($rootScope) {
    return {
        restrict:"E",
        templateUrl:"templates/floor-plans.html",
        link: function ( scope, element, attrs ) {
            scope.selectRoom = function(roomNum) {
                scope.curRoom = _.find(scope.rooms, function (room) { return room.id == roomNum;});
                scope.isRoomDetailsShown = true;
            };
            scope.floorAdd = function(n){
                var floor = _.find(scope.floors,function(f){
                    return f.buildingId === scope.curFloor.buildingId && f.number == scope.curFloor.number + n;
                });
                if(floor){
                    scope.curFloor = floor;
                    if(scope.isDocked){
                        scope.curFloor.imgSuffix = "";
                    }
                    else{
                        scope.curFloor.imgSuffix = "big";
                    }
                }
            };

            scope.isDocked = true;
            scope.toggleDock = function () {
                if (scope.isDocked) {
                    angular.element(document.querySelector('.floor-plan-popup')).append(angular.element(document.querySelector('.floor-plan')));
                    $rootScope.$broadcast('showPopUp');
                    scope.curFloor.imgSuffix = "big";
                }
                else {
                    angular.element(document.querySelector('.floor-plan-container')).append(angular.element(document.querySelector('.floor-plan')));
                    $rootScope.$broadcast('hidePopUp');
                    scope.curFloor.imgSuffix = "";
                }
                scope.isDocked = !scope.isDocked;
            }
        }
    }
}]);