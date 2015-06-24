mapApp.directive("kmCatalog", function () {
    return {
        restrict: "E",
        //templateUrl: "templates/catalog.html",
        template:'<div data-angular-treeview="true" data-tree-id="roomsTree" data-tree-model="buildingsData" ></div>',
        link: function (scope, element, attrs) {
            scope.$watch("rooms+buildings+floors", function () {
                if(scope.buildings && scope.rooms && scope.floors)
                {
                    scope.buildings.forEach(function(val){
                        if(val.nodeType === "building"){
                            val.children = _.filter(scope.floors,function(f) {
                                return f.buildingId === val.id;
                            });
                            val.children.forEach(function(v){
                                v.children = _.filter(scope.rooms,function(r){
                                    return r.buildingId === v.buildingId && r.floor === v.number;
                                })
                            });
                        } else {
                            val.children = _.filter(scope.rooms, function(r) {
                                return r.buildingId === val.id;
                            });
                        }
                    });
                }
                scope.buildingsData = scope.buildings;

                //scope.roomsData = _.groupBy(scope.rooms, function (item) {
                //    return item.building;
                //});
            });
            /*scope.showOnMap = function (r) {
                console.log(r);
            }*/
        }
    }
})
//.directive("kmBuildings",function(){
//        return {
//            restrict: "E",
//            transclude: true,
//            scope:{},
//            controller: function($scope) {
//                var buildings = $scope.buildings = [];
//
//                $scope.toggle = function(building) {
//                    building.shown = !building.shown;
//                }
//
//                this.addBuilding = function(building){
//                    buildings.push(building);
//                }
//            },
//            template:   '<div class="tabbable">' +
//                            '<div ng-repeat="building in buildings">' +
//                                '<i ng-class="{\'ico-plus\': !building.shown, \'ico-minus\': building.shown}" ng-click="toggle(building)"></i>' +
//                                '{{building.title}}' +
//                            '</div>' +
//                            '<div class="tab-content" ng-transclude></div>' +
//                        '</div>'
//        }
//    })
//.directive("kmRoomsContainer",function($rootScope){
//        return {
//            require: '^kmBuildings',
//            restrict: 'E',
//            transclude: true,
//            scope: {
//                title: "@buildingName",
//                showOnMap: "&onClick"
//            },
//            link: function(scope, element, attrs, tabsCtrl) {
//                scope.shown = false;
//                tabsCtrl.addBuilding(scope);
//            },
//            template: '<div class="rooms-container" ng-show="shown" ng-transclude></div>'
//        }
//    })