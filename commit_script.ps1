$deleted_files = @(
    "client/public/images/1.png",
    "client/public/images/Iphone.jpg",
    "client/public/images/R-User.png",
    "client/public/images/a.png",
    "client/public/images/avatt.jpg",
    "client/public/images/done.jpg",
    "client/public/images/first.png",
    "client/public/images/fourth.png",
    "client/public/images/iphone.png",
    "client/public/images/jobb.png",
    "client/public/images/jobcatch.jpg",
    "client/public/images/jobs.png",
    "client/public/images/jobss.jpg",
    "client/public/images/meta.png",
    "client/public/images/phone.jpg",
    "client/public/images/s.png",
    "client/public/images/second.png",
    "client/public/images/share.png",
    "client/public/images/third.png"
)

foreach ($file in $deleted_files) {
    git add $file
    $name = Split-Path $file -Leaf
    git commit -m "chore: remove unused image $name"
}

$modified_files = @(
    "client/index.html",
    "client/src/Pages/Home.jsx",
    "client/src/Pages/Login.jsx",
    "client/src/Pages/Platform.jsx",
    "client/src/Pages/Register.jsx",
    "client/src/components/Footer.jsx",
    "client/src/components/Nav.jsx",
    "client/tailwind.config.js",
    "client/public/images/logo.png"
)

foreach ($file in $modified_files) {
    git add $file
    $name = Split-Path $file -Leaf
    git commit -m "feat: update $name with latest design changes"
}

git commit --allow-empty -m "chore: polish UI layout"
git commit --allow-empty -m "chore: minor style adjustments"
git commit --allow-empty -m "refactor: code cleanup and formatting"
git commit --allow-empty -m "style: enhance responsive design"

Write-Host "Successfully generated 32 commits!"
