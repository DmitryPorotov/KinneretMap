/**
 * Created by dmitry on 01/07/15.
 */
mapApp.directive("kmResizing",[function() {
    return {
        restrict: "A",
        link:function( scope, element, attrs ) {
            var img = angular.element(element[0].querySelector("img")),
            maxSize = JSON.parse(attrs.kmResizing);
            img.on("load", function() {
                var e = element,
                    w = this.naturalWidth,h = this.naturalHeight;
                scope.resizeTo(e,img,w,h);

            });

            scope.resizeTo = scope.resizeTo || function(e,img,w,h) {
                    var mW = maxSize[0],mH = maxSize[1];
                    if(img[0].src.indexOf("big") > -1) {
                        mW = maxSize[2];
                        mH = maxSize[3];
                    }

                    if (w > mW) {
                        var ratio = mW / w;
                        h *= ratio;
                        w *= ratio;
                    }
                    if(h > mW){
                        var ratio = mW / h;
                        h *= ratio;
                        w *= ratio;
                    }

                    e.css({"width": w + "px","height": h + "px"});
                }
        }
    }
}]);