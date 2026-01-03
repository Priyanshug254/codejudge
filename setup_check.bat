@echo off
echo ==========================================
echo CodeJudge Environment Setup Check
echo ==========================================

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in PATH. Please install JDK 17+.
    pause
    exit /b 1
) else (
    echo [OK] Java is found.
)

REM Check Node
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is found.
)

REM Check Maven
call mvn -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Maven 'mvn' command not found.
    echo Parsing Maven Wrapper...
    if exist "backend\mvnw.cmd" (
        echo [OK] Maven Wrapper found in backend. Use 'mvnw' instead of 'mvn'.
    ) else (
        echo [ERROR] Maven not found and Wrapper missing.
        echo Please install Maven manually: https://maven.apache.org/install.html
    )
) else (
    echo [OK] Maven is found.
)

echo.
echo ==========================================
echo Environment verification complete.
echo If you saw errors above, please fix them to run the project.
echo ==========================================
pause
