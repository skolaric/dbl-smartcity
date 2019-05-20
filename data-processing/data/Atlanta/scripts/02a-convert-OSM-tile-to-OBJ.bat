rem Very small area around Five Points (for testing purposes):
rem 
rem 02a-convert-OSM-tile-to-OBJ.bat -84.394635 33.751115 -84.388637 33.756280
rem 
rem This is: -84.394635 33.751115 = 84°23'40.7"W  33°45'04.0"N 
rem ----> X, Y, Z (in meters) = 518527.76724968, -5283261.28526402, 3523526.39818424 (see http://www.apsalin.com/convert-geodetic-to-cartesian.aspx)
rem 
rem 02a-convert-OSM-tile-to-OBJ.bat -84.420000 33.740000 -84.400000 33.760000
rem 02a-convert-OSM-tile-to-OBJ.bat -84.400000 33.740000 -84.380000 33.760000
rem 02a-convert-OSM-tile-to-OBJ.bat -84.380000 33.740000 -84.360000 33.760000
rem 02a-convert-OSM-tile-to-OBJ.bat -84.360000 33.740000 -84.340000 33.760000
set arg1=%1
set arg2=%2
set arg3=%3
set arg4=%4
java -Xmx512m -jar "./../../../tools/OSM2World/OSM2World.jar" ^
  -i "./../tileset-3d/tile-buildings(%arg1%,%arg2%,%arg3%,%arg4%).osm" ^
  -o "./../tileset-3d/tile-buildings(%arg1%,%arg2%,%arg3%,%arg4%).osm.obj" ^
  --config "02b-osm2world.config"