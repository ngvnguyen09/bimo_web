const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.0-flash';
const DEFAULT_TEMPERATURE = 0.4;

const DEFAULT_SYSTEM_PROMPT = [
    'Ban la DreamBot, tro ly huong nghiep cua website DreamNavigator.',
    'Tra loi bang tieng Viet, ngan gon, than thien, phu hop voi hoc sinh THPT.',
    'Neu co ket qua Holland/RIASEC cua nguoi dung, hay dua vao do de tu van.',
    'Khong khang dinh chac chan mot nganh nghe; hay goi y va khuyen nguoi dung doi chieu voi nang luc, so thich va dieu kien tuyen sinh.'
].join(' ');

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/api/chat') {
            return handleChat(request, env);
        }

        return env.ASSETS.fetch(request);
    }
};

async function handleChat(request, env) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: corsHeaders()
        });
    }

    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    if (!env.GEMINI_API_KEY) {
        return jsonResponse({ error: 'Missing GEMINI_API_KEY secret' }, 500);
    }

    let payload;
    try {
        payload = await request.json();
    } catch (error) {
        return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    const userMessage = getUserMessage(payload);
    if (!userMessage) {
        return jsonResponse({ error: 'Missing message' }, 400);
    }

    const model = env.GEMINI_MODEL || payload.model || DEFAULT_MODEL;
    const geminiPayload = buildGeminiPayload(payload, userMessage);
    const geminiUrl = `${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${env.GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(geminiPayload)
    });

    const geminiData = await geminiResponse.json().catch(() => ({}));

    if (!geminiResponse.ok) {
        return jsonResponse({
            error: 'Gemini API error',
            detail: geminiData.error?.message || `HTTP ${geminiResponse.status}`
        }, geminiResponse.status);
    }

    const reply = extractGeminiReply(geminiData);
    return jsonResponse({
        reply: reply || 'Minh chua tao duoc cau tra loi luc nay. Ban thu hoi lai ngan gon hon nhe.'
    });
}

function buildGeminiPayload(payload, userMessage) {
    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    const systemMessages = messages
        .filter((message) => message.role === 'system')
        .map((message) => message.content)
        .filter(Boolean);

    const systemText = [
        DEFAULT_SYSTEM_PROMPT,
        ...systemMessages,
        payload.hollandResult ? `Ket qua Holland/RIASEC: ${JSON.stringify(payload.hollandResult)}` : ''
    ].filter(Boolean).join('\n');

    const contents = messages
        .filter((message) => message.role !== 'system' && message.content)
        .map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(message.content) }]
        }));

    if (!contents.length || contents[contents.length - 1].parts[0].text !== userMessage) {
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });
    }

    return {
        systemInstruction: {
            parts: [{ text: systemText }]
        },
        contents,
        generationConfig: {
            temperature: Number(payload.temperature) || DEFAULT_TEMPERATURE
        }
    };
}

function getUserMessage(payload) {
    if (typeof payload.message === 'string' && payload.message.trim()) {
        return payload.message.trim();
    }

    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        const message = messages[index];
        if (message?.role === 'user' && typeof message.content === 'string' && message.content.trim()) {
            return message.content.trim();
        }
    }

    return '';
}

function extractGeminiReply(data) {
    return data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim();
}

function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders()
        }
    });
}

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
}
