# PowerShell script to update all game HTML files with mobile support
# Run from the game collection root directory

$gameFiles = Get-ChildItem -Path "games" -Filter "*.html" -Recurse

foreach ($file in $gameFiles) {
    Write-Host "Updating $($file.FullName)..."
    
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if this file already has the responsive.css file
    if (-not ($content -match "responsive\.css")) {
        # Update viewport meta tag
        $content = $content -replace '<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
        
        # Add responsive CSS link
        $content = $content -replace '(<link rel="stylesheet" href="[^"]+\.css">)(\s*<link rel="stylesheet" href="[^"]+ads\.css">)', '$1$2
    <link rel="stylesheet" href="../../assets/css/responsive.css">'
        
        # Add mobile support script
        $content = $content -replace '(</body>)', '<script src="../../assets/js/mobile-support.js"></script>
$1'
        
        # Save the updated file
        Set-Content -Path $file.FullName -Value $content
        
        Write-Host "  Updated successfully!"
    } else {
        Write-Host "  Already updated, skipping."
    }
}

Write-Host "All game HTML files have been updated with mobile support!" 