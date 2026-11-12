
param(
    [Parameter(Mandatory = $true)]
    [string]$HostIp,

    [string]$SshKey = "$HOME\.ssh\id_ed25519"
)

$ErrorActionPreference = "Stop"

$deployDir = $PSScriptRoot

if (-not (Test-Path $SshKey)) {
    throw "SSH key not found: $SshKey"
}

foreach ($file in @(".env", "app.env", "tunnel.env", "docker-compose.yml")) {
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

scp -i $SshKey (Join-Path $deployDir "app.env") `
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
