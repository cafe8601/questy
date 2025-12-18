/**
 * Curriculum Data Module (Enhanced)
 * 과목별 커리큘럼 데이터를 관리하는 모듈
 * 원본: course_output/korean_exam_2026/*.md
 */

const CurriculumData = {
    subjects: {
        korean: {
            name: '국어',
            icon: '📖',

            // 4단계 Phase
            phases: [
                { id: 1, name: '개념 완성기', months: [1, 2, 3], goal: '기본 개념과 원리 완벽 이해', weeklyHours: { beginner: 8, growth: 10, leap: 10, master: 8 } },
                { id: 2, name: '실력 도약기', months: [4, 5, 6], goal: '유형별 풀이법 정립, 기출 분석', weeklyHours: { beginner: 10, growth: 13, leap: 14, master: 10 } },
                { id: 3, name: '실전 적응기', months: [7, 8, 9], goal: '실전 감각 극대화, 시간 관리 완성', weeklyHours: { beginner: 12, growth: 17, leap: 18, master: 12 } },
                { id: 4, name: '파이널 정리기', months: [10, 11, 12], goal: '최종 마무리, EBS 연계, 컨디션 최적화', weeklyHours: { beginner: 10, growth: 13, leap: 14, master: 9 } }
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
                11: { reading: '감각 유지, 컨디션', literature: '최종 정리', choice: '마무리' },
                12: { reading: '기초 다지기 시작', literature: '갈래 개념 복습', choice: '다음 학년도 준비' }
            },

            // 수험생 유형별 상세 정보
            studentTypes: {
                beginner: {
                    name: '초보형', targetGrade: '4~5등급', currentGrade: '6등급 이하',
                    conceptRatio: 70, practiceRatio: 30,
                    weakPoints: ['어휘력 부족', '독해력 미달', '기본 문법 부재', '시간 관리 실패'],
                    strategy: '기초 다지기 + 자신감 회복',
                    monthlyTargets: { march: '현재 등급 유지', june: '5등급 진입', sept: '4등급 달성', exam: '4~5등급 안정' }
                },
                growth: {
                    name: '성장형', targetGrade: '2~3등급', currentGrade: '4~5등급',
                    conceptRatio: 40, practiceRatio: 60,
                    weakPoints: ['추론 능력 부족', '유형별 접근 미정립', '오답 패턴 반복', '시간 부족'],
                    strategy: '유형 정복 + 추론력 강화',
                    monthlyTargets: { march: '4등급 진입', june: '3등급 진입', sept: '2~3등급 달성', exam: '2~3등급 안정' }
                },
                leap: {
                    name: '도약형', targetGrade: '1등급', currentGrade: '2~3등급',
                    conceptRatio: 20, practiceRatio: 80,
                    weakPoints: ['킬러 문항 실패', '시간 압박', '컨디션 기복', '2지선다 실수'],
                    strategy: '고난도 공략 + 실전 훈련',
                    monthlyTargets: { march: '2등급 유지', june: '1등급 진입', sept: '1등급 안정', exam: '안정적 1등급' }
                },
                master: {
                    name: '완성형', targetGrade: '만점', currentGrade: '1등급권',
                    conceptRatio: 10, practiceRatio: 90,
                    weakPoints: ['변별력 문항', '방심 실수', '컨디션 관리', '만점 압박'],
                    strategy: '유지 학습 + 실수 최소화',
                    monthlyTargets: { march: '1등급 유지', june: '1등급 유지', sept: '1등급 유지', exam: '만점 도전' }
                }
            },

            // 유형별 선생님 추천 조합
            teacherCombos: {
                beginner: {
                    reading: [{ name: '윤혜정', platform: 'EBS', reason: '기초 개념 친절' }, { name: '정석민', platform: '대성', reason: '반복 설명' }],
                    literature: [{ name: '엄선경', platform: '메가', reason: '작품 해설 친절' }, { name: '윤혜정', platform: 'EBS', reason: '갈래별 정리' }]
                },
                growth: {
                    reading: [{ name: '김승리', platform: '대성', reason: '지문 처리법 체계화' }, { name: '강민철', platform: '메가', reason: '구조적 접근' }],
                    literature: [{ name: '김젬마', platform: '대성', reason: '패턴화 풀이' }, { name: '김상훈', platform: '메가', reason: '작품 분석 심화' }]
                },
                leap: {
                    reading: [{ name: '강민철', platform: '메가', reason: '킬러 문항 대비' }, { name: '김승리', platform: '대성', reason: '실전 문풀' }],
                    literature: [{ name: '김동욱', platform: '메가', reason: '심화 해석' }, { name: '정온', platform: '이투스', reason: '변별력 문항' }]
                },
                master: {
                    reading: [{ name: '강민철', platform: '메가', reason: '실수 방지' }],
                    literature: [{ name: '김동욱', platform: '메가', reason: '고난도 해석' }, { name: '한병훈', platform: 'EBS', reason: 'EBS 연계' }]
                }
            },

            // 월별 체크리스트
            checkLists: {
                1: ['개념 강의 수강 시작', '학습 루틴 확립', '선택과목 결정'],
                3: ['3월 모의고사 응시', '현재 수준 정확히 파악', '상반기 전략 수립'],
                6: ['6월 모의평가 응시', '목표 등급 달성 여부 확인', '하반기 전략 조정'],
                9: ['9월 모의평가 응시', 'EBS 연계 마무리 시작', '파이널 전략 확정'],
                11: ['EBS 연계 최종 점검', '컨디션 최적화', '수능 D-Day 준비 완료']
            },

            // 멘탈 관리 가이드
            mentalGuide: {
                slump: [
                    { symptom: '점수 정체', cause: '과도한 학습', solution: '1~2일 휴식 후 재시작' },
                    { symptom: '의욕 저하', cause: '번아웃', solution: '강의 분량 50% 감소' },
                    { symptom: '불안감 급증', cause: '비교 심리', solution: 'SNS 차단, 자기 페이스 유지' },
                    { symptom: '자신감 하락', cause: '연속 오답', solution: '쉬운 문제로 자신감 회복' }
                ],
                examDay: {
                    before: ['새로운 내용 학습 금지', '가벼운 복습만', '일찍 취침'],
                    during: ['아침 식사 필수', '30분 전 도착', '평소 루틴 유지'],
                    after: ['당일 오답 분석', '점수에 일희일비 금지', '다음 계획 수립']
                }
            },

            // 권장 교재
            textbooks: {
                reading: [
                    { level: '기초', name: 'EBS 수능특강 독서', feature: 'EBS 연계' },
                    { level: '심화', name: '마더텅 독서 기출', feature: '기출 분석' },
                    { level: '고난도', name: '자이스토리 독서', feature: '고난도 심화' }
                ],
                literature: [
                    { level: '기초', name: 'EBS 수능특강 문학', feature: '작품 해설' },
                    { level: '심화', name: '마더텅 문학 기출', feature: '기출 분석' },
                    { level: '고난도', name: '자이스토리 문학', feature: '고난도 심화' }
                ]
            }
        }
    },

    getCurrentPhase(subject = 'korean') {
        const month = new Date().getMonth() + 1;
        const phases = this.subjects[subject]?.phases || [];
        return phases.find(p => p.months.includes(month)) || phases[0];
    },

    getCurrentMonthPlan(subject = 'korean') {
        const month = new Date().getMonth() + 1;
        return this.subjects[subject]?.monthlyPlan[month] || null;
    },

    getWeeklyHours(subject = 'korean', studentType = 'growth') {
        const phase = this.getCurrentPhase(subject);
        return phase?.weeklyHours[studentType] || 10;
    },

    getStudentTypeInfo(subject = 'korean', studentType = 'growth') {
        return this.subjects[subject]?.studentTypes[studentType] || null;
    },

    getTeacherRecommendations(subject = 'korean', studentType = 'growth') {
        return this.subjects[subject]?.teacherCombos[studentType] || null;
    },

    getCurrentCheckList(subject = 'korean') {
        const month = new Date().getMonth() + 1;
        return this.subjects[subject]?.checkLists[month] || null;
    },

    getMentalGuide(subject = 'korean') {
        return this.subjects[subject]?.mentalGuide || null;
    },

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
- 현재 수준: ${typeInfo.currentGrade}
- 목표 등급: ${typeInfo.targetGrade}
- 핵심 전략: ${typeInfo.strategy}
- 취약점: ${typeInfo.weakPoints.join(', ')}
- 개념:문제 비율: ${typeInfo.conceptRatio}:${typeInfo.practiceRatio}
- 권장 주간 학습시간: ${this.getWeeklyHours(subject, studentType)}시간
    `.trim();
    }
};

window.CurriculumData = CurriculumData;
