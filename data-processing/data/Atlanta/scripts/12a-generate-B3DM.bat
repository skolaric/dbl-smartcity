rem Very small area around Five Points (for testing purposes):
rem 
rem 12a-generate-B3DM.bat -84.394635 33.751115 -84.388637 33.756280
rem 
rem 12a-generate-B3DM.bat -84.420000 33.740000 -84.400000 33.760000
rem 12a-generate-B3DM.bat -84.400000 33.740000 -84.380000 33.760000
rem 12a-generate-B3DM.bat -84.380000 33.740000 -84.360000 33.760000
rem 12a-generate-B3DM.bat -84.360000 33.740000 -84.340000 33.760000
set arg1=%1
set arg2=%2
set arg3=%3
set arg4=%4 
"C:\Program Files\Blender Foundation\Blender\blender.exe" ^
  --background ^
  --python "12b-generate-B3DM-obj23dtiles.py" ^
  -- %arg1% %arg2% %arg3% %arg4%