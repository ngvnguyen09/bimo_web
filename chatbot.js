(function () {
    const TYPE_INFO = {
        R: {
            name: 'Thuc te',
            viName: 'Thực tế',
            careers: ['ky thuat co khi', 'dien dien tu', 'xay dung', 'nong nghiep cong nghe cao', 'van hanh may moc']
        },
        I: {
            name: 'Nghien cuu',
            viName: 'Nghiên cứu',
            careers: ['cong nghe thong tin', 'tri tue nhan tao', 'khoa hoc du lieu', 'y duoc', 'nghien cuu khoa hoc']
        },
        A: {
            name: 'Nghe thuat',
            viName: 'Nghệ thuật',
            careers: ['thiet ke do hoa', 'truyen thong da phuong tien', 'sang tao noi dung', 'kien truc', 'am nhac']
        },
        S: {
            name: 'Xa hoi',
            viName: 'Xã hội',
            careers: ['giao duc', 'tam ly hoc', 'y te dieu duong', 'cong tac xa hoi', 'tu van huong nghiep']
        },
        E: {
            name: 'Quan ly',
            viName: 'Quản lý',
            careers: ['quan tri kinh doanh', 'marketing', 'ban hang', 'khoi nghiep', 'quan ly du an']
        },
        C: {
            name: 'Nghiep vu',
            viName: 'Nghiệp vụ',
            careers: ['ke toan', 'tai chinh', 'hanh chinh nhan su', 'phan tich du lieu', 'kiem soat chat luong']
        }
    };

    const DEFAULT_CHIPS = [
        { label: 'Làm test Holland', action: 'start-test' },
        { label: 'Xem kết quả của tôi', action: 'show-result' },
        { label: 'Tư vấn chọn ngành', prompt: 'Mình nên chọn ngành gì?' },
        { label: 'DreamNavigator là gì?', prompt: 'DreamNavigator là gì?' }
    ];

    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://api.bimo.lemigo.xyz';

    const LOCAL_AI_DEFAULTS = {
        enabled: true,
        provider: 'nctv2',
        endpoint: `${API_BASE_URL}/api/chat_direct`,
        timeoutMs: 30000,
        temperature: 0.6,
        systemPrompt: 'Ban la DreamBot, tro ly huong nghiep cua DreamNavigator. Tra loi ngan gon bang tieng Viet.'
    };

    const MAX_HISTORY_MESSAGES = 10;

    document.addEventListener('DOMContentLoaded', initChatbot);

    function initChatbot() {
        if (document.querySelector('[data-dream-chatbot]')) return;

        const chatbot = document.createElement('section');
        chatbot.className = 'dn-chatbot';
        chatbot.setAttribute('data-dream-chatbot', '');
        chatbot.innerHTML = `
            <div class="dn-chat-panel" role="dialog" aria-label="DreamNavigator chatbot" aria-modal="false">
                <div class="dn-chat-header">
                    <div class="dn-chat-avatar" aria-hidden="true"><i class="fa-solid fa-robot"></i></div>
                    <div class="dn-chat-title">
                        <strong>DreamBot</strong>
                        <span>Trợ lý hướng nghiệp mini</span>
                    </div>
                    <button class="dn-chat-close" type="button" aria-label="Đóng chatbot">
                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="dn-chat-messages" aria-live="polite"></div>
                <div class="dn-chat-chips"></div>
                <form class="dn-chat-form">
                    <input class="dn-chat-input" type="text" autocomplete="off" placeholder="Nhập câu hỏi của bạn..." aria-label="Nhập câu hỏi cho DreamBot">
                    <button class="dn-chat-send" type="submit" aria-label="Gửi câu hỏi">
                        <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
                    </button>
                </form>
            </div>
            <button class="dn-chat-toggle" type="button" aria-label="Mở chatbot" aria-expanded="false">
                <i class="fa-solid fa-comments" aria-hidden="true"></i>
            </button>
        `;

        document.body.appendChild(chatbot);

        const toggleButton = chatbot.querySelector('.dn-chat-toggle');
        const closeButton = chatbot.querySelector('.dn-chat-close');
        const form = chatbot.querySelector('.dn-chat-form');
        const input = chatbot.querySelector('.dn-chat-input');
        const messages = chatbot.querySelector('.dn-chat-messages');
        const chips = chatbot.querySelector('.dn-chat-chips');

        let greeted = false;
        let conversation = [];

        toggleButton.addEventListener('click', () => {
            const isOpen = chatbot.classList.toggle('is-open');
            toggleButton.setAttribute('aria-expanded', String(isOpen));

            if (isOpen) {
                input.focus();
                if (!greeted) {
                    greeted = true;
                    addBotMessage(getGreeting());
                    renderChips(DEFAULT_CHIPS);
                }
            }
        });

        closeButton.addEventListener('click', () => {
            chatbot.classList.remove('is-open');
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.focus();
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            input.value = '';
            addUserMessage(text);
            renderChips([]);
            respond(text);
        });

        chips.addEventListener('click', (event) => {
            const chip = event.target.closest('.dn-chat-chip');
            if (!chip) return;

            const action = chip.dataset.action;
            const prompt = chip.dataset.prompt;

            if (action === 'start-test') {
                handleStartTest();
                return;
            }

            if (action === 'show-result') {
                addBotMessage(formatSavedResult());
                renderChips(DEFAULT_CHIPS);
                return;
            }

            if (prompt) {
                addUserMessage(prompt);
                renderChips([]);
                respond(prompt);
            }
        });

        async function respond(text) {
            const typing = addTypingMessage();

            try {
                const localAiText = await getLocalAiReply(text, conversation);
                typing.remove();

                if (localAiText) {
                    addBotMessage(localAiText);
                    rememberConversation(text, localAiText);
                    renderChips(DEFAULT_CHIPS);
                    return;
                }

                window.setTimeout(() => {
                    const reply = generateReply(text);
                    addBotMessage(reply.text);
                    rememberConversation(text, reply.text);
                    renderChips(reply.chips || DEFAULT_CHIPS);
                }, 180);
            } catch (error) {
                typing.remove();
                const reply = generateReply(text);
                addBotMessage(`${reply.text}\n\nMinh chua ket noi duoc AI API. Kiem tra lai endpoint, Worker, GEMINI_API_KEY hoac CORS.`);
                rememberConversation(text, reply.text);
                renderChips(reply.chips || DEFAULT_CHIPS);
                console.error('DreamBot local AI error:', error);
            }
        }

        function rememberConversation(userText, botText) {
            conversation.push(
                { role: 'user', content: userText },
                { role: 'assistant', content: botText }
            );

            if (conversation.length > MAX_HISTORY_MESSAGES) {
                conversation = conversation.slice(-MAX_HISTORY_MESSAGES);
            }
        }

        function addUserMessage(text) {
            addMessage(text, 'user');
        }

        function addBotMessage(text) {
            addMessage(text, 'bot');
        }

        function addMessage(text, sender) {
            const row = document.createElement('article');
            row.className = `dn-chat-message is-${sender}`;

            const bubble = document.createElement('div');
            bubble.className = 'dn-chat-bubble';
            bubble.textContent = text;

            row.appendChild(bubble);
            messages.appendChild(row);
            scrollToBottom();
            return row;
        }

        function addTypingMessage() {
            const row = document.createElement('article');
            row.className = 'dn-chat-message is-bot';
            row.innerHTML = `
                <div class="dn-chat-bubble">
                    <span class="dn-chat-typing" aria-label="DreamBot đang trả lời">
                        <span></span><span></span><span></span>
                    </span>
                </div>
            `;
            messages.appendChild(row);
            scrollToBottom();
            return row;
        }

        function renderChips(items) {
            chips.innerHTML = '';

            items.forEach((item) => {
                const button = document.createElement('button');
                button.className = 'dn-chat-chip';
                button.type = 'button';
                button.textContent = item.label;

                if (item.action) button.dataset.action = item.action;
                if (item.prompt) button.dataset.prompt = item.prompt;

                chips.appendChild(button);
            });
        }

        function scrollToBottom() {
            messages.scrollTop = messages.scrollHeight;
        }

        function handleStartTest() {
            if (isOnHollandPage()) {
                addBotMessage('Bạn đang ở trang test Holland rồi. Bấm "Bắt Đầu Test Ngay" ở giữa trang, hoặc mình có thể mở lại từ đầu nếu bạn đang xem kết quả.');
                renderChips([
                    { label: 'Xem kết quả của tôi', action: 'show-result' },
                    { label: 'Holland là gì?', prompt: 'Holland RIASEC là gì?' }
                ]);
                return;
            }

            window.location.href = 'holland_test.html';
        }
    }

    async function getLocalAiReply(userText, conversation) {
        const config = getLocalAiConfig();
        if (!config.enabled) return null;

        const messages = buildLocalAiMessages(userText, conversation, config);
        const provider = String(config.provider || '').toLowerCase();

        if (provider === 'nctv2') {
            const data = await postJson(config.endpoint, {
                text: userText,
                messages: conversation // Gửi history gốc lên server, server tự lo prompt
            }, config);
            return cleanAiText(data?.reply);
        }

        if (provider === 'ollama') {
            const data = await postJson(config.endpoint, {
                model: config.model,
                messages,
                stream: false,
                options: {
                    temperature: config.temperature
                }
            }, config);

            return cleanAiText(data?.message?.content || data?.response || data?.reply || data?.text);
        }

        if (provider === 'openai-compatible' || provider === 'openai') {
            const data = await postJson(config.endpoint, {
                model: config.model,
                messages,
                temperature: config.temperature,
                stream: false
            }, config);

            return cleanAiText(data?.choices?.[0]?.message?.content || data?.reply || data?.text);
        }

        const data = await postJson(config.endpoint, {
            message: userText,
            messages,
            history: conversation,
            hollandResult: getSavedResult()
        }, config);

        return cleanAiText(
            data?.reply ||
            data?.answer ||
            data?.text ||
            data?.message?.content ||
            data?.message ||
            data?.response
        );
    }

    function getLocalAiConfig() {
        return {
            ...LOCAL_AI_DEFAULTS,
            ...(window.DREAM_CHATBOT_CONFIG || {})
        };
    }

    function buildLocalAiMessages(userText, conversation, config) {
        const savedResult = getSavedResult();
        const hollandContext = savedResult
            ? `Ket qua Holland/RIASEC cua nguoi dung: ${JSON.stringify(savedResult)}`
            : 'Nguoi dung chua co ket qua Holland/RIASEC trong trinh duyet nay.';

        return [
            { role: 'system', content: `${config.systemPrompt}\n${hollandContext}` },
            ...conversation.slice(-MAX_HISTORY_MESSAGES),
            { role: 'user', content: userText }
        ];
    }

    async function postJson(url, body, config) {
        if (!url) {
            throw new Error('Missing local AI endpoint');
        }

        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), config.timeoutMs || 30000);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(config.headers || {})
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Local AI returned ${response.status}`);
            }

            return response.json();
        } finally {
            window.clearTimeout(timeout);
        }
    }

    function cleanAiText(value) {
        if (typeof value !== 'string') return '';
        return value.trim();
    }

    function getGreeting() {
        const result = getSavedResult();

        if (result) {
            return `Chào bạn, mình là DreamBot. Mình thấy bạn đã có kết quả Holland ${result.code}. Bạn có thể hỏi mình về ngành phù hợp, ý nghĩa mã RIASEC, hoặc bấm "Xem kết quả của tôi".`;
        }

        return 'Chào bạn, mình là DreamBot. Mình có thể giải thích DreamNavigator, hướng dẫn làm test Holland, và gợi ý ngành học theo sở thích của bạn.';
    }

    function generateReply(text) {
        const normalized = normalizeText(text);
        const savedResult = getSavedResult();

        if (hasAny(normalized, ['chao', 'hello', 'hi', 'xin chao'])) {
            return {
                text: getGreeting(),
                chips: DEFAULT_CHIPS
            };
        }

        if (hasAny(normalized, ['ket qua', 'ma riasec', 'riasec cua toi', 'diem cua toi'])) {
            return {
                text: formatSavedResult(),
                chips: [
                    { label: 'Tư vấn theo kết quả', prompt: 'Tư vấn ngành theo kết quả Holland của tôi' },
                    { label: 'Làm test Holland', action: 'start-test' }
                ]
            };
        }

        if (hasAny(normalized, ['holland', 'riasec', 'bai test', 'lam test', 'trac nghiem'])) {
            const resultText = savedResult
                ? `Bạn đã có kết quả ${savedResult.code}. Nếu muốn chính xác hơn, bạn có thể làm lại khi tâm trạng ổn định và trả lời theo điều mình thật sự thích.`
                : 'Bạn nên làm bài test Holland trước để có mã RIASEC. Bài test có 36 câu, mất khoảng 5-10 phút.';

            return {
                text: `Holland/RIASEC chia sở thích nghề nghiệp thành 6 nhóm: R, I, A, S, E, C. ${resultText}`,
                chips: [
                    { label: 'Làm test Holland', action: 'start-test' },
                    { label: '6 nhóm RIASEC là gì?', prompt: 'Giải thích 6 nhóm RIASEC' }
                ]
            };
        }

        if (hasAny(normalized, ['6 nhom', 'r i a s e c', 'giai thich 6', 'nhom riasec'])) {
            return {
                text: '6 nhóm RIASEC gồm: R - Thực tế, I - Nghiên cứu, A - Nghệ thuật, S - Xã hội, E - Quản lý/Kinh doanh, C - Nghiệp vụ/Quy củ. Mã 3 chữ cao nhất thường dùng để gợi ý môi trường học tập và nghề nghiệp phù hợp.',
                chips: DEFAULT_CHIPS
            };
        }

        if (hasAny(normalized, ['chon nganh', 'nganh gi', 'nghe gi', 'huong nghiep', 'tu van', 'hoc gi'])) {
            if (savedResult) {
                return {
                    text: buildCareerAdvice(savedResult),
                    chips: [
                        { label: 'Xem điểm của tôi', action: 'show-result' },
                        { label: 'Ngành CNTT hợp không?', prompt: 'Em có hợp ngành công nghệ thông tin không?' }
                    ]
                };
            }

            return {
                text: 'Để tư vấn ngành sát hơn, bạn nên làm test Holland trước. Nếu chưa làm ngay, hãy nói cho mình 3 điều: bạn thích môn nào, thích làm việc với người hay với dữ liệu/máy móc, và bạn muốn công việc ổn định hay sáng tạo.',
                chips: [
                    { label: 'Làm test Holland', action: 'start-test' },
                    { label: 'Em thích công nghệ', prompt: 'Em thích công nghệ và máy tính thì nên chọn ngành gì?' },
                    { label: 'Em thích giao tiếp', prompt: 'Em thích giao tiếp thì nên chọn ngành gì?' }
                ]
            };
        }

        if (hasAny(normalized, ['cong nghe', 'cntt', 'lap trinh', 'ai', 'may tinh', 'du lieu'])) {
            return {
                text: 'Nếu bạn thích công nghệ, lập trình hoặc AI, nhóm I thường rất quan trọng vì liên quan phân tích và giải quyết vấn đề. Nhóm C giúp bạn hợp với dữ liệu/quy trình, còn nhóm A hỗ trợ thiết kế sản phẩm và sáng tạo. Bạn nên kiểm tra điểm I-C-A trong kết quả Holland.',
                chips: [
                    { label: 'Xem kết quả của tôi', action: 'show-result' },
                    { label: 'Làm test Holland', action: 'start-test' }
                ]
            };
        }

        if (hasAny(normalized, ['giao tiep', 'giup nguoi', 'tam ly', 'giao duc', 'y te'])) {
            return {
                text: 'Nếu bạn thích giao tiếp, lắng nghe và giúp người khác, hãy chú ý nhóm S trong RIASEC. Nhóm S thường hợp giáo dục, tâm lý, y tế, công tác xã hội, tư vấn hoặc các nghề cần tương tác nhiều với con người.',
                chips: [
                    { label: 'Xem kết quả của tôi', action: 'show-result' },
                    { label: 'Làm test Holland', action: 'start-test' }
                ]
            };
        }

        if (hasAny(normalized, ['dreamnavigator', 'du an', 'robot', 'gioi thieu'])) {
            return {
                text: 'DreamNavigator là dự án trợ lý hướng nghiệp thông minh. Website giới thiệu robot, công nghệ AI/giọng nói, và có bài test Holland để gợi ý định hướng nghề nghiệp cá nhân hóa.',
                chips: [
                    { label: 'Tính năng nổi bật', prompt: 'DreamNavigator có tính năng gì?' },
                    { label: 'Làm test Holland', action: 'start-test' }
                ]
            };
        }

        if (hasAny(normalized, ['tinh nang', 'lam duoc gi', 'chuc nang'])) {
            return {
                text: 'Các phần chính của DreamNavigator gồm: giao tiếp bằng giọng nói, phân tích định hướng theo Holland/RIASEC, tư vấn nghề nghiệp cá nhân hóa, và tích hợp robot để tương tác trực quan hơn.',
                chips: DEFAULT_CHIPS
            };
        }

        if (hasAny(normalized, ['api', 'chatgpt', 'openai', 'ai that', 'backend'])) {
            return {
                text: 'Để làm chatbot AI thật, bạn nên tạo backend riêng để gọi API AI, rồi frontend chỉ gửi câu hỏi về backend. Không nên để API key trong file HTML/JS vì người dùng có thể xem được.',
                chips: DEFAULT_CHIPS
            };
        }

        return {
            text: 'Mình hiểu ý chung rồi. Để tư vấn kỹ hơn, bạn hãy hỏi theo kiểu: "Em thích công nghệ thì chọn ngành gì?", "Giải thích mã RIASEC của em", hoặc "DreamNavigator hoạt động như thế nào?".',
            chips: DEFAULT_CHIPS
        };
    }

    function getSavedResult() {
        try {
            const raw = localStorage.getItem('hollandTestResult');
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !data.code) return null;
            return data;
        } catch (error) {
            return null;
        }
    }

    function formatSavedResult() {
        const result = getSavedResult();

        if (!result) {
            return 'Mình chưa thấy kết quả Holland trong trình duyệt này. Bạn hãy làm bài test trước, sau đó quay lại đây mình sẽ tư vấn theo mã RIASEC của bạn.';
        }

        const topTypes = Array.isArray(result.topTypes) && result.topTypes.length
            ? result.topTypes
            : String(result.code).split('');
        const names = topTypes.map((type) => TYPE_INFO[type]?.viName || type).join(' - ');
        const scoreText = result.scores
            ? Object.keys(result.scores).sort().map((type) => `${type}: ${result.scores[type]}/18`).join(', ')
            : 'chưa có điểm chi tiết';

        return `Kết quả Holland của bạn là ${result.code}: ${names}.\nĐiểm chi tiết: ${scoreText}.\n${buildCareerAdvice(result)}`;
    }

    function buildCareerAdvice(result) {
        const topTypes = Array.isArray(result.topTypes) && result.topTypes.length
            ? result.topTypes
            : String(result.code || '').split('').slice(0, 3);
        const careerSet = new Set();

        topTypes.forEach((type) => {
            const info = TYPE_INFO[type];
            if (!info) return;
            info.careers.forEach((career) => careerSet.add(career));
        });

        const names = topTypes.map((type) => TYPE_INFO[type]?.viName || type).join(' - ');
        const careers = Array.from(careerSet).slice(0, 8).join(', ');

        if (!careers) {
            return 'Bạn có thể cho mình biết thêm sở thích, môn học mạnh và môi trường làm việc mong muốn để mình gợi ý ngành phù hợp hơn.';
        }

        return `Với nhóm nổi bật ${names}, bạn có thể tham khảo các hướng: ${careers}. Hãy dùng danh sách này như gợi ý ban đầu, rồi đối chiếu thêm năng lực học tập và điều kiện tuyển sinh.`;
    }

    function normalizeText(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function hasAny(text, keywords) {
        return keywords.some((keyword) => text.includes(keyword));
    }

    function isOnHollandPage() {
        return window.location.pathname.toLowerCase().includes('holland_test');
    }
})();
