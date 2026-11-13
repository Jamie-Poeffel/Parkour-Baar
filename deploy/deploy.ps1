
param(
    [Parameter(Mandatory = $true)]
    [string]$HostIp,

    [string]$SshKey = "$HOME\.ssh\id_ed25519"
)

$ErrorActionPreference = "Stop"

# ssh/scp are not always on PATH (e.g. no Windows OpenSSH client installed):
# fall back to the Windows OpenSSH folder, then to the copy bundled with Git.
function Resolve-Tool([string]$Name) {
    $cmd = Get-Command $Name -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($cmd) { return $cmd.Source }
    foreach ($dir in @(
        "$env:SystemRoot\System32\OpenSSH",
        # A 32-bit PowerShell (started by a 32-bit make) sees System32 as
        # SysWOW64 and ProgramFiles as the x86 folder; these reach the real ones.
        "$env:SystemRoot\Sysnative\OpenSSH",
        "$env:ProgramW6432\Git\usr\bin",
        "$env:ProgramFiles\Git\usr\bin",
        "${env:ProgramFiles(x86)}\Git\usr\bin",
        "C:\Program Files\Git\usr\bin",
        "$env:LOCALAPPDATA\Programs\Git\usr\bin"
    )) {
        if (-not $dir -or $dir.StartsWith("\")) { continue }
        $candidate = Join-Path $dir "$Name.exe"
        if (Test-Path $candidate) { return $candidate }
    }
    throw "$Name not found. Install the Windows OpenSSH Client (Settings > Optional features) or Git for Windows."
}

$script:SshExe = Resolve-Tool "ssh"
$script:ScpExe = Resolve-Tool "scp"
function ssh { & $script:SshExe @args }
function scp { & $script:ScpExe @args }

$deployDir = $PSScriptRoot

if (-not (Test-Path $SshKey)) {
    throw "SSH key not found: $SshKey"
}

$appEnv = Join-Path (Split-Path $deployDir -Parent) ".env"
if (-not (Test-Path $appEnv)) {
    throw "Missing app config: $appEnv (root .env is the single source of truth)"
}

foreach ($file in @(".env", "tunnel.env", "docker-compose.yml")) {
    if (-not (Test-Path (Join-Path $deployDir $file))) {
        throw "Missing deployment file: $file"
    }
}

Write-Host "Preparing Oracle deployment directory..."

ssh -i $SshKey "ubuntu@$HostIp" `
    "sudo mkdir -p /opt/parkour-baar && sudo chown ubuntu:ubuntu /opt/parkour-baar"

Write-Host "Uploading deployment files..."

scp -i $SshKey (Join-Path $deployDir "docker-compose.yml") `
    "ubuntu@${HostIp}:/opt/parkour-baar/docker-compose.yml"

scp -i $SshKey (Join-Path $deployDir ".env") `
    "ubuntu@${HostIp}:/opt/parkour-baar/.env"

scp -i $SshKey $appEnv `
    "ubuntu@${HostIp}:/opt/parkour-baar/app.env"

scp -i $SshKey (Join-Path $deployDir "tunnel.env") `
    "ubuntu@${HostIp}:/opt/parkour-baar/tunnel.env"

Write-Host "Starting deployment..."

ssh -i $SshKey "ubuntu@$HostIp" `
    "cd /opt/parkour-baar && chmod 600 .env app.env tunnel.env && sudo docker compose pull && sudo docker compose up -d --remove-orphans && sudo docker compose ps"

if ($LASTEXITCODE -ne 0) {
    throw "Oracle deployment failed."
}

Write-Host "Deployment completed."
