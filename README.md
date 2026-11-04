# To be a real man

헬스 중에 보는 동기부여 영상 앱. 상황별 버튼을 누르면 AI 캐릭터의 쓴소리 영상이 랜덤으로 재생된다.

## 카테고리

| 큰 카테고리 | 작은 카테고리 | 영상 폴더 |
|---|---|---|
| 운동 전 | 가슴 하는 날 | `videos/before/chest` |
| 운동 전 | 등 하는 날 | `videos/before/back` |
| 운동 전 | 어깨 하는 날 | `videos/before/shoulder` |
| 운동 전 | 팔 하는 날 | `videos/before/arms` |
| 운동 전 | 하체 하는 날 | `videos/before/legs` |
| 운동 중 | 왠지 힘이 빠질 때 | `videos/during/weak` |
| 운동 중 | 마지막 세트 | `videos/during/last-set` |
| 운동 중 | 유산소 포기하고 싶을 때 | `videos/during/cardio` |
| 운동 중 | 더 해야 하는데 하기 싫을 때 | `videos/during/more` |

## 영상 넣기

각 폴더에 `1.mp4`, `2.mp4`, `3.mp4` … 순서대로 넣는다. 영상이 없으면 임시 화면(쓴소리 문구)이 나온다.

## 실행하기

- PC: `실행하기.bat` 더블클릭 → 브라우저에서 `http://localhost:8080`
- 휴대폰: Netlify 등 무료 호스팅에 폴더를 올려서 접속

## 파일 구성

- `index.html` 화면 구조
- `style.css` 디자인
- `app.js` 카테고리 목록, 임시 화면 대사, 랜덤 재생
- `server.js` PC에서 앱을 띄우는 서버 (Node 필요)
