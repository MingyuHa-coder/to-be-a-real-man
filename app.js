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

// 타이머가 끝났을 때 성향별 한마디 (성향마다 50개)
//   50개를 한 번씩 다 보여주기 전까지는 같은 문구가 다시 나오지 않아요.
//   문구를 더 넣거나 바꾸고 싶으면 아래 목록만 고치면 돼요.
const TIMER_DONE_LINES = {
  cheer: [   // 응원
    "잘했어! 진짜 멋있다.", "봐, 할 수 있잖아.", "오늘의 너, 최고야.", "방금 그 세트, 정말 멋졌어.", "끝까지 해낸 거, 나 다 봤어.",
    "어제보다 한 걸음 더 왔어.", "숨 고르고, 스스로를 칭찬해 줘.", "포기 안 한 너한테 박수!", "이렇게 쌓이는 거야. 잘하고 있어.", "힘들었지? 그래도 해냈잖아.",
    "지금 흘린 땀이 내일의 자신감이야.", "네가 자랑스러워.", "한 세트 끝! 너 진짜 대단해.", "꾸준함이 제일 멋있는 거야.", "오늘도 약속 지켰네.",
    "몸이 고마워하고 있을 거야.", "이 느낌 기억해. 이게 성장이야.", "천천히 가도 괜찮아. 멈추지만 마.", "너는 생각보다 훨씬 강해.", "방금 너, 진짜 빛났어.",
    "그 집중력 최고였어.", "한계를 조금 넘었어. 느껴져?", "잘 버텼어. 물 한 모금 마시자.", "오늘 온 것만으로도 이미 이긴 거야.", "다음 세트도 너라면 할 수 있어.",
    "표정 봐, 해낸 사람 얼굴이야.", "쉬운 길 말고 이 길을 택한 너, 멋있다.", "몸은 거짓말 안 해. 다 쌓이고 있어.", "수고했어. 진심으로.", "그 한 세트가 차이를 만들어.",
    "나는 항상 네 편이야.", "와, 오늘 컨디션 좋은데?", "작은 승리도 승리야. 축하해!", "지금 이 순간을 즐겨.", "넌 이미 시작했고, 해내고 있어.",
    "땀 흘린 만큼 웃게 될 거야.", "오늘 너 자신에게 10점 만점 줘.", "포기하고 싶었을 텐데, 대단해.", "거울 속 너, 점점 멋있어지고 있어.", "좋아, 이 기세 그대로 가자!",
    "힘든 거 알아. 그래서 더 멋진 거야.", "하나 끝냈다! 다음도 함께하자.", "너의 노력은 반드시 보답받아.", "숨 차는 거, 열심히 했다는 증거야.", "오늘 정말 잘 해냈어.",
    "이렇게 하루하루가 쌓여서 네가 돼.", "너라서 할 수 있었어.", "해낸 너, 꼭 안아주고 싶다.", "잠깐 쉬어. 넌 충분히 잘했어.", "다음에도 이렇게 멋지게 해내자.",
  ],
  mock: [    // 조롱
    "오, 그 정도는 하네?", "기대 안 했는데… 좀 놀랐다.", "끝까지 버틴 건 인정.", "와, 진짜 끝까지 했어? 의외인데.", "그 표정 뭐야. 겨우 이걸로?",
    "한 세트 하고 세상 다 끝난 얼굴이네.", "오늘은 도망 안 갔네? 칭찬해 줄게, 조금.", "숨소리는 마라톤 완주한 사람 같다.", "그 정도로 근육 생기면 다 몸짱이게.", "나쁘진 않았어. 좋지도 않았지만.",
    "방금 그거 운동이었어, 스트레칭이었어?", "땀은 많이 흘렸네. 성과는… 글쎄.", "그래, 포기는 안 했네. 그거 하나는 봐준다.", "지금 그 얼굴, 사진 찍어줄까?", "거울 보지 마. 아직 아니야.",
    "이걸로 인증샷 올리면 양심 없는 거다.", "오~ 한 세트 끝. 박수 세 번 쳐줄게.", "다리 후들거리는 거 다 보여.", "어제의 너보단 낫네. 기준이 낮아서 그렇지.", "와, 생각보다 덜 한심했어.",
    "그 정도면 동네 산책 수준은 넘었다.", "끝났다고 좋아하는 거 봐. 귀엽네.", "이거 하고 오늘 치킨 먹을 생각이지?", "이번 건 운이었다고 치자.", "아직 멀었어. 근데 방향은 맞아.",
    "숨 넘어가는 줄 알았잖아.", "오늘은 핑계 안 대네? 신기하다.", "그래도 소파에 누워 있는 것보단 낫지.", "몸이 놀랐겠다. 이런 일 처음이라.", "한 번은 우연, 두 번이면 실력. 또 해 봐.",
    "대단하네. 진짜 대단해. …라고 할 줄 알았지?", "그 근육, 돋보기로 보면 보이겠다.", "오늘 처음으로 운동하는 사람 같아 보였어.", "세트 끝! 이제 쉬는 시간이 더 길겠지?", "생각보다 버티네? 재밌어지는데.",
    "와, 오늘은 진짜 운동하러 왔구나.", "땀 닦아. 반짝여서 눈부셔.", "이 정도로 지치면 곤란한데?", "그래, 이 맛에 너 놀리는 거지.", "칭찬은 다음 세트까지 아껴둘게.",
    "끝까지 했으니까 오늘은 덜 놀릴게.", "그 얼굴 보니까 진짜 힘들었나 보네.", "하는 척이 아니라 진짜 했네? 놀랍다.", "오, 생각보다 근성 있는데?", "이 페이스면 몸짱은… 내년쯤?",
    "박수는 못 치겠고, 고개는 끄덕여 줄게.", "이번엔 좀 봐줄 만했어.", "대충 할 줄 알았는데, 내가 졌다.", "다음 세트에서 또 보자. 도망가지 말고.", "오늘만큼은 인정. 오늘만.",
  ],
  push: [    // 압박
    "끝? 아니. 한 세트 더 할 수 있잖아.", "숨 고르고 다시 간다.", "이제 몸 좀 풀렸네.", "쉬는 시간은 짧게. 바로 다음이다.", "이걸로 만족하면 거기까지다.",
    "땀 닦을 시간에 자세나 다시 잡아.", "방금 건 워밍업이라고 생각해.", "힘들어? 그게 시작이라는 신호다.", "다음 세트는 더 무겁게.", "여기서 멈추면 오늘 온 의미 없다.",
    "근육은 지금부터 자란다. 계속해.", "물 한 모금. 그리고 바로 복귀.", "한계라고? 아직 한참 남았다.", "몸이 아니라 머리가 쉬자고 하는 거다.", "좋아. 이제 진짜 운동 시작이다.",
    "어제의 너를 이겼으면, 이제 오늘의 너를 이겨.", "자리 뜨지 마. 다음 세트 준비.", "잘했다는 말은 운동 끝나고 들어.", "지금 쉬면 식는다. 바로 가.", "타이머 끝났다고 운동이 끝난 게 아니다.",
    "숨 차는 거 정상이다. 다시 잡아.", "이 정도로 지치면 안 된다. 한 번 더.", "오늘 목표는 아직 남아 있다.", "무게는 거짓말 안 한다. 다시 들어.", "핑계는 집에 두고 왔지? 계속 가.",
    "자세 무너지지 마. 다음은 더 정확하게.", "아픈 게 아니라 타는 거다. 버텨.", "남들 쉴 때 한 세트 더. 그게 차이다.", "고개 들어. 아직 안 끝났다.", "30초 쉬고 간다. 시계 봐.",
    "지금 포기하면 내일 더 힘들다.", "여기까지 왔으면 끝까지 간다.", "몸이 버틸 수 있다는 거, 방금 증명했잖아.", "한 세트 더 하는 놈이 결국 이긴다.", "쉬는 동안에도 집중 놓지 마.",
    "다리 떨려도 괜찮다. 다시 서.", "좋은 세트였다. 다음은 더 좋게.", "만족은 거울 앞에서 해. 지금은 아니다.", "그 땀, 아직 부족하다.", "오늘 할 거 오늘 끝낸다.",
    "너 자신과의 약속, 아직 안 끝났다.", "이제 반 왔다. 나머지 반 간다.", "쉬운 세트는 없다. 다음 거 준비해.", "심장 뛰는 거 느껴? 그게 살아 있는 거다.", "잠깐 숨 돌리고 다시 불붙여.",
    "지금 이 고통이 내일의 근육이다.", "생각하지 마. 그냥 다시 잡아.", "마지막이라고 생각하지 마. 한 개 더 있다.", "끝까지 간 놈만 결과를 본다.", "오늘의 마지막 세트는 아직 아니다. 하나 더.",
  ],
};

// 안 본 문구부터 하나씩 꺼내기 (이 휴대폰에 기억해 둠)
function nextDoneLine(type) {
  const lines = TIMER_DONE_LINES[type] || TIMER_DONE_LINES.push;
  const key = "doneBag_" + (TIMER_DONE_LINES[type] ? type : "push");
  let bag = [];
  try { bag = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) {}
  bag = bag.filter((i) => Number.isInteger(i) && i >= 0 && i < lines.length);
  if (bag.length === 0) {
    bag = lines.map((_, i) => i);
    for (let i = bag.length - 1; i > 0; i--) {          // 섞기
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    const last = Number(localStorage.getItem(key + "_last"));
    if (bag.length > 1 && bag[bag.length - 1] === last) bag.unshift(bag.pop());  // 새로 섞어도 직전 문구가 바로 안 나오게
  }
  const pick = bag.pop();
  try {
    localStorage.setItem(key, JSON.stringify(bag));
    localStorage.setItem(key + "_last", String(pick));
  } catch (e) {}
  return lines[pick];
}

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
  // 운동 전: 타이머 대신 "운동하러 간다" (운동 중 목록으로) / 운동 중: "지금 바로 시작" (타이머)
  $("start-now").textContent = gid === "before" ? "운동하러 간다 →" : "지금 바로 시작 ▶";
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
  $("timer-msg").textContent = nextDoneLine(me.type);
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
  if (gid === "before") return go({ screen: "group", group: "during" });   // 운동 전 → 운동 중 목록으로
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
