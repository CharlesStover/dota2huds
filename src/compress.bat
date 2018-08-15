@ECHO OFF
SETLOCAL
SET "sourcedir=W:\github.com\GamingMedley\dota2-hud-gallery\src\hud_skins"
FOR /r "%sourcedir%" %%a IN (*.png) DO (
  W:\github.com\GamingMedley\dota2-hud-gallery\src\optipng.exe -force -v -o2 "%%a"
)
pause
GOTO :EOF