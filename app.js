// ================================================================
//  To be a real man - 동작 코드
//
//  영상 넣는 법:
//    videos/큰카테고리/작은카테고리/ 안에 1.mp4, 2.mp4, 3.mp4 ... 처럼
//    숫자 순서대로 이름 붙여 넣으면 자동으로 인식됩니다.
//    예) videos/before/chest/1.mp4
//    (중간 번호가 빠지면 그 뒤 번호는 인식되지 않아요)
// ================================================================

const MAX_VIDEOS = 50;          // 카테고리당 최대 몇 개까지 찾을지
const PLACEHOLDER_SECONDS = 6;  // 임시 화면 길이(초)

// ----------------------------------------------------------------
//  카테고리 목록
//   id    : 영상 폴더 이름 (영어, 바꾸면 폴더 이름도 같이 바꿔야 함)
//   name  : 화면에 보이는 이름
//   hint  : 버튼 아래 작은 글씨
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
        id: "chest", name: "가슴 하는 날", hint: "가슴 펴. 오늘은 밀어붙이는 날이다.", color: "#ff3b1f",
        lines: [
          "벤치에 누웠으면\n변명도 같이 내려놔.",
          "오늘 미는 무게가\n너의 자신감이다.",
          "가슴은 거울 보라고\n있는 게 아니다. 밀어.",
        ],
      },
      {
        id: "back", name: "등 하는 날", hint: "보이지 않는 곳이 진짜 실력이다.", color: "#ff8a00",
        lines: [
          "등은 남이 본다.\n대충 하면 다 티 난다.",
          "팔로 당기지 마.\n등으로 당겨.",
          "넓은 등은\n하루아침에 안 생긴다. 시작해.",
        ],
      },
      {
        id: "shoulder", name: "어깨 하는 날", hint: "어깨가 서야 사람이 선다.", color: "#ffd000",
        lines: [
          "어깨 넓이가\n존재감이다.",
          "가볍다고 무시하지 마.\n어깨는 정직하다.",
          "오늘 어깨 안 하면\n티셔츠가 슬퍼한다.",
        ],
      },
      {
        id: "arms", name: "팔 하는 날", hint: "소매가 터질 때까지.", color: "#ff3d8b",
        lines: [
          "팔은 반동으로\n크지 않는다. 천천히.",
          "펌핑은 보상이다.\n그 전에 고통부터.",
          "반팔 입는 계절은\n지금 만들어진다.",
        ],
      },
      {
        id: "legs", name: "하체 하는 날", hint: "도망치고 싶지? 그래서 가는 거다.", color: "#c13cff",
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
        id: "weak", name: "왠지 힘이 빠질 때", hint: "기분 탓이다. 몸은 아직 남았다.", color: "#00d4ff",
        lines: [
          "힘이 없는 게 아니라\n의지가 쉬고 있는 거다.",
          "물 한 모금 마시고\n다시 잡아.",
          "오늘 컨디션 탓하면\n내일도 컨디션 탓한다.",
        ],
      },
      {
        id: "last-set", name: "마지막 세트", hint: "한 개 더. 여기서 끝내면 아무것도 안 바뀐다.", color: "#ff3b1f",
        lines: [
          "지금 내려놓으면\n오늘 운동은 없던 거다.",
          "한 개 더.\n그게 네가 여기 온 이유야.",
          "근육은 마지막 한 개에서\n자란다. 들어.",
        ],
      },
      {
        id: "cardio", name: "유산소 포기하고 싶을 때", hint: "숨 차는 게 정상이다. 속도 유지.", color: "#2bff88",
        lines: [
          "속도 줄이지 마.\n숨 차는 게 정상이다.",
          "5분만 더.\n그다음에 생각해.",
          "다리가 아니라\n머리가 먼저 포기하는 거다.",
        ],
      },
      {
        id: "more", name: "더 해야 하는데 하기 싫을 때", hint: "하기 싫은 그 세트가 차이를 만든다.", color: "#ffb800",
        lines: [
          "하기 싫은 걸 할 때\n남자가 된다.",
          "여기서 집에 가면\n어제랑 똑같은 너다.",
          "딱 한 세트만 더.\n그건 할 수 있잖아.",
        ],
      },
    ],
  },
];

// ---------- 화면 요소 ----------
const $ = (id) => document.getElementById(id);
const homeScreen = $("home");
const groupScreen = $("group");
const player = $("player");
const video = $("video");
const placeholder = $("placeholder");
const phLine = $("ph-line");
const phProgress = $("ph-progress");
const phNote = $("ph-note");
const tapToPlay = $("tap-to-play");

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

// 앱이 열리자마자 모든 카테고리 영상을 미리 찾아둠
const videoLists = {};
for (const g of GROUPS) {
  for (const s of g.subs) {
    const folder = `${g.id}/${s.id}`;
    videoLists[folder] = findVideos(folder);
  }
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
    <span class="hint">${item.hint}</span>`;
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

// ---------- 화면 전환 (휴대폰 뒤로가기 버튼도 동작하도록) ----------
function go(state) {
  history.pushState(state, "");
  render(state);
}

function render(state) {
  stopAll();
  homeScreen.hidden = state.screen !== "home";
  groupScreen.hidden = state.screen !== "group";
  player.hidden = state.screen !== "player";

  // 영상 재생 중에는 배경 영상을 멈춰서 배터리 아끼기
  const bgVideo = $("bg-video");
  document.body.classList.toggle("group-open", state.screen === "group");
  if (state.screen === "player") bgVideo.pause();
  else bgVideo.play().catch(() => {});

  if (state.screen === "group") showGroup(state.group);
  if (state.screen === "player") play(state.group, state.sub);
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
  const folder = `${gid}/${sid}`;
  current = { gid, sid };
  player.style.setProperty("--c", sub.color);
  $("player-cat").textContent = sub.name;
  stopAll();

  const list = await videoLists[folder];
  if (!current || current.gid !== gid || current.sid !== sid) return; // 그새 나갔으면 중단

  if (list.length === 0) {
    showPlaceholder(sub, folder);
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

function showPlaceholder(sub, folder) {
  video.hidden = true;
  placeholder.hidden = false;

  phLine.textContent = pickRandom(folder + "-line", sub.lines);
  phLine.style.animation = "none";
  void phLine.offsetWidth;
  phLine.style.animation = "";

  phNote.innerHTML =
    `아직 영상이 없어서 임시 화면이에요.<br>` +
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

// ---------- 버튼 연결 ----------
const goBack = () => history.back();
$("group-back").addEventListener("click", goBack);
$("back").addEventListener("click", goBack);
$("close").addEventListener("click", goBack);
$("next").addEventListener("click", () => current && play(current.gid, current.sid));
$("tap-btn").addEventListener("click", () => {
  tapToPlay.hidden = true;
  video.play();
});

window.addEventListener("popstate", (e) => {
  if (!e.state || e.state.screen !== "player") current = null;
  render(e.state || { screen: "home" });
});

// 처음 시작 화면
history.replaceState({ screen: "home" }, "");
render({ screen: "home" });
