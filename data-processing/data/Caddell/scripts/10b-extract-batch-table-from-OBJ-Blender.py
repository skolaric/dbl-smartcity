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

tile_west_deg  = -84.396972
tile_south_deg =  33.776497
tile_east_deg  = -84.396788
tile_north_deg =  33.776881
tile_west_rad  = tile_west_deg * math.pi / 180.0;
tile_south_rad = tile_south_deg * math.pi / 180.0;
tile_east_rad  = tile_east_deg * math.pi / 180.0;
tile_north_rad = tile_north_deg * math.pi / 180.0;

tile_center_LON_deg = (tile_west_deg + tile_east_deg) / 2.0;
tile_center_LAT_deg = (tile_south_deg + tile_north_deg) / 2.0;
tile_center_LON_rad = (tile_west_rad + tile_east_rad) / 2.0;
tile_center_LAT_rad = (tile_south_rad + tile_north_rad) / 2.0;


#SK: tweak:
# tile_center_LON_rad = tile_center_LON_rad - 0.00000001
# tile_center_LAT_rad = tile_center_LAT_rad - 0.00000001

def haversine(lat1, lon1, lat2, lon2):
 
  R = 6372.8 # Earth radius in kilometers
 
  dLat = radians(lat2 - lat1)
  dLon = radians(lon2 - lon1)
  lat1 = radians(lat1)
  lat2 = radians(lat2)
 
  a = sin(dLat/2)**2 + cos(lat1)*cos(lat2)*sin(dLon/2)**2
  c = 2*asin(sqrt(a))
 
  # distance in km:
  return R * c
  

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

full_path_to_import_file = "..\\CaddellEnergyZonesSK6.skp.dae.obj.postprocessed.obj";
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
    
    #featureNames.append( 'dummyName-' + str(featureCounter) )
    featureNames.append( line[ 11 : len(line[2:])+1 ])
    
    #featureUUIDs.append( 'dummyUuid-' + str(featureCounter) ) 
    featureUUIDs.append( str( uuid.uuid4() ) )  
    
    if (featureCounter > 0):
      bb_west = min(lx)
      bb_south = min(lz)
      bb_east = max(lx)
      bb_north = max(lz)
      bb_bottom = min(ly)
      bb_top = max(ly)
      
      bb_center_x = (bb_west + bb_east) / 2.0
      bb_center_y = (bb_south + bb_north) / 2.0
      
      #heights.append( float(featureCounter) )
      heights.append( bb_top )
      
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
    
# for the last o element    
bb_top = max(ly)
heights.append( bb_top )
    
# print()
# print('featureNames: ', featureNames)
print()
print('len(featureNames): ', len(featureNames))


count_objects = featureCounter - 1

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
customBatchtable_json += '], \n'

######################################################
# height array:
customBatchtable_json += '  "height": [ \n'
for i in range(0, count_objects):
    if ( i < (count_objects-1) ):
        customBatchtable_json += str( heights[i] ) + ', '
    else:
        customBatchtable_json += str( heights[i] ) # last batchId in the array, so no comma at end       
customBatchtable_json += '] \n'


customBatchtable_json += '}'

print()
print('Writing customBatchtable.json...')
customBatchtable_json_output_file_path = ".\\tileset-3d\\CaddellEnergyZonesSK6.skp.dae.obj.postprocessed.obj-customBatchtable.json";
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
print()
print('Writing customTilesetOptions.json...')
customTilesetOptions_json_output_file_path = ".\\tileset-3d\\CaddellEnergyZonesSK6.skp.dae.obj.postprocessed.obj-customTilesetOptions.json";
customTilesetOptions_json_output_file = open(customTilesetOptions_json_output_file_path, 'w')
customTilesetOptions_json_output_file.write(customTilesetOptions_json)
customTilesetOptions_json_output_file.close()
print(customTilesetOptions_json_output_file_path)
