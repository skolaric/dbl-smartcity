import bpy
import os
import mathutils
import math
import sys
import uuid

print()
print("========================================================================================================================================")
print("This is Blender Python script that calls obj23dtiles")
print("Author: Sinisa Kolaric")
print()

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get all args after "--" 
print("Passed-in arguments: ")
print(argv)  # should be ['-84.360000', '33.740000', '-84.340000', '33.760000']

temp_str = argv[0] + "," + argv[1] + "," + argv[2] + "," + argv[3]

# Example: 
# obj23dtiles -i "./../tileset-3d/tile-buildings(-84.394635,33.751115,-84.388637,33.756280).osm.obj.postprocessed.obj" --tileset -p "./../tileset-3d/tile-buildings(-84.394635,33.751115,-84.388637,33.756280).osm.obj.postprocessed.obj-customTilesetOptions.json" -c "./../tileset-3d/tile-buildings(-84.394635,33.751115,-84.388637,33.756280).osm.obj.postprocessed.obj-customBatchtable.json"

obj23dtiles_command  = 'obj23dtiles '  
obj23dtiles_command += '-i "./../tileset-3d/tile-buildings(' + temp_str + ').osm.obj.postprocessed.obj" '
obj23dtiles_command += '--tileset '
obj23dtiles_command += '-p "./../tileset-3d/tile-buildings(' + temp_str + ').osm.obj.postprocessed.obj-customTilesetOptions.json" '
obj23dtiles_command += '-c "./../tileset-3d/tile-buildings(' + temp_str + ').osm.obj.postprocessed.obj-customBatchtable.json" '

print()
print('Invoking the following command:')
print(obj23dtiles_command)

print()
os.system(obj23dtiles_command)

