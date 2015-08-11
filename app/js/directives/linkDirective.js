/**
 * Created by Dmitry on 11/08/2015.
 */
mapApp.directive("kmLink",["$location",function($location) {
    return {
        restrict: "E",
        scope: {location:"="},
        templateUrl:"templates/link.html",
        link: function($scope, element, attrs){
            var absUrl = $location.absUrl(),
                index = absUrl.indexOf("he/"),
                baseUrl,prefix = "heb";
            if(index < 0){
                index = absUrl.indexOf("en/");
                prefix = "eng";
            }
            baseUrl = absUrl.substr(0,index + 3);
            $scope.$watch("location", function(){
                if($scope.location){
                    $scope.url = baseUrl + "location/" + encodeURIComponent($scope.location[prefix + "Name"] || $scope.location["hebName"]);
                }
            });

            $scope.toggleLink = function(){
                $scope.isLinkShown = !$scope.isLinkShown;
            };
            $scope.isLinkShown = false;
        }
    }
}]);