// Khởi tạo thư viện marked với highlight.js
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    langPrefix: 'hljs language-',
    breaks: true,
    gfm: true
});

// Lấy các elements
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const readerContainer = document.getElementById('reader-container');
const contentDiv = document.getElementById('content');
const btnExport = document.getElementById('btn-export');
const btnTheme = document.getElementById('btn-theme');
const highlightTheme = document.getElementById('highlight-theme');

let currentFileName = 'document';

// Quản lý Dark/Light Theme
let isDark = localStorage.getItem('theme') === 'dark';

const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    highlightTheme.href = isDark 
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

applyTheme();

btnTheme.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme();
});

// Xử lý đọc file
function processFile(file) {
    if (!file) return;
    
    // Kiểm tra đuôi file
    if (!file.name.match(/\.(md|markdown)$/i)) {
        alert("Vui lòng chọn file Markdown (.md)");
        return;
    }
    
    currentFileName = file.name.replace(/\.[^/.]+$/, "");
    document.title = currentFileName + " - MD Reader";

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        
        // Render markdown sang HTML
        contentDiv.innerHTML = marked.parse(text);
        
        // Chuyển UI
        dropZone.style.display = 'none';
        readerContainer.style.display = 'block';
        
        // Cuộn lên đầu
        document.querySelector('.main-content').scrollTop = 0;
    };
    reader.readAsText(file);
}

// Bắt sự kiện chọn file từ nút
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        processFile(e.target.files[0]);
    }
});

// Bắt sự kiện kéo thả file
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
    }
});

// Ngăn trình duyệt tự động mở file khi kéo thả bên ngoài vùng drop
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => e.preventDefault());

// Xử lý xuất file PDF
btnExport.addEventListener('click', () => {
    if(readerContainer.style.display === 'none') {
        alert("Vui lòng mở file Markdown trước khi xuất PDF.");
        return;
    }

    const element = document.getElementById('content');
    
    // Cấu hình PDF
    const opt = {
        margin:       15,
        filename:     `${currentFileName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Tạm thời chuyển sang light theme để in PDF cho đẹp
    const wasDark = isDark;
    if (wasDark) {
        isDark = false;
        applyTheme();
    }

    // Đợi 100ms để CSS áp dụng trước khi in
    setTimeout(() => {
        html2pdf().set(opt).from(element).save().then(() => {
            // Khôi phục lại theme ban đầu
            if (wasDark) {
                isDark = true;
                applyTheme();
            }
        });
    }, 100);
});
