const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const tplInput = document.getElementById('tpl');
const imgInput = document.getElementById('img');
const downloadBtn = document.getElementById('download');

let templateImg = null;
let userImg = null;

// 👉 固定放置区域（你可以后面改）
const target = {
    x: 100,
    y: 100,
    width: 300,
    height: 300
};

// =======================
// 上传模板（透明PNG）
// =======================
tplInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    templateImg = new Image();
    templateImg.src = URL.createObjectURL(file);

    templateImg.onload = render;
});

// =======================
// 上传内容图片
// =======================
imgInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    userImg = new Image();
    userImg.src = URL.createObjectURL(file);

    userImg.onload = render;
});

// =======================
// 核心渲染
// =======================
function render() {
    if (!templateImg) return;

    canvas.width = templateImg.width;
    canvas.height = templateImg.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ① 先画用户图片（填充目标区域）
    if (userImg) {
        drawCover(userImg, target);
    }

    // ② 再画透明模板（覆盖层）
    ctx.drawImage(templateImg, 0, 0);
}

// =======================
// 等比填充（不变形）
// =======================
function drawCover(img, t) {
    const ir = img.width / img.height;
    const tr = t.width / t.height;

    let w, h;

    if (ir > tr) {
        h = t.height;
        w = h * ir;
    } else {
        w = t.width;
        h = w / ir;
    }

    const x = t.x - (w - t.width) / 2;
    const y = t.y - (h - t.height) / 2;

    ctx.drawImage(img, x, y, w, h);
}

// =======================
// 下载
// =======================
downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.download = 'result.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
};
