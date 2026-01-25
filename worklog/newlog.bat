@echo off
:: Extract from dd-MM-yyyy
set day=%date:~0,2%
set monthnum=%date:~3,2%
set year=%date:~6,4%

:: Remove leading zero from day
if %day:~0,1%==0 set day=%day:~1%

:: Convert month number to short name
set monthname=
if %monthnum%==01 set monthname=jan
if %monthnum%==02 set monthname=feb
if %monthnum%==03 set monthname=mar
if %monthnum%==04 set monthname=apr
if %monthnum%==05 set monthname=may
if %monthnum%==06 set monthname=jun
if %monthnum%==07 set monthname=jul
if %monthnum%==08 set monthname=aug
if %monthnum%==09 set monthname=sep
if %monthnum%==10 set monthname=oct
if %monthnum%==11 set monthname=nov
if %monthnum%==12 set monthname=dec

:: Final filename: 2025oct2.txt
set file=%year%%monthname%%day%.txt

:: Create file if missing
if not exist "%file%" echo .LOG > "%file%"

:: Open in Notepad
notepad "%file%"

exit