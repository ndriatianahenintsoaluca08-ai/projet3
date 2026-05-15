// ============================================
//   FORMULAIRE DE CONTACT - script.js
//   Version corrigée
// ============================================

// ── 🔑 IDENTIFIANTS EMAILJS ──────────────────
const EMAILJS_PUBLIC_KEY  = "8O4_WwxvLZiipZzom";
const EMAILJS_SERVICE_ID  = "service_1bf9v8v";
const EMAILJS_TEMPLATE_ID = "template_nwv9o3j";

// ── Initialisation EmailJS ───────────────────
emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,
});

// ── Sélection des éléments ───────────────────
const form = document.getElementById("contact-form");

if (!form) {
  console.error("Formulaire #contact-form introuvable");
}

const button = form.querySelector("button[type='submit']");
const inputs = form.querySelectorAll(
  "input[required], textarea[required]"
);

// ── 1. Validation en temps réel ──────────────
inputs.forEach((input) => {
  input.addEventListener("input", () => validateField(input));
  input.addEventListener("blur", () => validateField(input));
});

function validateField(field) {
  const wrapper = field.closest(".input-field, .message-field");

  // ✅ FIX #3 : Vérifier le champ vide EN PREMIER
  if (field.value.trim() === "") {
    setError(wrapper, field, "Ce champ est requis");
    return false;
  }

  // Validation email (seulement si non vide)
  if (field.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(field.value.trim())) {
      setError(wrapper, field, "Adresse e-mail invalide");
      return false;
    }
  }

  setValid(wrapper, field);
  return true;
}

// ── Affichage erreur ─────────────────────────
function setError(wrapper, field, message) {
  field.style.borderColor = "#f87171";
  field.style.boxShadow = "0 0 0 3px rgba(248,113,113,0.2)";

  let el = wrapper.querySelector(".error-msg");

  if (!el) {
    el = document.createElement("span");
    el.className = "error-msg";

    el.style.cssText = `
      color:#f87171;
      font-size:0.78rem;
      margin-top:5px;
      display:block;
      padding-left:5px;
    `;

    wrapper.appendChild(el);
  }

  el.textContent = message;
}

// ── Affichage valide ─────────────────────────
function setValid(wrapper, field) {
  field.style.borderColor = "#4ade80";
  field.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.2)";

  const el = wrapper.querySelector(".error-msg");

  if (el) el.remove();
}

// ── 2. Soumission formulaire ─────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
      shakeField(input);
    }
  });

  if (!isValid) return;

  setButtonLoading(true);

  try {
    await emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      form
    );

    showBanner("success");

    form.reset();

    inputs.forEach((input) => {
      input.style.borderColor = "";
      input.style.boxShadow = "";

      const wrapper = input.closest(".input-field, .message-field");
      const el = wrapper?.querySelector(".error-msg");
      if (el) el.remove();
    });

  } catch (error) {
    console.error("Erreur EmailJS :", error);
    showBanner("error");
  } finally {
    setButtonLoading(false);
  }
});

// ── 3. Animation shake ───────────────────────
function shakeField(field) {
  field.style.animation = "shake 0.4s ease";

  field.addEventListener(
    "animationend",
    () => { field.style.animation = ""; },
    { once: true }
  );
}

// ── 4. Bouton loading ────────────────────────
function setButtonLoading(isLoading) {
  const btnContent = button.querySelector(".btn-content");

  // ✅ FIX #4 : Désactiver le bouton pour éviter les doubles soumissions
  button.disabled = isLoading;

  if (isLoading) {
    button.classList.add("loading");

    btnContent.innerHTML = `
      <div class="spinner"></div>
      <span>Envoi en cours...</span>
    `;
  } else {
    button.classList.remove("loading");

    btnContent.innerHTML = `
      <span>Envoyer le message</span>
      <i class="fas fa-paper-plane"></i>
    `;
  }
}

// ── 5. Bannière ──────────────────────────────
function showBanner(type) {
  document.querySelector(".success-banner, .error-banner")?.remove();

  const isSuccess = type === "success";
  const banner = document.createElement("div");

  banner.className = isSuccess ? "success-banner" : "error-banner";

  banner.innerHTML = isSuccess
    ? `
      <i class="fas fa-circle-check"></i>
      <div>
        <strong>Message envoyé !</strong><br>
        <span>Merci de nous avoir contacté.</span>
      </div>
    `
    : `
      <i class="fas fa-circle-xmark"></i>
      <div>
        <strong>Erreur d'envoi</strong><br>
        <span>Veuillez réessayer plus tard.</span>
      </div>
    `;

  form.insertAdjacentElement("beforebegin", banner);

  setTimeout(() => {
    banner.style.opacity = "0";
    banner.style.transform = "translateY(-10px)";
    setTimeout(() => { banner.remove(); }, 500);
  }, 5000);
}

// ── 6. Styles injectés ───────────────────────
const style = document.createElement("style");

style.textContent = `
@keyframes shake {
  0%,100% { transform:translateX(0); }
  20% { transform:translateX(-8px); }
  40% { transform:translateX(8px); }
  60% { transform:translateX(-5px); }
  80% { transform:translateX(5px); }
}

@keyframes spin {
  to { transform:rotate(360deg); }
}

/* ✅ FIX #2 : "otate" corrigé en "rotate" ci-dessus */

.success-banner,
.error-banner {
  border-radius:10px;
  padding:18px 22px;
  display:flex;
  align-items:center;
  gap:14px;
  margin-bottom:28px;
  font-weight:500;
  transition:0.5s;
}

.success-banner {
  background:#22c55e22;
  border:1px solid #4ade80;
  color:#4ade80;
}

.error-banner {
  background:#ef444422;
  border:1px solid #f87171;
  color:#f87171;
}

.spinner {
  width:18px;
  height:18px;
  border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff;
  border-radius:50%;
  animation:spin .7s linear infinite;
}

button.loading {
  opacity:.7;
  cursor:not-allowed;
}
`;

document.head.appendChild(style);