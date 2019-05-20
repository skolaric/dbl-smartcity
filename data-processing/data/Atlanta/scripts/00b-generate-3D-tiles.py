
import sys
import os
import math

print()
print("========================================================================================")
print("This is a script that generates 3D tiles from OSM.OBJ data.")
print("Author: Sinisa Kolaric")

# for lon0 in range(-180, 180, 1): # degrees
    # for lat0 in range(-90, 90, 1): # degrees
        # print("lon, lat: ", lon0, lat0)
        # for lon1 in range(0, 100, 1): # 0.01 degrees
            # for lat1 in range(0, 100, 1): # 0.01 degrees
                # lon1dec = lon0 + lon1/100.0;
                # lat1dec = lat0 + lat1/100.0;
                # print("lon, lat: ", lon1dec, lat1dec, end="")

# lons = [-84.42, -84.40] # , -84.38, -84.36] # ascending order
# lats = [ 33.74 ] # [ 33.74 ,  33.76,  33.78] # ascending order
# lons = [ -84.50, -84.48, -84.46, -84.44, -84.42, -84.40, -84.38, -84.36, -84.34, -84.32, -84.30, -84.28, -84.26, -84.24 ] # ascending order
# lats = [  33.64,  33.66,  33.68,  33.70,  33.72,  33.74,  33.76,  33.78,  33.80,  33.82,  33.84,  33.86,  33.88,  33.90 ] # ascending order


# REM Five Points, super-small area around (2 tiles):
# REM osm23dtiles.bat -84.396000 33.750000 -84.388000 33.758000 0.002000 0.002000
# area_west_deg = -84.390000
# area_south_deg = 33.750000
# area_east_deg = -84.380000
# area_north_deg = 33.770000
# delta_lon_deg = 0.01
# delta_lat_deg = 0.01

# REM Five Points, super-small area around (4 tiles):
area_west_deg = -84.390000
area_south_deg = 33.750000
area_east_deg = -84.380000
area_north_deg = 33.760000
delta_lon_deg = 0.005
delta_lat_deg = 0.005

# Very small area around Five Points (4 tiles):
# area_west_deg = -84.390000
# area_south_deg = 33.750000
# area_east_deg = -84.370000
# area_north_deg = 33.770000
# delta_lon_deg = 0.01
# delta_lat_deg = 0.01


# # REM Five Points, small area around (9 tiles):
# # REM osm23dtiles.bat -84.396000 33.750000 -84.388000 33.758000 0.002000 0.002000
# area_west_deg = -84.390000
# area_south_deg = 33.750000
# area_east_deg = -84.360000
# area_north_deg = 33.780000
# delta_lon_deg = 0.01
# delta_lat_deg = 0.01

# # Wider Atlanta, from Smyrna to Rockdale County
# area_west_deg = -84.544000
# area_south_deg = 33.600000
# area_east_deg = -84.140000
# area_north_deg = 33.892000
# delta_lon_deg = 0.01
# delta_lat_deg = 0.01

# # Downtown + GT (9 tiles):
# # REM osm23dtiles.bat -84.396000 33.750000 -84.388000 33.758000 0.002000 0.002000
# area_west_deg = -84.430000
# area_south_deg = 33.740000
# area_east_deg = -84.360000
# area_north_deg = 33.810000
# delta_lon_deg = 0.01
# delta_lat_deg = 0.01

# Wider Atlanta, from Smyrna to Rockdale County
# area_west_deg = -84.544000
# area_south_deg = 33.600000
# area_east_deg = -84.140000
# area_north_deg = 33.892000
# delta_lon_deg = 0.01
# delta_lat_deg = 0.01
# Notes:
# 84.544000 - 84.140000 = 0.404, and 0.404 / 0.01 = 40
# 33.892000 - 33.600000 = 0.292, and 0.292 / 0.01 = 29
# So total tiles to be processed: 40 * 29 = around 1200


print()
print('delta LON, LAT [decimal degrees]: ', delta_lon_deg, delta_lat_deg)

print()
print('Populating the array of longitudes...')
lons = []
current_lon = area_west_deg
while True:  
  #print("current_lon: ", current_lon)
  lons.append(current_lon)
  current_lon = round(current_lon + delta_lon_deg, 6)
  if (current_lon >= area_east_deg):
    break      
print('Count of different longitude values: ', len(lons), ', from ', min(lons), ' to ', max(lons) )
print('lons[]: ', lons)

print()
print('Populating the array of latitudes...')
lats = []
current_lat = area_south_deg
while True:  
  #print("current_lat: ", current_lat)
  lats.append(current_lat)
  current_lat = round(current_lat + delta_lat_deg, 6)
  if (current_lat >= area_north_deg):
    break
print('Count of different latitude  values: ', len(lats), ', from ', min(lats), ' to ', max(lats) )
print('lats[]: ', lats)

countOfTiles = len(lons) * len(lats)

print()
print('Count of tiles to be generated: ',  countOfTiles )



i = 0

for lon in lons:
    for lat in lats:
    
        print('Processing tile ', str(i), ' of ', str(countOfTiles), 'with lon, lat: ', lon, lat)
        
        # find out current BB being processed:
        west = lon
        south = lat
        east = west + delta_lon_deg
        north = south + delta_lat_deg
        
        # build the string 1 to pass. Example: -84.394635 33.751115 -84.388637 33.756280
        str_to_pass = str(format(west, '.6f')) + " " + str(format(south, '.6f')) + " " + str(format(east, '.6f')) + " " + str(format(north, '.6f'))
				
        print('  str_to_pass: ', str_to_pass)
        
        os.system("01-extract-OSM-tile-buildings.bat " + str_to_pass) 
        os.system("02a-convert-OSM-tile-to-OBJ.bat " + str_to_pass)
        os.system("03a-postprocess-OBJ-tile.bat " + str_to_pass)
        os.system("10a-extract-batch-table-from-OBJ-tile.bat " + str_to_pass)
        os.system("12a-generate-B3DM.bat " + str_to_pass)

        i = i + 1