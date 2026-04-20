const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const modeSelect = document.getElementById('mode');
const downloadBtn = document.getElementById('download');

let images = [];

upload.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);

    images = await Promise.all(files.map(loadImage));

    autoMerge(); // ✅ 自动拼图
});

modeSelect.addEventListener('change', autoMerge);

function loadImage(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => resolve(img);
    });
}

function autoMerge() {
    if (images.length === 0) return;

    const mode = modeSelect.value;

    if (mode === 'horizontal') mergeHorizontal();
    if (mode === 'vertical') mergeVertical();
    if (mode === 'grid') mergeGrid();
}

// 横向拼接
function mergeHorizontal() {
    const height = Math.max(...images.map(i => i.height));
    const width = images.reduce((sum, i) => sum + i.width, 0);

    canvas.width = width;
    canvas.height = height;

    let x = 0;
    images.forEach(img => {
        ctx.drawImage(img, x, 0);
        x += img.width;
    });
}

// 纵向拼接
function mergeVertical() {
    const width = Math.max(...images.map(i => i.width));
    const height = images.reduce((sum, i) => sum + i.height, 0);

    canvas.width = width;
    canvas.height = height;

    let y = 0;
    images.forEach(img => {
        ctx.drawImage(img, 0, y);
        y += img.height;
    });
}

// 网格拼接（自动计算列数）
function mergeGrid() {
    const cols = Math.ceil(Math.sqrt(images.length));
    const rows = Math.ceil(images.length / cols);

    const size = 200; // 每张缩放尺寸

    canvas.width = cols * size;
    canvas.height = rows * size;

    images.forEach((img, index) => {
        const x = (index % cols) * size;
        const y = Math.floor(index / cols) * size;

        ctx.drawImage(img, x, y, size, size);
    });
}

// 下载
downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'merged.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
};
