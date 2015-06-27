mapApp.controller("menuController", ["$scope", "dataService", "$rootScope", "$routeParams",function ($scope, dataService, $rootScope, $routeParams) {
    $scope.langPrefix = $routeParams.lang === "he" ? "heb" : "eng";

    $rootScope.buildings = null;

    $scope.searchField = null;
    $scope.searchResults = [];

    $scope.rooms = null;
    $scope.roomsWithFloorPlans = null;
    $scope.buildings = null;
    $scope.floors = null;
    $scope.cubicles = null;

    $scope.isSearchShown = false;
    $scope.isBuildingsCatalogShown = false;
    $scope.isStaffCatalogShown = false;
    $scope.isRoomDetailsShown = false;
    $scope.isFloorPlanShown = false;

    $scope.curRoom = null;
    $scope.curFloor = null;
    $scope.curBuilding = null;

    dataService.getRooms().success(function (data) {
        $scope.rooms = data;
    });

    dataService.getBuildings().success(function (data) {
        $scope.buildings = data;
    });

    dataService.getFloors().success(function (data) {
        $scope.floors = data;
    });

    dataService.getCubicles().success(function(data){
       $scope.cubicles = data;
    });

    $scope.search = function () {
        $scope.isBuildingsCatalogShown = false;
        $scope.isStaffCatalogShown = false;
        $scope.isSearchShown = true;
        filterResults($scope.rooms);
    };

    $scope.showBuildingsCatalog = function () {
        $scope.isBuildingsCatalogShown = true;
        $scope.isStaffCatalogShown = false;
        $scope.isSearchShown = false;
    };

    function filterResults(rooms) {
        $scope.searchResults = [];
        $scope.rooms.forEach(function (v, i) {
            if (v.id.toString().indexOf(this.searchField) > -1 ) {
                this.searchResults.push(v);
            }
        }, $scope);
    }

    $scope.$watch("rooms+buildings+floors+cubicles", function () {
        if($scope.buildings && $scope.rooms && $scope.floors && $scope.cubicles)
        {
            $scope.rooms.forEach(function(r) { r.nodeType = "room"; });
            $scope.floors.forEach(function(f) { f.nodeType = "floor"; });

            var rootTreeNodes = _.filter($scope.buildings,function(b){
                return b.nodeType !=="noFloors" && b.nodeType !=="oneFloor";
            });

            rootTreeNodes.forEach(function(b){
                switch (b.nodeType) {
                    case "building":{
                        b.children =_.filter($scope.floors,function(f) {
                            return f.buildingId === b.id;
                        });
                        b.children.forEach(function(f){
                            f.building = b; //link floors to buildings
                            f.children = _.filter($scope.rooms,function(r){
                                return r.buildingId === f.buildingId && r.floorNum === f.number;
                            });
                            f.children.forEach(function(r){ //link rooms to floors
                                r.floor = f;
                            });

                            f.cubicles = _.filter($scope.cubicles,function(c){
                                return c.floorNum === f.number && c.buildingId === f.buildingId;
                            });
                            f.cubicles.forEach(function(c){
                                c.floor = r;
                            });
                        });
                        b.children.sort(function(a,b){
                            return a.number - b.number;
                        });
                        break;
                    }
                    case "groupOther":
                    case "groupBuildings": {
                        b.children = _.filter($scope.buildings, function(r) {
                            return r.buildingId === b.id;
                        });
                        b.children.forEach(function (b2){
                            b2.building = b;
                            b2.floor = _.find($scope.floors,function(f){
                                return f.buildingId === b2.id;
                            });
                            if(b2.floor) {
                                b2.floor.building = b2;
                                b2.floor.cubicles = _.filter($scope.cubicles, function (c) {
                                    c.floorNum === b2.floor.number && c.buildingId === b2.floor.buildingId;
                                });
                            }
                        });
                        break;
                    }
                }
            });

            $scope.buildingsData = rootTreeNodes;
            $rootScope.buildings = $scope.buildings;
        }
    });

    $scope.$watch("roomsTree.currentNode",function (n, o) {
        if (n) {
            $scope.isRoomDetailsShown = true;
            switch ($scope.roomsTree.currentNode.nodeType){
                case  "building":
                case  "groupBuildings":{
                    $scope.curFloor = null;
                    $scope.curRoom = null;
                    $rootScope.locationSelectedFromMenu = n;
                    $scope.isFloorPlanShown = false;
                    $scope.isRoomDetailsShown = false;
                    break;
                }
                case "groupOther":{
                    $scope.curFloor = null;
                    $scope.curRoom = null;
                    $rootScope.locationSelectedFromMenu = null;
                    $scope.isFloorPlanShown = false;
                    $scope.isRoomDetailsShown = false;
                    break;
                }
                case  "room":{
                    $rootScope.locationSelectedFromMenu = n.floor.building;
                    $scope.curFloor = n.floor;
                    $scope.curBuilding = n.floor.building;//TODO why do I need this?
                    $scope.curRoom = n;
                    $scope.isFloorPlanShown = true;
                    $scope.isRoomDetailsShown = true;
                    break;
                }
                case  "floor":{
                    $scope.curFloor = n;
                    $scope.curRoom = null;
                    $scope.curBuilding = n.building;
                    $scope.isFloorPlanShown = true;
                    $rootScope.locationSelectedFromMenu = n.building;
                    $scope.isRoomDetailsShown = false;
                    break;
                }
                case "noFloors": {
                    $scope.curFloor = null;
                    $scope.curRoom = n;
                    $rootScope.locationSelectedFromMenu = n;
                    $scope.isFloorPlanShown = false;
                    $scope.isRoomDetailsShown = true;
                    break;
                }
                case  "oneFloor":{
                    $scope.curFloor = n.floor;
                    $scope.curRoom = null;
                    $scope.isRoomDetailsShown = false;
                    $scope.isFloorPlanShown = true;
                    break;
                }
            }
        }
    });


    $scope.selectRoom = function(roomNum) {
        $scope.curRoom = _.find($scope.rooms, function (room) { return room.id == roomNum;});

        $rootScope.locationSelectedFromMenu = _.find($scope.buildings, function (building) { return building.id == $scope.curRoom.buildingId;});
    }

}]);