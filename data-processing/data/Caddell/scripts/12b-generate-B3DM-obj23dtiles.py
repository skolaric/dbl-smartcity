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

#obj23dtiles_command  = 'obj23dtiles '  
obj23dtiles_command  = 'node C:/dev/cesium/objTo3d-tiles-SK/bin/obj23dtiles.js ' 
obj23dtiles_command += '-i "./../CaddellEnergyZonesSK6.skp.dae.obj.postprocessed.obj" '
obj23dtiles_command += '--tileset '
obj23dtiles_command += '-p "./tileset-3d/CaddellEnergyZonesSK6.skp.dae.obj.postprocessed.obj-customTilesetOptions.json" '
obj23dtiles_command += '-c "./tileset-3d/CaddellEnergyZonesSK6.skp.dae.obj.postprocessed.obj-customBatchtable.json" '

print()
print('Invoking the following command:')
print(obj23dtiles_command)

print()
os.system(obj23dtiles_command)

