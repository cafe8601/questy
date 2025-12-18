/**
 * 입시 동반자 (Exam Companion) - Balanced Logic v4.0
 * ================================================
 */

const CONFIG = {
  KEY: 'exam_v4',
  D_DATE: '2025-11-13',
  TYPES: {
    beginner: { name: '기초 확립', range: [6, 9] },
    growing: { name: '실력 성장', range: [4, 5] },
    leaping: { name: '상위권 도약', range: [2, 3] },
    mastering: { name: '최상위 완성', range: [1, 1] }
  }
};

const Utils = {
  id: () => Math.random().toString(36).substr(2, 9),
  dDay: () => Math.ceil((new Date(CONFIG.D_DATE) - new Date().setHours(0, 0, 0, 0)) / 86400000),
  getType: (g) => Object.values(CONFIG.TYPES).find(t => g >= t.range[0] && g <= t.range[1]) || CONFIG.TYPES.beginner
};

const Store = {
  get: () => JSON.parse(localStorage.getItem(CONFIG.KEY) || 'null'),
  set: (d) => localStorage.setItem(CONFIG.KEY, JSON.stringify(d)),
  init: () => {
    if (!Store.get()) Store.set({
      profile: { name: '수험생', grade: 5, target: 2 },
      exams: [], checkins: [], chats: [], wrongNotes: []
    });
    // Migration: add wrongNotes if missing
    const d = Store.get();
    if (!d.wrongNotes) { d.wrongNotes = []; Store.set(d); }
    if (!d.tasks) { d.tasks = []; Store.set(d); }
  }
};

const Actions = {
  updateProfile: (p) => { const d = Store.get(); d.profile = { ...d.profile, ...p }; Store.set(d); },
  addExam: (e) => { const d = Store.get(); d.exams.push({ ...e, id: Utils.id() }); Store.set(d); },
  addCheckin: (c) => { const d = Store.get(); d.checkins.push({ ...c, date: new Date().toISOString() }); Store.set(d); },
  addChat: (m) => { const d = Store.get(); d.chats.push(m); Store.set(d); },
  addWrongNote: (note) => { const d = Store.get(); d.wrongNotes.push({ ...note, id: Utils.id(), date: new Date().toISOString() }); Store.set(d); },
  deleteWrongNote: (id) => { const d = Store.get(); d.wrongNotes = d.wrongNotes.filter(n => n.id !== id); Store.set(d); },
  // Planner
  addTask: (task) => { const d = Store.get(); d.tasks.push({ ...task, id: Utils.id(), done: false, createdAt: new Date().toISOString() }); Store.set(d); },
  toggleTask: (id) => { const d = Store.get(); const t = d.tasks.find(t => t.id === id); if (t) t.done = !t.done; Store.set(d); },
  deleteTask: (id) => { const d = Store.get(); d.tasks = d.tasks.filter(t => t.id !== id); Store.set(d); },
  reset: () => { localStorage.removeItem(CONFIG.KEY); location.reload(); }
};

const Charts = {
  line: (data) => {
    if (!data.length) return '';
    const w = 340, h = 100, p = 10, max = 400; // Compact Chart
    const pts = data.map((d, i) => ({
      x: p + i * ((w - p * 2) / Math.max(1, data.length - 1)),
      y: h - p - (d.score / max) * (h - p * 2),
      val: d.score
    }));
    const path = `M ${pts[0].x} ${pts[0].y}` + pts.slice(1).map(p => ` L ${p.x} ${p.y}`).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}">
      <path d="${path}" class="chart-line" />
      ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#1E1E1E" stroke="#5E5CE6" stroke-width="2"/>`).join('')}
    </svg>`;
  },
  radar: () => { // Simple Mock
    return `<svg class="chart-svg" viewBox="0 0 200 200"><polygon points="100,20 180,70 150,160 50,160 20,70" class="radar-polygon" fill-opacity="0.2"/></svg>`;
  }
};

// --- Views (Balanced Layout) ---

const Dash = {
  render: () => {
    const { profile, exams, tasks, wrongNotes } = Store.get();
    const type = Utils.getType(profile.grade);
    const dday = Utils.dDay();
    const lastScore = exams.length ? exams[exams.length - 1].score : null;

    // 플래너 진행률
    const completedTasks = (tasks || []).filter(t => t.done).length;
    const totalTasks = (tasks || []).length;
    const plannerProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 취약 과목 분석 (오답 3개 이상)
    const weakSubjects = [];
    const subjectCounts = {};
    (wrongNotes || []).forEach(n => {
      subjectCounts[n.subject] = (subjectCounts[n.subject] || 0) + 1;
    });
    Object.entries(subjectCounts).forEach(([subj, count]) => {
      if (count >= 3) weakSubjects.push({ subject: subj, count });
    });

    document.getElementById('dashboard-content').innerHTML = `
      <!-- D-Day Hero -->
      <div class="card" style="text-align:center; padding:40px 20px; background:linear-gradient(135deg, rgba(94,92,230,0.2) 0%, rgba(16,185,129,0.1) 100%)">
        <div style="font-size:14px; color:var(--text-sub); margin-bottom:8px">2025 수능까지</div>
        <div style="font-size:72px; font-weight:800; color:#fff; line-height:1; margin-bottom:8px">D-${dday}</div>
        <div style="font-size:16px; color:var(--text-sub)">${profile.name}님, 오늘도 화이팅! 💪</div>
      </div>

      <!-- Quick Stats Grid -->
      <div class="grid-container" style="margin-top:20px">
        <!-- 오늘 플래너 -->
        <div class="card half-width" onclick="Router.go('planner')" style="cursor:pointer">
          <div class="card-header"><span class="card-title">📅 오늘 플래너</span></div>
          <div style="display:flex; align-items:center; gap:16px">
            <div style="font-size:36px; font-weight:800; color:${plannerProgress === 100 ? '#10B981' : '#fff'}">${plannerProgress}%</div>
            <div style="flex:1">
              <div style="height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden">
                <div style="height:100%; width:${plannerProgress}%; background:#5E5CE6; transition:width 0.3s"></div>
              </div>
              <div style="font-size:12px; color:var(--text-sub); margin-top:4px">${completedTasks}/${totalTasks} 완료</div>
            </div>
          </div>
        </div>
        
        <!-- 최근 성적 -->
        <div class="card half-width" onclick="Router.go('exams')" style="cursor:pointer">
          <div class="card-header"><span class="card-title">📝 최근 모의고사</span></div>
          <div style="display:flex; align-items:baseline; gap:8px">
            <div style="font-size:36px; font-weight:800; color:#fff">${lastScore || '-'}</div>
            <div style="font-size:14px; color:var(--text-sub)">점</div>
          </div>
          <div style="font-size:12px; color:var(--text-sub); margin-top:4px">${type.name} · 목표 ${profile.target}등급</div>
        </div>
      </div>

      <!-- 취약 과목 알림 -->
      ${weakSubjects.length ? `
        <div class="card" style="margin-top:20px; border-color:rgba(239,68,68,0.3)" onclick="Router.go('wrongnotes')" style="cursor:pointer">
          <div class="card-header"><span class="card-title" style="color:#EF4444">⚠️ 취약 과목 알림</span></div>
          <div style="display:flex; gap:12px; flex-wrap:wrap">
            ${weakSubjects.map(w => `
              <div style="background:rgba(239,68,68,0.1); padding:8px 16px; border-radius:8px; border:1px solid rgba(239,68,68,0.3)">
                <span style="color:#EF4444; font-weight:600">${w.subject}</span>
                <span style="color:var(--text-sub); margin-left:8px">${w.count}회 오답</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 성적 추이 차트 -->
      <div class="card" style="margin-top:20px">
        <div class="card-header"><span class="card-title">📈 성적 추이</span></div>
        <div style="height:120px; display:flex; align-items:center; justify-content:center">
          ${exams.length >= 2 ? Charts.line(exams.map(e => ({ score: e.score }))) :
        '<div style="color:var(--text-sub)">2개 이상의 성적을 입력하면 그래프가 표시됩니다.</div>'}
        </div>
      </div>

      <!-- 빠른 액션 -->
      <div class="grid-container" style="margin-top:20px">
        <button class="card half-width" onclick="Router.go('coaching')" style="text-align:left; cursor:pointer; border:none">
          <div style="font-size:24px; margin-bottom:8px">🤖</div>
          <div style="font-weight:600; color:#fff">AI 코칭</div>
          <div style="font-size:13px; color:var(--text-sub)">학습 고민 상담하기</div>
        </button>
        <button class="card half-width" onclick="Router.go('teachers')" style="text-align:left; cursor:pointer; border:none">
          <div style="font-size:24px; margin-bottom:8px">👨‍🏫</div>
          <div style="font-weight:600; color:#fff">선생님 추천</div>
          <div style="font-size:13px; color:var(--text-sub)">맞춤 강사 찾기</div>
        </button>
      </div>
    `;
  }
};

const TeacherView = {
  render: () => {
    const { profile } = Store.get();
    const typeKey = Utils.getType(profile.grade).key; // beginner...
    // Mock Data based on type
    const recs = [
      { name: '강민철', subject: '국어', platform: '메가스터디', match: 98, desc: '압도적인 정보량 처리와 구조 독해', tag: '상위권' },
      { name: '현우진', subject: '수학', platform: '메가스터디', match: 96, desc: '수능 수학의 표준, 뉴런', tag: '전학년' },
      { name: '이명학', subject: '영어', platform: '대성마이맥', match: 92, desc: '실전적인 리드앤로직', tag: '실력향상' }
    ].sort((a, b) => b.match - a.match); // Simple Mock for UI

    document.getElementById('teachers-content').innerHTML = `
      <div style="margin-bottom:12px; font-size:14px; color:#A0A0A0">
        ${profile.name}님의 <b>${Utils.getType(profile.grade).name}</b> 성향 맞춤 추천
      </div>
      <div class="teachers-list">
        ${recs.map(t => `
          <div class="teacher-item">
            <div class="t-avatar">${t.name[0]}</div>
            <div class="t-info">
              <div class="t-name">${t.name} <span style="font-weight:400; font-size:12px; color:#666">| ${t.subject}</span></div>
              <div class="t-sub">${t.platform} · ${t.desc}</div>
            </div>
            <div class="t-match">${t.match}%</div>
          </div>
        `).join('')}
      </div>
    `;
  }
};

const ExamView = {
  render: () => {
    const { exams } = Store.get();
    document.getElementById('exams-content').innerHTML = `
      <div class="grid-container">
        <div class="card full-width">
          <div class="card-header"><span class="card-title">새 기록 추가</span></div>
          <form id="e-form" style="display:flex; gap:10px;">
             <input id="e-name" class="form-input" placeholder="시험명 (예: 6평)" required>
             <input type="number" id="e-score" class="form-input" placeholder="점수" style="width:100px" required>
             <button class="btn btn-primary" style="width:80px">저장</button>
          </form>
        </div>
        <div class="full-width">
           ${exams.map(e => `
             <div class="teacher-item" style="margin-bottom:8px">
               <div style="flex:1"><b>${e.name}</b></div>
               <div style="font-weight:600; color:#fff">${e.score}점</div>
             </div>
           `).join('')}
        </div>
      </div>
    `;
    document.getElementById('e-form').addEventListener('submit', (e) => {
      e.preventDefault();
      Actions.addExam({ name: document.getElementById('e-name').value, score: parseInt(document.getElementById('e-score').value) });
      ExamView.render();
    });
  }
};

const CoachingView = {
  render: () => {
    const { chats, profile } = Store.get();
    const hasApiKey = window.GeminiAI && window.GeminiAI.getApiKey();

    document.getElementById('coaching-content').innerHTML = `
      ${!hasApiKey ? `
        <div class="card" style="margin-bottom:16px; border-color:rgba(245,158,11,0.3)">
          <div class="card-header"><span class="card-title" style="color:#F59E0B">⚠️ API 키 필요</span></div>
          <p style="font-size:14px; color:var(--text-sub); margin-bottom:12px">Gemini AI를 사용하려면 API 키를 입력하세요.</p>
          <div style="display:flex; gap:8px">
            <input id="api-key-input" class="form-input" type="password" placeholder="Gemini API Key">
            <button id="save-api-key" class="btn btn-primary" style="width:80px">저장</button>
          </div>
        </div>
      ` : ''}
      <div class="chat-window">
        <div class="chat-msgs" id="chat-box">
          ${chats.length ? chats.map(c => `<div class="chat-bubble ${c.role}">${c.text}</div>`).join('') : '<div class="chat-bubble bot">안녕하세요! 입시 코치입니다. 학습 고민이 있으면 편하게 말씀해주세요.</div>'}
        </div>
        <form id="c-form" style="padding:16px; border-top:1px solid rgba(255,255,255,0.1); display:flex; gap:10px">
           <input id="c-in" class="form-input" placeholder="메시지 입력..." ${!hasApiKey ? 'disabled' : ''}>
           <button class="btn btn-primary" style="width:80px" ${!hasApiKey ? 'disabled' : ''}>전송</button>
        </form>
      </div>
    `;

    // Scroll to bottom
    const b = document.getElementById('chat-box');
    if (b) b.scrollTop = b.scrollHeight;

    // API Key save handler
    const saveBtn = document.getElementById('save-api-key');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const key = document.getElementById('api-key-input').value.trim();
        if (key && window.GeminiAI) {
          window.GeminiAI.setApiKey(key);
          CoachingView.render();
        }
      });
    }

    // Chat submit handler
    const form = document.getElementById('c-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('c-in');
        const text = input.value.trim();
        if (!text || !window.GeminiAI) return;

        // Add user message
        Actions.addChat({ role: 'user', text });
        CoachingView.render();
        input.value = '';

        // Show typing indicator
        Actions.addChat({ role: 'bot', text: '⏳ 생각 중...' });
        CoachingView.render();

        // Call Gemini API
        const result = await window.GeminiAI.chat(text, { profile });

        // Remove typing indicator and add real response
        const d = Store.get();
        d.chats.pop(); // Remove typing indicator
        Store.set(d);

        Actions.addChat({ role: 'bot', text: result.message });
        CoachingView.render();
      });
    }
  }
};

const CheckinView = {
  render: () => {
    document.getElementById('checkin-content').innerHTML = `
      <div class="card">
        <div class="card-header"><span class="card-title">주간 회고</span></div>
        <div class="form-group">
          <label class="form-label">만족도</label>
          <div style="display:flex; gap:8px">
             ${[1, 2, 3, 4, 5].map(n => `<button class="nav-btn" onclick="alert('${n}점 선택')">${n}</button>`).join('')}
          </div>
        </div>
        <div class="form-group"><label class="form-label">학습 시간</label><input type="number" class="form-input"></div>
        <div class="form-group"><label class="form-label">메모</label><input class="form-input" placeholder="한 줄 평"></div>
        <button class="btn btn-primary">저장하기</button>
      </div>
    `;
  }
};

const SettingsView = {
  render: () => {
    const { profile } = Store.get();
    document.getElementById('settings-content').innerHTML = `
      <div class="card">
        <div class="card-header"><span class="card-title">설정</span></div>
        <div class="form-group"><label class="form-label">이름</label><input id="s-name" class="form-input" value="${profile.name}"></div>
        <div class="form-group"><label class="form-label">현재 등급</label><input id="s-grade" type="number" class="form-input" value="${profile.grade}"></div>
        <div class="form-group"><label class="form-label">목표 등급</label><input id="s-target" type="number" class="form-input" value="${profile.target}"></div>
        <button id="s-save" class="btn btn-primary" style="margin-bottom:12px">프로필 저장</button>
        <button id="s-reset" class="btn" style="border:1px solid #d32f2f; color:#ef5350">데이터 초기화</button>
      </div>
    `;
    document.getElementById('s-save').addEventListener('click', () => {
      Actions.updateProfile({
        name: document.getElementById('s-name').value,
        grade: parseInt(document.getElementById('s-grade').value),
        target: parseInt(document.getElementById('s-target').value)
      }); alert('저장됨');
    });
    document.getElementById('s-reset').addEventListener('click', () => { if (confirm('삭제?')) Actions.reset(); });
  }
};

// 오답노트 View
const WrongNotesView = {
  SUBJECTS: ['국어', '수학', '영어', '한국사', '탐구1', '탐구2'],

  render: () => {
    const { wrongNotes } = Store.get();

    // 과목별 통계
    const stats = {};
    WrongNotesView.SUBJECTS.forEach(s => stats[s] = 0);
    wrongNotes.forEach(n => { if (stats[n.subject] !== undefined) stats[n.subject]++; });

    document.getElementById('wrongnotes-content').innerHTML = `
      <!-- 입력 폼 -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-header"><span class="card-title">오답 기록 추가</span></div>
        <form id="wrong-form">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px">
            <div class="form-group" style="margin:0">
              <label class="form-label">과목</label>
              <select id="w-subject" class="form-input" style="height:44px">
                ${WrongNotesView.SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin:0">
              <label class="form-label">단원/유형</label>
              <input id="w-topic" class="form-input" placeholder="예: 비문학 독해">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">틀린 이유</label>
            <input id="w-reason" class="form-input" placeholder="예: 시간 부족, 개념 미숙">
          </div>
          <button class="btn btn-primary" style="width:100%">추가하기</button>
        </form>
      </div>
      
      <!-- 취약 영역 분석 -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-header"><span class="card-title">취약 영역 분석</span></div>
        <div style="display:flex; gap:8px; flex-wrap:wrap">
          ${WrongNotesView.SUBJECTS.map(s => `
            <div style="flex:1; min-width:80px; text-align:center; padding:12px; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid ${stats[s] > 3 ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.05)'}">
              <div style="font-size:24px; font-weight:700; color:${stats[s] > 3 ? '#EF4444' : '#fff'}">${stats[s]}</div>
              <div style="font-size:12px; color:var(--text-sub)">${s}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- 오답 목록 -->
      <div class="card">
        <div class="card-header"><span class="card-title">오답 목록 (${wrongNotes.length}개)</span></div>
        <div style="display:flex; flex-direction:column; gap:8px">
          ${wrongNotes.length ? wrongNotes.map(n => `
            <div class="teacher-item" style="position:relative">
              <div style="flex:1">
                <div style="font-weight:600; color:#fff">[${n.subject}] ${n.topic || '미지정'}</div>
                <div style="font-size:13px; color:var(--text-sub)">${n.reason || '-'}</div>
              </div>
              <button onclick="Actions.deleteWrongNote('${n.id}'); WrongNotesView.render();" 
                      style="background:rgba(239,68,68,0.2); color:#EF4444; border:none; padding:6px 12px; border-radius:6px; cursor:pointer">삭제</button>
            </div>
          `).join('') : '<div style="text-align:center; padding:20px; color:var(--text-sub)">기록이 없습니다.</div>'}
        </div>
      </div>
    `;

    document.getElementById('wrong-form').addEventListener('submit', (e) => {
      e.preventDefault();
      Actions.addWrongNote({
        subject: document.getElementById('w-subject').value,
        topic: document.getElementById('w-topic').value,
        reason: document.getElementById('w-reason').value
      });
      WrongNotesView.render();
    });
  }
};

// 학습 플래너 View
const PlannerView = {
  render: () => {
    const { tasks } = Store.get();
    const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
    const completedCount = tasks.filter(t => t.done).length;
    const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

    document.getElementById('planner-content').innerHTML = `
      <!-- 오늘 날짜 & 진행률 -->
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px">
          <div>
            <div style="font-size:14px; color:var(--text-sub)">오늘</div>
            <div style="font-size:20px; font-weight:700; color:#fff">${today}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:32px; font-weight:800; color:${progress === 100 ? '#10B981' : '#fff'}">${progress}%</div>
            <div style="font-size:12px; color:var(--text-sub)">${completedCount}/${tasks.length} 완료</div>
          </div>
        </div>
        <!-- Progress Bar -->
        <div style="height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden">
          <div style="height:100%; width:${progress}%; background:linear-gradient(90deg, #5E5CE6, #10B981); transition:width 0.3s"></div>
        </div>
      </div>
      
      <!-- 할 일 추가 -->
      <div class="card" style="margin-bottom:20px">
        <form id="task-form" style="display:flex; gap:10px">
          <input id="task-input" class="form-input" placeholder="할 일을 입력하세요..." style="flex:1">
          <button class="btn btn-primary" style="width:80px">추가</button>
        </form>
      </div>
      
      <!-- 할 일 목록 -->
      <div class="card">
        <div class="card-header"><span class="card-title">오늘의 할 일</span></div>
        <div style="display:flex; flex-direction:column; gap:8px">
          ${tasks.length ? tasks.map(t => `
            <div class="teacher-item" style="opacity:${t.done ? '0.5' : '1'}">
              <button onclick="Actions.toggleTask('${t.id}'); PlannerView.render();" 
                      style="width:28px; height:28px; border-radius:50%; border:2px solid ${t.done ? '#10B981' : 'rgba(255,255,255,0.3)'}; background:${t.done ? '#10B981' : 'transparent'}; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0">
                ${t.done ? '✓' : ''}
              </button>
              <div style="flex:1; text-decoration:${t.done ? 'line-through' : 'none'}; color:${t.done ? 'var(--text-sub)' : '#fff'}">${t.text}</div>
              <button onclick="Actions.deleteTask('${t.id}'); PlannerView.render();" 
                      style="background:none; border:none; color:var(--text-sub); cursor:pointer; padding:8px">✕</button>
            </div>
          `).join('') : '<div style="text-align:center; padding:30px; color:var(--text-sub)">할 일을 추가해보세요!</div>'}
        </div>
      </div>
    `;

    document.getElementById('task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('task-input');
      const text = input.value.trim();
      if (!text) return;
      Actions.addTask({ text });
      input.value = '';
      PlannerView.render();
    });
  }
};

const Router = {
  go: (p) => {
    document.querySelectorAll('.page').forEach(e => e.classList.remove('active'));
    document.getElementById(`page-${p}`).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.page === p);
    });

    if (p === 'dashboard') Dash.render();
    if (p === 'teachers') TeacherView.render();
    if (p === 'exams') ExamView.render();
    if (p === 'coaching') CoachingView.render();
    if (p === 'checkin') CheckinView.render();
    if (p === 'settings') SettingsView.render();
    if (p === 'wrongnotes') WrongNotesView.render();
    if (p === 'planner') PlannerView.render();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => Router.go(b.dataset.page)));
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-app').classList.remove('hidden');
    Router.go('dashboard');
  }, 300);
});
// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW error:', err));
  });
}
