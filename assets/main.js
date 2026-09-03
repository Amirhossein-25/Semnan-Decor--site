/**
 * Semnan Decor - Vanilla JavaScript Engine
 * Direct Cloudflare Pages Deployable (Zero-build, zero-npm)
 */

document.addEventListener('DOMContentLoaded', () => {
  initClockAndDates();
  initMobileMenu();
  initConsultationModal();
  initTelegramOrderModal();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. Live Real-Time Clock & Multi-Calendar Widget (Solar, Gregorian, Lunar)
   ========================================================================== */
function initClockAndDates() {
  const timeElements = document.querySelectorAll('.js-live-time');
  const solarElements = document.querySelectorAll('.js-solar-date');
  const gregorianElements = document.querySelectorAll('.js-gregorian-date');
  const lunarElements = document.querySelectorAll('.js-lunar-date');

  function update() {
    const now = new Date();

    // Time (e.g. 09:12 PM)
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    timeElements.forEach(el => {
      el.textContent = timeString;
    });

    // Solar Hijri (تاریخ هجری شمسی)
    try {
      const solarFormatter = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const solarFormatted = solarFormatter.format(now);
      solarElements.forEach(el => {
        el.textContent = `${solarFormatted} (Solar)`;
      });
    } catch (e) {
      solarElements.forEach(el => {
        el.textContent = '۱۴۰۳/۰۲/۱۵ (Solar)';
      });
    }

    // Gregorian (میلادی)
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    gregorianElements.forEach(el => {
      el.textContent = `${y}/${m}/${d} (Gregorian)`;
    });

    // Lunar (قمری هجری)
    try {
      const lunarFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const lunarFormatted = lunarFormatter.format(now);
      lunarElements.forEach(el => {
        el.textContent = `${lunarFormatted} (Lunar)`;
      });
    } catch (e) {
      lunarElements.forEach(el => {
        el.textContent = '۲۵ شوال ۱۴۴۵ (Lunar)';
      });
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. Mobile Hamburger Drawer
   ========================================================================== */
function initMobileMenu() {
  const menuButtons = document.querySelectorAll('.js-mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (!mobileDrawer) return;

  function openMenu() {
    mobileDrawer.classList.remove('translate-x-full');
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('hidden');
      setTimeout(() => mobileBackdrop.classList.add('opacity-100'), 10);
    }
  }

  function closeMenu() {
    mobileDrawer.classList.add('translate-x-full');
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('opacity-100');
      setTimeout(() => mobileBackdrop.classList.add('hidden'), 300);
    }
  }

  menuButtons.forEach(btn => btn.addEventListener('click', openMenu));
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);
}

/* ==========================================================================
   3. Telegram Ordering System
   ========================================================================== */
const TELEGRAM_USERNAME = 'semnandecor'; // Or direct phone: +989910709182
const PRIMARY_PHONE = '09910709182';

function initTelegramOrderModal() {
  const modal = document.getElementById('telegram-order-modal');
  const closeBtn = document.getElementById('close-telegram-modal');
  const form = document.getElementById('telegram-order-form');
  const serviceInput = document.getElementById('order-service-name');
  const serviceDisplay = document.getElementById('modal-service-title');

  if (!modal) return;

  // Global trigger function
  window.openTelegramOrder = function (serviceName, serviceDesc = '') {
    if (serviceInput) serviceInput.value = serviceName;
    if (serviceDisplay) serviceDisplay.textContent = serviceName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeTelegramModal = function () {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeTelegramModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeTelegramModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = serviceInput ? serviceInput.value : 'خدمات سمنان دکور';
      const name = document.getElementById('order-user-name')?.value || 'ناشناس';
      const phone = document.getElementById('order-user-phone')?.value || 'ثبت نشده';
      const details = document.getElementById('order-user-details')?.value || 'بدون توضیحات تکمیلی';

      const message = `✨ سفارش جدید از وب‌سایت سمنان دکور:\n\n` +
        `▫️ سرویس / محصول: ${service}\n` +
        `▫️ نام متقاضی: ${name}\n` +
        `▫️ شماره تماس: ${phone}\n` +
        `▫️ توضیحات و متراژ: ${details}\n\n` +
        `📍 موقعیت: سمنان دکور`;

      const encodedMessage = encodeURIComponent(message);
      // Construct Telegram web link
      const telegramUrl = `https://t.me/+989910709182?text=${encodedMessage}`;
      
      showToast('در حال هدایت به تلگرام سمنان دکور...', 'info');
      window.open(telegramUrl, '_blank');
      window.closeTelegramModal();
      form.reset();
    });
  }
}

/* ==========================================================================
   4. Consultation & Visit Request Modal
   ========================================================================== */
function initConsultationModal() {
  const modal = document.getElementById('consultation-modal');
  const closeBtn = document.getElementById('close-consultation-modal');
  const form = document.getElementById('consultation-form');

  if (!modal) return;

  window.openConsultationModal = function (topic = 'مشاوره معماری و دکوراسیون') {
    const topicEl = document.getElementById('consultation-topic');
    if (topicEl) topicEl.value = topic;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeConsultationModal = function () {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', window.closeConsultationModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeConsultationModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('consult-name')?.value;
      const phone = document.getElementById('consult-phone')?.value;
      const service = document.getElementById('consultation-topic')?.value || 'مشاوره عمومی';
      const address = document.getElementById('consult-address')?.value || '';

      const telegramMsg = encodeURIComponent(
        `🏛️ درخواست مشاوره و بازدید حضوری سمنان دکور:\n\n` +
        `نام: ${name}\n` +
        `تلفن: ${phone}\n` +
        `موضوع: ${service}\n` +
        `آدرس یا محدوده: ${address}`
      );

      showToast('درخواست مشاوره ثبت شد. کارشناسان ما به زودی با شما تماس می‌گیرند.', 'success');
      
      // Also offer to open Telegram
      setTimeout(() => {
        const confirmTg = confirm('آیا مایلید جزئیات درخواست را در تلگرام نیز برای کارشناس ارسال فرمایید؟');
        if (confirmTg) {
          window.open(`https://t.me/+989910709182?text=${telegramMsg}`, '_blank');
        }
      }, 600);

      window.closeConsultationModal();
      form.reset();
    });
  }
}

/* ==========================================================================
   5. Contact Form Submissions
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-us-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    if (!name || !phone) {
      showToast('لطفا نام و شماره تماس خود را وارد نمایید.', 'error');
      return;
    }

    showToast('پیام شما با موفقیت دریافت شد. به زودی پاسخگوی شما خواهیم بود.', 'success');

    // Create Telegram prefill link option
    const tgText = encodeURIComponent(
      `✉️ پیام جدید از فرم تماس با ما (سمنان دکور):\n\n` +
      `نام: ${name}\n` +
      `شماره تماس: ${phone}\n` +
      `متن پیام: ${message}`
    );

    setTimeout(() => {
      const wantTg = confirm('آیا می‌خواهید پیام خود را مستقیماً در تلگرام نیز ارسال کنید؟');
      if (wantTg) {
        window.open(`https://t.me/+989910709182?text=${tgText}`, '_blank');
      }
    }, 800);

    form.reset();
  });
}

/* ==========================================================================
   6. Toast Notifications
   ========================================================================== */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 left-6 z-[120] max-w-md p-4 rounded-lg shadow-2xl flex items-center gap-3 font-body-md text-sm border';
    document.body.appendChild(toast);
  }

  let bgColor = 'bg-[#1c1b1b] text-white border-white/10';
  let icon = 'info';

  if (type === 'success') {
    bgColor = 'bg-[#142618] text-white border-emerald-500/40';
    icon = 'check_circle';
  } else if (type === 'error') {
    bgColor = 'bg-[#311111] text-white border-red-500/40';
    icon = 'error';
  }

  toast.className = `fixed bottom-6 left-6 z-[120] max-w-md p-4 rounded-lg shadow-2xl flex items-center gap-3 font-body-md text-sm border ${bgColor} show`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-xl text-[#C5A059]">${icon}</span>
    <span>${message}</span>
  `;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
window.showToast = showToast;

/* ==========================================================================
   7. Smooth Anchor Scroll
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
