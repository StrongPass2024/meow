
const CORRECT_PASSWORD = "meow";

// ลิงก์เพลง Spotify ของคุณ
const SONG_URL =
  "https://open.spotify.com/intl-th/track/51EN90GQ1JhX7n1noAB0s4?autoplay_ok=1";

const lockScreen = document.querySelector("#lockScreen");
const bookScreen = document.querySelector("#bookScreen");
const passwordForm = document.querySelector("#passwordForm");
const passwordInput = document.querySelector("#passwordInput");
const passwordMessage = document.querySelector("#passwordMessage");
const pages = [...document.querySelectorAll(".page")];
const pageCounter = document.querySelector("#pageCounter");
const lockAgainButton = document.querySelector("#lockAgain");
const musicFrame = document.querySelector("#musicFrame");
const bookStage = document.querySelector(".book-stage");

let currentPage = 0;

// แปลงลิงก์ Spotify เป็นลิงก์สำหรับฝังในเว็บ
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

// ตั้งค่าเพลง
if (musicFrame) {
  const embedUrl = getSpotifyEmbedUrl(SONG_URL);

  if (embedUrl) {
    musicFrame.src = embedUrl;
    musicFrame.title = "Spotify music player";
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

    page.style.zIndex =
      index < currentPage
        ? index + 1
        : pages.length - index;
  });

  // แสดงเลขหน้า หากมี element นี้ใน HTML
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

// ปัดหน้าหนังสือด้วยเมาส์หรือหน้าจอสัมผัส
if (bookStage) {
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  bookStage.addEventListener("pointerdown", (event) => {
    // ไม่ให้การลากไปรบกวนเครื่องเล่นเพลงหรือปุ่ม
    if (
      event.target.closest(
        "iframe, button, a, input, textarea, select"
      )
    ) {
      return;
    }

    startX = event.clientX;
    startY = event.clientY;
    isDragging = true;
  });

  bookStage.addEventListener("pointerup", (event) => {
    if (!isDragging) return;

    isDragging = false;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    // ต้องปัดแนวนอนอย่างน้อย 45 พิกเซล
    // และไม่ใช่การเลื่อนแนวตั้งเป็นหลัก
    if (
      Math.abs(deltaX) < 45 ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    // ปัดซ้าย = หน้าถัดไป
    if (deltaX < 0 && currentPage < pages.length - 1) {
      currentPage++;
      updateBook();
    }

    // ปัดขวา = ย้อนกลับ
    if (deltaX > 0 && currentPage > 0) {
      currentPage--;
      updateBook();
    }
  });

  bookStage.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  bookStage.addEventListener("lostpointercapture", () => {
    isDragging = false;
  });
}

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

// เริ่มต้นที่ปกหน้า
updateBook();
