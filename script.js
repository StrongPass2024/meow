
const CORRECT_PASSWORD = "meow";

// ลิงก์เพลง YouTube Music ของคุณ
const SONG_URL = "https://open.spotify.com/intl-th/track/51EN90GQ1JhX7n1noAB0s4?autoplay_ok=1";

const lockScreen = document.querySelector("#lockScreen");
const bookScreen = document.querySelector("#bookScreen");
const passwordForm = document.querySelector("#passwordForm");
const passwordInput = document.querySelector("#passwordInput");
const passwordMessage = document.querySelector("#passwordMessage");
const pages = [...document.querySelectorAll(".page")];
const prevButton = document.querySelector("#prevPage");
const nextButton = document.querySelector("#nextPage");
const pageCounter = document.querySelector("#pageCounter");
const lockAgainButton = document.querySelector("#lockAgain");
const musicFrame = document.querySelector("#musicFrame");

let currentPage = 0;


function getSpotifyEmbedUrl(url) {
  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname !== "open.spotify.com" &&
      parsedUrl.hostname !== "spotify.com"
    ) {
      return "";
    }

    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    const trackIndex = parts.indexOf("track");

    if (trackIndex === -1 || !parts[trackIndex + 1]) {
      return "";
    }

    const trackId = parts[trackIndex + 1];

    if (!/^[a-zA-Z0-9]+$/.test(trackId)) {
      return "";
    }

    return `https://open.spotify.com/embed/track/${trackId}`;
  } catch {
    return "";
  }
}

if (musicFrame) {
  const embedUrl = getSpotifyEmbedUrl(SONG_URL);

  if (embedUrl) {
    musicFrame.src = embedUrl;
  }
}

// แปลงลิงก์ YouTube ให้เป็นลิงก์สำหรับฝังในเว็บ
function getYouTubeEmbedUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    let videoId = "";

    if (host === "music.youtube.com" || host === "youtube.com" ||
        host === "m.youtube.com") {
      videoId = parsedUrl.searchParams.get("v") || "";
    } else if (host === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1).split("/")[0];
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return "";
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

// ตั้งค่าเพลงในหน้าหนังสือ
if (musicFrame) {
  const embedUrl = getYouTubeEmbedUrl(SONG_URL);

  if (embedUrl) {
    musicFrame.src = embedUrl;
  } else {
    musicFrame.title = "ไม่พบลิงก์เพลงที่ถูกต้อง";
  }
}

// ตรวจสอบรหัสผ่าน
passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value === CORRECT_PASSWORD) {
    lockScreen.classList.add("hidden");
    bookScreen.classList.remove("hidden");
    passwordMessage.textContent = "";
    passwordInput.value = "";
    updateBook();
  } else {
    passwordMessage.textContent =
      "ລະຫັດບໍ່ຖືກນະລອງເດົາໃໝ່ອິອິ";
    passwordInput.value = "";
    passwordInput.focus();
  }
});

// อัปเดตหน้าหนังสือ
function updateBook() {
  pages.forEach((page, index) => {
    page.classList.toggle("flipped", index < currentPage);

    page.style.zIndex = index < currentPage
      ? index + 1
      : pages.length - index;
  });

  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === pages.length - 1;

  // แสดงเลขหน้า เฉพาะเมื่อมี element นี้ใน HTML
  if (pageCounter) {
    if (currentPage === 0) {
      pageCounter.textContent = "ปกหน้า";
    } else if (currentPage === pages.length - 1) {
      pageCounter.textContent = "ปกหลัง";
    } else {
      pageCounter.textContent =
        `หน้า ${currentPage} / ${pages.length - 2}`;
    }
  }
}

// พลิกไปหน้าถัดไป
nextButton.addEventListener("click", () => {
  if (currentPage < pages.length - 1) {
    currentPage++;
    updateBook();
  }
});

// พลิกกลับหน้าก่อนหน้า
prevButton.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    updateBook();
  }
});

// ล็อกหนังสืออีกครั้ง
lockAgainButton.addEventListener("click", () => {
  currentPage = 0;
  updateBook();

  bookScreen.classList.add("hidden");
  lockScreen.classList.remove("hidden");

  passwordInput.value = "";
  passwordMessage.textContent = "";
  passwordInput.focus();
});

updateBook();
