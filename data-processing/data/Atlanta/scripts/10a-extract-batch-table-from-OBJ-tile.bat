rem Very small area around Five Points (for testing purposes):
rem 
rem 10a-extract-batch-table-from-OBJ-tile.bat -84.394635 33.751115 -84.388637 33.756280
rem 
rem 10a-extract-batch-table-from-OBJ-tile.bat -84.390000 33.750000 -84.380000 33.760000
rem 
rem 10a-extract-batch-table-from-OBJ-tile.bat -84.420000 33.740000 -84.400000 33.760000
rem 10a-extract-batch-table-from-OBJ-tile.bat -84.400000 33.740000 -84.380000 33.760000
rem 10a-extract-batch-table-from-OBJ-tile.bat -84.380000 33.740000 -84.360000 33.760000
rem 10a-extract-batch-table-from-OBJ-tile.bat -84.360000 33.740000 -84.340000 33.760000
set arg1=%1
set arg2=%2
set arg3=%3
set arg4=%4
"C:\Program Files\Blender Foundation\Blender\blender.exe" ^
  --background ^
  --python "10b-extract-batch-table-from-OBJ-tile-Blender.py" ^
  -- %arg1% %arg2% %arg3% %arg4%