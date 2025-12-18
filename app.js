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
      exams: [], checkins: [], chats: []
    });
  }
};

const Actions = {
  updateProfile: (p) => { const d = Store.get(); d.profile = { ...d.profile, ...p }; Store.set(d); },
  addExam: (e) => { const d = Store.get(); d.exams.push({ ...e, id: Utils.id() }); Store.set(d); },
  addCheckin: (c) => { const d = Store.get(); d.checkins.push({ ...c, date: new Date().toISOString() }); Store.set(d); },
  addChat: (m) => { const d = Store.get(); d.chats.push(m); Store.set(d); },
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
    const { profile, exams } = Store.get();
    const type = Utils.getType(profile.grade);
    const lastScore = exams.length ? exams[exams.length - 1].score : '-';

    document.getElementById('dashboard-content').innerHTML = `
      <!-- 1. Profile Summary (Full Width) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">내 프로필</span>
          <span class="d-day-badge">D-${Utils.dDay()}</span>
        </div>
        <div class="stat-row">
           <div class="big-stat">${profile.name}</div>
           <div class="sub-stat">목표 ${profile.target}등급 · ${type.name}</div>
        </div>
      </div>

      <!-- 2. Charts (Grid) -->
      <div class="grid-container">
        <div class="card half-width">
           <div class="card-header"><span class="card-title">성적 추이</span></div>
           <div style="height:100px; display:flex; align-items:center; justify-content:center">
             ${exams.length ? Charts.line(exams.map(e => ({ score: e.score }))) : '<span class="sub-stat">기록 없음</span>'}
           </div>
        </div>
        <div class="card half-width">
           <div class="card-header"><span class="card-title">밸런스</span></div>
           <div style="height:100px; display:flex; align-items:center; justify-content:center">${Charts.radar()}</div>
        </div>
      </div>
      
      <!-- 3. Recent Activity -->
      <div class="card">
         <div class="card-header"><span class="card-title">최근 모의고사</span></div>
         <div class="stat-row">
            <span class="big-stat">${lastScore}</span>
            <span class="sub-stat">점 (표준점수 합)</span>
         </div>
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
    const { chats } = Store.get();
    document.getElementById('coaching-content').innerHTML = `
      <div class="chat-window">
        <div class="chat-msgs" id="chat-box">
          ${chats.length ? chats.map(c => `<div class="chat-bubble ${c.role}">${c.text}</div>`).join('') : '<div class="chat-bubble bot">안녕하세요! 학습 방향을 잡아드릴게요.</div>'}
        </div>
        <form id="c-form" style="padding:16px; border-top:1px solid #333; display:flex; gap:10px">
           <input id="c-in" class="form-input" placeholder="메시지 입력...">
           <button class="btn btn-primary" style="width:60px">전송</button>
        </form>
      </div>
    `;
    const b = document.getElementById('chat-box'); b.scrollTop = b.scrollHeight;
    document.getElementById('c-form').addEventListener('submit', (e) => {
      e.preventDefault(); const i = document.getElementById('c-in'); const t = i.value.trim(); if (!t) return;
      Actions.addChat({ role: 'user', text: t }); CoachingView.render(); i.value = '';
      setTimeout(() => { Actions.addChat({ role: 'bot', text: '분석 중입니다...' }); CoachingView.render(); }, 600);
    });
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

const Router = {
  go: (p) => {
    document.querySelectorAll('.page').forEach(e => e.classList.remove('active'));
    document.getElementById(`page-${p}`).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.page === p);
      // 단순 텍스트 비교 대신 data-page 속성을 사용하여 스타일링
    });

    if (p === 'dashboard') Dash.render();
    if (p === 'teachers') TeacherView.render();
    if (p === 'exams') ExamView.render();
    if (p === 'coaching') CoachingView.render();
    if (p === 'checkin') CheckinView.render();
    if (p === 'settings') SettingsView.render();
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
