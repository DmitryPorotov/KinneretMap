mapApp.controller("menuController", ["$scope", "dataService", function ($scope, dataService) {
    $scope.searchField = null;
    $scope.searchResults = [];
    $scope.rooms = null;
    $scope.isSearchShown = false;
    $scope.isBuildingsCatalogShown = false;
    $scope.isStaffCatalogShown = false;
    $scope.isRoomDetailsShown = false;
    $scope.isFloorPlanShown = false;

    dataService.getRooms().success(function (data) {
        $scope.rooms = data;
    });

    $scope.search = function () {
        $scope.isBuildingsCatalogShown = false;
        $scope.isStaffCatalogShown = false;
        $scope.isSearchShown = true;
        filterResults($scope.rooms);
    }

    $scope.setResultsClass = function () {
        if (this.isSearchShown) {
            return "from-search";
        }
        else if (this.isBuildingsCatalogShown) {
            return "from-building-catalog";
        }
        else if (this.isStaffCatalogShown) {
            return "from-staff-catalog";
        }
    }

    $scope.showBuildingsCatalog = function () {
        $scope.isBuildingsCatalogShown = true;
        $scope.isStaffCatalogShown = false;
        $scope.isSearchShown = false;
    }

    function filterResults(rooms) {
        $scope.searchResults = [];
        $scope.rooms.forEach(function (v, i) {
            if (v.id == this.searchField) {
                this.searchResults.push(v);
            }
        }, $scope);
    }

}]);