@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM Apache Maven Wrapper startup batch script, version 3.2.0

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "__MVNW_ARG0_NAME__=%~nx0")
@SET ___MVNW_ISBATCH=1
@SETLOCAL

@SET "__MVNW_PROPERTIES=%~dp0.mvn\wrapper\maven-wrapper.properties"

@SET DOWNLOAD_URL=
@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%__MVNW_PROPERTIES%") DO (
  @IF "%%A"=="distributionUrl" SET DOWNLOAD_URL=%%B
)

@SET MAVEN_USER_HOME=%MAVEN_USER_HOME%
@IF "%MAVEN_USER_HOME%"=="" SET MAVEN_USER_HOME=%USERPROFILE%\.m2

@FOR %%F IN ("%DOWNLOAD_URL%") DO @SET MAVEN_DIST_NAME=%%~nF
@SET MAVEN_DIST_DIR=%MAVEN_USER_HOME%\wrapper\dists\%MAVEN_DIST_NAME%
@SET MAVEN_BIN=%MAVEN_DIST_DIR%\bin\mvn.cmd

@IF EXIST "%MAVEN_BIN%" GOTO run

@ECHO Downloading Maven from %DOWNLOAD_URL% ...
@IF NOT EXIST "%MAVEN_DIST_DIR%" MKDIR "%MAVEN_DIST_DIR%"

@powershell -Command "Invoke-WebRequest '%DOWNLOAD_URL%' -OutFile '%MAVEN_DIST_DIR%\maven.zip'"
@powershell -Command "Expand-Archive '%MAVEN_DIST_DIR%\maven.zip' -DestinationPath '%MAVEN_USER_HOME%\wrapper\dists'"
@DEL "%MAVEN_DIST_DIR%\maven.zip"

@FOR /D %%D IN ("%MAVEN_USER_HOME%\wrapper\dists\apache-maven-*") DO (
  @IF NOT "%%D"=="%MAVEN_DIST_DIR%" MOVE "%%D" "%MAVEN_DIST_DIR%"
)

:run
@"%MAVEN_BIN%" %*
