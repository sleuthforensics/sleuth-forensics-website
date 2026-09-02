$newSvgContent = @"
  <!-- Outer glass rim with a thicker stroke -->
  <circle cx="13" cy="13" r="10" stroke="currentColor" stroke-width="2.5" />
  <!-- Glass inner highlight/gradient hint -->
  <circle cx="13" cy="13" r="7" stroke="currentColor" stroke-width="0.75" opacity="0.3" stroke-dasharray="2 4" />
  <!-- A minimal digital/circuit node inside -->
  <path d="M10 13 L13 10 L16 13" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" opacity="0.7" />
  <circle cx="13" cy="10" r="1.5" fill="currentColor" opacity="0.8" />
  <!-- The handle, styled with a distinct cap -->
  <line x1="20" y1="20" x2="27" y2="27" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
  <line x1="24" y1="24" x2="28" y2="28" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" opacity="0.4" />
"@

$files = Get-ChildItem -Path . -Recurse -Include *.html, generate-services.js | Where-Object { $_.FullName -notmatch '\\node_modules\\' }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Regex to match the contents inside <svg class="header__logo-icon"...>...</svg>
    $pattern = '(?s)(<svg class="header__logo-icon"[^>]*>).*?(</svg>)'
    
    if ($content -match $pattern) {
        $newContent = [regex]::Replace($content, $pattern, "`$1`n$newSvgContent`n`$2")
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.Name)"
    }
}
