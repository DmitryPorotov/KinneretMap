mapApp.directive("kmSearch", ["menuLogicService", function (menuLogicService) {
    return {
        restrict: "E",
        templateUrl:"templates/search-results.html" ,
        link: function ( $scope, element, attrs ) {
            $scope.selectRoomFromSearch = function(room){
                $scope.handleSelectionChange(room.floor.building,null,room.floor,room,null,true,false,true,true);
            };

            $scope.selectBuildingFromSearch = function(building){
                $scope.handleSelectionChange(building,null,null,null,null,true);
            };

            $scope.goToRoom = function(loc){
                var r = menuLogicService.findLocation(loc);

                if(r.cubicle){
                    $scope.handleSelectionChange(r.room.floor.building,r.room.floor.building,r.room.floor,null,r.cubicle,true,false,true,true);
                }
                else if(r.room){
                    $scope.handleSelectionChange(r.room.floor.building,null,r.room.floor,r.room,null,true,false,true,true);
                }
            };
        }
    }
}]).directive("kmAdvSearch",["menuLogicService",function(menuLogicService){
    return {
        restrict: "E",
        templateUrl: "templates/advanced-search.html",
        link: function ( $scope, element, attrs ) {
            $scope.dt = new Date();
            $scope.minDate = new Date();
            $scope.maxDate = new Date().setDate( new Date().getDate()+7);
            $scope.fromTime = new Date();
            $scope.toTime = new Date();
            $scope.uselessArray = [];

            $scope.disabled = function(date, mode) {
                return ( mode === 'day' && (  date.getDay() === 6 ) );
            };

            $scope.roomTypes = ["compRoom","classroom"/*,"auditorium"*/];
            $scope.selectedRoomTypes = ["compRoom"];
            $scope.toggleRoomType = function(type){
                var index = $scope.selectedRoomTypes.indexOf(type);
                if(index > -1){
                    $scope.selectedRoomTypes.splice(index,1);
                }
                else{
                    $scope.selectedRoomTypes.push(type);
                }
            };

            $scope.searchForAvailableRooms = function(startTime,endTime,date,types){
                var d = date.toISOString().split("T")[0];
                menuLogicService.filterRoomsByAvailability(startTime,endTime,d,types).then(function(d){
                    $scope.searchResultsRooms = d.rooms;
                    $scope.searchResultsBuildings = d.buildings;
                    $scope.isSearchShown = true;
                    $scope.isAdvSearchShown = false;
                });
            }

        }
    }
}]);