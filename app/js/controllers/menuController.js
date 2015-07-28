mapApp.controller("menuController", ["$scope", "$rootScope", "$routeParams", "langConst", "menuLogicService", "menuCache", function ($scope, $rootScope, $routeParams, langConst, menuLogicService, menuCache) {
    $scope.langPrefix = $routeParams.lang === "he" ? "heb" : "eng";
    $scope.langConst = langConst;

    $rootScope.isRTL = $routeParams.lang === "he";
    $rootScope.buildings = $rootScope.buildings || null;

    $scope.searchField = null;
    $scope.searchResults = [];

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
        });

        menuLogicService.getStaffObject().then(function (data) {
            $scope.staffObj = menuCache.staffObj = data;
        }, function (error) {
            //TODO handle error
        });
        menuCache.isInit = true;
    }

    $scope.closeMenu = function() {
        showPanes(false,false,false,false,false);
    };

    $scope.search = function () {
        showPanes(true);
        filterResults($scope.rooms);
    };

    $scope.showBuildingsCatalog = function () {
        showPanes(false,true);
    };

    $scope.showStaffCatalog = function(){
        showPanes(false,false,true);
    };

    function showPanes(isSearchShown,isBuildingsCatalogShown,isStaffCatalogShown,isRoomDetailsShown,isFloorPlanShown){
        $scope.isSearchShown = !!isSearchShown;
        $scope.isBuildingsCatalogShown = !!isBuildingsCatalogShown;
        $scope.isStaffCatalogShown = !!isStaffCatalogShown;
        $scope.isRoomDetailsShown = !!isRoomDetailsShown;
        $scope.isFloorPlanShown = !!isFloorPlanShown;
    }

    function filterResults(rooms) {
        $scope.searchResults = [];
        $scope.rooms.forEach(function (v, i) {
            if (v.id.toString().indexOf(this.searchField) > -1 ) {
                this.searchResults.push(v);
            }
        }, $scope);
    }

    $scope.$watch("staffTree.currentNode", function (n, o) {

    });

    $scope.$watch("roomsTree.currentNode", function (n, o) {
        var handleCurrentNodeChange = function (curFloor,curRoom,isRoomDetailsShown,isFloorPlanShown,locationSelectedFromMenu) {
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
        if (n) {
            switch ($scope.roomsTree.currentNode.nodeType) {
                case  "building":
                case  "groupBuildings":{
                    handleCurrentNodeChange(null,null,false,false,n);
                    break;
                }
                case "groupOther":{
                    handleCurrentNodeChange(null,null,false,false,null);
                    break;
                }
                case  "room":{
                    handleCurrentNodeChange(n.floor,n,true,true,n.floor.building);
                    break;
                }
                case  "floor":{
                    handleCurrentNodeChange(n,null,false,true,n.building);
                    break;
                }
                case "noFloors": {
                    handleCurrentNodeChange(null,n,true,false,n);
                    break;
                }
                case  "oneFloor":{
                    handleCurrentNodeChange(n.floor,null,false,true,n);
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
            showPanes(false,true,false,true)
        }
    })

}]);