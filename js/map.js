function initializeMap() {
    var map = L.map("map").setView([26.8401, 88.6169], 13);

    // OSM layer
    var osmLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
    );
    osmLayer.addTo(map);

    // OptenTopo layer
    var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var NASAGIBS_ModisTerraTrueColorCR = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
        attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
        bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
        minZoom: 1,
        maxZoom: 9,
        format: 'jpg',
        time: '',
        tilematrixset: 'GoogleMapsCompatible_Level'
    });

    // Variable to hold the GeoTIFF and GeoJSON layers
    var geotiffLayer, geojsonLayer;

    // Load GeoTIFF layer
    fetch("")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
            parseGeoraster(arrayBuffer).then((georaster) => {
                geotiffLayer = new GeoRasterLayer({
                    georaster: georaster,
                    opacity: 0.7,
                    pixelValuesToColorFn: function (value) {
                        if (value < 50) {
                            return "yellow";
                        } else if (value > 50 && value < 130) {
                            return "green";
                        } else if (value < 130 && value > 180) {
                            return "#93E9BE";
                        } else if (value == 190) {
                            return "red";
                        } else if (value == 200) {
                            return "#966400";
                        } else if (value == 210) {
                            return "blue";
                        } else if (value == 220) {
                            return "#ffffff";
                        } else {
                            return "transparent";
                        }
                    },
                    resolution: 128,
                });
                geotiffLayer.addTo(map);

                const layerBounds = geotiffLayer.getBounds();
                map.fitBounds(layerBounds);
            });
        })
        .catch((error) => {
            console.error("Error loading GeoTIFF:", error);
        });

    // Load GeoJSON layer but don't add to map immediately
    fetch("../data/foothills.geojson")
        .then((response) => response.json())
        .then((geojsonData) => {
            geojsonLayer = L.geoJSON(geojsonData, {
                style: function (feature) {
                    return {
                        color: "blue", // Static color for GeoJSON layer
                        weight: 2,
                        fillOpacity: 0.2,
                    };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(feature.properties.name);
                    }
                },
            });

            // Initially add the GeoJSON layer to the map
            geojsonLayer.addTo(map);
        })
        .catch((error) => {
            console.error("Error loading GeoJSON:", error);
        });

    // Function to toggle layers visibility
    document.getElementById("toggleGeoJSON").addEventListener("change", function (e) {
        if (e.target.checked) {
            if (geotiffLayer) geotiffLayer.addTo(map);
            if (geojsonLayer) geojsonLayer.addTo(map);
        } else {
            if (geotiffLayer) map.removeLayer(geotiffLayer);
            if (geojsonLayer) map.removeLayer(geojsonLayer);
        }
    });

    document.getElementById("toggleOSM").addEventListener("change", function (e) {
        if (e.target.checked) {
            osmLayer.addTo(map);
        } else {
            map.removeLayer(osmLayer);
        }
    });

    document.getElementById("toggleOptenTopo").addEventListener("change", function (e) {
        if (e.target.checked) {
            OpenTopoMap.addTo(map);
        } else {
            map.removeLayer(OpenTopoMap);
        }
    });

    document.getElementById("toggleEsri_WorldImagery").addEventListener("change", function (e) {
        if (e.target.checked) {
            Esri_WorldImagery.addTo(map);
        } else {
            map.removeLayer(Esri_WorldImagery);
        }
    });

    document.getElementById("toggleNASAGIBS_ModisTerraTrueColorCR").addEventListener("change", function (e) {
        if (e.target.checked) {
            NASAGIBS_ModisTerraTrueColorCR.addTo(map);
        } else {
            map.removeLayer(NASAGIBS_ModisTerraTrueColorCR);
        }
    });
}
