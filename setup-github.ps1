# Script tự động setup và push code lên GitHub
# Chạy: .\setup-github.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Git đã cài chưa
Write-Host "[1/5] Kiểm tra Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    Write-Host "✓ Git đã được cài đặt: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git chưa được cài đặt!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vui lòng cài đặt Git từ: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Hoặc sử dụng GitHub Desktop: https://desktop.github.com/" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "Bạn đã cài Git chưa? (y/n)"
    if ($install -ne "y") {
        Write-Host "Vui lòng cài Git trước rồi chạy lại script này." -ForegroundColor Red
        exit
    }
}

Write-Host ""

# Kiểm tra đã có git repo chưa
Write-Host "[2/5] Kiểm tra Git repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git repository đã được khởi tạo" -ForegroundColor Green
} else {
    Write-Host "→ Đang khởi tạo Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Đã khởi tạo Git repository" -ForegroundColor Green
}

Write-Host ""

# Add files
Write-Host "[3/5] Đang thêm files vào staging..." -ForegroundColor Yellow
git add .
Write-Host "✓ Đã thêm tất cả files" -ForegroundColor Green

Write-Host ""

# Kiểm tra có commit chưa
Write-Host "[4/5] Kiểm tra commits..." -ForegroundColor Yellow
$commitCount = (git rev-list --count HEAD 2>&1)
if ($commitCount -eq "0" -or $commitCount -match "fatal") {
    Write-Host "→ Đang tạo commit đầu tiên..." -ForegroundColor Yellow
    git commit -m "Initial commit: Password Checker with Login/Register - Next.js + Prisma + SQLite"
    Write-Host "✓ Đã tạo commit" -ForegroundColor Green
} else {
    Write-Host "✓ Đã có $commitCount commit(s)" -ForegroundColor Green
    $addCommit = Read-Host "Bạn có muốn tạo commit mới? (y/n)"
    if ($addCommit -eq "y") {
        $commitMsg = Read-Host "Nhập message cho commit"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "Update: Password Checker project"
        }
        git add .
        git commit -m $commitMsg
        Write-Host "✓ Đã tạo commit mới" -ForegroundColor Green
    }
}

Write-Host ""

# Đổi branch thành main nếu đang ở master
Write-Host "[5/5] Kiểm tra branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current 2>&1
if ($currentBranch -eq "master") {
    git branch -M main
    Write-Host "✓ Đã đổi branch từ master sang main" -ForegroundColor Green
} else {
    Write-Host "✓ Đang ở branch: $currentBranch" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Bước tiếp theo:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Tạo repository trên GitHub:" -ForegroundColor Yellow
Write-Host "   → Truy cập: https://github.com/new" -ForegroundColor White
Write-Host "   → Đặt tên: pwd-checker" -ForegroundColor White
Write-Host "   → KHÔNG tích 'Initialize with README'" -ForegroundColor White
Write-Host "   → Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "2. Sau khi tạo repo, chạy lệnh sau:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/pwd-checker.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Hoặc nếu bạn đã có repo, nhập URL repo của bạn:" -ForegroundColor Yellow
$repoUrl = Read-Host "GitHub Repository URL (hoặc Enter để bỏ qua)"
if (![string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host ""
    Write-Host "→ Đang thêm remote..." -ForegroundColor Yellow
    git remote remove origin 2>$null
    git remote add origin $repoUrl
    Write-Host "✓ Đã thêm remote: $repoUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "→ Đang push code lên GitHub..." -ForegroundColor Yellow
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ Đã push code lên GitHub thành công!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✗ Có lỗi khi push. Có thể cần:" -ForegroundColor Red
        Write-Host "  - Đăng nhập GitHub (git config --global user.name/email)" -ForegroundColor Yellow
        Write-Host "  - Tạo Personal Access Token tại: https://github.com/settings/tokens" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Hoàn tất!" -ForegroundColor Green

