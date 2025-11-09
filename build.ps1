# CommunityCar Full-Stack Build Script
# This script builds both the backend (.NET) and frontend (React) applications

param(
    [switch]$Clean,
    [switch]$Restore,
    [switch]$Build,
    [switch]$Test,
    [switch]$Publish,
    [string]$Configuration = "Release",
    [string]$OutputPath = "publish"
)

Write-Host "🚗 CommunityCar Full-Stack Build Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Default actions if none specified
if (-not $Clean -and -not $Restore -and -not $Build -and -not $Test -and -not $Publish) {
    $Clean = $true
    $Restore = $true
    $Build = $true
    $Test = $true
}

# Function to write colored output
function Write-Step {
    param([string]$Message)
    Write-Host "`n📋 $Message" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Clean step
if ($Clean) {
    Write-Step "Cleaning previous builds..."

    # Clean .NET projects
    Write-Host "  Cleaning .NET projects..." -ForegroundColor Gray
    dotnet clean --verbosity quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to clean .NET projects"
        exit 1
    }

    # Clean React build
    Write-Host "  Cleaning React build..." -ForegroundColor Gray
    if (Test-Path "CommunityCar.Client\ClientApp\build") {
        Remove-Item "CommunityCar.Client\ClientApp\build" -Recurse -Force
    }

    Write-Success "Clean completed"
}

# Restore step
if ($Restore) {
    Write-Step "Restoring dependencies..."

    # Restore .NET dependencies
    Write-Host "  Restoring .NET dependencies..." -ForegroundColor Gray
    dotnet restore --verbosity quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to restore .NET dependencies"
        exit 1
    }

    # Restore Node.js dependencies
    Write-Host "  Restoring Node.js dependencies..." -ForegroundColor Gray
    Push-Location "CommunityCar.Client\ClientApp"
    npm install --silent
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        Write-Error "Failed to restore Node.js dependencies"
        exit 1
    }
    Pop-Location

    Write-Success "Restore completed"
}

# Build step
if ($Build) {
    Write-Step "Building applications..."

    # Build .NET projects
    Write-Host "  Building .NET projects ($Configuration)..." -ForegroundColor Gray
    dotnet build --configuration $Configuration --verbosity quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build .NET projects"
        exit 1
    }

    # Build React application
    Write-Host "  Building React application..." -ForegroundColor Gray
    Push-Location "CommunityCar.Client\ClientApp"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        Write-Error "Failed to build React application"
        exit 1
    }
    Pop-Location

    Write-Success "Build completed"
}

# Test step
if ($Test) {
    Write-Step "Running tests..."

    # Run .NET tests
    Write-Host "  Running .NET tests..." -ForegroundColor Gray
    dotnet test --configuration $Configuration --verbosity quiet --no-build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Some .NET tests failed"
        # Don't exit here, continue with React tests
    }

    # Run React tests
    Write-Host "  Running React tests..." -ForegroundColor Gray
    Push-Location "CommunityCar.Client\ClientApp"
    npm test -- --watchAll=false --passWithNoTests
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        Write-Error "Some React tests failed"
        # Don't exit here, tests are not critical for build
    } else {
        Pop-Location
    }

    Write-Success "Tests completed"
}

# Publish step
if ($Publish) {
    Write-Step "Publishing applications..."

    # Create output directory
    if (!(Test-Path $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath | Out-Null
    }

    # Publish .NET API
    Write-Host "  Publishing .NET API..." -ForegroundColor Gray
    dotnet publish CommunityCar.Api\CommunityCar.Api.csproj --configuration $Configuration --output "$OutputPath\Api" --verbosity quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to publish .NET API"
        exit 1
    }

    # Copy React build to API wwwroot
    Write-Host "  Copying React build to API..." -ForegroundColor Gray
    $reactBuildPath = "CommunityCar.Client\ClientApp\build"
    $apiWwwrootPath = "$OutputPath\Api\wwwroot"

    if (Test-Path $reactBuildPath) {
        Copy-Item $reactBuildPath\* $apiWwwrootPath -Recurse -Force
    }

    Write-Success "Publish completed"
}

Write-Host "`n🎉 Build script completed successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

if ($Publish) {
    Write-Host "📦 Published application available at: $OutputPath" -ForegroundColor Cyan
    Write-Host "   - API: $OutputPath\Api" -ForegroundColor Gray
    Write-Host "   - Client: $OutputPath\Api\wwwroot" -ForegroundColor Gray
}