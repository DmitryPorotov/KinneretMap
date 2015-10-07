mapApp.directive("kmClassroomUsage",["menuLogicService", function(menuLogicService) {
    return {
        restrict: "E",
        templateUrl:'templates/classroom-usage.html',
        link: function ($scope, element, attrs) {
            $scope.isUsageShown = false;
            $scope.classesTakingPlace = [];
            $scope.$on('showUsage',function(event, room){
                $scope.isUsageShown = true;
                $scope.isUsageSpinnerShown = true;
                menuLogicService.getRoomUsage(new Date().toISOString().split('T')[0], room.externalId).then(function(classes){
                    $scope.classesTakingPlace = classes;
                    $scope.isUsageSpinnerShown = false;
                })
            });

            $scope.closeUsage = function(event){
                if(event) {
                    var el = angular.element(event.target);
                    if (el.hasClass("modal-screen") || el.hasClass("close-button")) {
                        $scope.classesTakingPlace = [];
                        $scope.isUsageShown = false;
                    }
                }
            }
        }
    }
}]);