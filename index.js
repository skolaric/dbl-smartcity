(function () {
    "use strict";
   
    var imageryProvider_MapBoxStreets = new Cesium.MapboxImageryProvider({
        url : 'https://api.mapbox.com/v4/',
        mapId: 'mapbox.streets'
        });
        
    var imageryProvider_OpenStreetMap = Cesium.createOpenStreetMapImageryProvider();
        
    var imageryProvider_ArcGisMapServer = new Cesium.ArcGisMapServerImageryProvider({
            url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        });
        
    var imageryProvider_NaturalEarthII = Cesium.createTileMapServiceImageryProvider({
      url : 'libs/Cesium/Cesium-1.41/Build/Cesium/Assets/Textures/NaturalEarthII', 
    });
        
    var viewer = new Cesium.Viewer('cesiumContainer', {
        homeButton : false,
        selectionIndicator: true, // default = true
        navigationHelpButton: false, 
        sceneModePicker : false,
        timeline: false, // default = true
        animation : false, // default = true ; removes the "clock" in the bottom left corner
        baseLayerPicker : false,
        imageryProvider : imageryProvider_MapBoxStreets, //  imageryProvider_NaturalEarthII
      }
    );
        
    viewer.scene.frameState.creditDisplay.destroy();
		
    var initialPosition = Cesium.Cartesian3.fromDegrees(-84.3983539610, 33.7634571614, 1173.808); // GT, at 45 deg
    var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(0.0, -45.0, 0.0);    
		   
    viewer.scene.camera.setView({
        destination: initialPosition,
        orientation: initialOrientation,
        endTransform: Cesium.Matrix4.IDENTITY
    });
    
    // just like previous one, only zoomed out a little
    

    // var center = new Cesium.Cartesian3.fromDegrees(-84.391636, 33.7536975);
    // var posMat = Cesium.Transforms.eastNorthUpToFixedFrame(center);  
    // //console.log('posMat: ', posMat.toString());

    var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
		url: "http://localhost:80/data/tilesets3d/Atlanta-wide/tileset.json", 
		//url: "http://localhost:80/data/tilesets3d/test/tileset.json", 
        //url: 'data/tilesets3d/Atlanta-wide/', // last good one
        //url: 'data/tileset3d-2018-02-13a-small-1x2/',         
        //url: 'data/tileset3d-2018-02-13b-supersmall/', 
        //url: 'data/tileset3d-2018-02-13a-small-1x2/Batchedtile-buildings(-84.390000,33.760000,-84.380000,33.770000).osm.obj.postprocessed/',
        // //debugWireframe: true, 
        // debugColorizeTiles: true, 
        // debugShowBoundingVolume: true, 
        // debugShowContentBoundingVolume: true,
        // debugShowViewerRequestVolume: true,
        // debugShowGeometricError: true, 
        // debugShowRenderingStatistics: true, 
        // debugShowMemoryUsage: true, 
        //debugShowUrl: true,
    }));
    
    tileset.name = 'Buildings';

    var style = new Cesium.Cesium3DTileStyle();
    style.show = true;
    // style.color = 'color("white")'; 
    // style.color = "rgba(1.0, 0.8, 0.8, 1.0)"; 
    //style.color = "rgba(${red}, ${green}, ${blue}, (${volume} > 100 ? 0.5 : 1.0))"; 
    style.color = 'color("blue")';  
    style.pointSize = 20.0;
    
    tileset.style = style;
    
   
    
    
    var tileset_energy = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
		url: "http://localhost:80/data/tilesets3d/Caddell/tileset.json", 
        //url: 'http://localhost:8080/Apps/dbl-client/$HEAD/data/tiles3d-Caddell/',
        //url: 'data/tilesets3d/Caddell/',
        // //debugWireframe: true, 
        // debugColorizeTiles: true, 
        // debugShowBoundingVolume: true, 
        // debugShowContentBoundingVolume: true,
        // debugShowViewerRequestVolume: true,
        // debugShowGeometricError: true, 
        // debugShowRenderingStatistics: true, 
        // debugShowMemoryUsage: true, 
        // debugShowUrl: true,
    }));
    tileset_energy.show = false;
    
    var style_energy = new Cesium.Cesium3DTileStyle();
    style_energy.show = true;
    // style.color = 'color("white")'; 
    // style.color = "rgba(1.0, 0.8, 0.8, 1.0)"; 
    //style.color = "rgba(${red}, ${green}, ${blue}, (${volume} > 100 ? 0.5 : 1.0))"; 
    //style_energy.color = 'color("blue")';  
    style_energy.pointSize = 20.0;
    
    tileset_energy.style = style_energy;
    
    
    
    enable3dTilesetCheckbox.addEventListener(
        'change', 
        function() {
            tileset.show = enable3dTilesetCheckbox.checked;
            // //console.log('enable3dTilesetCheckbox change triggered');
            if(enable3dTilesetCheckbox.checked) {
                //console.log('Checkbox is checked.');
            } else {
                //console.log('Checkbox is not checked.');
            }            
        }, 
        false
    );
    
    // Color buildings by distance from a landmark.
    function colorByDistance() {
        tileset.style = new Cesium.Cesium3DTileStyle({
            defines : {
                distance : "distance(vec2(${longitude}, ${latitude}), vec2(-1.291777521, 0.7105706624))"
            },
            color : {
                conditions : [
                    ["${distance} > 0.0002", "color('gray')"],
                    ["true", "mix(color('yellow'), color('green'), ${distance} / 0.0002)"]
                ]
            }
        });
    }
    
    // Color buildings based on their height.
    function colorByHeight() {
        //tileset.style = new Cesium.Cesium3DTileStyle({
        var style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ["${height} >= 300", "rgba(255, 0, 0, 1.0)"],
                    ["${height} >= 200", "rgba(255, 100, 25, 1.0)"],
                    ["${height} >= 100", "rgba(255, 230, 25, 0.42)"],
                    ["${height} >= 50", "rgb(198, 255, 43)"],
                    ["${height} >= 25", "rgb(9, 178, 22)"],
                    ["${height} >= 10", "rgb(39, 255, 244)"],
                    ["${height} >= 5", "rgba(0, 90, 255, 0.4)"],  //["${height} >= 5", "rgba(80, 80, 255, 0.4)"], //["${height} >= 5", "rgba(0, 91, 178, 0.4)"],
                    ["true", "rgb(127, 59, 8)"]
                ]
            }
        });
        
        return style;
    }
       
    // Color buildings based on their height (white/low to red/tall).
    function colorByHeight_whiteToRed() {
        //tileset.style = new Cesium.Cesium3DTileStyle({
        var style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ["${height} >= 300", "rgba(255,   0,   0, 1.00)"],
                    ["${height} >= 200", "rgba(255,  90,   0, 1.00)"],
                    ["${height} >= 100", "rgba(255, 154,   0, 1.00)"],
                    ["${height} >= 50",  "rgba(255, 206,   0, 1.00)"],
                    ["${height} >= 25",  "rgba(240, 255,   0, 1.00)"],
                    ["${height} >= 10",  "rgba(255, 225, 225, 1.00)"],
                    ["${height} >= 5",   "rgba(255, 255, 255, 1.00)"],
                    ["true", "rgb(127, 59, 8)"]
                ]
            }
        });
        
        return style;
    }
    
    // Color buildings based on their height (turquoise).
    function colorByHeight_turquoise() {
        var style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ["${height} >= 300", "rgba( 59, 214, 198, 1.00)"],
                    ["${height} >= 200", "rgba( 64, 224, 208, 1.00)"],
                    ["${height} >= 100", "rgba( 67, 232, 216, 1.00)"],
                    ["${height} >= 50",  "rgba(137, 236, 218, 1.00)"],
                    ["${height} >= 25",  "rgba(179, 236, 236, 1.00)"],
                    ["${height} >= 10",  "rgba(200, 240, 240, 1.00)"],
                    ["${height} >= 5",   "rgba(255, 255, 255, 1.00)"],
                    ["true", "rgb(127, 59, 8)"]
                ]
            }
        });
        
        return style;
    }
    
    var tilesetStyle_buildings_colorByHeight_01 = colorByHeight();
    var tilesetStyle_buildings_colorByHeight_02 = colorByHeight_whiteToRed();
    var tilesetStyle_buildings_colorByHeight_03 = colorByHeight_turquoise();
    
    // Color buildings with a '3' in their name.
    function colorByNameRegex() {
        tileset.style = new Cesium.Cesium3DTileStyle({
            color : "(regExp('3').test(${dbl:name})) ? color('red', 0.9) : color('purple', 0.1)"
        });
    }

    
    
    var radioBtn_colorRamp_buildingHeight_01 = document.getElementById('radioBtn_colorRamp_buildingHeight_01');
    radioBtn_colorRamp_buildingHeight_01.addEventListener(
        'change', 
        function() 
        {                        
          var currentStyle = tileset.style;
          
          var currentStyle_show = currentStyle.show;
              
          var newStyle = new Cesium.Cesium3DTileStyle();
          newStyle.show = currentStyle_show;          
          newStyle.color = tilesetStyle_buildings_colorByHeight_01.color;
          
          tileset.style = newStyle;
            
          //setCurrentTilesetStyle( tileset, tilesetStyle_buildings_colorByHeight_01 );
        }, 
        false
    );
    var radioBtn_colorRamp_buildingHeight_02 = document.getElementById('radioBtn_colorRamp_buildingHeight_02');
    radioBtn_colorRamp_buildingHeight_02.addEventListener(
        'change', 
        function() 
        {     
          var currentStyle = tileset.style;
          
          var currentStyle_show = currentStyle.show;
              
          var newStyle = new Cesium.Cesium3DTileStyle();
          newStyle.show = currentStyle_show;          
          newStyle.color = tilesetStyle_buildings_colorByHeight_02.color;
          
          tileset.style = newStyle;

            //setCurrentTilesetStyle( tileset, tilesetStyle_buildings_colorByHeight_02 );
        }, 
        false
    );
    var radioBtn_colorRamp_buildingHeight_03 = document.getElementById('radioBtn_colorRamp_buildingHeight_03');
    radioBtn_colorRamp_buildingHeight_03.addEventListener(
        'change', 
        function() 
        {     
          var currentStyle = tileset.style;
          
          var currentStyle_show = currentStyle.show;
              
          var newStyle = new Cesium.Cesium3DTileStyle();
          newStyle.show = currentStyle_show;          
          newStyle.color = tilesetStyle_buildings_colorByHeight_03.color;
          
          tileset.style = newStyle;

            //setCurrentTilesetStyle( tileset, tilesetStyle_buildings_colorByHeight_03 );
        }, 
        false
    );
    

    
    function setCurrentTilesetStyle(parmTileset, parmTilesetStyle)
    {
      parmTileset.style = parmTilesetStyle;
    }

    tileset.readyPromise.then(function(tileset) {
        //console.log('entered tileset.readyPromise.then()');
        //console.log('  tileset.basepath: ', tileset.basepath);
        //console.log('  tileset.baseScreenSpaceError: ', tileset.baseScreenSpaceError);
        //console.log('  tileset.boundingSphere: ', tileset.boundingSphere);
        //console.log('  tileset.maximumMemoryUsage (MB): ', tileset.maximumMemoryUsage);
        var properties = tileset.properties; // see https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileFeature.html#getProperty
        if (Cesium.defined(properties)) {
            for (var name in properties) {
                //console.log(properties[name]);
            }
        }
        else {
            //console.log('  tileset.properties: undefined'); 
        }
        
        //console.log('  tileset.url: ', tileset.url);

        // Set the camera to view the newly added tileset
        //viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
        
        //colorByNameRegex();
        //colorByHeight();
        //colorByHeight_whiteToRed();
        
        //setCurrentTilesetStyle(tileset, colorByHeight_whiteToRed());
        //setCurrentTilesetStyle( tileset, colorByHeight() );
        
        setCurrentTilesetStyle( tileset, tilesetStyle_buildings_colorByHeight_01 );
        
        //var tilesetStyle_buildings_colorByHeight_01 = colorByHeight();
        //var tilesetStyle_buildings_colorByHeight_02 = colorByHeight_whiteToRed();
        
    });    


    viewer.canvas.addEventListener('click', function(e)
    {
        var mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);

        var ellipsoid = viewer.scene.globe.ellipsoid;
        var cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
        if (cartesian) {
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);

            //console.log('picked location at mouse pos (lon, lat): ' + longitudeString + ', ' + latitudeString);
        }
        // else {
          // alert('Globe was not picked');
        // }

    }, false);

  
    
    // zoom into GT campus, entire area (45 deg view)
    var zoomIntoGTCampusAtl_Energy_link2 = document.getElementById('zoomIntoGTCampusAtl_Energy_link2');
    zoomIntoGTCampusAtl_Energy_link2.addEventListener(
        'click', 
        function() 
        {
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.4001615153, 33.7709457655, 500.680),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-45.0),
                    roll : 0.0 
                }
            });
        }, 
        false
    );
    var zoomIntoGTCampusAtl_Energy_link2_sensor = document.getElementById('zoomIntoGTCampusAtl_Energy_link2_sensor');
    zoomIntoGTCampusAtl_Energy_link2_sensor.addEventListener(
        'click', 
        function() 
        {
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.4001615153, 33.7709457655, 500.680),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-45.0),
                    roll : 0.0 
                }
            });
        }, 
        false
    );
		
    // zoom into Caddell
    var zoomIntoGTCampusAtl_Energy_link6 = document.getElementById('zoomIntoGTCampusAtl_Energy_link6');
    zoomIntoGTCampusAtl_Energy_link6.addEventListener(
        'click', 
        function() 
        {
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3962095887, 33.7765832878, 52.051),
                orientation : {
                    heading : Cesium.Math.toRadians(270.0), 
                    pitch : Cesium.Math.toRadians(-35.992), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );
		
    // zoom into Caddell
    var zoomIntoGTCampusAtl_Energy_link6_sensor = document.getElementById('zoomIntoGTCampusAtl_Energy_link6_sensor');
    zoomIntoGTCampusAtl_Energy_link6_sensor.addEventListener(
        'click', 
        function() 
        {
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3962095887, 33.7765832878, 52.051),
                orientation : {
                    heading : Cesium.Math.toRadians(270.0), 
                    pitch : Cesium.Math.toRadians(-35.992), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );
		
    
  

    // >Atlanta, from downtown to midtown
    var bookmarkLink0a = document.getElementById('bookmarkLink0a');
    bookmarkLink0a.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3528963977, 33.7523390108, 1076.758),
                orientation : {
                    heading : Cesium.Math.toRadians(301.66), 
                    pitch : Cesium.Math.toRadians(-18.453),
                    roll : 0.0 
                }
            });
        }, 
        false
    );
    // Over downtown Atlanta (at 45° angle)
    var bookmarkLink1 = document.getElementById('bookmarkLink1');
    bookmarkLink1.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3887098693, 33.7501354063, 874.051),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-45.00),//-42.920), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );

    var bookmarkLink2Shenzen1 = document.getElementById('bookmarkLink2Shenzen1');
    bookmarkLink2Shenzen1.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({               
                destination : Cesium.Cartesian3.fromDegrees(113.9542427148, 22.2167464226, 27069.853),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-32.86), 
                    roll : 0.0
                }
            });
        }, 
        false
    );
    var bookmarkLink2Shenzen2 = document.getElementById('bookmarkLink2Shenzen2');
    bookmarkLink2Shenzen2.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({               
                destination : Cesium.Cartesian3.fromDegrees(113.9976018209, 22.5772811391, 1559.150),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-32.86), 
                    roll : 0.0
                }
            });
        }, 
        false
    );

    
    var bookmarkLink2 = document.getElementById('bookmarkLink2');
    bookmarkLink2.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3937042848, 33.7313475553, 613),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-14.36), 
                    roll : 0.0
                }
            });
        }, 
        false
    );
    var bookmarkLink2a = document.getElementById('bookmarkLink2a');
    bookmarkLink2a.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees( -84.3782107105, 33.7401139090, 575.988),
                orientation : {
                    heading : Cesium.Math.toRadians(331.8), 
                    pitch : Cesium.Math.toRadians(-13.319), 
                    roll : 0.0
                }
            });
        }, 
        false
    );
    
    // view over Tech Tower and Hinman, towards midtown
    var bookmarkLink3 = document.getElementById('bookmarkLink3');
    bookmarkLink3.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.4112442769, 33.7697772958, 216.81),
                orientation : {
                    heading : Cesium.Math.toRadians(60.055), 
                    pitch : Cesium.Math.toRadians(-5.151), 
                    roll : 0.0
                }
            });
        }, 
        false
    );

    
    var bookmarkLink4 = document.getElementById('bookmarkLink4');
    bookmarkLink4.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.40, 33.76, 1800),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-45.00), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );
 

    // GT campus (from South, horizon visible)
    var bookmarkLink4a1 = document.getElementById('bookmarkLink4a1');
    bookmarkLink4a1.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees( -84.4016759842, 33.7543276876, 650.143),
                orientation : {
                    heading : Cesium.Math.toRadians(0.993), 
                    pitch : Cesium.Math.toRadians(-13.459), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );

     // view over GT, from east (i.e., from Midtown)
    var bookmarkLink4a = document.getElementById('bookmarkLink4a');
    bookmarkLink4a.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3759284301, 33.7760580975, 394.762),
                orientation : {
                    heading : Cesium.Math.toRadians(268.412), 
                    pitch : Cesium.Math.toRadians(-11.030), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );
 

    // Caddell Building, front view (from east, at height 11m)
    var bookmarkLink5 = document.getElementById('bookmarkLink5');
    bookmarkLink5.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees( -84.3962498573, 33.7766607611, 11),
                orientation : {
                    heading : Cesium.Math.toRadians(268.655), 
                    pitch : Cesium.Math.toRadians(-4.477), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );

    // Caddell Building, front view (from east, at average person's height 1.77m = 5'10'')
    var bookmarkLink6 = document.getElementById('bookmarkLink6');
    bookmarkLink6.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3965214227, 33.7763217269, 1.70),
                orientation : {
                    heading : Cesium.Math.toRadians(313.088), 
                    pitch : Cesium.Math.toRadians(-3.355), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );

    // Skyhouse South
    var bookmarkLink8 = document.getElementById('bookmarkLink8');
    bookmarkLink8.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3822877818, 33.7770941730, 21.465),
                orientation : {
                    heading : Cesium.Math.toRadians(298.642), 
                    pitch : Cesium.Math.toRadians(-7.559), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );
    // Buckhead, north view
    var bookmarkLink9 = document.getElementById('bookmarkLink9');
    bookmarkLink9.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3672513193, 33.8268373784, 454.50),
                orientation : {
                    heading : Cesium.Math.toRadians(0.00), 
                    pitch : Cesium.Math.toRadians(-7.246), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );
    // Buckhead, south view
    var bookmarkLink10 = document.getElementById('bookmarkLink10');
    bookmarkLink10.addEventListener(
        'click', 
        function() {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.3607325598, 33.8628797211, 428.50),
                orientation : {
                    heading : Cesium.Math.toRadians(180.0), 
                    pitch : Cesium.Math.toRadians(-14.2), 
                    roll : 0.0 
                }
            });
        }, 
        false
    );
    
    
    // The amount the camera has to change before the changed event is raised. The value is a percentage in the [0, 1] range, with default = 0.5.
    // Set this to e.g. 0.1 for more frequent calling of the function.
    viewer.camera.percentageChanged = 0.1;
    viewer.camera.changed.addEventListener(function() 
    {
      var positionCartographic = viewer.scene.camera.positionCartographic;
      var longitudeString = Cesium.Math.toDegrees(positionCartographic.longitude).toFixed(10);
      var latitudeString  = Cesium.Math.toDegrees(positionCartographic.latitude).toFixed(10);
      
      // // prevent camera from dipping below height = 0.1m:
      // var height          = positionCartographic.height;
      // if (height < 0.1)
      // {
        // height = 0.1;

        // var position = view.camera.position;
        // position.height = height;
        // var orientation = view.camera.orientation;
        
        // viewer.scene.camera.setView({
            // destination: position,
            // orientation: orientation,
            // endTransform: Cesium.Matrix4.IDENTITY
        // });
        
      // }
      var heightString    = positionCartographic.height.toFixed(3);

      var heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(3);
      var pitch   = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(3);
      var roll    = Cesium.Math.toDegrees(viewer.camera.roll).toFixed(3);
      
      var detailsString = ' Camera: <em>lon, lat, h</em> = ' + longitudeString + '°, ' + latitudeString + '°, ' + heightString + 'm';
      detailsString    += ' | <em>heading, pitch, roll</em> = ' + heading + '°, ' + pitch + '°, ' + roll + '°';
      
      var detailsPanel = document.getElementById('detailsPanel');
      detailsPanel.innerHTML = detailsString;
      
    });
      
 
    function showOnlyBuildingsWithHeightAtLeast(minHeight)
    {
      var currentStyle = tileset.style;
      var currentStyle_color = currentStyle.color;
          
      var newStyle = new Cesium.Cesium3DTileStyle();
      newStyle.show = '${height} >= ' + minHeight;
      newStyle.color = currentStyle_color;
      
      tileset.style = newStyle;
    }   

    // https://refreshless.com/nouislider/
    minHeightSlider.noUiSlider.on(
      'update', 
      function( values, handle ) 
      {
        document.getElementById('slider-value-min-height').innerHTML = Math.round(values[handle]) + ' m ≈ ' + Math.round(values[handle] * 3.2808) + ' ft';
        
        //var minHeight = values[0];
        var value = values[handle]; // equals min height
        
        var minHeight = value;
        
        showOnlyBuildingsWithHeightAtLeast(minHeight);
        
      }
    );
    


    var energy_showGTBuildings_thermalZones_Checkbox = document.getElementById('energy_showGTBuildings_thermalZones_Checkbox');
    energy_showGTBuildings_thermalZones_Checkbox.addEventListener(
        'change', 
        function() {
            tileset.show = !energy_showGTBuildings_thermalZones_Checkbox.checked;
            tileset_energy.show = energy_showGTBuildings_thermalZones_Checkbox.checked;
        }, 
        false
    );
    
  
    // HTML overlay for showing feature name on mouseover
    var nameOverlay = document.createElement('div');
    viewer.container.appendChild(nameOverlay);
    nameOverlay.className = 'backdrop';
    nameOverlay.style.display = 'none';
    nameOverlay.style.position = 'absolute';
    nameOverlay.style.bottom = '0';
    nameOverlay.style.left = '0';
    nameOverlay.style['pointer-events'] = 'none';
    nameOverlay.style.padding = '4px';
    nameOverlay.style.backgroundColor = 'black';
    nameOverlay.style.color = 'white';

    // Information about the currently selected feature. 
    var selected = {
        feature: undefined,
        originalColor: new Cesium.Color()
    };

    // Information about the currently highlighted feature.
    var highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
    };

    // An entity object which will hold info about the currently selected feature for infobox display
    var selectedEntity = new Cesium.Entity();

    // Color a feature yellow on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) 
    {
        //console.log('==============================');
        //console.log('onMouseMove(movement)');
        //console.log('    movement: ', movement);
        
        // If a feature was previously highlighted, undo the highlight
        if (Cesium.defined(highlighted.feature)) 
        {
            highlighted.feature.color = highlighted.originalColor;
            highlighted.feature = undefined;
        }

        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.endPosition);
        //console.log('    pickedFeature: ', pickedFeature);
        
        if (!Cesium.defined(pickedFeature)) 
        {
            nameOverlay.style.display = 'none';
            return;
        }

        // what kind of feature was picked?
        if (pickedFeature instanceof Cesium.Cesium3DTileFeature) 
        {
          //console.log('pickedFeature is an instanceof Cesium.Cesium3DTileFeature!');
          
        
          // A feature was picked, so show it's overlay content
          nameOverlay.style.display = 'block';
          nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
          nameOverlay.style.left = movement.endPosition.x + 'px';
          
          // var name = pickedFeature.getProperty('name');      
          // if (!Cesium.defined(name)) 
          // {
              // name = pickedFeature.getProperty('id');
          // }
          // nameOverlay.textContent = name;      
          // //console.log("pickedFeature.getProperty('name'): ", name)
          
          //console.log('=======================================');
          
          var batchId = pickedFeature._batchId;
          //console.log('pickedFeature._batchId: ', pickedFeature._batchId);
          
          var propertyNames = pickedFeature.getPropertyNames();
          //console.log('propertyNames: ', propertyNames);
          
          var length = propertyNames.length;
          for (var i = 0; i < length; ++i) {
              var propertyName = propertyNames[i];
              //console.log(propertyName + ': ' + pickedFeature.getProperty(propertyName));
          }      
          
          
          //var batchId_array = pickedFeature.content.batchTable.batchTableJson.batchId;
          ////console.log('batchId_array: ', batchId_array);
          
          var dbl_name = pickedFeature.getProperty("dbl:name");
          var dbl_uuid = pickedFeature.getProperty("dbl:uuid");

          //var batchIdNew_array = pickedFeature.content.batchTable.batchTableJson.batchIdNew;
          ////console.log('batchIdNew_array: ', batchIdNew_array);

          //var newname_array = pickedFeature.content.batchTable.batchTableJson.newname;
          //var feature_newname = newname_array[batchId];
          ////console.log('newname_array[batchId]: ', newname_array[batchId]);
          
          //nameOverlay.textContent = feature_newname + ' (' + batchId + ')';
          
          // var overlayText  = 'batchID: ' + batchId + '\n';
          // overlayText += 'dbl:name: ' + dbl_name + '\r\n';
          // overlayText += 'dbl:uuid: ' + dbl_uuid;
          var overlayText  = dbl_name;
          //overlayText.replace('_', ' ');
          
          var overlayTextNew;
          
          var token = "_";
          var newToken = " ";
          overlayTextNew = overlayText.split(token).join(newToken);
                    
          nameOverlay.textContent = overlayTextNew;
          
          // Highlight the feature if it's not already selected.
          if (pickedFeature !== selected.feature) {
              highlighted.feature = pickedFeature;
              Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
              pickedFeature.color = Cesium.Color.YELLOW;
          }
        
        }
        else
        {
          //console.log('pickedFeature is NOT an instanceof Cesium.Cesium3DTileFeature');
          //console.log('pickedFeature.id: ', pickedFeature.id);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      
      
      
    // featureUuid: if empty, then the whole campus
    // energyDataType: 'endUsePct', 'energyUsePct'
    // timeInterval: examples: '2017', '2017-09', '2017-09-18'
    function getEnergyDataJSONPerFeature(featureUuid, energyDataTypeId, timeInterval)
    {
      // example use:
      // 
      // energyData.building['Caddell'].endUsePct.timeInterval['2017']
      // energyData.campus.endUsePct.timeInterval['2017'].
      
      var energyDataJSON;
      
      var returnJSON = [];
      
      // if ( featureUuid == '')
        // returnJSON = energyDataJSON.campus.energyDataType[energyDataTypeId].timeInterval[timeIntervalId];
      // else
        // returnJSON = energyDataJSON.feature[featureUuid].energyDataType[energyDataTypeId].timeInterval[timeIntervalId];
      
      ///////////////////////////////////////////////////////////////////////////////////////
      // sample returnJSON (endUsePct) for Caddell:
      // 
      // energyDataJSON.feature['3e6c1806-4a44-40bb-be89-04a13d946876'].energyDataType['endUsePct'].timeInterval['2017'];
      if (
        featureUuid == '3e6c1806-4a44-40bb-be89-04a13d946876' 
        && energyDataTypeId == 'endUsePct'
        && timeInterval == '2017')
      {
        returnJSON = [
          {            
            //"id": "interiorEquipment", 
            "caption": "Interior Equipment", 
            "value": 0.30
          },
          {            
            //"id": "heating", 
            "caption": "Heating", 
            "value": 0.20
          },
          {
            //"id": "interiorLighting", 
            "caption": "Interior Lighting", 
            "value": 0.20
          },
          {
            //"id": "cooling", 
            "caption": "Cooling", 
            "value": 0.10
          },
          {
            //"id": "fans", 
            "caption": "Fans", 
            "value": 0.05
          },
          {
            //"id": "waterSystems", 
            "caption": "Water Systems", 
            "value": 0.05
          },
          {
            //"id": "pumps", 
            "caption": "Pumps", 
            "value": 0.05
          },
          {
            //"id": "exteriorLighting", 
            "caption": "Exterior Lighting", 
            "value": 0.05
          },
        ];
      }

      if (
        featureUuid == '3e6c1806-4a44-40bb-be89-04a13d946876' 
        && energyDataTypeId == 'energyUsePct'
        && timeInterval == '2017')
      {
        returnJSON = [
          {            
            //"id": "electricity", 
            "caption": "Electricity", 
            "value": 0.72
          },
          {            
            //"id": "naturalGas", 
            "caption": "Natural Gas", 
            "value": 0.28
          },
        ];
      }
      
      return returnJSON;
    }    
      

    function onSingleClick(movement) 
    {
      // If a feature was previously selected, undo the highlight
      if (Cesium.defined(selected.feature)) 
      {
          selected.feature.color = selected.originalColor;
          selected.feature = undefined;
      }

      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.position);
      //console.log('    pickedFeature: ', pickedFeature);
      
      if (!Cesium.defined(pickedFeature)) 
      {
          leftClickHandler(movement);
					
          GTEnergySelectionScope.innerHTML = 'Entire GT Campus <span style="font-weight:normal">(= no selection)</span>';					
          annualOverviewEndUseText.innerHTML = getEnergyDataJSONPerFeature('', 'endUsePct', '2017');
          //annualOverviewEnergyUseText.innerHTML = getEnergyDataJSONPerFeature('', 'energyUsePct', '2017');            
          
          energyGT_endUse_pieChart_config.data.datasets.forEach(function(dataset) {
              dataset.data = dataset.data.map(function() {
                  return randomScalingFactor();
              });
          });
          window.myPie.update();
					
          GTSensorDataSelectionScope.innerHTML = 'Entire GT Campus <span style="font-weight:normal">(= no selection)</span>';					
					
          
          return;
      }

      // Select the feature if it's not already selected
      if (selected.feature === pickedFeature) 
      {
          return;
      }
      selected.feature = pickedFeature;

      // Save the selected feature's original color
      if (pickedFeature === highlighted.feature) 
      {
          Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
          highlighted.feature = undefined;
      } 
      else 
      {
          Cesium.Color.clone(pickedFeature.color, selected.originalColor);
      }

      // Highlight newly selected feature
      pickedFeature.color = Cesium.Color.LIME;

      // what kind of feature was picked?
      if (pickedFeature instanceof Cesium.Cesium3DTileFeature) 
      {
        //console.log('pickedFeature is an instanceof Cesium.Cesium3DTileFeature!');
				
				var propertyNames = pickedFeature.getPropertyNames();
      
        // Set feature infobox description
				var featureBatchId = pickedFeature.getProperty('batchId');
        var featureDblName = pickedFeature.getProperty('dbl:name');
				var featureDblUuid = pickedFeature.getProperty('dbl:uuid');
				var featureHeight = pickedFeature.getProperty('height');
				
       
				const chart2 = new Chart2(viewer.container, featureDblUuid);
				chart2.showPlotlyInstances(featureDblUuid);
				
				
        var tilesetName = pickedFeature.tileset.name;
        
        if (tilesetName == 'Buildings')
          selectedEntity.name = 'Building'; // featureName;
        else
          selectedEntity.name = 'Feature';
        
        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
        
        
        //viewer.selectedEntity = selectedEntity; 
        // SKSKSK
        // Gets or sets the object instance for which to display a selection indicator.
        
        
        var dblName;
        var height;
        var dblUuid;
        
        selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>';
        var propertyNames = pickedFeature.getPropertyNames();         
        var length = propertyNames.length;
        for (var i = 0; i < length; ++i) 
        {
          var propertyName = propertyNames[i];
          
          if (propertyName == 'dbl:name')
          {
            selectedEntity.description += '<tr>';
            selectedEntity.description += '  <th>Name:</th>';
            var dblName = pickedFeature.getProperty('dbl:name');
            var re = /_/gi;
            var processedDblName = dblName.replace(re, " ");
            dblName = processedDblName;
            selectedEntity.description += '  <td>' + dblName + '</td>';
            selectedEntity.description += '</tr>';
          }
          else if (propertyName == 'height')
          {
            selectedEntity.description += '<tr>';
            selectedEntity.description += '  <th>Height:</th>';
            height = Math.round(parseFloat(pickedFeature.getProperty(propertyName)), 2);
            selectedEntity.description += '  <td>' + height + ' m</td>';
            selectedEntity.description += '</tr>';            
          }
        }
        selectedEntity.description += '</tbody></table>';
        
        // now update Statistics for current selection and time interval:
        
        // featureUuid: if empty, then the whole campus
        // energyDataType: 'endUsePct', 'energyUsePct'
        // timeInterval: examples: '2017', '2017-09', '2017-09-18'
        //function getEnergyDataJSONPerFeature(featureUuid, energyDataTypeId, timeInterval)
        
        GTEnergySelectionScope.innerHTML = dblName;
				GTSensorDataSelectionScope.innerHTML = dblName;
        
        var energy_endUsePct_JSON = getEnergyDataJSONPerFeature(dblUuid, 'endUsePct', '2017');
        annualOverviewEndUseText.innerHTML = energy_endUsePct_JSON;
        
        var energy_energyUsePct_JSON = getEnergyDataJSONPerFeature(dblUuid, 'energyUsePct', '2017');
        //annualOverviewEnergyUseText.innerHTML = energy_energyUsePct_JSON
        //annualOverviewElectricityConsumptionText.innerHTML = dblUuid + ' - electricity consumption';
        
        energyGT_endUse_pieChart_config.data.datasets.forEach(function(dataset) {
            dataset.data = dataset.data.map(function() {
                return randomScalingFactor();
            });
        });
        window.myPie.update();
        
        
      } // end of if (pickedFeature instanceof Cesium.Cesium3DTileFeature)
      else
      {
        //console.log('pickedFeature is NOT an instance of Cesium.Cesium3DTileFeature');
        //console.log('   add code at position 78623472634');
      }
    } // end of onSingleClick()
      



    function onDoubleClick(movement) 
    {
      //console.log('====================================');
      //console.log('function onDoubleClick(movement)');
      //console.log('  movement: ', movement);
      
      //onSingleClick(movement);
      
      var pickedFeature = viewer.scene.pick(movement.position);

      if (pickedFeature instanceof Cesium.Cesium3DTileFeature) 
      {
        //console.log('pickedFeature is an instanceof Cesium.Cesium3DTileFeature!');
      
        // Set feature infobox description
        var featureName = pickedFeature.getProperty('name');
        
        var tilesetName = pickedFeature.tileset.name;
        
        if (tilesetName == 'Buildings')
          selectedEntity.name = 'Building'; // featureName;
        else
          selectedEntity.name = 'Feature';
        
        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
        viewer.selectedEntity = selectedEntity;
        
        
        var dblName;
        var height;
        var dblUuid;
        
        var propertyNames = pickedFeature.getPropertyNames();
        for (var i = 0; i < propertyNames.length; ++i) 
        {
          var propertyName = propertyNames[i];
          
          if (propertyName == 'dbl:name')
          {
            var dblName = pickedFeature.getProperty('dbl:name');
            var re = /_/gi;
            var processedDblName = dblName.replace(re, " ");
            dblName = processedDblName;
          }
          else if (propertyName == 'height')
          {
            height = Math.round(parseFloat(pickedFeature.getProperty(propertyName)), 2);
            
            var mousePosition = new Cesium.Cartesian2(movement.position.x, movement.position.y);

            var ellipsoid = viewer.scene.globe.ellipsoid;
            var cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
            if (cartesian) 
            {
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);

                //console.log('picked location at mouse pos (lon, lat): ' + longitudeString + ', ' + latitudeString);

                //var boundingSphere = new Cesium.BoundingSphere;
                
                // viewer.camera.flyToBoundingSphere({
                    // boundingSphere : boundingSphere;
                // });            
                
                // viewer.camera.flyTo({
                    // destination : Cesium.Cartesian3.fromDegrees(-84.3990865979, 33.7646875228, 1058.488),
                    // orientation : {
                        // heading : Cesium.Math.toRadians(0.0), 
                        // pitch : Cesium.Math.toRadians(-45.0),
                        // roll : 0.0 
                    // }
                // });            
                
            }
            
          }
          // else if (propertyName == 'batchId')
          // {
          // }
          else if (propertyName == 'dbl:uuid')
          {
            dblUuid = pickedFeature.getProperty('dbl:uuid');
          }
          // else
          // {
            // selectedEntity.description += '<tr><th>' + propertyName + '</th><td>' + pickedFeature.getProperty(propertyName) + '</td></tr>';
          // }
          
        } // end of for (var i = 0; i < propertyNames.length; ++i) 
        
      } // end of if (pickedFeature instanceof Cesium.Cesium3DTileFeature) 
      
    } // end of function onDoubleClick(movement) 

      
    var GTEnergySelectionScope = document.getElementById('GTEnergySelectionScope');
    var annualOverviewEndUseText = document.getElementById('annualOverviewEndUseText');
    var annualOverviewElectricityConsumptionText = document.getElementById('annualOverviewElectricityConsumptionText');    
		
		
		var GTSensorDataSelectionScope = document.getElementById('GTSensorDataSelectionScope');
    
    viewer.isBeingDoubleClicked = false;
    
    // Color a feature on selection and show metadata in the InfoBox.
    var leftClickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
    // Color a feature green on click, and show the details panel.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) 
    {  
        //console.log('==============================');
        //console.log('onLeftClick(movement)');
        //console.log('    movement: ', movement);
        
        if (viewer.isBeingDoubleClicked == false)
        {
          viewer.isBeingDoubleClicked = true;
          setTimeout(function(){
            if (viewer.isBeingDoubleClicked)
            {
              //console.log('single click!');
              onSingleClick(movement);
            }
            viewer.isBeingDoubleClicked = false;
          }, 
          200);
        }
        else
        {
          viewer.isBeingDoubleClicked = false;
          //console.log('double click!');
          // here call function onDoubleClick()
        }
        
        
        // if (viewer.getAttribute("data-dblclick") == null)
        // {
          // viewer.setAttribute("data-dblclick", 1);
          // setTimeout(function(){
            // if (viewer.getAttribute("data-dblclick") == 1)
            // {
              // //console.log('single click!');
              // // here call function onSingleClick()
            // }
            // viewer.removeAttribute("data-dblclick");
          // }, 
          // 200);
        // }
        // else
        // {
          // viewer.removeAttribute("data-dblclick");
          // //console.log('double click!');
          // // here call function onDoubleClick()
        // }
      
        // // If a feature was previously selected, undo the highlight
        // if (Cesium.defined(selected.feature)) 
        // {
            // selected.feature.color = selected.originalColor;
            // selected.feature = undefined;
        // }

        // // Pick a new feature
        // var pickedFeature = viewer.scene.pick(movement.position);
        // //console.log('    pickedFeature: ', pickedFeature);
        
        // if (!Cesium.defined(pickedFeature)) 
        // {
            // leftClickHandler(movement);
            // GTEnergySelectionScope.innerHTML = 'No selection (= entire campus)';
            // annualOverviewEndUseText.innerHTML = getEnergyDataJSONPerFeature('', 'endUsePct', '2017');
            // annualOverviewEnergyUseText.innerHTML = getEnergyDataJSONPerFeature('', 'energyUsePct', '2017');            
            // return;
        // }

        // // Select the feature if it's not already selected
        // if (selected.feature === pickedFeature) 
        // {
            // return;
        // }
        // selected.feature = pickedFeature;

        // // Save the selected feature's original color
        // if (pickedFeature === highlighted.feature) 
        // {
            // Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
            // highlighted.feature = undefined;
        // } 
        // else 
        // {
            // Cesium.Color.clone(pickedFeature.color, selected.originalColor);
        // }

        // // Highlight newly selected feature
        // pickedFeature.color = Cesium.Color.LIME;

        // // what kind of feature was picked?
        // if (pickedFeature instanceof Cesium.Cesium3DTileFeature) 
        // {
          // //console.log('pickedFeature is an instanceof Cesium.Cesium3DTileFeature!');
        
          // // Set feature infobox description
          // var featureName = pickedFeature.getProperty('name');
          
          // var tilesetName = pickedFeature.tileset.name;
          
          // if (tilesetName == 'Buildings')
            // selectedEntity.name = 'Building'; // featureName;
          // else
            // selectedEntity.name = 'Feature';
          
          // selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
          // viewer.selectedEntity = selectedEntity;
          
          
          // var dblName;
          // var height;
          // var dblUuid;
          
          // selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>';
          // var propertyNames = pickedFeature.getPropertyNames();         
          // var length = propertyNames.length;
          // for (var i = 0; i < length; ++i) 
          // {
            // var propertyName = propertyNames[i];
            
            // if (propertyName == 'dbl:name')
            // {
              // selectedEntity.description += '<tr>';
              // selectedEntity.description += '  <th>Name:</th>';
              // var dblName = pickedFeature.getProperty('dbl:name');
              // var re = /_/gi;
              // var processedDblName = dblName.replace(re, " ");
              // dblName = processedDblName;
              // selectedEntity.description += '  <td>' + dblName + '</td>';
              // selectedEntity.description += '</tr>';
            // }
            // else if (propertyName == 'height')
            // {
              // selectedEntity.description += '<tr>';
              // selectedEntity.description += '  <th>Height:</th>';
              // height = Math.round(parseFloat(pickedFeature.getProperty(propertyName)), 2);
              // selectedEntity.description += '  <td>' + height + ' m</td>';
              // selectedEntity.description += '</tr>';            
            // }
            // // else if (propertyName == 'batchId')
            // // {
              // // selectedEntity.description += '<tr>';
              // // selectedEntity.description += '  <th>batchId:</th>';
              // // selectedEntity.description += '  <td>' + pickedFeature.getProperty('batchId') + '</td>';
              // // selectedEntity.description += '</tr>';            
            // // }
            // else if (propertyName == 'dbl:uuid')
            // {
              // selectedEntity.description += '<tr>';
              // selectedEntity.description += '  <th>dbl:uuid:</th>';
              // dblUuid = pickedFeature.getProperty('dbl:uuid');
              // selectedEntity.description += '  <td>' + dblUuid + '</td>';
              // selectedEntity.description += '</tr>';            
            // }
            // // else
            // // {
              // // selectedEntity.description += '<tr><th>' + propertyName + '</th><td>' + pickedFeature.getProperty(propertyName) + '</td></tr>';
            // // }
          // }
          // selectedEntity.description += '</tbody></table>';
          
          // // now update Statistics for current selection and time interval:
          
          // // featureUuid: if empty, then the whole campus
          // // energyDataType: 'endUsePct', 'energyUsePct'
          // // timeInterval: examples: '2017', '2017-09', '2017-09-18'
          // //function getEnergyDataJSONPerFeature(featureUuid, energyDataTypeId, timeInterval)
          
          // GTEnergySelectionScope.innerHTML = dblName;
          // annualOverviewEndUseText.innerHTML = getEnergyDataJSONPerFeature(dblUuid, 'endUsePct', '2017');
          // annualOverviewEnergyUseText.innerHTML = getEnergyDataJSONPerFeature(dblUuid, 'energyUsePct', '2017');
          // //annualOverviewElectricityConsumptionText.innerHTML = dblUuid + ' - electricity consumption';
          
        // } // end of if (pickedFeature instanceof Cesium.Cesium3DTileFeature)
        // else
        // {
          // //console.log('pickedFeature is NOT an instance of Cesium.Cesium3DTileFeature');
          // //console.log('   add code at position 78623472634');
        // }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    


    
    
    


    /*
    // Color a feature on selection and show metadata in the InfoBox.
    var leftDoubleClickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    
    // Color a feature green on click, and show the details panel.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftDoubleClick(movement) 
    {  
        //console.log('==============================');
        //console.log('onLeftDoubleClick(movement)');
        //console.log('    movement: ', movement);
      
        // If a feature was previously selected, undo the highlight
        if (Cesium.defined(selected.feature)) 
        {
            selected.feature.color = selected.originalColor;
            selected.feature = undefined;
        }

        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.position);
        //console.log('    pickedFeature: ', pickedFeature);
        
        if (!Cesium.defined(pickedFeature)) 
        {
            leftDoubleClickHandler(movement);
            GTEnergySelectionScope.innerHTML = 'No selection (= entire campus)';
            annualOverviewEndUseText.innerHTML = getEnergyDataJSONPerFeature('', 'endUsePct', '2017');
            annualOverviewEnergyUseText.innerHTML = getEnergyDataJSONPerFeature('', 'energyUsePct', '2017');            
            return;
        }

        // Select the feature if it's not already selected
        if (selected.feature === pickedFeature) 
        {
            return;
        }
        selected.feature = pickedFeature;

        // Save the selected feature's original color
        if (pickedFeature === highlighted.feature) 
        {
            Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
            highlighted.feature = undefined;
        } 
        else 
        {
            Cesium.Color.clone(pickedFeature.color, selected.originalColor);
        }

        // Highlight newly selected feature
        pickedFeature.color = Cesium.Color.LIME;

        // what kind of feature was picked?
        if (pickedFeature instanceof Cesium.Cesium3DTileFeature) 
        {
          //console.log('pickedFeature is an instanceof Cesium.Cesium3DTileFeature!');
        
          // Set feature infobox description
          var featureName = pickedFeature.getProperty('name');
          
          var tilesetName = pickedFeature.tileset.name;
          
          if (tilesetName == 'Buildings')
            selectedEntity.name = 'Building'; // featureName;
          else
            selectedEntity.name = 'Feature';
          
          selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
          viewer.selectedEntity = selectedEntity;
          
          
          var dblName;
          var height;
          var dblUuid;
          
          selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>';
          var propertyNames = pickedFeature.getPropertyNames();         
          var length = propertyNames.length;
          for (var i = 0; i < length; ++i) 
          {
            var propertyName = propertyNames[i];
            
            if (propertyName == 'dbl:name')
            {
              selectedEntity.description += '<tr>';
              selectedEntity.description += '  <th>Name:</th>';
              var dblName = pickedFeature.getProperty('dbl:name');
              var re = /_/gi;
              var processedDblName = dblName.replace(re, " ");
              dblName = processedDblName;
              selectedEntity.description += '  <td>' + dblName + '</td>';
              selectedEntity.description += '</tr>';
            }
            else if (propertyName == 'height')
            {
              selectedEntity.description += '<tr>';
              selectedEntity.description += '  <th>Height:</th>';
              height = Math.round(parseFloat(pickedFeature.getProperty(propertyName)), 2);
              selectedEntity.description += '  <td>' + height + ' m</td>';
              selectedEntity.description += '</tr>';            
            }
            // else if (propertyName == 'batchId')
            // {
              // selectedEntity.description += '<tr>';
              // selectedEntity.description += '  <th>batchId:</th>';
              // selectedEntity.description += '  <td>' + pickedFeature.getProperty('batchId') + '</td>';
              // selectedEntity.description += '</tr>';            
            // }
            else if (propertyName == 'dbl:uuid')
            {
              selectedEntity.description += '<tr>';
              selectedEntity.description += '  <th>dbl:uuid:</th>';
              dblUuid = pickedFeature.getProperty('dbl:uuid');
              selectedEntity.description += '  <td>' + dblUuid + '</td>';
              selectedEntity.description += '</tr>';            
            }
            // else
            // {
              // selectedEntity.description += '<tr><th>' + propertyName + '</th><td>' + pickedFeature.getProperty(propertyName) + '</td></tr>';
            // }
          }
          selectedEntity.description += '</tbody></table>';
          
          // now update Statistics for current selection and time interval:
          
          // featureUuid: if empty, then the whole campus
          // energyDataType: 'endUsePct', 'energyUsePct'
          // timeInterval: examples: '2017', '2017-09', '2017-09-18'
          //function getEnergyDataJSONPerFeature(featureUuid, energyDataTypeId, timeInterval)
          
          GTEnergySelectionScope.innerHTML = dblName;
          annualOverviewEndUseText.innerHTML = getEnergyDataJSONPerFeature(dblUuid, 'endUsePct', '2017');
          annualOverviewEnergyUseText.innerHTML = getEnergyDataJSONPerFeature(dblUuid, 'energyUsePct', '2017');
          //annualOverviewElectricityConsumptionText.innerHTML = dblUuid + ' - electricity consumption';
          
        } // end of if (pickedFeature instanceof Cesium.Cesium3DTileFeature)
        else
        {
          //console.log('pickedFeature is NOT an instance of Cesium.Cesium3DTileFeature');
          //console.log('   add code at position 78623472634');
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    */
    
    
  
  
    // Surface Imagery (radio buttons for selecting one)
    var surfaceImageryRadioBtn_MapboxStreets = document.getElementById('surfaceImageryRadioBtn_MapboxStreets');
    surfaceImageryRadioBtn_MapboxStreets.addEventListener(
        'change', 
        function() {
            //console.log('surfaceImageryRadioBtn_MapboxStreets selected!');
            
            var layers = viewer.imageryLayers;
            var baseLayer = layers.get(0);
            layers.remove(baseLayer);
            layers.addImageryProvider(imageryProvider_MapBoxStreets);            
        }, 
        false
    );
    var surfaceImageryRadioBtn_OpenStreetMap = document.getElementById('surfaceImageryRadioBtn_OpenStreetMap');
    surfaceImageryRadioBtn_OpenStreetMap.addEventListener(
        'change', 
        function() {
            //console.log('surfaceImageryRadioBtn_OpenStreetMap selected!');
            
            var layers = viewer.imageryLayers;
            var baseLayer = layers.get(0);
            layers.remove(baseLayer);
            layers.addImageryProvider(imageryProvider_OpenStreetMap);
        }, 
        false
    );
    var surfaceImageryRadioBtn_ArcGisMapServer = document.getElementById('surfaceImageryRadioBtn_ArcGisMapServer');
    surfaceImageryRadioBtn_ArcGisMapServer.addEventListener(
        'change', 
        function() {
            //console.log('surfaceImageryRadioBtn_ArcGisMapServer selected!');
            
            var layers = viewer.imageryLayers;
            var baseLayer = layers.get(0);
            layers.remove(baseLayer);
            layers.addImageryProvider(imageryProvider_ArcGisMapServer);
        }, 
        false
    );
    var surfaceImageryRadioBtn_NaturalEarthII = document.getElementById('surfaceImageryRadioBtn_NaturalEarthII');
    surfaceImageryRadioBtn_NaturalEarthII.addEventListener(
        'change', 
        function() {
            //console.log('surfaceImageryRadioBtn_NaturalEarthII selected!');
            
            var layers = viewer.imageryLayers;
            var baseLayer = layers.get(0);
            layers.remove(baseLayer);
            layers.addImageryProvider(imageryProvider_NaturalEarthII);
        }, 
        false
    );
    
  
  
  
    var MARTA_allBusRoutes_strokeWidth = 1;
    
    //var MARTA_Bus_allRoutes_dataURL = 'http://localhost:8080/Apps/dbl-client/$HEAD/data/transit/atlanta/marta/routes.geojson';
    var MARTA_Bus_allRoutes_dataURL = 'data/transit/atlanta/marta/routes.geojson';
    
    var MARTA_Bus_allRoutes_options = {
      stroke: Cesium.Color.DARKMAGENTA, //TEAL, STEELBLUE, SLATEBLUE, PURPLE, MEDIUMORCHID, MEDIUMPURPLE, LIGHTSLATEGRAY, MIDNIGHTBLUE, MEDIUMORCHID, DARKMAGENTA, 
      fill: Cesium.Color.DARKMAGENTA, // 
      strokeWidth: MARTA_allBusRoutes_strokeWidth,
      markerSymbol: '?'
    };
    
    var MARTA_Bus_allRoutes_dataSource;
    
    var MARTA_Bus_allRoutes_dataSourcePromise = Cesium.GeoJsonDataSource.load(
      MARTA_Bus_allRoutes_dataURL, 
      MARTA_Bus_allRoutes_options).then(function(myDataSource) 
      {
        // Add it to the viewer
        viewer.dataSources.add(myDataSource);
        MARTA_Bus_allRoutes_dataSource = myDataSource;
        MARTA_Bus_allRoutes_dataSource.show = false;
        //viewer.zoomTo(MARTA_Bus_allRoutes_dataSource);
      }); 
    //viewer.dataSources.add(MARTA_metro_route_Blue_dataSourcePromise);
    //viewer.zoomTo(MARTA_metro_route_Blue_dataSourcePromise);
    
    var toggleCheckbox_MARTA_allRoutes = document.getElementById('toggleCheckbox_MARTA_allRoutes');
    toggleCheckbox_MARTA_allRoutes.addEventListener(
        'change', 
        function() 
        {
          MARTA_Bus_allRoutes_dataSource.show = toggleCheckbox_MARTA_allRoutes.checked;
          MARTA_metro_route_Blue_dataSource.show = toggleCheckbox_MARTA_allRoutes.checked;
          MARTA_metro_route_Gold_dataSource.show = toggleCheckbox_MARTA_allRoutes.checked;
          MARTA_metro_route_Green_dataSource.show = toggleCheckbox_MARTA_allRoutes.checked;
          MARTA_metro_route_Red_dataSource.show = toggleCheckbox_MARTA_allRoutes.checked;
        }, 
        false
    );    
    
    // zoom into entire MARTA coverage area, at angle
    var zoomIntoMARTAArea_link1 = document.getElementById('zoomIntoMARTAArea_link1');
    zoomIntoMARTAArea_link1.addEventListener(
        'click', 
        function() 
        {            
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees( -84.4181408716, 33.1932691056, 17827.536),
                orientation : {
                    heading : Cesium.Math.toRadians(358.427), 
                    pitch : Cesium.Math.toRadians(-21.093),
                    roll : 0.0 
                }
            });
        }, 
        false
    );
    // zoom into entire MARTA coverage area, from top
    var zoomIntoMARTAArea_link2 = document.getElementById('zoomIntoMARTAArea_link2');
    zoomIntoMARTAArea_link2.addEventListener(
        'click', 
        function() 
        {
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.6173223438, 33.7622505764, 140929.555),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-90.0),
                    roll : 0.0 
                }
            });
        }, 
        false
    );
    // zoom into MARTA coverage area, wider downtown
    var zoomIntoMARTAArea_link3 = document.getElementById('zoomIntoMARTAArea_link3');
    zoomIntoMARTAArea_link3.addEventListener(
        'click', 
        function() 
        {
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(-84.4043185442, 33.7606394394, 15098.793),
                orientation : {
                    heading : Cesium.Math.toRadians(0.0), 
                    pitch : Cesium.Math.toRadians(-90.0),
                    roll : 0.0 
                }
            });
        }, 
        false
    );
    // // zoom into MARTA coverage area, downtown
    // var zoomIntoMARTAArea_link4 = document.getElementById('zoomIntoMARTAArea_link4');
    // zoomIntoMARTAArea_link4.addEventListener(
        // 'click', 
        // function() 
        // {
            // viewer.camera.flyTo({
                // destination : Cesium.Cartesian3.fromDegrees(-84.3974612398, 33.7564100701, 6055.52),
                // orientation : {
                    // heading : Cesium.Math.toRadians(0.0), 
                    // pitch : Cesium.Math.toRadians(-90.0),
                    // roll : 0.0 
                // }
            // });
        // }, 
        // false
    // );
    // // zoom into MARTA coverage area, downtown Five Points
    // var zoomIntoMARTAArea_link5 = document.getElementById('zoomIntoMARTAArea_link5');
    // zoomIntoMARTAArea_link5.addEventListener(
        // 'click', 
        // function() 
        // {
            // viewer.camera.flyTo({
                // destination : Cesium.Cartesian3.fromDegrees(-84.3926487627, 33.7541015982, 778.07),
                // orientation : {
                    // heading : Cesium.Math.toRadians(0.0), 
                    // pitch : Cesium.Math.toRadians(-90.0),
                    // roll : 0.0 
                // }
            // });
        // }, 
        // false
    // );
    // // zoom into GT campus area
    // var zoomIntoMARTAArea_link6 = document.getElementById('zoomIntoMARTAArea_link6');
    // zoomIntoMARTAArea_link6.addEventListener(
        // 'click', 
        // function() 
        // {
            // viewer.camera.flyTo({
                // destination : Cesium.Cartesian3.fromDegrees(-84.4014763743, 33.7770395646, 4224.050),
                // orientation : {
                    // heading : Cesium.Math.toRadians(0.0), 
                    // pitch : Cesium.Math.toRadians(-90.0),
                    // roll : 0.0 
                // }
            // });
        // }, 
        // false
    // );


  
  
  
  var metroLine_strokeWidth = 4;
  // ****************************************************************************************************************************************************************
  // ****************************************************************************************************************************************************************
  // MARTA Metro, Blue line
  //var MARTA_metro_route_Blue_dataURL = 'http://localhost:8080/Apps/dbl-client/$HEAD/data/transit/atlanta/marta/metro/marta-train-route-blue.geojson';
  var MARTA_metro_route_Blue_dataURL = 'data/transit/atlanta/marta/metro/marta-train-route-blue.geojson';
  var MARTA_metro_route_Blue_options = {
    stroke: Cesium.Color.BLUE,
    fill: Cesium.Color.BLUE,
    strokeWidth: metroLine_strokeWidth,
    markerSymbol: '?'
  };
  var MARTA_metro_route_Blue_dataSource;
  var MARTA_metro_route_Blue_dataSourcePromise = Cesium.GeoJsonDataSource.load(
    MARTA_metro_route_Blue_dataURL, 
    MARTA_metro_route_Blue_options).then(function(myDataSource) 
    {
      // Add it to the viewer
      viewer.dataSources.add(myDataSource);
      myDataSource.typeSK = "Cesium.GeoJsonDataSource";
      MARTA_metro_route_Blue_dataSource = myDataSource;
      MARTA_metro_route_Blue_dataSource.show = false;
    }); 
  //viewer.dataSources.add(MARTA_metro_route_Blue_dataSourcePromise);
  //viewer.zoomTo(MARTA_metro_route_Blue_dataSourcePromise);
  
  
  // ****************************************************************************************************************************************************************
  // ****************************************************************************************************************************************************************
  // MARTA Metro, Gold line
  var MARTA_metro_route_Gold_dataURL = 'data/transit/atlanta/marta/metro/marta-train-route-gold.geojson';
  var MARTA_metro_route_Gold_options = {
    stroke: Cesium.Color.GOLDENROD,
    fill: Cesium.Color.RED,
    strokeWidth: metroLine_strokeWidth,
    markerSymbol: '?'
  };
  var MARTA_metro_route_Gold_dataSource;
  var MARTA_metro_route_Gold_dataSourcePromise = Cesium.GeoJsonDataSource.load(
    MARTA_metro_route_Gold_dataURL, 
    MARTA_metro_route_Gold_options
  ).then(function(myDataSource) 
    {
      // Add it to the viewer
      viewer.dataSources.add(myDataSource);
      MARTA_metro_route_Gold_dataSource = myDataSource;
      MARTA_metro_route_Gold_dataSource.show = false;
    }); 
  //viewer.zoomTo(MARTA_metro_route_Gold_dataSourcePromise);
  
  
  // ****************************************************************************************************************************************************************
  // ****************************************************************************************************************************************************************
  // MARTA Metro, Green line
  var MARTA_metro_route_Green_dataURL = 'data/transit/atlanta/marta/metro/marta-train-route-green.geojson';
  var MARTA_metro_route_Green_options = {
    stroke: Cesium.Color.GREEN,
    fill: Cesium.Color.GREEN,
    strokeWidth: metroLine_strokeWidth,
    markerSymbol: '?'
  };
  var MARTA_metro_route_Green_dataSource;
  var MARTA_metro_route_Green_dataSourcePromise = Cesium.GeoJsonDataSource.load(
    MARTA_metro_route_Green_dataURL, 
    MARTA_metro_route_Green_options
  ).then(function(myDataSource) 
    {
      // Add it to the viewer
      viewer.dataSources.add(myDataSource);
      MARTA_metro_route_Green_dataSource = myDataSource;
      MARTA_metro_route_Green_dataSource.show = false;
    }); 
  //viewer.zoomTo(MARTA_metro_route_Green_dataSourcePromise);


  // ****************************************************************************************************************************************************************
  // ****************************************************************************************************************************************************************
  // MARTA Metro, Red line
  var MARTA_metro_route_Red_dataURL = 'data/transit/atlanta/marta/metro/marta-train-route-red.geojson';
  var MARTA_metro_route_Red_options = {
    stroke: Cesium.Color.RED,
    fill: Cesium.Color.RED,
    strokeWidth: metroLine_strokeWidth,
    markerSymbol: '?'
  };
  var MARTA_metro_route_Red_dataSource;
  var MARTA_metro_route_Red_dataSourcePromise = Cesium.GeoJsonDataSource.load(
    MARTA_metro_route_Red_dataURL, 
    MARTA_metro_route_Red_options
  ).then(function(myDataSource) 
    {
      // Add it to the viewer
      viewer.dataSources.add(myDataSource);
      MARTA_metro_route_Red_dataSource = myDataSource;
      MARTA_metro_route_Red_dataSource.show = false;
      //viewer.zoomTo(MARTA_metro_route_Red_dataSource);
    });   

    
    
    
    var MARTA_showBusLabels = false;    
    var toggleCheckbox_MARTA_showBusLabels = document.getElementById('toggleCheckbox_MARTA_showBusLabels');
    toggleCheckbox_MARTA_showBusLabels.addEventListener(
        'change', 
        function() {
            MARTA_showBusLabels = toggleCheckbox_MARTA_showBusLabels.checked;
            showRealTimeMARTABusData();
        }, 
        false
    );
    
    

    /*
    var pinBuilder = new Cesium.PinBuilder();
    
    //var url = Cesium.buildModuleUrl('images/transit/bus32x32.png');
    var groceryPin = Cesium.when(pinBuilder.fromUrl('images/transit/bus32x32.png', Cesium.Color.YELLOW, 46), function(canvas) {
        return viewer.entities.add({
            name : 'Grocery store',
            position : Cesium.Cartesian3.fromDegrees(-84.395, 33.773523),
            billboard : {
                image : canvas.toDataURL(),
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM
            }
        });
    });
  
    //Create a pin representing a bus
    var hospitalPin = Cesium.when(pinBuilder.fromMakiIconId('bus', Cesium.Color.YELLOW, 42), function(canvas) {
        return viewer.entities.add({
            name : 'Bus 83429',
            position : Cesium.Cartesian3.fromDegrees(-84.394417, 33.773523),
            billboard : {
                image : canvas.toDataURL(),
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM
            }
        });
    });
    
    var citizensBankPark = viewer.entities.add({
        name : 'Citizens Bank Park',
        position : Cesium.Cartesian3.fromDegrees(-84.396, 33.773523),
        point : {
            pixelSize : 10,
            color : Cesium.Color.YELLOW,
            outlineColor : Cesium.Color.BLACK,
            outlineWidth : 1
        },
        label : {
            text : 'Bus 9274',
            font : '12pt sans-serif', // '12pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth : 3,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            pixelOffset : new Cesium.Cartesian2(0, -9)
        }
    });
    */
    
    

    var showRealTimeMARTABusData_turnedOn = false;
    var toggleCheckbox_MARTA_vehicles_RT = document.getElementById('toggleCheckbox_MARTA_vehicles_RT');
    toggleCheckbox_MARTA_vehicles_RT.addEventListener(
        'change', 
        function() 
        {
            if(toggleCheckbox_MARTA_vehicles_RT.checked) 
            {
              showRealTimeMARTABusData_turnedOn = true;
            } 
            else 
            {
              showRealTimeMARTABusData_turnedOn = false;
              document.getElementById('realTimeBusLocationsSwitchLabel').innerHTML = '&nbsp;Real-time bus locations';
              
            } 
            
            showRealTimeMARTABusData();            
        }, 
        false
    );    
    


    // arrays containing loaded bus RT data
    var vehicleEntities = [];
    var vehicleEntities_needAnimation = [];
    
    
    // animate bus glyphs/symbols:    
    var animationRequestID;
    var animationCurrentPercentage = 0;
    
    function animateBuses(highResTimestamp) // // highResTimestamp: a high resolution timestamp (DOMHighResTimeStamp)
    {
      console.log('animateBuses(highResTimestamp), highResTimestamp = ', highResTimestamp);
      animationRequestID = requestAnimationFrame(animateBuses);
      
      if (animationCurrentPercentage < 100)
      {
        for(var i = 0; i < vehicleEntities_needAnimation.length; i++) 
        {
          var LONGITUDE_prev = vehicleEntities_needAnimation[i].LONGITUDE_prev;
          var LATITUDE_prev = vehicleEntities_needAnimation[i].LATITUDE_prev;

          var LONGITUDE_next = vehicleEntities_needAnimation[i].LONGITUDE;
          var LATITUDE_next = vehicleEntities_needAnimation[i].LATITUDE;
          
          var LONGITUDE_delta = LONGITUDE_next - LONGITUDE_prev;
          var LATITUDE_delta = LATITUDE_next - LATITUDE_prev;

          var LONGITUDE_animated = LONGITUDE_prev + ( animationCurrentPercentage / 100.0 ) * LONGITUDE_delta;
          var LATITUDE_animated  = LATITUDE_prev  + ( animationCurrentPercentage / 100.0 ) * LATITUDE_delta;
                            
          vehicleEntities_needAnimation[i].position = Cesium.Cartesian3.fromDegrees( 
            parseFloat(LONGITUDE_animated), 
            parseFloat(LATITUDE_animated) );
        }
    
        animationCurrentPercentage++;
      }
      else
      {
        console.log('  cancelAnimationFrame(animationRequestID);');
        cancelAnimationFrame(animationRequestID);
      }
    }
    

    
    //
    // http://easings.net/#easeInOutQuart
    //  t: current time
    //  b: beginning value
    //  c: change in value
    //  d: duration
    //
    function easeInOutQuart(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
    
    function easeOutSine(t, b, c, d) 
    {
      return c * Math.sin(t/d * (Math.PI/2)) + b;
    }
    
    function showRealTimeMARTABusData()
    {
      //console.log('===============================================================================');
      
      if (showRealTimeMARTABusData_turnedOn)
      {       
        //console.log('showRealTimeMARTABusData() called, and showRealTimeMARTABusData_turnedOn = TRUE');
        
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function() 
        {
          if (this.readyState == 4 && this.status == 200) 
          {
            //document.getElementById("demo").innerHTML = this.responseText;
            
            var current_MARTA_RT_bus_JSON_data = JSON.parse(this.responseText);
            
            /*
            var current_MARTA_RT_bus_JSON_data = [
              {
                "ADHERENCE": "0",
                "BLOCKID": "26",
                "BLOCK_ABBR": "110-3",
                "DIRECTION": "Southbound",
                "LATITUDE": "33.792612",
                "LONGITUDE": "-84.3864473",
                "MSGTIME": "2\/8\/2018 4:00:30 PM",
                "ROUTE": "110",
                "STOPID": "900644",
                "TIMEPOINT": "Peachtree Rd & Peachtree Hills",
                "TRIPID": "5959484",
                "VEHICLE": "1608"
              }, 
              ....
            ];
            */
            
            document.getElementById('realTimeBusLocationsSwitchLabel').innerHTML = '&nbsp;Real-time bus locations (<b>' + current_MARTA_RT_bus_JSON_data.length + '</b> buses active)';
            
            
            vehicleEntities = [];
            vehicleEntities_needAnimation = [];
            
            for(var i = 0; i < current_MARTA_RT_bus_JSON_data.length; i++) 
            {
                var obj = current_MARTA_RT_bus_JSON_data[i];
                // {
                  // "ADHERENCE": "0",
                  // "BLOCKID": "26",
                  // "BLOCK_ABBR": "110-3",
                  // "DIRECTION": "Southbound",
                  // "LATITUDE": "33.792612",
                  // "LONGITUDE": "-84.3864473",
                  // "MSGTIME": "2\/8\/2018 4:00:30 PM",
                  // "ROUTE": "110",
                  // "STOPID": "900644",
                  // "TIMEPOINT": "Peachtree Rd & Peachtree Hills",
                  // "TRIPID": "5959484",
                  // "VEHICLE": "1608"
                // }, 
                
                // //console.log("Vehicle: ", obj.VEHICLE);
                // //console.log("  LONGITUDE: ", obj.LONGITUDE);
                // //console.log("  LATITUDE: ", obj.LATITUDE);
                // //console.log("  MSGTIME: ", obj.MSGTIME);
                            
                var vehicleEntity_options;
                
                if (MARTA_showBusLabels)
                {
                    vehicleEntity_options = {
                        name : 'Bus ' + obj.VEHICLE,
                        id: 'bus'+ obj.VEHICLE, 
                        position : Cesium.Cartesian3.fromDegrees( parseFloat(obj.LONGITUDE), parseFloat(obj.LATITUDE) ),
                        point : {
                            pixelSize : 10,
                            color : Cesium.Color.YELLOW,
                            outlineColor : Cesium.Color.BLACK,
                            outlineWidth : 1
                        },
                        label : {
                            text : 'Bus ' + obj.VEHICLE,
                            font : '12pt sans-serif', // '12pt monospace',
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth : 2.5,
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset : new Cesium.Cartesian2(0, -9)
                        },
                        LONGITUDE: obj.LONGITUDE,
                        LATITUDE: obj.LATITUDE,
                    };
                }
                else
                {
                    vehicleEntity_options = {
                        name : 'Bus ' + obj.VEHICLE,
                        id: 'bus'+ obj.VEHICLE, 
                        position : Cesium.Cartesian3.fromDegrees( parseFloat(obj.LONGITUDE), parseFloat(obj.LATITUDE) ),
                        point : {
                            pixelSize : 10,
                            color : Cesium.Color.YELLOW,
                            outlineColor : Cesium.Color.BLACK,
                            outlineWidth : 1
                        },
                        LONGITUDE: obj.LONGITUDE,
                        LATITUDE: obj.LATITUDE,
                    };
                }
                
                var vehicleEntity = new Cesium.Entity(vehicleEntity_options);
                
                // add three new properties to vehicleEntity:
                // vehicleEntity.LONGITUDE = obj.LONGITUDE;
                // vehicleEntity.LATITUDE  = obj.LATITUDE;
                // vehicleEntity.needsAnimation = false;
                
                
                //console.log('loop, i = ', i);
                //console.log('  vehicleEntity.id = ', vehicleEntity.id);
                
                
                ////////////////////////////////////////////////////////////////////////////////
                // set LONGITUDE_prev, LATITUDE_prev for the current vehicleEntity:
                
                // console.log('-----');
                // console.log('setting LONGITUDE_prev, LATITUDE_prev for current vehicleEntity:')                
                
                // check if an entity with the same id already exists in the scene/viewer:
                var existingBusEntity = viewer.entities.getById(vehicleEntity.id); // e.g. 'bus1613'
                
                // console.log('  existingBusEntity: ', existingBusEntity);
                
                if (existingBusEntity == undefined)
                {
                  // console.log('  we are in case: (existingBusEntity == undefined)');
                  
                  // an entity with the id does not exist yet, so set _prev to the **current** LON, LAT
                  vehicleEntity.LONGITUDE_prev = obj.LONGITUDE;
                  vehicleEntity.LATITUDE_prev = obj.LATITUDE;
                  vehicleEntity.needsAnimation = false; // reconfirm that this case doesn't need animation
                }
                else
                {
                  //console.log('  we are in case: (existingBusEntity != undefined)');
                  
                  // an entity with the id (e.g. 'bus2330') already exists!, so set _prev to the current 
                  vehicleEntity.LONGITUDE_prev = existingBusEntity.LONGITUDE;
                  vehicleEntity.LATITUDE_prev = existingBusEntity.LATITUDE;
                  
                  // console.log('    vehicleEntity.LONGITUDE_prev: ', vehicleEntity.LONGITUDE_prev);
                  // console.log('    vehicleEntity.LONGITUDE: ', vehicleEntity.LONGITUDE);
                  // console.log('    vehicleEntity.LATITUDE_prev: ', vehicleEntity.LATITUDE_prev);
                  // console.log('    vehicleEntity.LATITUDE: ', vehicleEntity.LATITUDE);
                  
                  if (
                    vehicleEntity.LONGITUDE_prev != vehicleEntity.LONGITUDE || 
                    vehicleEntity.LATITUDE_prev != vehicleEntity.LATITUDE )
                  {
                    //console.log('      we are in subcase A - needs animation');
                    vehicleEntity.needsAnimation = true;  
                    vehicleEntities_needAnimation.push(vehicleEntity);
                  }
                  else
                  {
                    //console.log('      we are in subcase B - does not need animation');
                    vehicleEntity.needsAnimation = false;
                  }
                    
                }                  

                // finally, add the entity:
                vehicleEntities.push(vehicleEntity);
            }

            
            // clear all entities:
            viewer.entities.removeAll();
            
            // first add entities that need no animation
            for(var i = 0; i < vehicleEntities.length; i++) 
            {
              // if (vehicleEntities[i].needsAnimation == false)
                // viewer.entities.add(vehicleEntities[i]);
              viewer.entities.add(vehicleEntities[i]);
            }                        
            
            
            // console.log('=========================================');
            // console.log('vehicleEntities_needAnimation.length: ', vehicleEntities_needAnimation.length);
            
            
            /*
            // now add (and animate) entities that need animation, i.e., entities that were changed in position
            if (vehicleEntities_needAnimation.length > 0)
            {
              for(var i = 0; i < vehicleEntities_needAnimation.length; i++) 
              {              
                //var tempVehicleEntity  = viewer.entities.getById(vehicleEntities_needAnimation[i].id); // e.g. 'bus1613'
                var tempVehicleEntity  = vehicleEntities_needAnimation[i];
                               
                var from_LON     = tempVehicleEntity.LONGITUDE_prev;  
                var to_LON       = tempVehicleEntity.LONGITUDE;  
                var from_LAT     = tempVehicleEntity.LATITUDE_prev;  
                var to_LAT       = tempVehicleEntity.LATITUDE;
                
                tempVehicleEntity.position = Cesium.Cartesian3.fromDegrees( 
                  parseFloat(from_LON), 
                  parseFloat(from_LAT) );
                  
                viewer.entities.add(tempVehicleEntity);
                
                var duration = 2500; // in ms
                var start = new Date().getTime();
                
                var timer = setInterval(
                  function() 
                  {
                    var time = new Date().getTime() - start;
                    
                    var LONGITUDE_animated = easeOutSine( //easeInOutQuart(
                      time, 
                      from_LON, 
                      to_LON - from_LON, 
                      duration);
                    var LATITUDE_animated = easeOutSine( //easeInOutQuart(
                      time, 
                      from_LAT, 
                      to_LAT - from_LAT, 
                      duration);
                    
                    tempVehicleEntity.position = Cesium.Cartesian3.fromDegrees( 
                      parseFloat(LONGITUDE_animated), 
                      parseFloat(LATITUDE_animated) );
                    
                    if (time >= duration) 
                      clearInterval(timer);
                  }, 
                  1000 / 60
                ); // end of var timer = setInterval(...
                
              }

            }
            */
            
              // now animate the vehicle entities that need animating:
              //console.log('  vehicleEntities_needAnimation: ', vehicleEntities_needAnimation);
              
              // // Start the animation.
              // animationCurrentPercentage = 0;
              // requestAnimationFrame(animateBuses);
              // // Note SK: The requestAnimationFrame method will return a requestID that can be used for cancelling the scheduled animation frame.
              
              /*
              var animationCurrentPercentage = 0;
              var duration = 500; // 500ms
              while (animationCurrentPercentage < 100)
              {
                for(var i = 0; i < vehicleEntities_needAnimation.length; i++) 
                {
                  var LONGITUDE_prev = vehicleEntities_needAnimation[i].LONGITUDE_prev;
                  var LATITUDE_prev = vehicleEntities_needAnimation[i].LATITUDE_prev;

                  var LONGITUDE_next = vehicleEntities_needAnimation[i].LONGITUDE;
                  var LATITUDE_next = vehicleEntities_needAnimation[i].LATITUDE;
                  
                  var LONGITUDE_delta = LONGITUDE_next - LONGITUDE_prev;
                  var LATITUDE_delta = LATITUDE_next - LATITUDE_prev;

                  var LONGITUDE_animated = LONGITUDE_prev + ( animationCurrentPercentage / 100.0 ) * LONGITUDE_delta;
                  var LATITUDE_animated  = LATITUDE_prev  + ( animationCurrentPercentage / 100.0 ) * LATITUDE_delta;
                                    
                  vehicleEntities_needAnimation[i].position = Cesium.Cartesian3.fromDegrees( 
                    parseFloat(LONGITUDE_animated), 
                    parseFloat(LATITUDE_animated) );
                }
            
                animationCurrentPercentage++;                             
              }
              */
                            
            //}

            
            /*
            var animSteps = 500;
            for (var animStep = 0; animStep < animSteps; animStep++)
            {
              //console.log('animStep: ', animStep);
              // clear all entities:
              viewer.entities.removeAll();
              
              // add entities
              for(var i = 0; i < vehicleEntities_needAnimation.length; i++) 
              {
                var LONGITUDE_prev = vehicleEntities_needAnimation[i].LONGITUDE_prev;
                var LATITUDE_prev = vehicleEntities_needAnimation[i].LATITUDE_prev;

                var LONGITUDE_next = vehicleEntities_needAnimation[i].LONGITUDE;
                var LATITUDE_next = vehicleEntities_needAnimation[i].LATITUDE;
                
                var LONGITUDE_delta = LONGITUDE_next - LONGITUDE_prev;
                var LATITUDE_delta = LATITUDE_next - LATITUDE_prev;

                var LONGITUDE_animated = LONGITUDE_prev + ( (1.0 * animStep) / animSteps) * LONGITUDE_delta;
                var LATITUDE_animated = LATITUDE_prev + ( (1.0 * animStep) / animSteps) * LATITUDE_delta;
                                  
                vehicleEntities_needAnimation[i].position = Cesium.Cartesian3.fromDegrees( 
                  parseFloat(LONGITUDE_animated), 
                  parseFloat(LATITUDE_animated) );

                viewer.entities.add(vehicleEntities_needAnimation[i]);
              }                        
            }
            */
            
            // call this function again, after a timeout:
            var timeout_ms = 3000;
            setTimeout(showRealTimeMARTABusData, 5000);
            
          }
        };
        
        //xhttp.open("GET", 'http://localhost:8080/Apps/dbl-client/$HEAD/data/transit/atlanta/marta/current-bus-locations.json', true);
        xhttp.open("GET", 'data/transit/atlanta/marta/current-bus-locations.json', true);
        xhttp.send();        
      }
      else
      {
        //console.log('showRealTimeMARTABusData() called, but with showRealTimeMARTABusData_turnedOn = FALSE');
        //console.log('NOOP, exiting showRealTimeMARTABusData()');
        
        // clear all entities:
        viewer.entities.removeAll();       
        
      }    
    }   
    


    // https://refreshless.com/nouislider/
    menuPanelOpacitySlider.noUiSlider.on(
      'update', 
      function( values, handle ) 
      {
        //document.getElementById('slider-value-min-height').innerHTML = Math.round(values[handle]) + ' m ≈ ' + Math.round(values[handle] * 3.2808) + ' ft';
        
        //var opacity = values[0];
        var opacity = values[handle]; // equals opacity
        
        updateMenuPanelOpacity(opacity);        
      }
    );
    
    
    // GT, Caddell, -84.404000,33.770000 
    var longitude = -1.47312767672;
    var latitude = 0.58939767834;
    var height = 0.0;

    var matrix = Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromRadians(longitude, latitude, height), new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0));
    

    //console.log('matrix: ', matrix);
    
    
       
  
}());

