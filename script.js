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
            image:   'image/XFIMG.jpeg',
            protoUrl: 'project/xuanfang/page_2.png',
            docUrl:   'project/xuanfang/PRD-xuanfangprewarm-V1.2.pdf'
        },
        {
            name: 'project Ptilopsis',
            desc: '从社区视角出发，针对当前明日方舟缺乏一个较为完整的理智规划工具的情况，所设计的集成资料查询，干员资料导入，理智规划，干员养成规划等功能的第三方工具型产品。',
            tags: ['社区工具', '效率提升', '功能向'],
            date: '2026 / 06',
            thumb: 'New',                                         
            image:   'image/BAIGUGU.jpeg',                         
            protoUrl: 'project/project Ptilopsis/page_1.png',                                          
            docUrl:   'project/project Ptilopsis/PRD-project Ptilopsis-V1.0.pdf'                                           
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
            </div>
            <div class="card-actions">
                ${cardButton(p.protoUrl, 'btn-prototype', '原型图')}
                ${cardButton(p.docUrl, 'btn-doc', 'PRD')}
            </div>
        `;
        return article;
    });

    cards.forEach(c => grid.appendChild(c));

    /* ===== Contact Modal ===== */
    const contactOverlay = document.getElementById('contactOverlay');
    const contactLink = document.querySelector('.nav-links a[href="#contact"]');

    // Contact data — in JS rather than HTML so crawlers can't scrape it
    const contactData = {
        email: { icon: '✉', label: '邮箱', value: '2375652664@qq.com' },
        
    };

    function renderContactInfo() {
        const list = document.getElementById('contactInfo');
        list.innerHTML = Object.values(contactData).map(c =>
            `<li>
                <span class="contact-icon">${c.icon}</span>
                <span>${c.label}：${c.value}</span>
            </li>`
        ).join('');
    }
    renderContactInfo();

    function openContact(e) {
        e.preventDefault();
        contactOverlay.classList.remove('exit');
        contactOverlay.classList.add('open');
        contactOverlay.setAttribute('aria-hidden', 'false');
    }

    function closeContact() {
        contactOverlay.classList.add('exit');
        contactOverlay.classList.remove('open');
        contactOverlay.setAttribute('aria-hidden', 'true');
        setTimeout(() => contactOverlay.classList.remove('exit'), 250);
    }

    contactLink.addEventListener('click', openContact);

    // Close: X button
    contactOverlay.querySelector('.contact-close').addEventListener('click', closeContact);

    // Close: click outside modal (on overlay backdrop)
    contactOverlay.addEventListener('click', (e) => {
        if (e.target === contactOverlay) closeContact();
    });

    // Close: Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactOverlay.classList.contains('open')) closeContact();
    });

    /* ===== Card click → button flash ===== */
    grid.addEventListener('click', (e) => {
        // Don't flash if the click is on a button itself — let the link work
        if (e.target.closest('.card-actions .btn-outline')) return;

        const card = e.target.closest('.project-card');
        if (!card) return;

        const btns = card.querySelectorAll('.card-actions .btn-outline');
        btns.forEach(btn => {
            btn.classList.remove('flash');
            void btn.offsetWidth; // force reflow to restart animation
            btn.classList.add('flash');
        });
    });
})();
