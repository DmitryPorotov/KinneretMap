var geoJsonData = {
    projection: 'EPSG:3857',
    object: {
        'type': 'FeatureCollection',
        'crs': {
            'type': 'name',
            'properties': {
                'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
            }
        },
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                            [[35.59311, 32.70582], [35.59311, 32.70542], [35.59283, 32.70542], [35.59283, 32.70582]]
                    ]
                },
                id: "achi"
            }
        ]
    }
}