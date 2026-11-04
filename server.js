// ================================================================
//  쓴소리 코치 - 내 PC에서 앱을 띄우는 작은 서버
//  실행: "실행하기.bat" 더블클릭 (또는 터미널에서 node server.js)
//  끄기: 검은 창을 닫거나 Ctrl + C
// ================================================================

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = 8080;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (urlPath === "/") urlPath = "/index.html";

  // 앱 폴더 밖의 파일은 절대 보여주지 않음
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end();
    return;
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404).end();
      return;
    }
    const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range;

    // 영상은 "부분 요청(Range)"을 지원해야 아이폰에서 재생됨
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (m && !m[1] && m[2]) { start = stat.size - parseInt(m[2], 10); end = stat.size - 1; }
      if (start >= stat.size || start > end) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` }).end();
        return;
      }
      end = Math.min(end, stat.size - 1);
      res.writeHead(206, {
        "Content-Type": type,
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
      });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": stat.size,
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache",
    });
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const ips = Object.values(os.networkInterfaces())
    .flat()
    .filter((n) => n && n.family === "IPv4" && !n.internal)
    .map((n) => n.address);

  console.log("");
  console.log("  ==========================================");
  console.log("   쓴소리 코치 서버가 켜졌어요!");
  console.log("  ==========================================");
  console.log("");
  console.log("   [PC에서 보기]");
  console.log(`     http://localhost:${PORT}`);
  console.log("");
  console.log("   [휴대폰에서 보기] (PC와 같은 와이파이)");
  if (ips.length === 0) console.log("     (네트워크 주소를 찾지 못했어요)");
  ips.forEach((ip) => console.log(`     http://${ip}:${PORT}`));
  console.log("");
  console.log("   끄려면 이 창을 닫으세요.");
  console.log("");
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.log(`\n  이미 서버가 켜져 있어요 (${PORT}번). 다른 검은 창이 열려 있는지 확인하세요.\n`);
  } else {
    console.log(e);
  }
});
