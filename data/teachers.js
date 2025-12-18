/**
 * Teachers Data & Recommendation Logic
 * Based on: course_output/korean_exam_2026/teacher_recommendation.md
 */

const TEACHER_DATA = [
    // ==========================================
    // [독서] Reading
    // ==========================================
    {
        id: 't_reading_01',
        name: '강민철',
        platform: 'MegaStudy',
        subject: 'reading',
        style: ['structural', 'detail'], // 구조독해, 정보량 폭발
        tags: ['#구조독해의끝', '#정보량처리', '#상위권필수'],
        targetTypes: ['leaping', 'mastering'], // 도약형, 완성형
        description: '지문의 모든 정보를 장악하는 압도적 구조 독해. 텍스트 밀도가 높은 지문에 강점.',
        matchPoints: { structural: 9, intuitive: 3, logic: 10 }
    },
    {
        id: 't_reading_02',
        name: '김승리',
        platform: 'Daesung',
        subject: 'reading',
        style: ['organic', 'logic'], // 유기적 연결, 논리
        tags: ['#AllOfKice', '#평가원코드', '#유기적연결'],
        targetTypes: ['growing', 'leaping'], // 성장형, 도약형
        description: '지문과 선지의 유기적 연결을 강조. 누구나 체화 가능한 논리적 독해 프레임.',
        matchPoints: { structural: 7, intuitive: 6, logic: 9 }
    },
    {
        id: 't_reading_03',
        name: '김동욱',
        platform: 'MegaStudy',
        subject: 'reading',
        style: ['intuitive', 'reaction'], // 반응, 이해 중심
        tags: ['#반응하라', '#항만이', '#본질적독해'],
        targetTypes: ['beginner', 'growing', 'mastering'], // 전 구간 (본질파)
        description: '스킬보다는 읽는 태도와 반응을 강조. 글을 읽고 이해하는 본질적 피지컬 훈련.',
        matchPoints: { structural: 2, intuitive: 10, logic: 7 }
    },

    // ==========================================
    // [문학] Literature
    // ==========================================
    {
        id: 't_lit_01',
        name: '김젬마',
        platform: 'Daesung',
        subject: 'literature',
        style: ['emotional', 'concept'], // 감성, 개념
        tags: ['#봄봄', '#개념의여왕', '#선지판단'],
        targetTypes: ['beginner', 'growing'],
        description: '문학 개념어의 명쾌한 정의와 작품의 내적 논리 분석. 노베이스에게 강력 추천.',
        matchPoints: { concept: 10, analysis: 7, feeling: 8 }
    },
    {
        id: 't_lit_02',
        name: '김상훈',
        platform: 'Daesung',
        subject: 'literature',
        style: ['logic', 'cbs'], // EBS 연계, 논리
        tags: ['#문학론', '#EBS를부탁해', '#실전문학'],
        targetTypes: ['growing', 'leaping', 'mastering'],
        description: '문학도 비문학처럼 논리적으로 푼다. 객관적 근거를 찾는 훈련과 EBS 적중률.',
        matchPoints: { concept: 7, analysis: 10, feeling: 4 }
    },
    {
        id: 't_lit_03',
        name: '엄선경',
        platform: 'MegaStudy',
        subject: 'literature',
        style: ['story', 'ebs'], // 스토리텔링
        tags: ['#스토리텔링', '#EBS전체줄거리', '#무한반복'],
        targetTypes: ['beginner', 'growing'],
        description: '한편의 영화를 보듯 재미있는 스토리텔링. EBS 전 작품의 내용을 머리에 각인시킴.',
        matchPoints: { concept: 5, analysis: 4, feeling: 10 }
    },

    // ==========================================
    // [언어와매체] Language
    // ==========================================
    {
        id: 't_lang_01',
        name: '전형태',
        platform: 'MegaStudy',
        subject: 'korean_opt',
        subSubject: '언어와매체',
        style: ['system', 'speed'],
        tags: ['#언매올인원', '#체계적문법', '#시간단축'],
        targetTypes: ['growing', 'leaping', 'mastering'],
        description: '문법의 체계를 가장 깔끔하게 정리. 실전에서 시간을 줄여주는 도구 제공.',
        matchPoints: { system: 10, practice: 9 }
    },

    // ==========================================
    // [화법과작문]
    // ==========================================
    {
        id: 't_speech_01',
        name: '김민정',
        platform: 'Etoos',
        subject: 'korean_opt',
        subSubject: '화법과작문',
        style: ['pattern', 'detail'],
        tags: ['#씹어먹는화작', '#유형별패턴', '#실수방지'],
        targetTypes: ['beginner', 'growing'],
        description: '화작의 유형별 풀이법과 오답 함정을 피하는 실전적 행동 강령.',
        matchPoints: { system: 8, practice: 10 }
    }
];

// Teacher Matcher Logic
const TeacherMatcher = {
    getRecommendations: (student) => {
        if (!student) return [];

        const type = student.profile.studentTypeKey || 'beginner'; // beginner, growing, leaping, mastering
        const subject = student.profile.selectedSubject || '언어와매체';

        // Filter by Student Type Compatibility
        let recs = TEACHER_DATA.filter(t => {
            // Basic type match
            const typeMatch = t.targetTypes.includes(type);

            // Subject match (Optional subject check)
            if (t.subject === 'korean_opt') {
                return typeMatch && t.subSubject === subject;
            }

            return typeMatch;
        });

        // Add Matching Score (Simulation based on profile)
        return recs.map(teacher => {
            let score = 85; // Base score

            // Bonus logic based on keywords
            if (type === 'beginner' && teacher.tags.some(t => t.includes('개념') || t.includes('스토리'))) score += 10;
            if (type === 'mastering' && teacher.tags.some(t => t.includes('정보량') || t.includes('논리'))) score += 10;
            if (student.profile.learningStyle === '시각형' && teacher.style.includes('structural')) score += 5;
            if (student.profile.learningStyle === '청각형' && teacher.style.includes('story')) score += 5;

            return { ...teacher, matchScore: Math.min(99, score) };
        }).sort((a, b) => b.matchScore - a.matchScore);
    }
};
