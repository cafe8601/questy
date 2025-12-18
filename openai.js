/**
 * OpenAI API Coaching Module
 * Uses GPT-4o-mini model for real-time tutoring
 */

const OpenAI = {
    API_KEY: '',
    MODEL: 'gpt-5-mini',
    ENDPOINT: 'https://api.openai.com/v1/chat/completions',

    SYSTEM_PROMPT: `당신은 한국 수능(대학수학능력시험) 전문 입시 코치입니다.

역할:
- 학생의 학습 고민을 경청하고 공감합니다
- 과목별 학습 전략을 구체적으로 제시합니다
- 멘탈 관리와 동기부여를 돕습니다
- 한국어로 대화하며, 존댓말을 사용합니다

응답 스타일:
- 간결하면서도 따뜻하게 (2-3문장)
- 구체적인 액션 아이템 제시
- 학생의 상황에 맞는 맞춤형 조언`,

    setApiKey(key) {
        this.API_KEY = key;
        localStorage.setItem('openai_api_key', key);
    },

    getApiKey() {
        if (!this.API_KEY) {
            this.API_KEY = localStorage.getItem('openai_api_key') || '';
        }
        return this.API_KEY;
    },

    // 등급에 따른 학생 유형 결정
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
            return { error: true, message: 'OpenAI API 키가 설정되지 않았습니다. 설정에서 입력해주세요.' };
        }

        // 학생 정보
        const studentInfo = context.profile
            ? `현재 학생 정보: ${context.profile.name}, 현재 ${context.profile.grade}등급, 목표 ${context.profile.target}등급`
            : '';

        // 커리큘럼 컨텍스트 (CurriculumData 모듈 사용)
        const curriculumContext = window.CurriculumData
            ? window.CurriculumData.getAIContext('korean', this.getStudentType(context.profile?.grade))
            : '';

        const payload = {
            model: this.MODEL,
            messages: [
                { role: 'system', content: this.SYSTEM_PROMPT + '\n\n' + studentInfo + '\n\n' + curriculumContext },
                { role: 'user', content: userMessage }
            ],
            max_completion_tokens: 2000
        };

        try {
            const response = await fetch(this.ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('OpenAI API Error:', errorData);
                const errMsg = errorData.error?.message || '알 수 없는 오류';
                return { error: true, message: `API 오류: ${errMsg}` };
            }

            const data = await response.json();
            console.log('OpenAI Response:', data);

            // 다양한 응답 형식 지원
            const reply = data.choices?.[0]?.message?.content
                || data.output?.[0]?.content?.[0]?.text
                || data.message?.content
                || JSON.stringify(data);
            return { error: false, message: reply };

        } catch (err) {
            console.error('Network Error:', err);
            return { error: true, message: '네트워크 오류가 발생했습니다.' };
        }
    }
};

window.OpenAI = OpenAI;
