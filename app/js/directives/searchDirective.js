mapApp.directive("kmSearch", function () {
    return {
        restrict: "E",
        templateUrl:"templates/search-results.html" ,
        link: function ( scope, element, attrs ) {
            scope.selectRoomFromSearch = function(room){
                scope.handleCurrentNodeChange(room.floor, room, true, true, room.floor.building);
            };
            scope.selectBuildingFromSearch = function(building){
                scope.handleCurrentNodeChange(null, null, false, false, building);
            };
            scope.goToRoom = function(loc){
                var arr = loc.split("-");
                var room = _.find(scope.rooms,function(r){
                    return r.hebName === arr[0] || r.engName === arr[0];
                });
                if(room){
                    scope.handleCurrentNodeChange(room.floor, room, true, true, room.floor.building);
                }
            }
        }
    }
});