const fs = require('fs');

// Read diagrams.md
const mdContent = fs.readFileSync('diagrams.md', 'utf-8');

// The HTML Template
const htmlTemplate = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HueViVu — System Architecture</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #FF7F6B;
            --primary-light: #fff1f0;
            --text-dark: #0f172a;
            --text-gray: #64748b;
            --bg-body: #f8fafc;
            --bg-card: #ffffff;
            --border: #e2e8f0;
        }

        body {
            margin: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-body);
            color: var(--text-dark);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Layout */
        .layout {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar (TOC) */
        .sidebar {
            width: 320px;
            background: var(--bg-card);
            padding: 30px 20px;
            border-right: 1px solid var(--border);
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
            box-sizing: border-box;
            flex-shrink: 0;
            z-index: 10;
        }

        .logo {
            font-size: 22px;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 30px;
            padding-left: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #toc {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        #toc a {
            display: block;
            padding: 10px 12px;
            color: var(--text-gray);
            text-decoration: none;
            border-radius: 10px;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        #toc a:hover {
            background: var(--bg-body);
            color: var(--text-dark);
        }

        #toc a.active {
            background: var(--primary-light);
            color: var(--primary);
            font-weight: 600;
        }

        #toc a.h3 {
            padding-left: 30px;
            font-size: 13.5px;
            position: relative;
        }
        
        #toc a.h3::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 50%;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #cbd5e1;
            transform: translateY(-50%);
        }

        #toc a.h3.active::before {
            background: var(--primary);
        }

        /* Main Content */
        .main-content {
            flex: 1;
            padding: 50px 80px;
            min-width: 0;
            box-sizing: border-box;
        }

        .content-container {
            max-width: 1000px;
            margin: 0 auto;
        }

        /* Markdown Styling */
        #markdown-body h1 {
            font-size: 2.5em;
            color: var(--text-dark);
            margin-bottom: 40px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        #markdown-body h2 {
            font-size: 1.8em;
            color: var(--text-dark);
            margin-top: 60px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--border);
            scroll-margin-top: 40px;
        }

        #markdown-body h3 {
            font-size: 1.3em;
            color: #334155;
            margin-top: 40px;
            scroll-margin-top: 40px;
        }

        #markdown-body p, #markdown-body li {
            font-size: 1.05em;
            color: #475569;
        }

        blockquote {
            border-left: 4px solid var(--primary);
            background: var(--primary-light);
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 12px 12px 0;
            color: #475569;
        }

        pre {
            background: #1e293b;
            color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            overflow-x: auto;
            font-family: 'Fira Code', monospace;
            font-size: 0.9em;
        }

        code {
            background: #e2e8f0;
            padding: 3px 6px;
            border-radius: 6px;
            font-size: 0.9em;
            color: #be123c;
        }

        pre code {
            background: transparent;
            padding: 0;
            color: inherit;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            background: var(--bg-card);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }

        th {
            background: #f1f5f9;
            font-weight: 600;
            color: #334155;
        }

        /* Mermaid Wrapper */
        .mermaid-container {
            position: relative;
            margin: 40px 0;
            background: var(--bg-card);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.04);
            border: 1px solid var(--border);
        }

        .mermaid {
            padding: 40px;
            display: flex;
            justify-content: center;
            overflow: auto;
            transition: zoom 0.2s ease; /* For CSS zoom */
        }
        
        /* Ensure SVGs inside mermaid don't get clipped weirdly when scaled */
        .mermaid svg {
            transform-origin: top left;
        }

        /* Zoom Controls */
        .zoom-controls {
            position: absolute;
            top: 15px;
            right: 15px;
            display: flex;
            gap: 8px;
            background: rgba(255, 255, 255, 0.95);
            padding: 6px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            z-index: 10;
            border: 1px solid #e2e8f0;
        }

        .zoom-btn {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            width: 30px;
            height: 30px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            color: #334155;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .zoom-btn:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }

        /* Loading */
        #loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50vh;
            color: var(--text-gray);
            font-size: 1.2em;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .sidebar { width: 250px; }
            .main-content { padding: 40px; }
        }
        @media (max-width: 768px) {
            .layout { flex-direction: column; }
            .sidebar { width: 100%; height: auto; position: relative; border-right: none; border-bottom: 1px solid var(--border); padding: 20px; }
            .main-content { padding: 20px; }
        }
    </style>
    <!-- Marked.js -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <!-- Mermaid.js -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
</head>
<body>

<div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="logo">
            <span>🌸</span> HueViVu Docs
        </div>
        <nav id="toc">
            <!-- TOC will be injected here -->
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <div class="content-container">
            <div id="loading">✨ Đang tải biểu đồ mô hình hệ thống...</div>
            <div id="markdown-body" style="display: none;"></div>
        </div>
    </main>
</div>

<!-- Embedded Markdown -->
<script type="text/markdown" id="raw-markdown">
${mdContent.replace(/<\/script>/g, '<\\/script>')}
</script>

<script>
    // Initialize Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
            primaryColor: '#ffffff',
            primaryBorderColor: '#cbd5e1',
            primaryTextColor: '#0f172a',
            lineColor: '#94a3b8',
            secondaryColor: '#fff1f0',
            tertiaryColor: '#f8fafc',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '14px'
        },
        er: {
            layoutDirection: 'LR',
            minEntityWidth: 150,
            minEntityHeight: 70,
            entityPadding: 20,
            stroke: '#94a3b8',
            fill: '#ffffff'
        },
        flowchart: {
            curve: 'basis',
            nodeSpacing: 50,
            rankSpacing: 50
        },
        sequence: {
            actorBkg: '#fff1f0',
            actorBorder: '#FF7F6B',
            actorTextColor: '#0f172a',
            noteBkgColor: '#f1f5f9',
            noteBorderColor: '#cbd5e1',
            messageTextColor: '#475569'
        }
    });

    const text = document.getElementById('raw-markdown').textContent;
    const html = marked.parse(text);
    const body = document.getElementById('markdown-body');
    body.innerHTML = html;
    
    // Find all mermaid code blocks, convert them and wrap them for zoom
    const mermaidBlocks = body.querySelectorAll('pre code.language-mermaid');
    mermaidBlocks.forEach(block => {
        const pre = block.parentElement;
        
        const container = document.createElement('div');
        container.className = 'mermaid-container';
        
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = block.textContent; 
        
        container.appendChild(div);
        
        // Add zoom controls
        const controls = document.createElement('div');
        controls.className = 'zoom-controls';
        controls.innerHTML = \`
            <button class="zoom-btn zoom-in" title="Phóng to">+</button>
            <button class="zoom-btn zoom-out" title="Thu nhỏ">−</button>
            <button class="zoom-btn zoom-reset" title="Khôi phục" style="font-size: 13px;">↻</button>
        \`;
        container.appendChild(controls);
        
        // Simple safe CSS zoom logic
        let currentZoom = 1;
        controls.querySelector('.zoom-in').addEventListener('click', () => {
            currentZoom += 0.2;
            div.style.zoom = currentZoom;
        });
        controls.querySelector('.zoom-out').addEventListener('click', () => {
            currentZoom = Math.max(0.4, currentZoom - 0.2);
            div.style.zoom = currentZoom;
        });
        controls.querySelector('.zoom-reset').addEventListener('click', () => {
            currentZoom = 1;
            div.style.zoom = currentZoom;
        });

        pre.replaceWith(container);
    });
    
    buildTOC(body);

    document.getElementById('loading').style.display = 'none';
    body.style.display = 'block';

    // Render Mermaid Diagrams
    mermaid.run({
        nodes: document.querySelectorAll('.mermaid')
    }).then(() => {
        setupScrollSpy();
    });

    function buildTOC(container) {
        const headings = container.querySelectorAll('h2, h3');
        const toc = document.getElementById('toc');
        
        headings.forEach((h, i) => {
            if (!h.id) {
                const safeText = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                h.id = \`\${safeText}-\${i}\`;
            }
            
            const link = document.createElement('a');
            link.href = '#' + h.id;
            link.textContent = h.textContent.replace(/^#+\\s*/, '');
            link.className = h.tagName.toLowerCase();
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(h.id);
                window.scrollTo({
                    top: target.offsetTop - 40,
                    behavior: 'smooth'
                });
                history.pushState(null, null, '#' + h.id);
            });
            
            toc.appendChild(link);
        });
    }

    function setupScrollSpy() {
        const links = document.querySelectorAll('#toc a');
        const headings = Array.from(document.querySelectorAll('#markdown-body h2, #markdown-body h3'));
        
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 100;
            
            let current = '';
            for (let i = 0; i < headings.length; i++) {
                if (headings[i].offsetTop <= scrollPos) {
                    current = headings[i].id;
                } else {
                    break; 
                }
            }
            
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                    const toc = document.getElementById('toc');
                    const linkRect = link.getBoundingClientRect();
                    const tocRect = toc.parentElement.getBoundingClientRect();
                    if (linkRect.bottom > tocRect.bottom || linkRect.top < tocRect.top) {
                        link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        });
    }
</script>
</body>
</html>`;

fs.writeFileSync('huevivu-diagram.html', htmlTemplate);
console.log('Successfully created huevivu-diagram.html');
