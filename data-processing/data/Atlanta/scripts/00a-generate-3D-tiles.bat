REM Wider Atlanta, fine-grained: (227,900 tiles)
REM 00a-generate-3D-tiles.bat -84.860000 33.340000 -83.800000 34.200000 0.002000 0.002000

REM Five Points, small area around (16 tiles):
REM 00a-generate-3D-tiles.bat -84.396000 33.750000 -84.388000 33.758000 0.002000 0.002000

REM Five Points, even SMALLER area around (4 tiles):
REM 00a-generate-3D-tiles.bat -84.394000 33.752000 -84.390000 33.756000 0.002000 0.002000

REM 00a-generate-3D-tiles.bat -84.860000 33.340000 -83.800000 34.200000 0.002000 0.002000
REM 00a-generate-3D-tiles.bat -85.860000 34.340000 -83.800000 34.200000 0.002000 0.002000

REM Tiled area's west limit, longitude in [rad]
set arg1=%1 

REM Tiled area's south limit, latitude in [rad]
set arg2=%2 

REM Tiled area's east limit, latitude in [rad]
set arg3=%3 

REM Tiled area's north limit, latitude in [rad]
set arg4=%4 

REM Tile width, in [rad].
set arg5=%5

REM Tile height, in [rad].
set arg6=%6

"C:\Program Files\Blender Foundation\Blender\blender.exe" ^
  --background ^
  --python "00b-generate-3D-tiles.py" ^
  -- %arg1% %arg2% %arg3% %arg4% %arg5% %arg6%