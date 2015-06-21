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
            'whiteRoof': [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(255, 255, 255)'
                })
            })],
            "caravan": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(228, 207, 188)'
                })
            })],
            "afafaf": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(175, 175, 175)'
                })
            })],
            "7b7b7b": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(123, 123, 123)'
                })
            })],
            "redRoof": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(228, 112, 112)'
                })
            })],
            "libStairs": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(250, 161, 67)'
                })
            })],
            "greenStairs": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(67, 172, 67)'
                })
            })],
            "c8c8c8": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#c8c8c8'
                })
            })],
            "greenGrass": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(207,236,168)'
                })
            })],
            "fence": [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'black',
                    lineDash: [10, 2],
                    width: 1
                })
            })],
            "water": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(118,208,232)'
                })
            })],
            "gate": [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgb(251,226,107)'
                })
            })]
        };

        var styleFunction = function (feature, resolution) {
            if (resolution > 20 && feature.get("styleType") === "fence")
                return null;
            return styles[feature.get("styleType")];
        };

        var vectorSource = new ol.source.GeoJSON(buildings/*geoJsonData*/);

        var vectorSourceMehina = new ol.source.GeoJSON(mehina/*geoJsonData*/);

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: styleFunction
        });

        var vectorLayerMehina = new ol.layer.Vector({
            source: vectorSourceMehina,
            style: styleFunction
        });

        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(10),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            //className: 'custom-mouse-position',
            //target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
        });

        $scope.map = new ol.Map({
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }).extend([mousePositionControl]),
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                vectorLayer,
                vectorLayerMehina
            ],
            renderer: 'dom',
            view: new ol.View({
                center: ol.proj.transform([35.5919148, 32.7053342], 'EPSG:4326', 'EPSG:3857'),
                zoom: 19
            })
        });

        var lastFeatureSelected = null;

        $scope.map.on("click", function (e) {
            $scope.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                if (feature.getId().indexOf("path") < 0) {
                    var curStyle = layer.getStyle()(feature)[0];
                    feature.setStyle([new ol.style.Style({
                        fill:curStyle.getFill(),
                        stroke: new ol.style.Stroke({
                            color: 'rgb(109,44,146)',
                            width: 1
                        })
                    }), new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(109,44,146,0.2)'
                        })
                    })]);

                    if (lastFeatureSelected && lastFeatureSelected != feature) {
                        lastFeatureSelected.setStyle(null);
                    }
                    lastFeatureSelected = feature;
                }
            })
        });

        $scope.map.on("pointermove", function (e) {
            //detect feature at mouse coords
            var hit;
            $scope.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                if (feature.getId().indexOf("path") < 0) {
                    hit = true;
                }
            });

            if (hit) {
                angular.element(document.body).css("cursor", "pointer");
            } else {
                angular.element(document.body).css("cursor", "");
            }
        })
    }


}]);