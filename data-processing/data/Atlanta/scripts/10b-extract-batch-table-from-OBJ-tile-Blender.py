import bpy
import os
import mathutils
import math
import sys
import uuid

print()
print("========================================================================================================================================")
print("This is Blender Python script that extracts CustomBatchTable.json and TilesetOptions.json from OBJ tile, for processing with obj23dtiles")
print("Author: Sinisa Kolaric")
print()

# Example: 10a-extract-batch-table-from-OBJ-tile.bat -84.390000 33.760000 -84.380000 33.770000

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get all args after "--" 
print("Passed-in arguments: ")
print(argv)  # should be ['-84.360000', '33.740000', '-84.340000', '33.760000']

tile_west_deg  = float(argv[0])
tile_south_deg = float(argv[1])
tile_east_deg  = float(argv[2])
tile_north_deg = float(argv[3])

tile_west_rad  = tile_west_deg * math.pi / 180.0;
tile_south_rad = tile_south_deg * math.pi / 180.0;
tile_east_rad  = tile_east_deg * math.pi / 180.0;
tile_north_rad = tile_north_deg * math.pi / 180.0;

tile_center_LON_deg = (tile_west_deg + tile_east_deg) / 2.0;
tile_center_LON_rad = (tile_west_rad + tile_east_rad) / 2.0;

tile_center_LAT_deg = (tile_south_deg + tile_north_deg) / 2.0;
tile_center_LAT_rad = (tile_south_rad + tile_north_rad) / 2.0;

tile_dx_deg = abs(tile_east_deg - tile_west_deg)
tile_dy_deg = abs(tile_north_deg - tile_south_deg)

tile_dx_rad = abs(tile_east_rad - tile_west_rad)
tile_dy_rad = abs(tile_north_rad - tile_south_rad)


def radians(angleDegrees):
  return angleDegrees * 3.1415926 / 180.0

def haversine(lat1, lon1, lat2, lon2):
 
  #R = 6372.8 # Earth radius in kilometers
  R = 6378137
 
  dLat = radians(lat2 - lat1)
  dLon = radians(lon2 - lon1)
  lat1 = radians(lat1)
  lat2 = radians(lat2)
 
  a = math.sin(dLat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dLon/2)**2
  c = 2*math.asin(math.sqrt(a))
 
  # distance in m:
  return R * c

  
tile_dx_meters = haversine(tile_west_deg, tile_south_deg, tile_east_deg, tile_south_deg)
tile_dy_meters = haversine(tile_west_deg, tile_south_deg, tile_west_deg, tile_north_deg)

print('tile_dx_meters: ', tile_dx_meters)
print('tile_dy_meters: ', tile_dy_meters)



a = 6378137
f = 0.00335281066 #1/298.257223563
b = 6356752.31424518 # a*(1-f)
e  = math.sqrt((a*a - b*b)/(a*a))
e2 = math.sqrt((a*a - b*b)/(b*b))

def WGS84_to_ECEF(lon, lat, alt): # See: https://microem.ru/files/2012/08/GPS.G1-X-00006.pdf
    N = a/math.sqrt( 1 - e*e*math.sin(lat)*math.sin(lat) )
    x = ( N + alt ) * math.cos(lat) * math.cos(lon)
    y = ( N + alt ) * math.cos(lat) * math.sin(lon)
    z = ( ((b*b)/(a*a)) * N + alt ) * math.sin(lat)
    return x, y, z
 
def ECEF_to_WGS84(x, y, z): # See: https://stackoverflow.com/questions/1185408/converting-from-longitude-latitude-to-cartesian-coordinates/1185413#1185413
    lon = -84.394635
    lat =  33.751115
    return lon, lat

tile_center_ECEF    = WGS84_to_ECEF(tile_center_LON_rad, tile_center_LAT_rad, 0.0) # returns x, y, z
 
 
vertices = []
normals = []
texcoords = []
faces = []

full_path_to_import_file = "..\\tileset-3d\\tile-buildings(" + argv[0] + "," + argv[1] + "," + argv[2] + "," + argv[3] + ").osm.obj.postprocessed.obj";
print("Full path to import file: ", full_path_to_import_file)

material = None

lx = [] # list of objects x locations
ly = [] # list of objects y locations
lz = [] # list of objects z locations 

batchIDs = []
featureNames = []
featureUUIDs = []
heights = []
longitudes = []
latitudes = []

featureCounter = 0
lineCounter = 0

# Pass 1
for line in open(full_path_to_import_file, "r"):  

  #print('line nr: ', lineCounter)
  lineCounter = lineCounter + 1
  
  if line.startswith('#'): 
    continue

  if line.startswith('g'): # Ignored for now
    continue
    
  values = line.split()
  
  if not values: 
    continue
    
  if values[0] == 'o':  
    batchIDs.append(featureCounter)
    featureNames.append( line[ 11 : len(line[2:])+1 ])
    featureUUIDs.append( str( uuid.uuid4() ) )  
    
    if (featureCounter > 0):
      bb_west = min(lx)
      bb_south = min(lz)
      bb_east = max(lx)
      bb_north = max(lz)
      bb_bottom = min(ly)
      bb_top = max(ly)
      
      heights.append( bb_top )
      
      
      bb_center_x = (bb_west + bb_east) / 2.0
      bb_center_y = (bb_south + bb_north) / 2.0
      
      pct_x = ( (bb_center_x + tile_dx_meters/2.0) ) / tile_dx_meters
      pct_y = ( (bb_center_y + tile_dy_meters/2.0) ) / tile_dy_meters
      
      # print()
      # print('bb_center_x, tile_dx_meters/2.0: ', bb_center_x, tile_dx_meters/2.0)
      # print('( (bb_center_x + tile_dx_meters/2.0) ): ', ( (bb_center_x + tile_dx_meters/2.0) ))
      # print('pct_x, pct_y: ', pct_x, pct_y)
      # print('tile_west_deg, tile_south_deg: ', tile_west_deg, tile_south_deg)
      # print('tile_dx_deg, tile_dy_deg: ', tile_dx_deg, tile_dy_deg)
      # print('tile_dx_deg*pct_x, tile_dy_deg*pct_y: ', tile_dx_deg*pct_x, tile_dy_deg*pct_y)
      # print('tile_west_deg + tile_dx_deg*pct_x, tile_south_deg + tile_dy_deg*pct_y: ', tile_west_deg + tile_dx_deg*pct_x, tile_south_deg + tile_dy_deg*pct_y)
      
      longitudes.append(tile_west_deg + tile_dx_deg*pct_x)
      latitudes.append(tile_south_deg + tile_dy_deg*pct_y)
      
      
      
      # tile_center_ECEF.x, tile_center_ECEF.y

    # reset lists:
    lx = []
    ly = []
    lz = []
      
    featureCounter = featureCounter + 1
  
  if values[0] == 'v':
    #v = map(float, values[1:4])
    # if swapyz:
      # v = v[0], v[2], v[1]
    #vertices.append(v)
    x = float(values[1])
    y = float(values[2])
    z = float(values[3])
    lx.append(x)
    ly.append(y)
    lz.append(z)
    
# for the last o element:

# Height:
bb_top = max(ly)
heights.append( bb_top )

# Lon, lat:
pct_x = ( (bb_center_x + tile_dx_meters/2.0) ) / tile_dx_meters
pct_y = ( (bb_center_y + tile_dy_meters/2.0) ) / tile_dy_meters

longitudes.append(tile_west_deg + tile_dx_deg*pct_x)
latitudes.append(tile_south_deg + tile_dy_deg*pct_y)

    
# print()
# print('featureNames: ', featureNames)
print()
print('len(featureNames): ', len(featureNames))


count_objects = featureCounter

#######################################################################################################################
#######################################################################################################################
# build customBatchtable.json for this tile:
customBatchtable_json = '{\n'

######################################################
# first the batchId array:
customBatchtable_json += '  "batchId": [ \n'
for i in range(0, count_objects):
    if ( i < (count_objects-1) ):
        customBatchtable_json += str( batchIDs[i] ) + ', '
    else:
        customBatchtable_json += str( batchIDs[i] ) # last batchId in the array, so no comma at end       
customBatchtable_json += '], \n'

######################################################
# then the dbl:name array:
customBatchtable_json += '  "dbl:name": [ \n'
for i in range(0, count_objects):      
    if ( i < (count_objects-1) ):
        tempFeatureName = featureNames[i]
        if (tempFeatureName == ""):
            customBatchtable_json += '"feature", '
        else:
            customBatchtable_json += '"' + tempFeatureName + '", '        
    else:
        customBatchtable_json += '"' + featureNames[i] + '"'  # last uuid in the array, so no comma at end
customBatchtable_json += '], \n'
    
######################################################
# then the dbl:uuid array:
customBatchtable_json += '  "dbl:uuid": [ \n'
for i in range(0, count_objects):    
    if ( i < (count_objects-1) ):
        customBatchtable_json += '"' + featureUUIDs[i] + '", '
    else:
        customBatchtable_json += '"' + featureUUIDs[i] + '"'  # last uuid in the array, so no comma at end
customBatchtable_json += '], \n'

######################################################
# height array:
customBatchtable_json += '  "dbl:height": [ \n'
for i in range(0, count_objects):
    if ( i < (count_objects-1) ):
        customBatchtable_json += str( heights[i] ) + ', '
    else:
        customBatchtable_json += str( heights[i] ) # last batchId in the array, so no comma at end       
customBatchtable_json += '] \n'

# ######################################################
# # longitudes array:
# customBatchtable_json += '  "dbl:longitude": [ \n'
# for i in range(0, count_objects):
    # if ( i < (count_objects-1) ):
        # customBatchtable_json += '"' + str( longitudes[i] ) + '", '
    # else:
        # customBatchtable_json += '"' + str( longitudes[i] ) + '"'# last batchId in the array, so no comma at end       
# customBatchtable_json += '], \n'

# ######################################################
# # latitudes array:
# customBatchtable_json += '  "dbl:latitude": [ \n'
# for i in range(0, count_objects):
    # if ( i < (count_objects-1) ):
        # customBatchtable_json += '"' + str( latitudes[i] ) + '", '
    # else:
        # customBatchtable_json += '"' + str( latitudes[i] ) + '"' # last batchId in the array, so no comma at end       
# customBatchtable_json += '] \n'

customBatchtable_json += '}'

# Example: tile-buildings(-84.394635,33.751115,-84.388637,33.756280).osm.obj.postprocessed.obj-customBatchtable.json
print()
print('Writing customBatchtable.json...')
customBatchtable_json_output_file_path = "..\\tileset-3d\\tile-buildings(" + argv[0] + "," + argv[1] + "," + argv[2] + "," + argv[3] + ").osm.obj.postprocessed.obj-customBatchtable.json";
customBatchtable_json_output_file = open(customBatchtable_json_output_file_path,'w')
customBatchtable_json_output_file.write(customBatchtable_json)
customBatchtable_json_output_file.close()
print(customBatchtable_json_output_file_path)



#######################################################################################################################
#######################################################################################################################
# build customTilesetOptions.json for this tile:
customTilesetOptions_json  = '{\n'
customTilesetOptions_json += '    "longitude":      ' + str(tile_center_LON_rad) + ',\n' # center.lon of the tile
customTilesetOptions_json += '    "latitude":       ' + str(tile_center_LAT_rad) + ',\n'  # center.lat of the tile
customTilesetOptions_json += '    "transHeight":    0.0,\n'
customTilesetOptions_json += '    "region":         true,\n'
customTilesetOptions_json += '    "box":            false,\n'
customTilesetOptions_json += '    "sphere":         false\n'
customTilesetOptions_json += '}'
# Example: tile-buildings(-84.394635,33.751115,-84.388637,33.756280).osm.obj.postprocessed.obj-customTilesetOptions.json
print()
print('Writing customTilesetOptions.json...')
customTilesetOptions_json_output_file_path = "..\\tileset-3d\\tile-buildings(" + argv[0] + "," + argv[1] + "," + argv[2] + "," + argv[3] + ").osm.obj.postprocessed.obj-customTilesetOptions.json";
customTilesetOptions_json_output_file = open(customTilesetOptions_json_output_file_path, 'w')
customTilesetOptions_json_output_file.write(customTilesetOptions_json)
customTilesetOptions_json_output_file.close()
print(customTilesetOptions_json_output_file_path)



quit()



# See: https://microem.ru/files/2012/08/GPS.G1-X-00006.pdf
a = 6378137
f = 0.00335281066 #1/298.257223563
b = 6356752.31424518 # a*(1-f)
e  = math.sqrt((a*a - b*b)/(a*a))
e2 = math.sqrt((a*a - b*b)/(b*b))
def WGS84_to_ECEF(lon, lat, alt):
    N = a/math.sqrt( 1 - e*e*math.sin(lat)*math.sin(lat) )
    x = ( N + alt ) * math.cos(lat) * math.cos(lon)
    y = ( N + alt ) * math.cos(lat) * math.sin(lon)
    z = ( ((b*b)/(a*a)) * N + alt ) * math.sin(lat)
    return x, y, z
   
full_path_to_import_file = "..\\tileset-3d\\tile-buildings(" + argv[0] + "," + argv[1] + "," + argv[2] + "," + argv[3] + ").osm.obj.postprocessed.obj";
print("Full path to import file: ", full_path_to_import_file)

tile_west_deg  = float(argv[0])
tile_south_deg = float(argv[1])
tile_east_deg  = float(argv[2])
tile_north_deg = float(argv[3])
tile_west_rad  = tile_west_deg * math.pi / 180.0;
tile_south_rad = tile_south_deg * math.pi / 180.0;
tile_east_rad  = tile_east_deg * math.pi / 180.0;
tile_north_rad = tile_north_deg * math.pi / 180.0;

tile_center_LON_deg = (tile_west_deg + tile_east_deg) / 2.0;
tile_center_LAT_deg = (tile_south_deg + tile_north_deg) / 2.0;
tile_center_LON_rad = (tile_west_rad + tile_east_rad) / 2.0;
tile_center_LAT_rad = (tile_south_rad + tile_north_rad) / 2.0;

# Notes:
# x) osm2world exports OBJ with origin at the center of export bounding box: O = (W+E)/2, (S+N)/2
# x) however, b3dm files must have coordinates in ECEF
# x) thus, all vertices in the OBJ export must be translated by vector O
####################################################################################
####################################################################################
tile_center_ECEF    = WGS84_to_ECEF(tile_center_LON_rad, tile_center_LAT_rad, 0.0) # returns x, y, z
####################################################################################
####################################################################################

bpy.ops.import_scene.obj(filepath=full_path_to_import_file)

# make sure to get all imported objects
obj_objects = bpy.context.selected_objects[:]

count_objects = len(bpy.context.selected_objects)
print("Count of selected objects (bpy.context.selected_objects): ", count_objects)

batchIDs = []
featureNames = []
featureUUIDs = []

lx = [] # list of objects x locations
ly = [] # list of objects y locations
lz = [] # list of objects z locations 

# iterate through all objects
counter = 0
for obj in obj_objects:

    batchIDs.append(counter)
    featureNames.append(obj.name)
    featureUUIDs.append( str( uuid.uuid4() ) )
    
    mesh = obj.data
    # print ("    len(obj.data.vertices): ", len(mesh.vertices))
    for v in mesh.vertices:
        # v.co.x = v.co.x + tile_center_ECEF[0]
        # v.co.y = v.co.y + tile_center_ECEF[1]
        # v.co.z = v.co.z + tile_center_ECEF[2]
        lx.append(v.co.x)
        ly.append(v.co.y)
        lz.append(v.co.z)

    counter = counter + 1
        
bb_west = min(lx)
bb_south = min(lz)
bb_east = max(lx)
bb_north = max(lz)
bb_bottom = min(ly)
bb_top = max(ly)
#print ("Tile BB (west, south, east, north, bottom, top): ", bb_west, bb_south, bb_east, bb_north, bb_bottom, bb_top)
        

#######################################################################################################################
#######################################################################################################################
# build customBatchtable.json for this tile:
customBatchtable_json = '{\n'

######################################################
# first the batchId array:
customBatchtable_json += '  "batchId": [ \n'
for i in range(0, count_objects):
    if ( i < (count_objects-1) ):
        customBatchtable_json += str( batchIDs[i] ) + ', '
    else:
        customBatchtable_json += str( batchIDs[i] ) # last batchId in the array, so no comma at end       
customBatchtable_json += '], \n'

######################################################
# then the dbl:name array:
customBatchtable_json += '  "dbl:name": [ \n'
for i in range(0, count_objects):    
    if ( i < (count_objects-1) ):
        customBatchtable_json += '"' + featureNames[i] + '", '
    else:
        customBatchtable_json += '"' + featureNames[i] + '"'  # last uuid in the array, so no comma at end
customBatchtable_json += '], \n'
    
######################################################
# then the dbl:uuid array:
customBatchtable_json += '  "dbl:uuid": [ \n'
for i in range(0, count_objects):    
    if ( i < (count_objects-1) ):
        customBatchtable_json += '"' + featureUUIDs[i] + '", '
    else:
        customBatchtable_json += '"' + featureUUIDs[i] + '"'  # last uuid in the array, so no comma at end
customBatchtable_json += '] \n'

customBatchtable_json += '}'

# Example: tile-buildings(-84.394635,33.751115,-84.388637,33.756280).osm.obj.postprocessed.obj-customBatchtable.json
print()
print('Writing customBatchtable.json...')
customBatchtable_json_output_file_path = "..\\tileset-3d\\tile-buildings(" + argv[0] + "," + argv[1] + "," + argv[2] + "," + argv[3] + ").osm.obj.postprocessed.obj-customBatchtable.json";
customBatchtable_json_output_file = open(customBatchtable_json_output_file_path,'w')
customBatchtable_json_output_file.write(customBatchtable_json)
customBatchtable_json_output_file.close()
print(customBatchtable_json_output_file_path)



#######################################################################################################################
#######################################################################################################################
# build customTilesetOptions.json for this tile:
customTilesetOptions_json  = '{\n'
customTilesetOptions_json += '    "longitude":      ' + str(tile_center_LON_rad) + ',\n' # center.lon of the tile
customTilesetOptions_json += '    "latitude":       ' + str(tile_center_LAT_rad) + ',\n'  # center.lat of the tile
customTilesetOptions_json += '    "transHeight":    0.0,\n'
customTilesetOptions_json += '    "region":         true,\n'
customTilesetOptions_json += '    "box":            false,\n'
customTilesetOptions_json += '    "sphere":         false\n'
customTilesetOptions_json += '}'
# Example: tile-buildings(-84.394635,33.751115,-84.388637,33.756280).osm.obj.postprocessed.obj-customTilesetOptions.json
print()
print('Writing customTilesetOptions.json...')
customTilesetOptions_json_output_file_path = "..\\tileset-3d\\tile-buildings(" + argv[0] + "," + argv[1] + "," + argv[2] + "," + argv[3] + ").osm.obj.postprocessed.obj-customTilesetOptions.json";
customTilesetOptions_json_output_file = open(customTilesetOptions_json_output_file_path, 'w')
customTilesetOptions_json_output_file.write(customTilesetOptions_json)
customTilesetOptions_json_output_file.close()
print(customTilesetOptions_json_output_file_path)



print()
print("Tile processed:")
print("---------------")
print("  west  (deg, rad):", tile_west_deg, tile_west_rad)
print("  south (deg, rad):", tile_south_deg, tile_south_rad)
print("  east  (deg, rad):", tile_east_deg, tile_east_rad)
print("  north (deg, rad):", tile_north_deg, tile_north_rad)
print("---------------")
print("  extent LON (deg, rad):", tile_east_deg - tile_west_deg, tile_east_rad - tile_west_rad)
print("  extent LAT (deg, rad):", tile_north_deg - tile_south_deg, tile_north_rad - tile_south_rad)
print("---------------")
print("  center LON (deg, rad):", tile_center_LON_deg, tile_center_LON_rad)
print("  center LAT (deg, rad):", tile_center_LAT_deg, tile_center_LAT_rad)
print("  center ECEF (x, y, z):", WGS84_to_ECEF(tile_center_LON_rad, tile_center_LAT_rad, 0.0))
print("  tile_center_ECEF (x, y, z):", tile_center_ECEF)
