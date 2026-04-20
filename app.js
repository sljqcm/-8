const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const downloadBtn = document.getElementById('download');

const template = new Image();
template.src = 'template.png';

let userImg = null;

// 👉 控制参数（关键）
let state = {
    x: 100,
    y: 100,
    scale: 1,
    dragging: false,
    startX: 0,
    startY: 0
};

// 初始化
template.onload = () => {
    canvas.width = template.width;
    canvas.height = template.height;
    render();
};

// 上传图片
upload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    userImg = new Image();
    userImg.src = URL.createObjectURL(file);

    userImg.onload = render;
});

// 渲染
function render() {
    if (!template) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (userImg) {
        const w = userImg.width * state.scale;
        const h = userImg.height * state.scale;

        ctx.drawImage(userImg, state.x, state.y, w, h);
    }

    // 覆盖模板（关键）
    ctx.drawImage(template, 0, 0);
}

// 鼠标拖动
canvas.addEventListener('mousedown', e => {
    state.dragging = true;
    state.startX = e.offsetX - state.x;
    state.startY = e.offsetY - state.y;
});

canvas.addEventListener('mousemove', e => {
    if (!state.dragging) return;

    state.x = e.offsetX - state.startX;
    state.y = e.offsetY - state.startY;

    render();
});

canvas.addEventListener('mouseup', () => {
    state.dragging = false;
});

// 👉 滚轮缩放（像那个网站一样）
canvas.addEventListener('wheel', e => {
    e.preventDefault();

    const scaleAmount = -e.deltaY * 0.001;
    state.scale += scaleAmount;

    if (state.scale < 0.1) state.scale = 0.1;
    if (state.scale > 5) state.scale = 5;

    render();
});

// 👉 手机触摸支持
canvas.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();

    state.dragging = true;
    state.startX = touch.clientX - rect.left - state.x;
    state.startY = touch.clientY - rect.top - state.y;
});

canvas.addEventListener('touchmove', e => {
    if (!state.dragging) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();

    state.x = touch.clientX - rect.left - state.startX;
    state.y = touch.clientY - rect.top - state.startY;

    render();
});

canvas.addEventListener('touchend', () => {
    state.dragging = false;
});

// 下载
downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'result.png';
    link.href = canvas.toDataURL();
    link.click();
};
