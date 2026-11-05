// ================================================================
//  To be a real man - 동작 코드
//
//  영상 넣는 법:
//    videos/큰카테고리/작은카테고리/성향/ 안에 1.mp4, 2.mp4, 3.mp4 ... 처럼
//    숫자 순서대로 이름 붙여 넣으면 자동으로 인식됩니다.
//    성향 폴더: cheer(응원), mock(조롱), push(압박)
//    예) videos/before/chest/mock/1.mp4
//    (중간 번호가 빠지면 그 뒤 번호는 인식되지 않아요)
// ================================================================

const MAX_VIDEOS = 50;          // 카테고리당 최대 몇 개까지 찾을지
const PLACEHOLDER_SECONDS = 6;  // 임시 화면 길이(초)

// ----------------------------------------------------------------
//  카테고리 목록
//   id    : 영상 폴더 이름 (영어, 바꾸면 폴더 이름도 같이 바꿔야 함)
//   name  : 화면에 보이는 이름
//   hint  : 버튼 아래 작은 글씨
//   warn  : true면 hint를 "⚠ 경고" 표시와 함께 빨갛게 보여줌
//   color : 버튼 색
//   lines : 영상이 없을 때 임시 화면에 나오는 대사
// ----------------------------------------------------------------
const GROUPS = [
  {
    id: "before",
    name: "운동 전",
    eyebrow: "BEFORE WORKOUT",
    hint: "오늘 뭐 하는 날이야?",
    color: "#ff6a00",
    subs: [
      {
        id: "chest", name: "가슴 하는 날", hint: "멘탈 약하면 누르지 마라.", warn: true, color: "#ff3b1f",
        lines: [
          "벤치에 누웠으면\n변명도 같이 내려놔.",
          "오늘 미는 무게가\n너의 자신감이다.",
          "가슴은 거울 보라고\n있는 게 아니다. 밀어.",
        ],
      },
      {
        id: "back", name: "등 하는 날", hint: "등 뒤에서 욕먹는 기분일 거다.", warn: true, color: "#ff8a00",
        lines: [
          "등은 남이 본다.\n대충 하면 다 티 난다.",
          "팔로 당기지 마.\n등으로 당겨.",
          "넓은 등은\n하루아침에 안 생긴다. 시작해.",
        ],
      },
      {
        id: "shoulder", name: "어깨 하는 날", hint: "각오 없이 들어오지 마라.", warn: true, color: "#ffd000",
        lines: [
          "어깨 넓이가\n존재감이다.",
          "가볍다고 무시하지 마.\n어깨는 정직하다.",
          "오늘 어깨 안 하면\n티셔츠가 슬퍼한다.",
        ],
      },
      {
        id: "arms", name: "팔 하는 날", hint: "보고 나면 핑계가 사라진다.", warn: true, color: "#ff3d8b",
        lines: [
          "팔은 반동으로\n크지 않는다. 천천히.",
          "펌핑은 보상이다.\n그 전에 고통부터.",
          "반팔 입는 계절은\n지금 만들어진다.",
        ],
      },
      {
        id: "legs", name: "하체 하는 날", hint: "누르는 순간 도망칠 곳은 없다.", warn: true, color: "#c13cff",
        lines: [
          "하체 빼먹는 놈은\n상체도 가짜다.",
          "계단 오를 때 후회해도\n오늘은 앉아.",
          "스쿼트 한 개가\n자존심 한 개다.",
        ],
      },
    ],
  },
  {
    id: "during",
    name: "운동 중",
    eyebrow: "DURING WORKOUT",
    hint: "지금 무너지려고 하지?",
    color: "#00d4ff",
    subs: [
      {
        id: "weak", name: "왠지 힘이 빠질 때", hint: "나약한 소리 할 거면 누르지 마라.", warn: true, color: "#00d4ff",
        lines: [
          "힘이 없는 게 아니라\n의지가 쉬고 있는 거다.",
          "물 한 모금 마시고\n다시 잡아.",
          "오늘 컨디션 탓하면\n내일도 컨디션 탓한다.",
        ],
      },
      {
        id: "last-set", name: "마지막 세트", hint: "누르면 한 개 더 들게 된다.", warn: true, color: "#ff3b1f",
        lines: [
          "지금 내려놓으면\n오늘 운동은 없던 거다.",
          "한 개 더.\n그게 네가 여기 온 이유야.",
          "근육은 마지막 한 개에서\n자란다. 들어.",
        ],
      },
      {
        id: "cardio", name: "유산소 포기하고 싶을 때", hint: "보고 나면 속도 못 줄인다.", warn: true, color: "#2bff88",
        lines: [
          "속도 줄이지 마.\n숨 차는 게 정상이다.",
          "5분만 더.\n그다음에 생각해.",
          "다리가 아니라\n머리가 먼저 포기하는 거다.",
        ],
      },
      {
        id: "more", name: "더 해야 하는데 하기 싫을 때", hint: "누르는 순간 세트 하나 추가다.", warn: true, color: "#ffb800",
        lines: [
          "하기 싫은 걸 할 때\n남자가 된다.",
          "여기서 집에 가면\n어제랑 똑같은 너다.",
          "딱 한 세트만 더.\n그건 할 수 있잖아.",
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------
//  성향 목록 (시작할 때 고르는 것)
// ----------------------------------------------------------------
const TYPES = [
  { id: "cheer", name: "응원", hint: "믿어주면 불타오른다.", color: "#2bff88" },
  { id: "mock", name: "조롱", hint: "무시당하면 이 악물고 증명한다.", color: "#ff3d8b" },
  { id: "push", name: "압박", hint: "몰아붙여야 움직인다.", color: "#ff3b1f" },
];

// ----------------------------------------------------------------
//  타이머 설정 ("지금 바로 시작"을 누르면 나오는 운동 타이머)
//   ※ 지금은 임시 값이에요. 운동별 목표 시간과 나이별 차등은 나중에 정해서 여기만 바꾸면 돼요.
// ----------------------------------------------------------------
const READY_SECONDS = 3;  // 시작 전 "3, 2, 1" 준비 시간

// 운동(작은 카테고리)별 목표 시간 (초)
const TIMER_SECONDS = {
  chest: 60, back: 60, shoulder: 60, arms: 60, legs: 60,
  weak: 60, "last-set": 60, cardio: 60, more: 60,
};

// 나이에 따른 차등: 나이가 upTo 이하이면 목표 시간 × factor
//   예) factor 1.2 → 20% 더 길게, 0.8 → 20% 더 짧게. 지금은 모두 1(그대로).
const AGE_RULES = [
  { upTo: 29, factor: 1 },
  { upTo: 39, factor: 1 },
  { upTo: 49, factor: 1 },
  { upTo: 99, factor: 1 },
];

// 타이머가 끝났을 때 성향별 한마디
const TIMER_DONE_LINES = {
  cheer: ["잘했어! 진짜 멋있다.", "봐, 할 수 있잖아.", "오늘의 너, 최고야."],
  mock: ["오, 그 정도는 하네?", "기대 안 했는데… 좀 놀랐다.", "끝까지 버틴 건 인정."],
  push: ["끝? 아니. 한 세트 더 할 수 있잖아.", "숨 고르고 다시 간다.", "이제 몸 좀 풀렸네."],
};

function timerGoal(sid) {
  const base = TIMER_SECONDS[sid] || 60;
  const rule = AGE_RULES.find((r) => (me.age || 0) <= r.upTo);
  return Math.max(5, Math.round(base * (rule ? rule.factor : 1)));
}

// ---------- 내 정보 (나이, 성향) 저장 ----------
//  이 휴대폰(브라우저)에만 저장돼요. 다음에 들어오면 지난번 값이 미리 채워져요.
let me = { age: null, type: null };
try { me = Object.assign(me, JSON.parse(localStorage.getItem("me") || "{}")); } catch (e) {}
function saveMe() {
  try { localStorage.setItem("me", JSON.stringify(me)); } catch (e) {}
}

// ---------- 화면 요소 ----------
const $ = (id) => document.getElementById(id);
const player = $("player");
const video = $("video");
const placeholder = $("placeholder");
const phLine = $("ph-line");
const phProgress = $("ph-progress");
const phNote = $("ph-note");
const tapToPlay = $("tap-to-play");

const groupScreen = $("group");
const findGroup = (gid) => GROUPS.find((g) => g.id === gid);
const findSub = (gid, sid) => findGroup(gid).subs.find((s) => s.id === sid);

let lastPicked = {};   // 방금 보여준 것 기억 (연속 중복 방지)
let current = null;    // 지금 재생 중인 { group, sub }

// ---------- 영상 파일 찾기 ----------
function videoExists(src) {
  return new Promise((resolve) => {
    const test = document.createElement("video");
    let finished = false;
    const done = (ok) => {
      if (finished) return;
      finished = true;
      test.removeAttribute("src");
      test.load();
      resolve(ok);
    };
    test.preload = "metadata";
    test.muted = true;
    test.onloadedmetadata = () => done(true);
    test.onerror = () => done(false);
    setTimeout(() => done(false), 5000);
    test.src = src;
  });
}

async function findVideos(folder) {
  const list = [];
  for (let i = 1; i <= MAX_VIDEOS; i++) {
    const src = `videos/${folder}/${i}.mp4`;
    if (await videoExists(src)) list.push(src);
    else break;
  }
  return list;
}

// 영상 목록은 처음 필요할 때 한 번만 찾아서 기억해 둠 (카테고리/성향별)
const videoLists = {};
function getVideos(folder) {
  if (!videoLists[folder]) videoLists[folder] = findVideos(folder);
  return videoLists[folder];
}

function pickRandom(key, items) {
  if (items.length === 1) return items[0];
  let pick;
  do {
    pick = items[Math.floor(Math.random() * items.length)];
  } while (pick === lastPicked[key]);
  lastPicked[key] = pick;
  return pick;
}

// ---------- 버튼 만들기 ----------
function makeButton(num, item, onClick) {
  const btn = document.createElement("button");
  btn.className = "cat";
  btn.style.setProperty("--c", item.color);
  btn.innerHTML = `
    <span class="num display">${String(num).padStart(2, "0")}</span>
    <span class="label display">${item.name}</span>
    <span class="hint${item.warn ? " warn" : ""}">${item.warn ? '<b class="warn-tag">⚠ 경고</b>' : ""}${item.hint}</span>`;
  btn.addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate(30);  // 누르면 살짝 진동 (안드로이드)
    onClick();
  });
  return btn;
}

const groupList = $("group-list");
groupList.classList.add("few");
GROUPS.forEach((g, i) => {
  groupList.appendChild(makeButton(i + 1, g, () => go({ screen: "group", group: g.id })));
});

// ---------- 시작 → 나이 → 성향 ----------
const SCREENS = ["start", "age", "type", "home", "group", "timer"];
let curState = { screen: "start" };
const ageInput = $("age-input");
const ageNext = $("age-next");
const ageError = $("age-error");
const validAge = (n) => n >= 10 && n <= 99;

$("start-btn").addEventListener("click", () => go({ screen: "age" }));

ageInput.addEventListener("input", () => {
  ageInput.value = ageInput.value.replace(/[^0-9]/g, "");
  const n = Number(ageInput.value);
  ageNext.disabled = !validAge(n);
  ageError.hidden = ageInput.value.length < 2 || validAge(n);
});
ageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !ageNext.disabled) ageNext.click();
});
ageNext.addEventListener("click", () => {
  me.age = Number(ageInput.value);
  saveMe();
  ageInput.blur();
  if (curState.change) history.back();   // "나이 수정"으로 들어왔으면 원래 화면으로
  else go({ screen: "type" });
});

const typeList = $("type-list");
typeList.classList.add("few");
TYPES.forEach((t, i) => {
  typeList.appendChild(makeButton(i + 1, t, () => {
    me.type = t.id;
    saveMe();
    GROUPS.forEach((g) => g.subs.forEach((s) => getVideos(`${g.id}/${s.id}/${t.id}`)));  // 미리 찾아두기
    if (curState.change) history.back();   // "성향 바꾸기"로 들어왔으면 원래 화면으로
    else go({ screen: "home" });
  }));
});

$("me-age").addEventListener("click", () => go({ screen: "age", change: true }));
$("me-type").addEventListener("click", () => go({ screen: "type", change: true }));

function showMe() {
  const t = TYPES.find((x) => x.id === me.type);
  $("me-age").innerHTML = `${me.age || "-"}세 <i>수정</i>`;
  $("me-type").innerHTML = `<b style="color:${t ? t.color : "inherit"}">${t ? t.name : "-"}</b>형 <i>성향 바꾸기 ⇄</i>`;
}

// ---------- 화면 전환 (휴대폰 뒤로가기 버튼도 동작하도록) ----------
function go(state) {
  history.pushState(state, "");
  render(state);
}

function render(state) {
  curState = state;
  stopAll();
  stopTimer();
  SCREENS.forEach((id) => { $(id).hidden = state.screen !== id; });
  player.hidden = state.screen !== "player";

  // 영상 재생 중에는 배경 영상을 멈춰서 배터리 아끼기
  const bgVideo = $("bg-video");
  document.body.classList.toggle("group-open", ["group", "age", "type", "timer"].includes(state.screen));
  if (state.screen === "player") bgVideo.pause();
  else bgVideo.play().catch(() => {});

  if (state.screen === "age") {
    $("age-eyebrow").textContent = state.change ? "나이 수정" : "STEP 1 / 2";
    ageNext.textContent = state.change ? "저장" : "다음";
    ageInput.value = me.age ? String(me.age) : "";
    ageNext.disabled = !validAge(Number(ageInput.value));
    ageError.hidden = true;
    setTimeout(() => ageInput.focus(), 50);
  }
  if (state.screen === "type") {
    $("type-eyebrow").textContent = state.change ? "성향 바꾸기" : "STEP 2 / 2";
    typeList.querySelectorAll(".cat").forEach((b, i) => b.classList.toggle("picked", TYPES[i].id === me.type));
  }
  if (state.screen === "home") showMe();
  if (state.screen === "group") showGroup(state.group);
  if (state.screen === "player") play(state.group, state.sub);
  if (state.screen === "timer") startTimer(state.group, state.sub);
  window.scrollTo(0, 0);
}

function showGroup(gid) {
  const g = findGroup(gid);
  groupScreen.style.setProperty("--theme", g.color);
  $("group-eyebrow").textContent = g.eyebrow;
  $("group-title").textContent = g.name;

  const list = $("sub-list");
  list.innerHTML = "";
  list.className = "list " + (g.subs.length >= 5 ? "many" : "");
  g.subs.forEach((s, i) => {
    list.appendChild(makeButton(i + 1, s, () => go({ screen: "player", group: g.id, sub: s.id })));
  });
}

// ---------- 재생 ----------
async function play(gid, sid) {
  const sub = findSub(gid, sid);
  const folder = `${gid}/${sid}/${me.type || "push"}`;
  current = { gid, sid };
  player.style.setProperty("--c", sub.color);
  $("player-cat").textContent = sub.name;
  stopAll();

  const list = await getVideos(folder);
  if (!current || current.gid !== gid || current.sid !== sid) return; // 그새 나갔으면 중단

  if (list.length === 0) {
    showPlaceholder(sub, folder, gid, sid);
    return;
  }

  video.hidden = false;
  video.src = pickRandom(folder, list);
  try {
    await video.play();
  } catch (e) {
    tapToPlay.hidden = false;  // 소리 있는 자동재생이 막힌 경우 → 직접 누르게
  }
}

function showPlaceholder(sub, folder, gid, sid) {
  video.hidden = true;
  placeholder.hidden = false;

  phLine.textContent = pickRandom(`${gid}/${sid}-line`, sub.lines);
  phLine.style.animation = "none";
  void phLine.offsetWidth;
  phLine.style.animation = "";

  phNote.innerHTML =
    `아직 '${(TYPES.find((t) => t.id === me.type) || {}).name || ""}' 영상이 없어서 임시 화면이에요.<br>` +
    `<code>videos/${folder}/1.mp4</code> 를 넣으면 영상이 나와요.`;

  phProgress.style.transition = "none";
  phProgress.style.width = "0%";
  void phProgress.offsetWidth;
  phProgress.style.transition = `width ${PLACEHOLDER_SECONDS}s linear`;
  phProgress.style.width = "100%";
}

function stopAll() {
  video.pause();
  video.removeAttribute("src");
  video.load();
  placeholder.hidden = true;
  tapToPlay.hidden = true;
}

// ---------- 운동 타이머 ----------
const RING_LEN = 2 * Math.PI * 90;
const ringFg = $("ring-fg");
ringFg.style.strokeDasharray = RING_LEN;
const tLeft = $("timer-left");
const tRight = $("timer-right");
let T = null;   // 타이머 상태
let wakeLock = null;

const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

function startTimer(gid, sid) {
  const sub = findSub(gid, sid);
  $("timer").style.setProperty("--theme", sub.color);
  $("timer").style.setProperty("--c", sub.color);
  $("timer-title").textContent = sub.name;
  const goal = timerGoal(sid);
  $("timer-goal").textContent = `목표 ${fmt(goal)}`;
  $("timer-msg").textContent = "";
  T = { gid, sid, goal, phase: "ready", left: READY_SECONDS * 1000, last: Date.now(), paused: false, tick: null };
  setTimerButtons("running");
  keepScreenOn(true);
  T.tick = setInterval(timerTick, 100);
  timerTick();
}

function timerTick() {
  if (!T || T.paused) return;
  const now = Date.now();
  T.left -= now - T.last;
  T.last = now;

  if (T.phase === "ready") {
    if (T.left <= 0) {
      T.phase = "go";
      T.left += T.goal * 1000;
      buzz([80]);
      beep(880, 0.15);
    }
  } else if (T.phase === "go" && T.left <= 0) {
    return finishTimer();
  }
  drawTimer();
}

function drawTimer() {
  const sec = Math.max(0, Math.ceil(T.left / 1000));
  const total = T.phase === "ready" ? READY_SECONDS : T.goal;
  const ratio = Math.max(0, Math.min(1, T.left / (total * 1000)));
  ringFg.style.strokeDashoffset = RING_LEN * (1 - ratio);
  $("timer").classList.toggle("ready", T.phase === "ready");
  $("timer-phase").textContent = T.phase === "ready" ? "준비" : T.paused ? "일시정지" : "운동 중";
  $("timer-time").textContent = T.phase === "ready" ? String(sec) : fmt(sec);
  if (T.phase === "go" && sec <= 3 && sec > 0 && T.lastBeep !== sec) {   // 마지막 3초 삑
    T.lastBeep = sec;
    beep(660, 0.08);
  }
}

function finishTimer() {
  clearInterval(T.tick);
  T.phase = "done";
  T.left = 0;
  ringFg.style.strokeDashoffset = RING_LEN;
  $("timer").classList.remove("ready");
  $("timer-phase").textContent = "끝!";
  $("timer-time").textContent = fmt(0);
  const lines = TIMER_DONE_LINES[me.type] || TIMER_DONE_LINES.push;
  $("timer-msg").textContent = lines[Math.floor(Math.random() * lines.length)];
  setTimerButtons("done");
  buzz([200, 100, 200, 100, 400]);
  beep(990, 0.5);
  keepScreenOn(false);
}

function setTimerButtons(mode) {
  if (mode === "done") {
    tLeft.textContent = "처음으로";
    tRight.textContent = "한 세트 더 ↻";
  } else {
    tLeft.textContent = T && T.paused ? "계속" : "일시정지";
    tRight.textContent = "끝내기";
  }
  $("timer").dataset.mode = mode;
}

tLeft.addEventListener("click", () => {
  if (!T) return;
  if (T.phase === "done") return go({ screen: "home" });
  T.paused = !T.paused;
  T.last = Date.now();
  setTimerButtons("running");
  drawTimer();
});
tRight.addEventListener("click", () => {
  if (!T) return;
  unlockAudio();
  if (T.phase === "done") return startTimer(T.gid, T.sid);   // 한 세트 더
  finishTimer();                                             // 끝내기
});

function stopTimer() {
  if (T) clearInterval(T.tick);
  T = null;
  keepScreenOn(false);
}

function buzz(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

let audioCtx = null;
// 휴대폰은 버튼을 누른 순간에만 소리를 허락해서, 누를 때 미리 소리 장치를 깨워 둠
function unlockAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch (e) {}
}
function beep(freq, sec) {
  try {
    unlockAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.25, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + sec);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + sec);
  } catch (e) {}
}

// 타이머 도는 동안 화면이 꺼지지 않게 (지원하는 휴대폰만)
async function keepScreenOn(on) {
  try {
    if (on && "wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen");
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) {}
}

// ---------- 버튼 연결 ----------
const goBack = () => history.back();
$("group-back").addEventListener("click", goBack);
document.querySelectorAll(".back-btn").forEach((b) => b.addEventListener("click", goBack));
$("close").addEventListener("click", goBack);
$("more").addEventListener("click", () => current && play(current.gid, current.sid));   // 아직 부족해 → 다른 영상
$("start-now").addEventListener("click", () => {
  if (!current) return;
  const { gid, sid } = current;
  current = null;
  unlockAudio();
  go({ screen: "timer", group: gid, sub: sid });
});
$("tap-btn").addEventListener("click", () => {
  tapToPlay.hidden = true;
  video.play();
});

window.addEventListener("popstate", (e) => {
  if (!e.state || e.state.screen !== "player") current = null;
  render(e.state || { screen: "start" });
});

// 처음 시작 화면
history.replaceState({ screen: "start" }, "");
render({ screen: "start" });
