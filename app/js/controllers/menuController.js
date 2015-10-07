mapApp.controller("menuController", ["$scope","$rootScope","$routeParams","langConst","menuLogicService","menuCache","tmhDynamicLocale", function ($scope, $rootScope, $routeParams, langConst, menuLogicService, menuCache, tmhDynamicLocale) {
    console.log("menuController " + $scope.$id);
    $scope.langPrefix = $routeParams.lang === "he" ? "heb" : "eng";
    $scope.langConst = langConst;

    $rootScope.isRTL = $routeParams.lang === "he";
    $rootScope.buildings = $rootScope.buildings || null;
    $rootScope.locationSelectedFromMap = null;

    $scope.searchField = null;
    $scope.searchResultsRooms = $scope.searchResultsBuildings = $scope.searchResultsStaff = [];

    $scope.buildingsObj = menuCache.buildingsObj || null;

    $scope.staffObj = menuCache.staffObj || null;

    $scope.isSearchShown = false;
    $scope.isBuildingsCatalogShown = false;
    $scope.isRoomDetailsShown = false;
    $scope.isBuildingDetailsShown = false;
    $scope.isFloorPlanShown = false;
    $scope.isAdvSearchShown = false;

    $scope.isDocked = true;
    $scope.isSpinnerShown = true;

    $scope.curBuilding = null;
    $scope.curFloor = null;
    $scope.curRoom = null;
    $scope.curCubicle = null;

    if(!menuCache.isInit) {
        menuLogicService.getBuildingsObject().then(function (data) {
            $scope.buildingsObj = menuCache.buildingsObj = data;
            var bd = menuLogicService.getBuildingsData();
            $rootScope.buildings = bd.buildings;
            if($routeParams.sTerm && $routeParams.sType){
                handleUrlParams($routeParams.sType, $routeParams.sTerm);
            }
            menuCache.isInit = true;
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
    }


    $scope.showAdvSearch = function(){
        showPanes(false,false,false,false,false,true);
        $scope.renderAdvSearchPaneArray = [1];
    };

    $scope.closeMenu = function() {
        showPanes();
    };

    $scope.search = function () {
        if ($scope.searchField) {
            showPanes(true);
            $scope.isSpinnerShown = true;
            filterResults($scope.searchField);
        }
    };

    $scope.handleSearchFieldKeyPress = function(e){
        if(e.keyCode === 13 || e.key === "Enter"){
           $scope.search();
        }
    };
    $scope.showBuildingsCatalog = function () {
        showPanes(false,true);
    };

    function showPanes(isSearchShown,isBuildingsCatalogShown,isRoomDetailsShown,isFloorPlanShown,isBuildingDetailsShown,isAdvSearchShown){
        $scope.isSearchShown = !!isSearchShown;
        $scope.isBuildingsCatalogShown = !!isBuildingsCatalogShown;
        $scope.isRoomDetailsShown = !!isRoomDetailsShown;
        $scope.isFloorPlanShown = !!isFloorPlanShown;
        $scope.isBuildingDetailsShown = !!isBuildingDetailsShown;
        $scope.isAdvSearchShown = !!isAdvSearchShown;
    }

    function filterResults(term) {
        $scope.searchResultsBuildings = menuLogicService.findBuildings(term);
        $scope.searchResultsRooms = menuLogicService.findRooms(term);

        menuLogicService.findPersons(term).then(function(d){
            $scope.searchResultsStaff = d.data;
            $scope.isSpinnerShown = false;
            if($scope.searchResultsStaff.length + $scope.searchResultsBuildings.length + $scope.searchResultsRooms.length == 1){
                handleSingleSearchResult();
            }
        });
    }

    function handleSingleSearchResult(){
        if($scope.searchResultsBuildings.length){
            $scope.selectBuildingFromSearch($scope.searchResultsBuildings[0]);
        }
        else if($scope.searchResultsRooms.length){
            $scope.selectRoomFromSearch($scope.searchResultsRooms[0]);
        }
        else if($scope.searchResultsStaff.length){
            $scope.goToRoom($scope.searchResultsStaff[0].receptionPlace);
        }
    }

    $scope.handleSelectionChange = function(locationSelectedFromMenu, curBuilding, curFloor, curRoom, curCubicle,isSearchShown,isBuildingsCatalogShown,isRoomDetailsShown,isFloorPlanShown,isBuildingDetailsShown){
        $rootScope.locationSelectedFromMenu = locationSelectedFromMenu;
        $scope.curBuilding = curBuilding;
        $scope.curFloor = curFloor;
        $scope.curRoom = curRoom;
        $scope.curCubicle = curCubicle;
        showPanes(isSearchShown,isBuildingsCatalogShown,isRoomDetailsShown,isFloorPlanShown,isBuildingDetailsShown);
    };

    $scope.$watch("roomsTree.currentNode", function (n, o) {
        if (n) {
            switch ($scope.roomsTree.currentNode.nodeType) {
                case  "building":
                case  "groupBuildings":{
                    $scope.handleSelectionChange(n,n,null,null,null,false,true,true);
                    break;
                }
                case "groupOther":{
                    $scope.handleSelectionChange(null,null,null,null,null,false,true);
                    break;
                }
                case  "room":{
                    $scope.handleSelectionChange(n.floor.building,null, n.floor,n,null,false,true,true,true);
                    break;
                }
                case  "floor":{
                    $scope.handleSelectionChange(n.building,null,n,null,null,false,true,false,true);
                    break;
                }
                case "noFloors": {
                    $scope.handleSelectionChange(n,null,null,n,null,false,true,true);
                    break;
                }
                case  "oneFloor":{
                    $scope.handleSelectionChange(n,null,n,null,null,false,true,false,true);
                    break;
                }
            }
            $scope.roomsTree.currentNode = null;
        }
    });

    $rootScope.$watch("locationSelectedFromMap",function(n) {
        if (n) {
            var floor = n.floor || _.find(n.children,function(f){ return !f.number;}) || null;
            if(n.nodeType === 'noFloors') {
                floor = null;
            }
            var room =  null;
            if(n.nodeType === 'noFloors' && n.floor)
            {
                room = n.floor.room;
            }
            $scope.handleSelectionChange(null,n,floor,room,null,false,false,false,floor,true);
        }
    });

    function handleUrlParams(sType, sTerm){
        switch (sType){
            case "location":{
                var result = menuLogicService.findLocation(sTerm);
                if(result.cubicle){
                    if(result.room){
                        $scope.handleSelectionChange(result.room.floor.building,result.room.floor.building,result.room.floor,null,result.cubicle,false,false,true,true,true);
                    }
                    else if(result.building) {
                        $scope.handleSelectionChange(result.building,result.building,result.building.floor,null,result.cubicle,false,false,true,true,true);
                    }
                }
                else if(result.room){
                    $scope.handleSelectionChange(result.room.floor.building,result.room.floor.building, result.room.floor,result.room,null,false,false,true,true,true);
                }
                else if(result.building) {
                    var room = result.building.nodeType === 'noFloors' ? result.building : null;
                    $scope.handleSelectionChange(result.building,result.building,null,room,null,false,false,false,false,true);
                }
                else {
                    $scope.searchResultsBuildings = result.buildings;
                    $scope.searchResultsRooms = result.rooms;
                    showPanes(true);
                }
                break;
            }
        }
    }

    if(menuCache.isInit && $routeParams.sTerm && $routeParams.sType){
        handleUrlParams($routeParams.sType,$routeParams.sTerm);
    }

    tmhDynamicLocale.set($routeParams.lang);
}]);