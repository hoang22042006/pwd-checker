# Script nhanh để push code lên GitHub (sau khi đã setup)
# Chạy: .\push-to-github.ps1

Write-Host "Đang push code lên GitHub..." -ForegroundColor Yellow
Write-Host ""

# Kiểm tra remote
$remote = git remote get-url origin 2>&1
if ($remote -match "fatal") {
    Write-Host "✗ Chưa có remote repository!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vui lòng chạy: .\setup-github.ps1 trước" -ForegroundColor Yellow
    Write-Host "Hoặc thêm remote: git remote add origin YOUR_REPO_URL" -ForegroundColor Yellow
    exit
}

Write-Host "Remote: $remote" -ForegroundColor Cyan
Write-Host ""

# Add và commit
Write-Host "→ Đang thêm files..." -ForegroundColor Yellow
git add .
Write-Host "✓ Đã thêm files" -ForegroundColor Green

Write-Host ""
$hasChanges = git diff --cached --quiet 2>&1
if ($LASTEXITCODE -ne 0) {
    $commitMsg = Read-Host "Nhập message cho commit (hoặc Enter để dùng mặc định)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Update: Password Checker project"
    }
    git commit -m $commitMsg
    Write-Host "✓ Đã tạo commit" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "→ Không có thay đổi để commit" -ForegroundColor Yellow
    Write-Host ""
}

# Push
Write-Host "→ Đang push lên GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Đã push thành công!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Có lỗi khi push" -ForegroundColor Red
    Write-Host "Kiểm tra:" -ForegroundColor Yellow
    Write-Host "  - Đã đăng nhập GitHub chưa?" -ForegroundColor White
    Write-Host "  - Repository URL đúng chưa?" -ForegroundColor White
    Write-Host "  - Có quyền push không?" -ForegroundColor White
}

