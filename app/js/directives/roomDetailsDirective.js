/**
 * Created by Dmitry on 09/08/2015.
 */
mapApp.directive("kmRoomDetails",[function() {
    return {
        restrict: "E",
        templateUrl:"templates/room-details.html",
        link: function ($scope, element, attrs) {
            $scope.showUsage = function(room){
                $scope.$emit('showUsage',room);
            }
        }
    }
}]);