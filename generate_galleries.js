const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const DIRS = [
    { id: 'xhs_guide_gallery', title: '小红书运营指南' },
    { id: 'card_gpu', title: '国产 GPU 独角兽上市潮' },
    { id: 'ai_2025_trends', title: '2025 AI 趋势预测' },
    { id: 'llm_quarterly_cards', title: '大模型季度观察' },
    { id: 'tencent_yuanbao_cards', title: '腾讯元宝深度解读' },
    { id: 'ai_infra_roundtable', title: 'AI 基础设施圆桌' },
    { id: 'luozhenyu_2026', title: '罗振宇「时间的朋友」2026' }
];

const TEMPLATE = (title, cards) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Zhang's Gallery</title>
    <style>
        :root { --bg: #1a1a1a; --card-bg: #2d2d2d; --text: #e0e0e0; --accent: #64ffda; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 40px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 60px; }
        h1 { color: var(--accent); font-size: 2.5rem; margin-bottom: 15px; }
        .back-link { color: #888; text-decoration: none; font-size: 1rem; display: inline-flex; align-items: center; gap: 5px; transition: color 0.2s; }
        .back-link:hover { color: white; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; }
        .card-wrapper { background: var(--card-bg); border-radius: 12px; padding: 15px; transition: transform 0.3s; }
        .card-wrapper:hover { transform: translateY(-5px); }
        .card-title { text-align: center; font-weight: bold; margin-bottom: 15px; color: #fff; }
        img.preview-img { width: 100%; border-radius: 8px; cursor: zoom-in; transition: opacity 0.2s; display: block; }
        img.preview-img:hover { opacity: 0.9; }
        .actions { margin-top: 15px; display: flex; gap: 10px; justify-content: center; }
        .btn { padding: 8px 16px; background: #333; color: var(--accent); text-decoration: none; border-radius: 4px; font-size: 0.9rem; border: 1px solid var(--accent); transition: all 0.2s; }
        .btn:hover { background: rgba(100,255,218,0.1); }
        
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); backdrop-filter: blur(5px); }
        .modal-content { margin: auto; display: block; max-width: 90%; max-height: 90vh; border-radius: 4px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .close { position: absolute; top: 20px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer; }
        
        footer { text-align: center; margin-top: 60px; color: #666; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <a href="../../index.html" class="back-link">← 返回画廊首页</a>
            <h1>${title}</h1>
        </header>

        <div class="gallery">
            ${cards.map(renderCard).join('')}
        </div>

        <footer>
            <p>© 2025 老章 Zhang's Gallery</p>
        </footer>
    </div>

    <div id="imageModal" class="modal" onclick="this.style.display='none'">
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImg">
    </div>

    <script>
        function openModal(src) {
            document.getElementById('imageModal').style.display = 'block';
            document.getElementById('modalImg').src = src;
        }
        document.addEventListener('keydown', e => { if(e.key === 'Escape') document.getElementById('imageModal').style.display = 'none'; });
    </script>
</body>
</html>`;

function renderCard(file) {
    const title = file.replace('.svg', '').replace(/card_|ai_|xhs_|llm_/g, '').replace(/_/g, ' ').replace(/\d+/, '').trim();
    return `
    <div class="card-wrapper">
        <div class="card-title">${title}</div>
        <img src="./${file}" class="preview-img" onclick="openModal(this.src)" loading="lazy">
        <div class="actions">
            <a href="./${file}" download class="btn">下载 SVG</a>
            <a href="https://svg.zhanglearning.com/" target="_blank" class="btn">转为 PNG</a>
        </div>
    </div>`;
}

function generate() {
    DIRS.forEach(dirInfo => {
        const dirPath = path.join(ASSETS_DIR, dirInfo.id);
        if (!fs.existsSync(dirPath)) return;

        const files = fs.readdirSync(dirPath)
            .filter(f => f.endsWith('.svg') && !f.startsWith('.'))
            .sort(); // 简单的字母排序，您可以根据需要调整

        const html = TEMPLATE(dirInfo.title, files);
        fs.writeFileSync(path.join(dirPath, 'index.html'), html);
        console.log(`Generated gallery for ${dirInfo.id} with ${files.length} cards.`);
    });
}

generate();
