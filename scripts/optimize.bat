# You may need full paths for sourcedir and optipng.exe

@ECHO OFF
SETLOCAL
SET "sourcedir=..\src\hud_skins"
FOR /r "%sourcedir%" %%a IN (*.png) DO (
  ..\helpers\optipng.exe -force -v -o2 "%%a"
)
pause
GOTO :EOF
