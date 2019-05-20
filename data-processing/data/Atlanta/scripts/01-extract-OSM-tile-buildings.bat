rem Very small area around Five Points (for testing purposes):
rem 01-extract-OSM-tile-buildings.bat -84.394635 33.751115 -84.388637 33.756280
rem 
rem 01-extract-OSM-tile-buildings.bat -84.420000 33.740000 -84.400000 33.760000
rem 01-extract-OSM-tile-buildings.bat -84.400000 33.740000 -84.380000 33.760000
rem 01-extract-OSM-tile-buildings.bat -84.380000 33.740000 -84.360000 33.760000
rem 01-extract-OSM-tile-buildings.bat -84.360000 33.740000 -84.340000 33.760000
rem 
rem 01-extract-OSM-tile-buildings.bat -84.410000 33.750000 -84.400000 33.760000
set arg1=%1
set arg2=%2
set arg3=%3
set arg4=%4
./../../../tools/osmosis/bin/osmosis ^
  --read-pbf file="./../data.osm.pbf" ^
  --tag-filter reject-relations ^
  --tag-filter accept-ways building=* ^
  --tag-filter reject-nodes entrance=* ^
  --tag-filter reject-ways building=entrance ^
  --used-node ^
  --bounding-box left=%arg1% bottom=%arg2% right=%arg3% top=%arg4% ^
  --write-xml file="./../tileset-3d/tile-buildings(%arg1%,%arg2%,%arg3%,%arg4%).osm"
  
  
  