// Holland Test Data
const QUESTIONS = [
    // Realistic (R) - Thực tế
    { id: 1, text: "Tôi thích làm việc với máy móc hoặc công cụ", type: "R" },
    { id: 2, text: "Tôi thích sửa chữa những thứ bị hỏng", type: "R" },
    { id: 3, text: "Tôi thích công việc đòi hỏi kỹ năng thủ công", type: "R" },
    { id: 4, text: "Tôi thích hoạt động ngoài trời", type: "R" },
    { id: 5, text: "Tôi thích làm việc với đất đá, gỗ hoặc kim loại", type: "R" },
    { id: 6, text: "Tôi thích công việc liên quan đến xây dựng", type: "R" },

    // Investigative (I) - Tò mò
    { id: 7, text: "Tôi thích khám phá và tìm hiểu những điều mới", type: "I" },
    { id: 8, text: "Tôi thích giải quyết các vấn đề phức tạp", type: "I" },
    { id: 9, text: "Tôi thích ngành khoa học và nghiên cứu", type: "I" },
    { id: 10, text: "Tôi thích phân tích dữ liệu và thông tin", type: "I" },
    { id: 11, text: "Tôi thích sử dụng máy tính và công nghệ", type: "I" },
    { id: 12, text: "Tôi thích công việc đòi hỏi suy nghĩ logic", type: "I" },

    // Artistic (A) - Sáng tạo
    { id: 13, text: "Tôi thích biểu đạt sáng tạo của mình", type: "A" },
    { id: 14, text: "Tôi thích vẽ vặn hoặc sáng tác", type: "A" },
    { id: 15, text: "Tôi thích âm nhạc, nghệ thuật hoặc sân khấu", type: "A" },
    { id: 16, text: "Tôi thích thiết kế và làm đẹp mọi thứ", type: "A" },
    { id: 17, text: "Tôi thích công việc cho phép phát triển ý tưởng độc lập", type: "A" },
    { id: 18, text: "Tôi thích viết lách hoặc sáng tác câu chuyện", type: "A" },

    // Social (S) - Xã hội
    { id: 19, text: "Tôi thích giúp đỡ những người khác", type: "S" },
    { id: 20, text: "Tôi thích làm việc với người khác hơn là làm một mình", type: "S" },
    { id: 21, text: "Tôi thích công việc liên quan đến giáo dục hoặc đào tạo", type: "S" },
    { id: 22, text: "Tôi thích nói chuyện và giao tiếp với mọi người", type: "S" },
    { id: 23, text: "Tôi thích lắng nghe và hiểu cảm xúc của người khác", type: "S" },
    { id: 24, text: "Tôi thích công việc liên quan đến chăm sóc sức khỏe hoặc xã hội", type: "S" },

    // Enterprising (E) - Kinh doanh
    { id: 25, text: "Tôi thích lãnh đạo và thuyết phục người khác", type: "E" },
    { id: 26, text: "Tôi thích công việc liên quan đến bán hàng hoặc marketing", type: "E" },
    { id: 27, text: "Tôi thích quản lý và tổ chức các hoạt động", type: "E" },
    { id: 28, text: "Tôi thích thách thức và cạnh tranh", type: "E" },
    { id: 29, text: "Tôi thích kinh doanh hoặc khởi nghiệp", type: "E" },
    { id: 30, text: "Tôi thích có ảnh hưởng và quyền lực trong công việc", type: "E" },

    // Conventional (C) - Truyền thống
    { id: 31, text: "Tôi thích công việc có cấu trúc và quy tắc rõ ràng", type: "C" },
    { id: 32, text: "Tôi thích sắp xếp và tổ chức thông tin", type: "C" },
    { id: 33, text: "Tôi thích công việc hành chính hoặc kế toán", type: "C" },
    { id: 34, text: "Tôi thích thực hiện công việc một cách chính xác", type: "C" },
    { id: 35, text: "Tôi thích làm việc một cách có trật tự và có kế hoạch", type: "C" },
    { id: 36, text: "Tôi thích công việc có tiền lương ổn định", type: "C" }
];

const SCALE = [
    { value: 0, label: "Không đồng ý" },
    { value: 1, label: "Ít đồng ý" },
    { value: 2, label: "Đồng ý" },
    { value: 3, label: "Rất đồng ý" }
];

const TYPE_INFO = {
    R: { name: "Realistic - Thực tế", description: "Người thực tế, thích làm việc với tay, máy móc" },
    I: { name: "Investigative - Tò mò", description: "Người tò mò, thích khám phá, nghiên cứu" },
    A: { name: "Artistic - Sáng tạo", description: "Người sáng tạo, thích biểu đạt, nghệ thuật" },
    S: { name: "Social - Xã hội", description: "Người xã hội, thích giúp đỡ, giao tiếp" },
    E: { name: "Enterprising - Kinh doanh", description: "Người kinh doanh, thích lãnh đạo, cạnh tranh" },
    C: { name: "Conventional - Truyền thống", description: "Người truyền thống, thích có trật tự, kỹ luật" }
};

const CAREERS = {
    R: ["Kỹ sư cơ khí", "Thợ xây dựng", "Điện lực", "Nông dân", "Tài xế", "Thợ cơ khí", "Lái máy bay"],
    I: ["Nhà khoa học", "Lập trình viên", "Bác sĩ", "Kiến trúc sư", "Kỹ sư phần mềm", "Nhà toán học", "Nhà hóa học"],
    A: ["Đạo diễn", "Họa sĩ", "Nhạc sĩ", "Nhà thiết kế", "Nhà văn", "Nhiếp ảnh gia", "Diễn viên"],
    S: ["Giáo viên", "Trợ lý xã hội", "Y tá", "Tâm lý sư", "Công tác xã hội", "Hướng dẫn viên du lịch", "Tư vấn viên"],
    E: ["Quản lý doanh nghiệp", "Người bán hàng", "Nhà tiếp thị", "CEO", "Chủ doanh nghiệp", "Người quản lý bán lẻ", "Tài phiệt"],
    C: ["Kế toán", "Thư ký", "Nhân viên hành chính", "Lập chỉ số", "Công chức", "Kiểm soát chất lượng", "Lễ tân"]
};

const CAREER_EMOJIS = {
    "Kỹ sư cơ khí": "⚙️",
    "Thợ xây dựng": "🏗️",
    "Điện lực": "⚡",
    "Nông dân": "🚜",
    "Tài xế": "🚗",
    "Thợ cơ khí": "🔧",
    "Lái máy bay": "✈️",
    "Nhà khoa học": "🔬",
    "Lập trình viên": "💻",
    "Bác sĩ": "👨‍⚕️",
    "Kiến trúc sư": "🏛️",
    "Kỹ sư phần mềm": "🖥️",
    "Nhà toán học": "📐",
    "Nhà hóa học": "🧪",
    "Đạo diễn": "🎬",
    "Họa sĩ": "🎨",
    "Nhạc sĩ": "🎵",
    "Nhà thiết kế": "🎭",
    "Nhà văn": "✍️",
    "Nhiếp ảnh gia": "📸",
    "Diễn viên": "🎪",
    "Giáo viên": "📚",
    "Trợ lý xã hội": "🤝",
    "Y tá": "🏥",
    "Tâm lý sư": "🧠",
    "Công tác xã hội": "💝",
    "Hướng dẫn viên du lịch": "🌍",
    "Tư vấn viên": "👔",
    "Quản lý doanh nghiệp": "📊",
    "Người bán hàng": "🛍️",
    "Nhà tiếp thị": "📢",
    "CEO": "👑",
    "Chủ doanh nghiệp": "🏢",
    "Người quản lý bán lẻ": "🏬",
    "Tài phiệt": "💼",
    "Kế toán": "📋",
    "Thư ký": "📝",
    "Nhân viên hành chính": "📄",
    "Lập chỉ số": "📊",
    "Công chức": "🏛️",
    "Kiểm soát chất lượng": "✅",
    "Lễ tân": "👋"
};

let currentQuestion = 0;
let answers = {}; // Lưu trữ câu trả lời
let scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

function startTest() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('testScreen').style.display = 'block';
    currentQuestion = 0;
    answers = {};
    scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    displayQuestion();
}

function displayQuestion() {
    const question = QUESTIONS[currentQuestion];
    const container = document.getElementById('questionsContainer');
    
    // Update progress
    updateProgress();
    
    // Create question HTML
    let html = `
        <div class="question-section active">
            <div class="question-text">${question.text}</div>
            <div class="options">
    `;
    
    SCALE.forEach((option) => {
        const isSelected = answers[currentQuestion] === option.value;
        const selectedClass = isSelected ? 'selected' : '';
        html += `
            <div class="option ${selectedClass}">
                <input type="radio" id="opt${option.value}" name="answer" value="${option.value}" 
                       ${isSelected ? 'checked' : ''} onchange="selectAnswer(${option.value})">
                <label for="opt${option.value}">${option.label}</label>
            </div>
        `;
    });
    
    html += `</div></div>`;
    container.innerHTML = html;
    
    // Update buttons
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').textContent = currentQuestion === QUESTIONS.length - 1 
        ? 'Xem Kết Quả' 
        : 'Tiếp Theo ';
}

function updateProgress() {
    const progress = ((currentQuestion) / QUESTIONS.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
    document.getElementById('questionCounter').textContent = `Câu ${currentQuestion + 1}/${QUESTIONS.length}`;
}

function selectAnswer(value) {
    answers[currentQuestion] = value;
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    event.target.closest('.option').classList.add('selected');
}

function nextQuestion() {
    if (currentQuestion === QUESTIONS.length - 1) {
        calculateResults();
        return;
    }
    if (currentQuestion < QUESTIONS.length - 1) {
        currentQuestion++;
        displayQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

function calculateResults() {
    // Tính toán điểm
    scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    QUESTIONS.forEach((question, index) => {
        const answer = answers[index] !== undefined ? answers[index] : 0;
        const type = question.type;
        scores[type] += answer;
    });
    
    // Sắp xếp để tìm ra 3 loại cao nhất
    const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topTypes = sortedTypes.slice(0, 3).map(entry => entry[0]);
    
    displayResults(topTypes);
}

function displayResults(topTypes) {
    document.getElementById('testScreen').style.display = 'none';
    document.getElementById('resultsScreen').classList.add('active');
    
    const code = topTypes.join('');
    const typeName = topTypes.map(t => TYPE_INFO[t].name).join(' + ');
    const description = topTypes.map(t => TYPE_INFO[t].description).join(' | ');
    
    document.getElementById('resultCode').textContent = code;
    document.getElementById('resultDescription').textContent = description;
    
    // Display scores
    let scoresHtml = '';
    Object.keys(scores).sort().forEach(type => {
        const maxScore = 18; // 6 questions × 3 max points
        const percentage = (scores[type] / maxScore) * 100;
        scoresHtml += `
            <div class="score-card">
                <div class="type-code">${type}</div>
                <div class="type-name">${TYPE_INFO[type].name.split(' - ')[1]}</div>
                <div class="score">${scores[type]}/18</div>
                <div class="score-bar">
                    <div class="score-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    });
    document.getElementById('scoresContainer').innerHTML = scoresHtml;
    
    // Display career recommendations
    let careersHtml = '';
    const careers = topTypes.flatMap(type => CAREERS[type]);
    const uniqueCareers = [...new Set(careers)];
    
    uniqueCareers.forEach(career => {
        const emoji = CAREER_EMOJIS[career] || '💼';
        careersHtml += `
            <div class="career-item">
                <div class="emoji">${emoji}</div>
                <div class="name">${career}</div>
            </div>
        `;
    });
    document.getElementById('careersContainer').innerHTML = careersHtml;
    
    // Store result in localStorage
    localStorage.setItem('hollandTestResult', JSON.stringify({
        code: code,
        scores: scores,
        topTypes: topTypes,
        timestamp: new Date().toLocaleString('vi-VN')
    }));

    // Auto save to database
    setTimeout(() => {
        const userName = prompt("Chúc mừng bạn đã hoàn thành bài test! Vui lòng nhập TÊN của bạn để lưu hồ sơ và nhận mã số tư vấn cá nhân:");
        if (userName) {
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const resultText = `Kết quả Holland: ${code} - ${description}\nCác ngành phù hợp: ${uniqueCareers.slice(0, 5).join(', ')}`;
            
            const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:5000' 
                : 'https://api.bimo.lemigo.xyz';

            fetch(`${API_BASE_URL}/api/save_holland`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userName,
                    code: randomCode.toString(),
                    result_text: resultText
                })
            }).then(res => res.json()).then(data => {
                if (data.status === "success") {
                    alert(`✅ HỒ SƠ ĐÃ ĐƯỢC LƯU!\n\nMã định danh của bạn là: [ ${userName} ${randomCode} ]\n\n📌 LƯU Ý: Hãy nhập nguyên văn mã này (VD: "Mình là ${userName} ${randomCode}") khi chat với Bimo để Bimo tự động nhận diện và tư vấn đúng ngành cho bạn nhé!`);
                } else {
                    alert("Lỗi lưu kết quả: " + data.message);
                }
            }).catch(e => {
                console.error("Error saving holland test:", e);
                alert(`Mã của bạn là: ${userName} ${randomCode} (Lưu ý: Không kết nối được tới server nội bộ)`);
            });
        }
    }, 500);
}

function restartTest() {
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('startScreen').style.display = 'block';
    currentQuestion = 0;
    answers = {};
    scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

function downloadResult() {
    const result = localStorage.getItem('hollandTestResult');
    if (!result) return;
    
    const data = JSON.parse(result);
    const code = document.getElementById('resultCode').textContent;
    const description = document.getElementById('resultDescription').textContent;
    
    let content = `KẾT QUẢ TEST HƯỚNG NGHIỆP HOLLAND\n`;
    content += `===================================\n\n`;
    content += `Mã RIASEC: ${code}\n`;
    content += `Mô tả: ${description}\n\n`;
    content += `Điểm Số Chi Tiết:\n`;
    content += `-----------------\n`;
    
    Object.keys(data.scores).sort().forEach(type => {
        content += `${type}: ${data.scores[type]}/18\n`;
    });
    
    content += `\nCác ngành nghề phù hợp:\n`;
    content += `-----------------------\n`;
    
    const topTypes = data.topTypes;
    const careers = topTypes.flatMap(type => CAREERS[type]);
    const uniqueCareers = [...new Set(careers)];
    uniqueCareers.forEach((career, index) => {
        content += `${index + 1}. ${career}\n`;
    });
    
    content += `\nNgày thi: ${data.timestamp}\n`;
    content += `---\n`;
    content += `Được tạo bởi DreamNavigator\n`;
    content += `https://dream.lemigo.xyz/\n`;
    
    // Download file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `Holland_Test_Result_${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if there's a saved result
    const savedResult = localStorage.getItem('hollandTestResult');
    if (savedResult && window.location.hash === '#view-result') {
        startTest();
        // We can enhance this to view previous results
    }
});
