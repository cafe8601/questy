/**
 * Knowledge Base Module for RAG (Retrieval-Augmented Generation)
 * Uses Google Gemini File API for document search
 * Source: course_output/korean_exam_2026/*.md
 */

const KnowledgeBase = {
    GEMINI_FILE_API: 'https://generativelanguage.googleapis.com/upload/v1beta/files',
    GEMINI_FILES_LIST_API: 'https://generativelanguage.googleapis.com/v1beta/files',

    uploadedFileUri: null,
    uploadedFileName: null,

    // 모든 마크다운 문서를 하나로 합친 지식 베이스
    koreanKnowledge: `
# 2026 수능 국어 완전 가이드

## 📌 수험생 유형별 전략

### 🔰 초보형 (6등급 이하 → 4~5등급 목표)
**현재 상태**: 원점수 50점 미만
**핵심 전략**: 기초 다지기 + 자신감 회복
**취약점**: 어휘력 부족, 독해력 미달, 기본 문법 부재, 시간 관리 실패
**월별 목표**:
- 3월: 현재 등급 유지
- 6월: 5등급 진입 (원점수 55~65점)
- 9월: 4등급 달성 (원점수 65~75점)
- 수능: 4~5등급 안정

**추천 선생님**:
- 독서: 윤혜정(EBS), 정석민(대성)
- 문학: 엄선경(메가), 윤혜정(EBS)
- 언매: 정석민(대성)

### 📈 성장형 (4~5등급 → 2~3등급 목표)
**현재 상태**: 원점수 50~70점
**핵심 전략**: 유형 정복 + 추론력 강화
**취약점**: 추론 능력 부족, 유형별 접근 미정립, 오답 패턴 반복
**월별 목표**:
- 3월: 4등급 진입
- 6월: 3등급 진입 (원점수 75점+)
- 9월: 2~3등급 달성
- 수능: 2~3등급 안정 (원점수 80점+)

**추천 선생님**:
- 독서: 김승리(대성), 강민철(메가)
- 문학: 김젬마(대성), 김상훈(메가)
- 언매: 정석민(대성)

### 🚀 도약형 (2~3등급 → 1등급 목표)
**현재 상태**: 원점수 70~85점
**핵심 전략**: 고난도 공략 + 실전 훈련
**취약점**: 킬러 문항 실패, 시간 압박, 2지선다 실수
**월별 목표**:
- 3월: 2등급 유지
- 6월: 1등급 진입 (원점수 88점+)
- 9월: 1등급 안정
- 수능: 안정적 1등급 (원점수 90점+)

**추천 선생님**:
- 독서: 강민철(메가) - 킬러 문항 대비
- 문학: 김동욱(메가) - 심화 해석
- EBS: 한병훈, 최서희

### 🏆 완성형 (1등급 목표, 만점 도전)
**현재 상태**: 원점수 85~95점
**핵심 전략**: 유지 학습 + 실수 최소화
**취약점**: 변별력 문항, 방심 실수, 만점 압박
**월별 목표**: 모든 모의고사 1등급 유지 → 수능 만점 도전

---

## 📅 연간 학습 로드맵

### Phase 1: 개념 완성기 (1~3월)
**목표**: 기본 개념과 원리 완벽 이해
**핵심 활동**:
- 1월: 독해력 기초 + 문학 갈래 입문
- 2월: 영역별 개념 심화
- 3월: 3월 모의고사 대비

**월별 학습량**: 주 8~12시간

### Phase 2: 실력 도약기 (4~6월)
**목표**: 유형별 풀이법 정립, 기출 분석
**핵심 활동**:
- 4월: 유형별 접근법 정립
- 5월: 기출 분석 심화
- 6월: 6월 모의평가 대비

**월별 학습량**: 주 10~18시간

### Phase 3: 실전 적응기 (7~9월)
**목표**: 실전 감각 극대화, 시간 관리 완성
**핵심 활동**:
- 7월: 실전 모의고사 집중
- 8월: 여름방학 집중 (EBS 수능특강)
- 9월: 9월 모의평가 대비

**월별 학습량**: 주 12~30시간 (방학 집중)

### Phase 4: 파이널 정리기 (10~11월)
**목표**: 최종 마무리, EBS 연계
**핵심 활동**:
- 10월: 취약점 집중 + EBS 연계 마무리
- 11월: 수능 D-Day 준비

---

## 👨‍🏫 인강 선생님 가이드

### 독서 영역 TOP 3
1. **강민철 (메가)**: 체계적 구조화, 킬러 문항 대비
2. **김승리 (대성)**: 지문 처리 행동 강령, 유기적 연결
3. **한병훈 (EBS)**: EBS 연계, 가성비 최강

### 문학 영역 TOP 3
1. **김동욱 (메가)**: 심화 해석, 고전시가 전문
2. **김젬마 (대성)**: 패턴화 풀이, 효율적 접근
3. **한병훈 (EBS)**: EBS 연계, 작품 분석

### 언어와 매체
1. **정석민 (대성)**: 언매 원탑, 개념~심화 완벽

### EBS 연계 (필수)
- **한병훈**: 수능특강, 수능완성 활용
- **최서희**: 연계 분석 전문

---

## 🧠 멘탈 관리

### 슬럼프 대응법
| 증상 | 원인 | 해결책 |
|------|------|--------|
| 점수 정체 | 과도한 학습 | 1~2일 휴식 후 재시작 |
| 의욕 저하 | 번아웃 | 강의 분량 50% 감소 |
| 불안감 급증 | 비교 심리 | SNS 차단, 자기 페이스 유지 |
| 자신감 하락 | 연속 오답 | 쉬운 문제로 자신감 회복 |

### 시험 당일 체크
**전날**: 새로운 내용 학습 금지, 가벼운 복습, 일찍 취침
**당일**: 아침 식사 필수, 30분 전 도착, 평소 루틴 유지
**시험 후**: 당일 오답 분석, 점수에 일희일비 금지

---

## 📚 권장 교재

### 수준별 교재
| 수준 | 독서 | 문학 |
|------|------|------|
| 기초 | EBS 수능특강 | EBS 수능특강 |
| 심화 | 마더텅 기출 | 마더텅 기출 |
| 고난도 | 자이스토리 | 자이스토리 |

### 비용 효율 조합
- **저예산**: EBS 무료 강의 (윤혜정, 한병훈)
- **중예산**: EBS + 대성 1~2과목
- **고예산**: 메가스터디 (강민철, 김동욱) + EBS

---

## 📊 독서 영역 세부

### 6개 지문 유형
| 영역 | 특징 | 핵심 역량 | 난이도 |
|------|------|----------|--------|
| 인문 | 철학, 역사, 윤리 | 추상적 개념 이해 | 중상 |
| 사회 | 경제, 법률, 정치 | 제도/논리 파악 | 중 |
| 과학 | 물리, 화학, 생명 | 과학적 사고 | 중상 |
| 기술 | 공학, IT, 발명 | 기술 메커니즘 | 상 (킬러) |
| 예술 | 미학, 음악, 미술 | 심미적 해석 | 중 |
| 융합 | 2개 이상 결합 | 통합적 사고 | 최상 |

### 출제 트렌드 (2025~2026)
1. 융합 지문 증가 (과학+기술, 인문+예술)
2. 긴 지문 경향 (1,500~2,000자)
3. 도표/그래프 활용 문항 증가
4. 실생활 연계 주제 확대

---

## 📝 문학 영역 세부

### 4개 갈래
| 갈래 | 빈출 유형 | 핵심 역량 | 난이도 |
|------|----------|----------|--------|
| 현대시 | 표현법, 화자 태도 | 비유/상징 해석 | 중 |
| 고전시가 | 시조, 가사, 향가 | 고어 해석 | 중상 |
| 현대소설 | 서술 시점, 인물 심리 | 서사 구조 파악 | 중 |
| 고전산문 | 한문 소설, 판소리계 | 고전 문법 | 상 |

### 출제 트렌드
1. 외적 준거 적용 (<보기> 활용 비평 문항 증가)
2. 복합 갈래 비교 문항
3. 낯선 고전 작품 출제

---

## ⏰ 주간 스케줄 템플릿

### 초보형 (주 8시간)
- 월: 독서 개념 1.5h
- 화: 문학 개념 1.5h
- 수: 선택과목 1h
- 목: 독서 개념 1.5h
- 금: 문학 복습 1h
- 토: 종합 문제 1.5h
- 일: 휴식

### 성장형 (주 13시간)
- 월: 독서 강의 + 문제 2h
- 화: 문학 강의 + 문제 2h
- 수: 선택과목 1.5h
- 목: 독서 기출 분석 2h
- 금: 문학 기출 분석 2h
- 토: 모의고사 3h
- 일: 주간 정리 0.5h
`.trim(),

    // Gemini API에 파일 업로드
    async uploadToGemini(apiKey) {
        if (!apiKey) {
            console.error('API key required');
            return null;
        }

        try {
            // 파일 내용을 Blob으로 변환
            const blob = new Blob([this.koreanKnowledge], { type: 'text/markdown' });

            // FormData 생성
            const formData = new FormData();
            formData.append('file', blob, 'korean_exam_2026_knowledge.md');

            // 메타데이터
            const metadata = {
                file: {
                    displayName: '2026 수능 국어 완전 가이드'
                }
            };
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

            // 파일 업로드
            const response = await fetch(`${this.GEMINI_FILE_API}?key=${apiKey}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('File upload error:', error);
                return null;
            }

            const data = await response.json();
            this.uploadedFileUri = data.file?.uri;
            this.uploadedFileName = data.file?.name;

            console.log('File uploaded:', this.uploadedFileName);
            return this.uploadedFileUri;

        } catch (err) {
            console.error('Upload failed:', err);
            return null;
        }
    },

    // 업로드된 파일 목록 가져오기
    async listFiles(apiKey) {
        try {
            const response = await fetch(`${this.GEMINI_FILES_LIST_API}?key=${apiKey}`);
            const data = await response.json();
            return data.files || [];
        } catch (err) {
            console.error('List files error:', err);
            return [];
        }
    },

    // 지식 기반 컨텍스트 생성 (RAG 용)
    getKnowledgeContext(query) {
        // 간단한 키워드 기반 검색
        const keywords = query.toLowerCase().split(' ');
        const lines = this.koreanKnowledge.split('\n');

        let relevantSections = [];
        let currentSection = '';
        let isRelevant = false;

        for (const line of lines) {
            if (line.startsWith('#')) {
                if (isRelevant && currentSection) {
                    relevantSections.push(currentSection);
                }
                currentSection = line + '\n';
                isRelevant = keywords.some(k => line.toLowerCase().includes(k));
            } else {
                currentSection += line + '\n';
                if (keywords.some(k => line.toLowerCase().includes(k))) {
                    isRelevant = true;
                }
            }
        }

        if (isRelevant && currentSection) {
            relevantSections.push(currentSection);
        }

        // 상위 3개 섹션만 반환
        return relevantSections.slice(0, 3).join('\n\n');
    },

    // 전체 지식 가져오기
    getFullKnowledge() {
        return this.koreanKnowledge;
    }
};

window.KnowledgeBase = KnowledgeBase;
