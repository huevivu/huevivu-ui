const fs = require('fs');
const path = require('path');

// Lấy danh sách các file markdown trong thư mục brain (artifacts)
const sourceDir = path.join(__dirname, '..', '.gemini', 'antigravity-ide', 'brain');
const targetDir = path.join(__dirname, 'docs', 'progress');

// Vì đường dẫn thực tế có thể thay đổi, ta sẽ truyền path thủ công hoặc quét thư mục cha
// Ở đây ta đơn giản hóa: Sao chép từ thư mục chỉ định vào thư mục hiện tại

function getFormattedDate() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${mm}-${dd}-${yy}-${h}-${m}`;
}

async function exportDocs(sourceFilesPath) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const timestamp = getFormattedDate();
  
  const filesToExport = ['walkthrough.md', 'implementation_plan.md', 'task.md'];
  
  filesToExport.forEach(file => {
    const sourcePath = path.join(sourceFilesPath, file);
    if (fs.existsSync(sourcePath)) {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const targetPath = path.join(targetDir, `${baseName}-${timestamp}${ext}`);
      
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Đã xuất: ${targetPath}`);
    } else {
      console.log(`⚠️ Không tìm thấy: ${sourcePath}`);
    }
  });
}

// Đường dẫn thực tế của artifacts workspace
const brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\a54a0290-f83e-4e1b-9727-3b64b53be07f';
exportDocs(brainDir);
