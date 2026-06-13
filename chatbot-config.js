// Chatbot calls this endpoint first. Keep real API keys on the server/Worker,
// not in this file.
window.DREAM_CHATBOT_CONFIG = {
    enabled: true,

    // Chon mot trong cac kieu:
    // - 'ollama': Ollama mac dinh http://localhost:11434/api/chat
    // - 'openai-compatible': LM Studio, llama.cpp server, vLLM... /v1/chat/completions
    // - 'custom': API rieng cua ban, tra ve JSON co reply/text/answer/message
    provider: 'nctv2',

    endpoint: 'https://api.bimo.lemigo.xyz/api/chat_direct',
    model: 'llama-3.3-70b-versatile',
    timeoutMs: 30000,
    temperature: 0.4,

    systemPrompt: [
        'Ban la DreamBot, tro ly huong nghiep cua website DreamNavigator.',
        'Tra loi bang tieng Viet, ngan gon, than thien, dung cho hoc sinh THPT.',
        'Neu co ket qua Holland/RIASEC cua nguoi dung, hay dua vao do de tu van.',
        'Khong khang dinh chac chan mot nganh nghe; hay goi y va khuyen doi chieu voi nang luc, so thich, dieu kien tuyen sinh.'
    ].join(' ')
};
