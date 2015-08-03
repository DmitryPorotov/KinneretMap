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
                    var sizeNum = 0;
                    if (img[0].src.indexOf("big") > -1){
                        sizeNum = 1;
                        if(window.innerHeight > 800 && window.innerWidth > 1200){
                            sizeNum = 2;
                        }
                    }
                    var mW = maxSize[sizeNum][0],mH = maxSize[sizeNum][1];

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
                    img.css({"width": w + "px","height": h + "px"});
                }
        }
    }
}]);