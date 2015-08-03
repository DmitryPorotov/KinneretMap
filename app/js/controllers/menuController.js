mapApp.controller("menuController", ["$scope", "$rootScope", "$routeParams", "langConst", "menuLogicService", "menuCache", function ($scope, $rootScope, $routeParams, langConst, menuLogicService, menuCache) {
    console.log($scope.$id);
    $scope.langPrefix = $routeParams.lang === "he" ? "heb" : "eng";
    $scope.langConst = langConst;

    $rootScope.isRTL = $routeParams.lang === "he";
    $rootScope.buildings = $rootScope.buildings || null;

    $scope.searchField = null;
    $scope.searchResultsRooms = $scope.searchResultsBuildings = $scope.searchResultsStaff = [];

    $scope.buildings = menuCache.buildings || null;
    $scope.floors = menuCache.floors || null;
    $scope.rooms = menuCache.rooms || null;
    $scope.cubicles = menuCache.cubicles || null;
    $scope.buildingsObj = menuCache.buildingsObj || null;

    $scope.staffObj = menuCache.staffObj || null;

    $scope.isSearchShown = false;
    $scope.isBuildingsCatalogShown = false;
    $scope.isStaffCatalogShown = false;
    $scope.isRoomDetailsShown = false;
    $scope.isFloorPlanShown = false;

    $scope.curRoom = null;
    $scope.curFloor = null;
    $scope.curBuilding = null;

    $scope.isPopupShown = false;

    $rootScope.$on('showPopUp',function(){
        $scope.isPopupShown = true;
    });

    $rootScope.$on('hidePopUp',function(){
        $scope.isPopupShown = false;
    });

    if(!menuCache.isInit) {
        menuLogicService.getBuildingsObject().then(function (data) {
            $scope.buildingsObj = menuCache.buildingsObj = data;
            var bd = menuLogicService.getBuildingsData();
            $scope.floors = menuCache.floors = bd.floors;
            $scope.rooms = menuCache.rooms = bd.rooms;
            $scope.cubicles = menuCache.cubicles = bd.cubicles;
            $rootScope.buildings = menuCache.buildings = $scope.buildings = bd.buildings;
        }, function (error) {
            //TODO handle error
            console.log(error);
        });

        menuLogicService.getStaffObject().then(function (data) {
            $scope.staffObj = menuCache.staffObj = data;
        }, function (error) {
            //TODO handle error
            console.log(error);
        });
        menuCache.isInit = true;
    }

    $scope.closeMenu = function() {
        showPanes(false,false,false,false,false);
    };

    $scope.search = function () {
        if ($scope.searchField) {
            showPanes(true);
            filterResults($scope.searchField);
        }
    };

    $scope.handleSearchFieldKeyPress = function(e){
        if(e.keyCode === 13 || e.charCode === 13){
           $scope.search();
        }
    };
    $scope.showBuildingsCatalog = function () {
        showPanes(false,true);
    };

    function showPanes(isSearchShown,isBuildingsCatalogShown,isStaffCatalogShown,isRoomDetailsShown,isFloorPlanShown){
       $scope.isSearchShown = !!isSearchShown;
       $scope.isBuildingsCatalogShown = !!isBuildingsCatalogShown;
       $scope.isStaffCatalogShown = !!isStaffCatalogShown;
       $scope.isRoomDetailsShown = !!isRoomDetailsShown;
       $scope.isFloorPlanShown = !!isFloorPlanShown;
    }

    function filterResults(term) {
        var tmpRes = menuLogicService.findLocations(term);
        $scope.searchResultsBuildings = tmpRes[0];
        $scope.searchResultsRooms = tmpRes[1];
        $scope.searchResultsStaff = menuLogicService.findPersons(term)
    }

    $scope.setLocationSelectedFromMenu = function(loc){
        $rootScope.locationSelectedFromMenu = loc;
    };

    $scope.handleCurrentNodeChange = function (curFloor,curRoom,isRoomDetailsShown,isFloorPlanShown,locationSelectedFromMenu) {
        $scope.curFloor = curFloor;
        $scope.curRoom = curRoom;
        $scope.isRoomDetailsShown = isRoomDetailsShown;
        $scope.isFloorPlanShown = isFloorPlanShown;
        $scope.curBuilding = null;
        $rootScope.locationSelectedFromMenu = locationSelectedFromMenu;
        if(curFloor){
            curFloor.imgSuffix = $scope.isPopupShown ? 'big':'';
        }
    };

    $scope.$watch("roomsTree.currentNode", function (n, o) {
        if (n) {
            switch ($scope.roomsTree.currentNode.nodeType) {
                case  "building":
                case  "groupBuildings":{
                    $scope.handleCurrentNodeChange(null,null,false,false,n);
                    break;
                }
                case "groupOther":{
                    $scope.handleCurrentNodeChange(null,null,false,false,null);
                    break;
                }
                case  "room":{
                    $scope.handleCurrentNodeChange(n.floor,n,true,true,n.floor.building);
                    break;
                }
                case  "floor":{
                    $scope.handleCurrentNodeChange(n,null,false,true,n.building);
                    break;
                }
                case "noFloors": {
                    $scope.handleCurrentNodeChange(null,n,true,false,n);
                    break;
                }
                case  "oneFloor":{
                    $scope.handleCurrentNodeChange(n.floor,null,false,true,n);
                    break;
                }
            }
            $scope.roomsTree.currentNode = null;
        }
    });

    $rootScope.$watch("locationSelectedFromMap",function(n) {
        if (n) {
            $scope.curBuilding = n;
            $scope.curRoom = null;
            showPanes(false,true,false,true);
        }
    })

}]);