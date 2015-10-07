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
                    if($scope.location.parent){
                        $scope.url = baseUrl + "location/" + encodeURIComponent($scope.location.parent[prefix + "Name"] || $scope.location.parent["hebName"]) + "-" + $scope.location.onMapNumber;
                    }
                    else {
                        $scope.url = baseUrl + "location/" + encodeURIComponent($scope.location[prefix + "Name"] || $scope.location["hebName"]);
                    }
                }
            });

            $scope.toggleLink = function(){
                setTimeout(function(){selectText(element[0]);},50);
                $scope.isLinkShown = true;
            };
            $scope.isLinkShown = false;
            $scope.$on("closeLink",function(event,target){
                if( angular.element(target).parent().parent()[0] !== element[0]){
                    $scope.isLinkShown = false;
                }
            });

            function selectText(element) {
                var doc = document
                    ,text = element.querySelector(".link-url")
                    ,range, selection
                    ;
                if (doc.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(text);
                    range.select();
                } else if (window.getSelection) {
                    selection = window.getSelection();
                    range = document.createRange();
                    range.selectNodeContents(text);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    }
}]);