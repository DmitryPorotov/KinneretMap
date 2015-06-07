/**
 * Created by dmitry on 02/06/15.
 */
mapApp.controller("mapController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $scope.map = null;

    init();

    $rootScope.$watch("currentBuildingId",function(newVal){
        if(newVal) {

            $scope.map.beforeRender(ol.animation.pan({
                duration:500,
                source: ($scope.map.values_.view.getCenter())
            }));
            $scope.map.setView(new ol.View({
                center: ol.proj.transform([newVal.lon, newVal.lat], 'EPSG:4326', 'EPSG:3857'),
                zoom: 19
            }));
        }
        $rootScope.currentBuildingId = null;
    });

    function init() {
        var styles = {
            'Polygon': [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                })
            })]
        };

        var styleFunction = function (feature, resolution) {
            return styles[feature.getGeometry().getType()];
        };

        var vectorSource = new ol.source.GeoJSON(geoJsonData);

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: styleFunction
        });

        $scope.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                vectorLayer
            ],
            renderer: 'dom',
            view: new ol.View({
                center: ol.proj.transform([35.5919148, 32.7053342], 'EPSG:4326', 'EPSG:3857'),
                zoom: 19
            })
        });

        $scope.map.on("click", function (e) {
            $scope.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                debugger;
            })
        });
    }


}]);