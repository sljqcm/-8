const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

let images = [];
let mode = 'horizontal';

function setMode(m) {
    mode = m;
    alert('当前模式：' + (m === 'horizontal' ? '横向' : '纵向'));
}

upload.addEventListener('change', function (e) {
    const files = Array.from(e.target.files);

    preview.innerHTML = '';
    images = [];

    files.forEach(file => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.src = url;
        img.className = 'preview-img';

        img.onload = () => {
            images.push(img);
        };

        preview.appendChild(img);
    });
});

function mergeImages() {
    if (images.length === 0) {
        alert('请先上传图片');
        return;
    }

    let totalWidth = 0;
    let totalHeight = 0;

    if (mode === 'horizontal') {
        totalWidth = images.reduce((sum, img) => sum + img.width, 0);
        totalHeight = Math.max(...images.map(img => img.height));
    } else {
        totalHeight = images.reduce((sum, img) => sum + img.height, 0);
        totalWidth = Math.max(...images.map(img => img.width));
    }

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    let x = 0;
    let y = 0;

    images.forEach(img => {
        ctx.drawImage(img, x, y);

        if (mode === 'horizontal') {
            x += img.width;
        } else {
            y += img.height;
        }
    });

    downloadBtn.style.display = 'inline-block';
}

downloadBtn.onclick = function () {
    const link = document.createElement('a');
    link.download = 'merged.png';
    link.href = canvas.toDataURL();
    link.click();
};
