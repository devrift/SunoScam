$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$androidJar = "$sdk\platforms\android-35\android.jar"
$aapt = "$sdk\build-tools\35.0.0\aapt.exe"
$d8 = "$sdk\build-tools\35.0.0\d8.bat"
$zipalign = "$sdk\build-tools\35.0.0\zipalign.exe"
$apksigner = "$sdk\build-tools\35.0.0\apksigner.bat"
$javac = "C:\Program Files\Java\jdk-26.0.1\bin\javac.exe"
$keytool = "C:\Program Files\Java\jdk-26.0.1\bin\keytool.exe"

Write-Host "1. Generating R.java via aapt..."
& $aapt package -f -m -J android-build/src -M android-build/AndroidManifest.xml -S android-build/res -I $androidJar
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "2. Compiling Java classes..."
New-Item -ItemType Directory -Force -Path "android-build/bin/classes" | Out-Null
& $javac -source 8 -target 8 -bootclasspath $androidJar -d android-build/bin/classes (Get-ChildItem -Path android-build/src -Recurse -Filter *.java | ForEach-Object { $_.FullName })
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "3. Compiling DEX via d8..."
$classFiles = (Get-ChildItem -Path android-build/bin/classes -Recurse -Filter *.class | ForEach-Object { $_.FullName })
& $d8 --release --min-api 24 --output android-build/bin $classFiles
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "4. Packaging APK resources..."
& $aapt package -f -M android-build/AndroidManifest.xml -S android-build/res -I $androidJar -F android-build/bin/unaligned.apk
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "5. Adding classes.dex to APK..."
Set-Location android-build/bin
& $aapt add unaligned.apk classes.dex
Set-Location ../..
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "6. Aligning APK via zipalign..."
if (Test-Path "android-build/bin/aligned.apk") { Remove-Item "android-build/bin/aligned.apk" }
& $zipalign -v -p 4 android-build/bin/unaligned.apk android-build/bin/aligned.apk
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "7. Creating keystore if needed..."
$keystore = "android-build/debug.keystore"
if (-not (Test-Path $keystore)) {
    & $keytool -genkeypair -v -keystore $keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=SunoScam, OU=Security, O=SunoScam, L=Delhi, S=Delhi, C=IN"
}

Write-Host "8. Signing APK with apksigner..."
& $apksigner sign --ks $keystore --ks-pass pass:android --key-pass pass:android --out public/SunoScam-v1.0.0.apk android-build/bin/aligned.apk
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "9. Verifying signed APK..."
& $apksigner verify -v public/SunoScam-v1.0.0.apk

Write-Host "SUCCESS: Valid standalone APK built at public/SunoScam-v1.0.0.apk"
