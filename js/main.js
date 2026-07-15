/* ═══════════════════════════════════════════════
   دعوة زفاف حسام & ندى — Crafted by Weddify
   ═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   ⚙️ الإعدادات — عدّل من هنا لأي عميل جديد
───────────────────────────────────────────── */
const CONFIG = {
  groom: "حسام",
  bride: "ندى",
  // توقيت القاهرة (UTC+3 صيفًا)
  weddingDate: new Date("2026-07-29T20:00:00+03:00"),
  eventDurationHours: 4,
  venueName: "قاعة أفراح القمر — وادي العمر، صفط تراب، المحلة الكبرى",
  mapsUrl:
    "https://maps.google.com?q=Wady%20Elamar,%20Saft%20Torab,%20El%20Mahalla%20El%20Kubra&ftid=0x14f7ba239a32d8f7:0x1dbfcc6831d017ab&entry=gps&shh=CAE&lucs=,94297699,94231188,94280568,47071704,94218641,94282134,100813464,94286869,100804976&g_st=ic",
  shareText: "💌 وصلتك دعوة زفاف حسام و ندى — افتحها من هنا:",
};

const $ = (id) => document.getElementById(id);

/* ─────────────────────────────────────────────
   ① اسم الضيف من الرابط  ?to=اسم%20الضيف
───────────────────────────────────────────── */
(function personalizeGuest() {
  const guest = new URLSearchParams(location.search).get("to");
  if (!guest) return;
  const clean = guest.trim().slice(0, 60);
  if (!clean) return;

  $("letter-guest").textContent = clean;
  $("letter-to").hidden = false;

  const heroGuest = $("hero-guest");
  heroGuest.textContent = `دعوة خاصة إلى: ${clean} 🌹`;
  heroGuest.hidden = false;
})();

/* ─────────────────────────────────────────────
   ② فتح الظرف → الانتقال للموقع
───────────────────────────────────────────── */
const scene = $("envelope-scene");
const envelope = $("envelope");
const seal = $("seal");
const site = $("site");
let opened = false;

function openInvitation() {
  if (opened) return;
  opened = true;

  $("env-hint").classList.add("hide");
  envelope.classList.add("opening");
  tryPlayMusic();

  // بعد ما الجواب يطلع من الظرف: نفتح الموقع
  setTimeout(() => {
    site.hidden = false;
    requestAnimationFrame(() => site.classList.add("shown"));
    startPetals(true); // زخة ذهبية احتفالية
    setTimeout(() => {
      scene.classList.add("gone");
      document.body.style.overflow = "";
      setTimeout(() => scene.remove(), 1200);
    }, 900);
  }, 1600);
}

seal.addEventListener("click", openInvitation);
$("letter").addEventListener("click", openInvitation);
document.body.style.overflow = "hidden";

/* ─────────────────────────────────────────────
   ③ العد التنازلي (بأرقام عربية)
───────────────────────────────────────────── */
const arNum = (n) => n.toLocaleString("ar-EG", { useGrouping: false });

function updateCountdown() {
  const diff = CONFIG.weddingDate - Date.now();
  const cells = {
    "cd-days": Math.floor(diff / 864e5),
    "cd-hours": Math.floor((diff / 36e5) % 24),
    "cd-mins": Math.floor((diff / 6e4) % 60),
    "cd-secs": Math.floor((diff / 1e3) % 60),
  };

  if (diff <= 0) {
    $("countdown").hidden = true;
    $("countdown-done").hidden = false;
    clearInterval(cdTimer);
    return;
  }

  for (const [id, val] of Object.entries(cells)) {
    const el = $(id);
    const txt = arNum(Math.max(0, val));
    if (el.textContent !== txt) {
      el.textContent = txt;
      el.classList.remove("tick");
      void el.offsetWidth; // إعادة تشغيل الأنيميشن
      el.classList.add("tick");
    }
  }
}
const cdTimer = setInterval(updateCountdown, 1000);
updateCountdown();

/* ─────────────────────────────────────────────
   ④ الأزرار: الخريطة / التقويم / المشاركة
───────────────────────────────────────────── */
$("btn-map").href = CONFIG.mapsUrl;

(function buildCalendarLink() {
  const pad = (n) => String(n).padStart(2, "0");
  const toUTC = (d) =>
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    "00Z";

  const start = CONFIG.weddingDate;
  const end = new Date(start.getTime() + CONFIG.eventDurationHours * 36e5);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `💍 حفل زفاف ${CONFIG.groom} و ${CONFIG.bride}`,
    dates: `${toUTC(start)}/${toUTC(end)}`,
    details: `تشرفنا دعوتكم لحضور حفل الزفاف 🌹\n${location.origin + location.pathname}`,
    location: CONFIG.venueName,
  });
  $("btn-calendar").href =
    "https://calendar.google.com/calendar/render?" + params.toString();
})();

$("btn-share").addEventListener("click", async () => {
  const url = location.origin + location.pathname;
  const shareData = {
    title: `دعوة زفاف ${CONFIG.groom} و ${CONFIG.bride}`,
    text: CONFIG.shareText,
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (_) {
      /* المستخدم لغى المشاركة */
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${CONFIG.shareText} ${url}`);
      const toast = $("share-toast");
      toast.hidden = false;
      setTimeout(() => (toast.hidden = true), 2600);
    } catch (_) {
      window.open(
        "https://wa.me/?text=" + encodeURIComponent(`${CONFIG.shareText} ${url}`),
        "_blank"
      );
    }
  }
});

/* ─────────────────────────────────────────────
   ⑤ ظهور الأقسام مع التمرير
───────────────────────────────────────────── */
const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        observer.unobserve(e.target);
      }
    }
  },
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ─────────────────────────────────────────────
   ⑥ بتلات ذهبية متساقطة (Canvas)
───────────────────────────────────────────── */
function startPetals(burst) {
  const canvas = $("petals");
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W, H;

  function resize() {
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }
  resize();
  addEventListener("resize", resize);

  const COLORS = ["#d4b98c", "#b08d57", "#e8d5ae", "#c9a06a", "#f0e3c4"];
  const petals = [];
  const AMBIENT = matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : Math.min(26, Math.floor(innerWidth / 40));

  function spawn(fromBurst) {
    const size = (4 + Math.random() * 7) * DPR;
    petals.push({
      x: Math.random() * W,
      y: fromBurst ? H * 0.4 + Math.random() * H * 0.2 : -20 * DPR,
      vx: (Math.random() - 0.5) * (fromBurst ? 6 : 0.6) * DPR,
      vy: (fromBurst ? -(2 + Math.random() * 5) : 0.4 + Math.random() * 0.9) * DPR,
      g: fromBurst ? 0.06 * DPR : 0,
      size,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.08,
      sway: Math.random() * Math.PI * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.5 + Math.random() * 0.5,
      burst: fromBurst,
    });
  }

  // زخة الاحتفال الأولى
  if (burst && AMBIENT > 0) for (let i = 0; i < 90; i++) spawn(true);

  function frame() {
    ctx.clearRect(0, 0, W, H);
    // حافظ على عدد بتلات محيطي ثابت
    while (petals.filter((p) => !p.burst).length < AMBIENT) spawn(false);

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.sway += 0.02;
      p.x += p.vx + Math.sin(p.sway) * 0.4 * DPR;
      p.vy += p.g;
      p.y += p.vy;
      p.rot += p.vr;

      if (p.y > H + 30 * DPR || p.x < -40 || p.x > W + 40) {
        petals.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      // شكل بتلة (قطع ناقص)
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ─────────────────────────────────────────────
   ⑦ موسيقى اختيارية (assets/music.mp3)
───────────────────────────────────────────── */
const music = $("bg-music");
const musicBtn = $("music-toggle");

function tryPlayMusic() {
  music.volume = 0.35;
  music
    .play()
    .then(() => {
      musicBtn.hidden = false;
      musicBtn.classList.add("playing");
    })
    .catch(() => {
      /* مفيش ملف موسيقى أو المتصفح رفض — نتجاهل بهدوء */
    });
}

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicBtn.classList.add("playing");
    musicBtn.classList.remove("muted");
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicBtn.classList.add("muted");
  }
});
