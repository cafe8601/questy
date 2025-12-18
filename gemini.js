/**
 * Gemini AI Coaching Module
 * Uses Gemini 2.0 Flash model for real-time tutoring
 */

const GeminiAI = {
    API_KEY: '', // Will be set by user
    MODEL: 'gemini-2.0-flash', // Latest Flash model
    ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/',

    // System prompt for exam coaching persona
    SYSTEM_PROMPT: `당신은 한국 수능(대학수학능력시험) 전문 입시 코치입니다.
역할:
- 학생의 학습 고민을 경청하고 공감합니다
- 과목별 학습 전략을 구체적으로 제시합니다
- 멘탈 관리와 동기부여를 돕습니다
- 한국어로 대화하며, 존댓말을 사용합니다

응답 스타일:
- 간결하면서도 따뜻하게
- 구체적인 액션 아이템 제시
- 2-3문장으로 핵심만 전달`,

    setApiKey(key) {
        this.API_KEY = key;
        localStorage.setItem('gemini_api_key', key);
    },

    getApiKey() {
        if (!this.API_KEY) {
            this.API_KEY = localStorage.getItem('gemini_api_key') || '';
        }
        return this.API_KEY;
    },

    getStudentType(grade) {
        if (!grade) return 'growth';
        if (grade >= 5) return 'beginner';
        if (grade >= 3) return 'growth';
        if (grade >= 2) return 'leap';
        return 'master';
    },

    async chat(userMessage, context = {}) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            return { error: true, message: 'API 키가 설정되지 않았습니다. 설정에서 Gemini API 키를 입력해주세요.' };
        }

        const url = `${this.ENDPOINT}${this.MODEL}:generateContent?key=${apiKey}`;

        // Build context from student profile
        const studentInfo = context.profile
            ? `현재 학생 정보: ${context.profile.name}, 현재 ${context.profile.grade}등급, 목표 ${context.profile.target}등급`
            : '';

        // RAG: 지식 기반에서 관련 정보 검색
        const ragContext = window.KnowledgeBase
            ? window.KnowledgeBase.getKnowledgeContext(userMessage)
            : '';

        // 커리큘럼 컨텍스트
        const curriculumContext = window.CurriculumData
            ? window.CurriculumData.getAIContext('korean', this.getStudentType(context.profile?.grade))
            : '';

        const fullContext = `
${this.SYSTEM_PROMPT}

${studentInfo}

[참조 문서 (RAG)]
${ragContext}

[현재 커리큘럼 정보]
${curriculumContext}

학생 질문: ${userMessage}
        `.trim();

        const payload = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: fullContext }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
                topP: 0.9
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                return { error: true, message: 'API 호출 실패. 키를 확인해주세요.' };
            }

            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 생성할 수 없습니다.';
            return { error: false, message: reply };

        } catch (err) {
            console.error('Network Error:', err);
            return { error: true, message: '네트워크 오류가 발생했습니다.' };
        }
    }
};

// Export for use in app.js
window.GeminiAI = GeminiAI;
