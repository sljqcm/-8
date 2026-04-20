const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');

// 🔥 你的透明模板（必须存在）
const TEMPLATE_SRC = 'template.png';

// 👉 模板中“用户图片放置区域”（你需要改这个）
const TARGET = {
    x: 100,
    y: 150,
    width: 300,
    height: 300
};

let templateImg = new Image();
templateImg.src = TEMPLATE_SRC;

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userImg = new Image();
    userImg.src = URL.createObjectURL(file);

    userImg.onload = () => {
        render(userImg);
    };
});

function render(userImg) {
    // 设置画布为模板大小
    canvas.width = templateImg.width;
    canvas.height = templateImg.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ① 画用户图片（自动填充目标区域）
    drawCover(userImg, TARGET);

    // ② 覆盖透明模板（关键）
    ctx.drawImage(templateImg, 0, 0);
}

// 👉 等比填充（不会变形）
function drawCover(img, target) {
    const imgRatio = img.width / img.height;
    const targetRatio = target.width / target.height;

    let drawWidth, drawHeight;

    if (imgRatio > targetRatio) {
        drawHeight = target.height;
        drawWidth = drawHeight * imgRatio;
    } else {
        drawWidth = target.width;
        drawHeight = drawWidth / imgRatio;
    }

    const dx = target.x - (drawWidth - target.width) / 2;
    const dy = target.y - (drawHeight - target.height) / 2;

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
}

// 下载
downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'fusion.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
};
