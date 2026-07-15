/* ================================================================
   Typewriter Effect — cycle through a list of phrases
   ================================================================ */
(function() {
    const el = document.getElementById('typewriter');
    const phrases = [
        '感知需求，设计原型',
        '撰写清晰的需求文档',
        '将想法转化为可落地方案',
        '（￣▽￣）'
    ];

    let phraseIdx   = 0;      // which phrase
    let charIdx     = 0;      // how many chars currently visible
    let isDeleting  = false;  // typing forward or backspacing
    let paused      = false;  // short pause between cycles

    const TYPE_SPEED   = 80;   // ms per char typed
    const DELETE_SPEED = 40;   // ms per char deleted
    const PAUSE_AFTER  = 1800; // ms pause before deleting
    const PAUSE_BEFORE = 400;  // ms pause before typing next phrase

    function tick() {
        const current = phrases[phraseIdx];

        if (paused) {
            paused = false;
            isDeleting = true;
            setTimeout(tick, DELETE_SPEED);
            return;
        }

        if (!isDeleting) {
            // Typing forward
            charIdx++;
            el.textContent = current.slice(0, charIdx);

            if (charIdx === current.length) {
                // Finished typing — pause then start deleting
                paused = true;
                setTimeout(tick, PAUSE_AFTER);
                return;
            }
            setTimeout(tick, TYPE_SPEED);
        } else {
            // Backspacing
            charIdx--;
            el.textContent = current.slice(0, charIdx);

            if (charIdx === 0) {
                // Fully deleted — move to next phrase
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(tick, PAUSE_BEFORE);
                return;
            }
            setTimeout(tick, DELETE_SPEED);
        }
    }

    // Start after a short initial delay
    setTimeout(tick, 600);
})();

/* ================================================================
   Project Data & Rendering
   ================================================================ */
(function() {
    const projects = [
        {
            name: '鸣潮3.5版本预热网页活动',
            desc: '鸣潮3.5版本玄方城的预热网页活动，通过旋转机关解谜的方式与游戏中机关变化之城玄方城联系起来，包含所需页面与流程逻辑。',
            tags: ['网页活动', '预热', '活动向'],
            date: '2026 / 06',
            thumb: 'Auth Flow',
            image:   'image/XFIMG.jpeg',                           // ← 填缩略图路径，如 'images/preview.png'
            protoUrl: 'project/xuanfang/page_2.png',
            docUrl:   'project/xuanfang/xian.pdf'
        }
    ];

    // Helper: return an <a> link if url is provided, else a plain <button>
    function cardButton(url, className, label) {
        if (url) {
            return `<a href="${url}" class="btn-outline ${className}" target="_blank">${label}</a>`;
        }
        return `<button class="btn-outline ${className}" disabled>${label}</button>`;
    }

    const grid = document.getElementById('projectGrid');

    const cards = projects.map(p => {
        const article = document.createElement('article');
        article.className = 'project-card';
        article.innerHTML = `
            <div class="card-thumb">
                ${p.image
                    ? `<img src="${p.image}" alt="${p.name}" class="thumb-img">`
                    : `<span class="thumb-label">${p.thumb}</span>`
                }
            </div>
            <div class="card-body">
                <p class="card-date">${p.date}</p>
                <h3>${p.name}</h3>
                <p class="card-desc">${p.desc}</p>
                <div class="card-tags">
                    ${p.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
                </div>
                <div class="card-actions">
                    ${cardButton(p.protoUrl, 'btn-prototype', '原型图')}
                    ${cardButton(p.docUrl, 'btn-doc', 'PRD')}
                </div>
            </div>
        `;
        return article;
    });

    cards.forEach(c => grid.appendChild(c));
})();
