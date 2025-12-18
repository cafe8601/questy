/**
 * Curriculum Data Module
 * 과목별 커리큘럼 데이터를 관리하는 모듈
 * 추후 다른 과목 추가 가능한 확장 구조
 */

const CurriculumData = {
    // 과목별 커리큘럼 저장소
    subjects: {
        korean: {
            name: '국어',
            icon: '📖',

            // 4단계 Phase
            phases: [
                {
                    id: 1,
                    name: '개념 완성기',
                    months: [1, 2, 3],
                    goal: '수능 국어의 기본 개념과 원리 완벽 이해',
                    weeklyHours: { beginner: 8, growth: 10, leap: 10, master: 8 }
                },
                {
                    id: 2,
                    name: '실력 도약기',
                    months: [4, 5, 6],
                    goal: '문제 유형별 풀이법 정립, 기출 분석',
                    weeklyHours: { beginner: 10, growth: 13, leap: 14, master: 10 }
                },
                {
                    id: 3,
                    name: '실전 적응기',
                    months: [7, 8, 9],
                    goal: '실전 감각 극대화, 시간 관리 완성',
                    weeklyHours: { beginner: 12, growth: 17, leap: 18, master: 12 }
                },
                {
                    id: 4,
                    name: '파이널 정리기',
                    months: [10, 11],
                    goal: '최종 마무리, EBS 연계, 컨디션 최적화',
                    weeklyHours: { beginner: 10, growth: 13, leap: 14, master: 9 }
                }
            ],

            // 월별 핵심 학습 내용
            monthlyPlan: {
                1: { reading: '문장 구조 이해, 단락 요약법', literature: '문학 갈래 개념', choice: '선택과목 결정' },
                2: { reading: '영역별 개념 심화', literature: '갈래별 심화', choice: '기본 개념 학습' },
                3: { reading: '문제 유형 학습', literature: '표현법 집중', choice: '오답률 높은 유형' },
                4: { reading: '유형별 접근법', literature: '시 표현법 심화', choice: '심화 개념' },
                5: { reading: '기출 분석 심화', literature: '수능 기출 분석', choice: 'EBS 연계 분석' },
                6: { reading: '취약 영역 보완', literature: '취약 갈래 보완', choice: '하반기 전략' },
                7: { reading: '고난도 지문 훈련', literature: '고전 작품 집중', choice: '고난도 문항' },
                8: { reading: '수능특강 분석', literature: '작품 분석', choice: 'EBS 연계' },
                9: { reading: '취약점 최종 보완', literature: '실전 감각', choice: 'D-60 전략' },
                10: { reading: '개인 취약 유형 집중', literature: 'EBS 연계 완료', choice: '파이널 전략' },
                11: { reading: '감각 유지, 컨디션', literature: '최종 정리', choice: '마무리' }
            },

            // 수험생 유형별 전략
            studentTypes: {
                beginner: { name: '초보형', targetGrade: '4~5등급', conceptRatio: 70, practiceRatio: 30 },
                growth: { name: '성장형', targetGrade: '2~3등급', conceptRatio: 40, practiceRatio: 60 },
                leap: { name: '도약형', targetGrade: '1등급', conceptRatio: 20, practiceRatio: 80 },
                master: { name: '완성형', targetGrade: '만점', conceptRatio: 10, practiceRatio: 90 }
            },

            // 권장 교재
            textbooks: {
                reading: [
                    { level: '기초', name: 'EBS 수능특강 독서', feature: 'EBS 연계, 기본 문항' },
                    { level: '심화', name: '마더텅 독서 기출', feature: '기출 분석, 유형별 정리' },
                    { level: '고난도', name: '자이스토리 독서', feature: '고난도 심화 문항' }
                ],
                literature: [
                    { level: '기초', name: 'EBS 수능특강 문학', feature: '작품 해설, 기본 문항' },
                    { level: '심화', name: '마더텅 문학 기출', feature: '기출 분석, 작품별 정리' },
                    { level: '고난도', name: '자이스토리 문학', feature: '고난도 심화 문항' }
                ]
            }
        }
        // 추후 다른 과목 추가: math, english, history 등
    },

    // 현재 월 기준 Phase 가져오기
    getCurrentPhase(subject = 'korean') {
        const month = new Date().getMonth() + 1;
        const phases = this.subjects[subject]?.phases || [];
        return phases.find(p => p.months.includes(month)) || phases[0];
    },

    // 현재 월 학습 내용 가져오기
    getCurrentMonthPlan(subject = 'korean') {
        const month = new Date().getMonth() + 1;
        return this.subjects[subject]?.monthlyPlan[month] || null;
    },

    // 학생 유형에 따른 주간 학습 시간
    getWeeklyHours(subject = 'korean', studentType = 'growth') {
        const phase = this.getCurrentPhase(subject);
        return phase?.weeklyHours[studentType] || 10;
    },

    // AI 프롬프트용 컨텍스트 생성
    getAIContext(subject = 'korean', studentType = 'growth') {
        const subjectData = this.subjects[subject];
        const phase = this.getCurrentPhase(subject);
        const monthPlan = this.getCurrentMonthPlan(subject);
        const typeInfo = subjectData.studentTypes[studentType];

        return `
[현재 학습 시기]
- 과목: ${subjectData.name}
- 현재 Phase: ${phase.name} (${phase.months.join(', ')}월)
- Phase 목표: ${phase.goal}

[이번 달 학습 내용]
- 독서: ${monthPlan?.reading || '미정'}
- 문학: ${monthPlan?.literature || '미정'}
- 선택과목: ${monthPlan?.choice || '미정'}

[학생 유형 정보]
- 유형: ${typeInfo.name}
- 목표 등급: ${typeInfo.targetGrade}
- 개념:문제 비율: ${typeInfo.conceptRatio}:${typeInfo.practiceRatio}
- 권장 주간 학습시간: ${this.getWeeklyHours(subject, studentType)}시간
    `.trim();
    }
};

window.CurriculumData = CurriculumData;
