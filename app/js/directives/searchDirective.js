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
            var d = new Date();
            $scope.fromTime = d.setMinutes((Math.round( d.getMinutes()/10)) * 10);
            $scope.toTime = d.setHours(d.getHours() + 1);
            $scope.renderAdvSearchPaneArray = [];

            $scope.disabled = function(date, mode) {
                return ( mode === 'day' && (  date.getDay() === 6 ) );
            };

            $scope.roomTypes = [2,1/*,7*/];
            $scope.selectedRoomTypes = [2];
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
                    $scope.isSpinnerShown = false;

                    $scope.searchResultsRooms = _.filter( d.rooms,function(r){
                        return r.isSearchable;
                    });
                    var buildings = _.filter( d.rooms,function(r){
                        return !r.isSearchable;
                    });
                    $scope.searchResultsBuildings = _.map(buildings, function (b) {
                        return b.floor.building;
                    });
                    $scope.searchResultsStaff = [];
                    $scope.isSearchShown = true;
                    $scope.isAdvSearchShown = false;
                });
            }

        }
    }
}]);