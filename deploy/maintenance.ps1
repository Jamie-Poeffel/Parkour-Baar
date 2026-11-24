param(
    [Parameter(Mandatory = $true)]
    [string]$HostIp,

    [Parameter(Mandatory = $true)]
    [ValidateSet("set", "off", "status")]
    [string]$Action,

    # Local time of this machine, e.g. "2026-11-20 22:00"
    [string]$From,
    [string]$To,
    [string]$Message = "",

    [string]$SshKey = "$HOME\.ssh\id_ed25519"
)

$ErrorActionPreference = "Stop"

function Resolve-Tool([string]$Name) {
    $cmd = Get-Command $Name -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($cmd) { return $cmd.Source }
    foreach ($dir in @(
        "$env:SystemRoot\System32\OpenSSH",
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
    throw "$Name not found. Install the Windows OpenSSH Client or Git for Windows."
}

$script:SshExe = Resolve-Tool "ssh"
$script:ScpExe = Resolve-Tool "scp"
function ssh { & $script:SshExe -o ConnectTimeout=10 -o BatchMode=yes @args }
function scp { & $script:ScpExe -o ConnectTimeout=10 -o BatchMode=yes @args }

if (-not (Test-Path $SshKey)) { throw "SSH key not found: $SshKey" }

$remote = "ubuntu@$HostIp"
$dir = "/opt/parkour-baar/maintenance"

switch ($Action) {
    "set" {
        if (-not $From -or -not $To) { throw "set needs -From and -To, e.g. -From '2026-11-20 22:00' -To '2026-11-21 02:00'" }
        $fromUtc = ([datetime]::Parse($From)).ToUniversalTime()
        $toUtc = ([datetime]::Parse($To)).ToUniversalTime()
        if ($toUtc -le $fromUtc) { throw "-To must be after -From" }

        $json = [ordered]@{
            from    = $fromUtc.ToString("o")
            to      = $toUtc.ToString("o")
            message = $Message
        } | ConvertTo-Json

        $tmp = New-TemporaryFile
        try {
            # UTF-8 without BOM so JSON.parse on the server accepts it.
            [System.IO.File]::WriteAllText($tmp.FullName, $json, (New-Object System.Text.UTF8Encoding($false)))
            ssh -i $SshKey $remote "mkdir -p $dir"
            scp -i $SshKey $tmp.FullName "${remote}:$dir/maintenance.json"
        }
        finally { Remove-Item $tmp.FullName -Force -ErrorAction SilentlyContinue }

        if ($LASTEXITCODE -ne 0) { throw "Could not upload maintenance window." }
        Write-Host "Maintenance scheduled: $fromUtc UTC -> $toUtc UTC"
        Write-Host "Monitors are paused 60s before the start and resumed 30s after the end."
    }
    "off" {
        ssh -i $SshKey $remote "rm -f $dir/maintenance.json"
        Write-Host "Maintenance window removed. Monitors resume within ~15s (if they were paused)."
    }
    "status" {
        ssh -i $SshKey $remote "echo '--- maintenance.json'; cat $dir/maintenance.json 2>/dev/null || echo '(none)'; echo; echo '--- state.json'; cat $dir/state.json 2>/dev/null || echo '(none)'; echo; echo '--- gateway log'; sudo docker logs --tail=15 parkour-baar-gateway 2>&1"
    }
}
