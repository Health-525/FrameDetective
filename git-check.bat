@echo off
REM Git 推送前的安全检查脚本

echo ========================================
echo Git 安全检查
echo ========================================
echo.

echo [1/5] 检查是否有敏感文件被追踪...
git ls-files | findstr /I "\.env$ secret key token" > nul
if %errorlevel% equ 0 (
    echo [FAIL] 发现敏感文件被追踪！
    git ls-files | findstr /I "\.env$ secret key token"
    exit /b 1
) else (
    echo [PASS] 未发现敏感文件被追踪
)
echo.

echo [2/5] 检查 .env 是否被正确忽略...
git check-ignore .env > nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] .env 已被忽略
) else (
    echo [WARN] .env 可能未被忽略，请检查 .gitignore
)
echo.

echo [3/5] 检查大文件...
for /f %%i in ('git ls-files ^| findstr /I "\.mp4$ \.mov$ \.zip$ \.avi$"') do (
    echo [WARN] 发现大文件: %%i
)
echo [PASS] 大文件检查完成
echo.

echo [4/5] 检查上传目录是否被忽略...
git check-ignore public/uploads outputs > nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] 上传和输出目录已被忽略
) else (
    echo [WARN] public/uploads 或 outputs 可能未被忽略
)
echo.

echo [5/5] 检查 node_modules 是否被忽略...
git check-ignore node_modules > nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] node_modules 已被忽略
) else (
    echo [FAIL] node_modules 未被忽略！
    exit /b 1
)
echo.

echo ========================================
echo 所有检查通过！可以安全推送
echo ========================================
echo.
echo 建议的推送步骤：
echo   1. git add .
echo   2. git commit -m "your message"
echo   3. git push origin main
echo.
