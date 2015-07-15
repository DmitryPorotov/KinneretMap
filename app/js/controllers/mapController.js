/**
 * Created by dmitry on 02/06/15.
 */
mapApp.controller("mapController", ["$scope", "$rootScope","$routeParams", function ($scope, $rootScope,$routeParams) {
    var map = null,
        textFunctions = {
            getText: function (feature, resolution) {
                if (resolution > 1.1) {
                    return "";
                }

                var text = "";
                var labelName = "hebName";
                switch ($routeParams.lang) {
                    case "en":
                    {
                        labelName = "engName";
                        break;
                    }
                    case "he":
                    {
                        labelName = "hebName";
                        break;
                    }
                }

                text = feature.get("linkedLocation")[labelName];

                if(text.length > 20) {
                    text.replace(' ', '\n');
                }

                return text;
            },
            createTextStyle: function (feature, resolution) {
                return new ol.style.Text({
                    font: "bold 10px Verdana",
                    text: this.getText(feature, resolution),
                    fill: new ol.style.Fill({color: "black"}),
                    stroke: new ol.style.Stroke({color: "white", width: 3})
                })
            },
            updatableFeatures: [],
            updateFeatures:function(resolution){
                this.updatableFeatures.forEach(function(feature){
                    feature.getStyle()[1] = new ol.style.Style({
                        text: this.createTextStyle(feature, resolution)
                    });
                    feature.changed();
                },this)
            }
        };

    $rootScope.$watch("buildings",function(){
        if($rootScope.buildings){
            if(!map){
                init();
            }
            else {
                textFunctions.updateFeatures(map.getView().getResolution());
            }
        }
    });


    $rootScope.$watch("locationSelectedFromMenu",function(loc){
        if(loc) {
            var layers = _.filter(map.getLayers().getArray(), function (l) {
                return l instanceof ol.layer.Vector
            });

            var layer, feature;
            for (var i = 0; i < layers.length; i++) {
                feature = _.find(layers[i].getSource().getFeatures(), function (f) {
                    return f.getId() === loc.id;
                });
                if (feature) {
                    layer = layers[i];
                    break;
                }
            }
            selectFeature(feature, layer);

            setTimeout(function () {
                map.beforeRender(ol.animation.pan({
                    duration: 500,
                    source: (map.get("view").getCenter())
                }));
                map.setView(new ol.View({
                    center: ol.proj.transform([loc.lon, loc.lat], 'EPSG:4326', 'EPSG:3857'),
                    zoom: map.getView().getZoom() < 18 ? 19 :map.getView().getZoom()
                }));
            }, 1);
        }
        $rootScope.locationSelectedFromMenu = null;
    });

    var lastFeatureSelected = null;

    var selectionStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(109,44,146,0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgb(109,44,146)',
            width: 1
        })
    });

    function selectFeature(feature, layer) {
        if (feature.getStyle()) {
            if(feature.getStyle().indexOf(selectionStyle) > -1) {
                return;
            }

            feature.getStyle().push(selectionStyle);
            feature.changed();
        } else {
            feature.setStyle([
                layer.getStyle()(feature)[0],//style inherited from the layer
                selectionStyle
            ]);
        }

        if (lastFeatureSelected) {
            if (lastFeatureSelected.getStyle().length == 2) {
                lastFeatureSelected.setStyle(null);
            }
            else {
                lastFeatureSelected.getStyle().pop();
            }
        }
        lastFeatureSelected = feature;
    }



    function init() {
        var styles = {
            'whiteRoof': {
                fill: new ol.style.Fill({
                    color: 'rgb(255, 255, 255)'
                })
            },
            "caravan": {
                fill: new ol.style.Fill({
                    color: 'rgb(228, 207, 188)'
                })
            },
            "afafaf": {
                fill: new ol.style.Fill({
                    color: 'rgb(175, 175, 175)'
                })
            },
            "7b7b7b": {
                fill: new ol.style.Fill({
                    color: 'rgb(123, 123, 123)'
                })
            },
            "redRoof": {
                fill: new ol.style.Fill({
                    color: 'rgb(228, 112, 112)'
                })
            },
            "libStairs": {
                fill: new ol.style.Fill({
                    color: 'rgb(250, 161, 67)'
                })
            },
            "greenStairs": {
                fill: new ol.style.Fill({
                    color: 'rgb(67, 172, 67)'
                })
            },
            "c8c8c8": {
                fill: new ol.style.Fill({
                    color: '#c8c8c8'
                })
            },
            "greenGrass": {
                fill: new ol.style.Fill({
                    color: 'rgb(207,236,168)'
                })
            },
            "fence": {
                stroke: new ol.style.Stroke({
                    color: 'black',
                    lineDash: [10, 2],
                    width: 1
                })
            },
            "water": {
                fill: new ol.style.Fill({
                    color: 'rgb(118,208,232)'
                })
            },
            "gate": {
                fill: new ol.style.Fill({
                    color: 'rgb(251,226,107)'
                })
            },
            "groupBuildings": {
                fill: new ol.style.Fill({
                    color: 'rgba(0,0,0,0)'
                })
            }
        };

        var createStyleFunction = function() {
            return function (feature, resolution) {
                if (resolution > 20 && feature.get("styleType") === "fence")
                    return null;

                return [new ol.style.Style(styles[feature.get("styleType")])];
            }
        }

        var vectorSourceMain = new ol.source.GeoJSON(buildings/*geoJsonData*/);

        var vectorSourceMehina = new ol.source.GeoJSON(mehina/*geoJsonData*/);

        var vectorSourceDorms = new ol.source.GeoJSON(dorms/*geoJsonData*/);

        var vectorLayerMain = new ol.layer.Vector({
            source: vectorSourceMain,
            style: createStyleFunction()
        });

        var vectorLayerMehina = new ol.layer.Vector({
            source: vectorSourceMehina,
            style: createStyleFunction()
        });

        var vectorLayerDorms = new ol.layer.Vector({
            source: vectorSourceDorms,
            style: createStyleFunction()
        });

        linkLocations(vectorSourceMain,vectorLayerMain);
        linkLocations(vectorSourceMehina,vectorLayerMehina);
        linkLocations(vectorSourceDorms,vectorLayerDorms);

        function linkLocations(vectSource, vectorLayer) {
            $rootScope.buildings.forEach(function (b) {
                if (b.id.indexOf("group")) {
                    linkLoc(b);
                }
            });
            function linkLoc(loc){
                var f = vectSource.getFeatureById(loc.id);
                if (f) {
                    textFunctions.updatableFeatures.push(f);
                    f.set("linkedLocation", loc);
                    f.setStyle([
                        vectorLayer.getStyle()(f)[0],
                        new ol.style.Style({
                            text: textFunctions.createTextStyle(f)
                        })
                    ]);
                }
            }
        }


        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(5),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            //className: 'custom-mouse-position',
            //target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
        });

        map = new ol.Map({
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
                vectorLayerMain,
                vectorLayerMehina,
                vectorLayerDorms
            ],
            renderer: 'dom',
            view: new ol.View({
                center: ol.proj.transform([35.5919148, 32.7053342], 'EPSG:4326', 'EPSG:3857'),
                zoom: 19
            })
        });

        map.on("click", function (e) {
            map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                if (feature.getId().indexOf("path") && feature.getId().indexOf("group")) {
                    selectFeature(feature,layer);
                    $rootScope.locationSelectedFromMap = feature.get("linkedLocation");
                }
            })
        });

        map.on("pointermove", function (e) {
            //detect feature at mouse coords
            var hit;
            map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                if (feature.getId().indexOf("path") && feature.getId().indexOf("group")) {
                    hit = true;
                }
            });

            if (hit) {
                angular.element(window.map).css("cursor", "pointer");
            } else {
                angular.element(window.map).css("cursor", "");
            }
        });

        map.getView().on('change:resolution',function(e){
            textFunctions.updateFeatures(map.getView().getResolution());
        })
    }


}]);