Write-Output "Starting..."
python -c "import sys; sys.exit(1)"
if ($LASTEXITCODE -ne 0) { Write-Output "ERROR: Python failed"; exit 1 }
