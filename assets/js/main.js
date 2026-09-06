/* ==========================================================================
   AL GHADEER PARKS - LANDING PAGE BEHAVIOUR
   --------------------------------------------------------------------------
   Handles the images, the reveal animations, the sticky mobile bar and,
   most importantly, the lead form: validation, spam protection, reCAPTCHA v3,
   EmailJS delivery, the Zapier webhook and the redirect to the thank you page.

   You should not need to edit this file. All settings live in config.js.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.LP_CONFIG || {};
  var behaviour = cfg.behaviour || {};
  var imagesCfg = cfg.images || {};
  var isPlaceholder = function (v) { return !v || String(v).indexOf("YOUR_") === 0; };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    setHeroSide();
    setupImages();
    setupReveal();
    setupStickyBar();
    setupFormScrolling();
    loadRecaptcha();
    setupForms();
  }

  /* ======================================================================
     SMALL BITS
     ====================================================================== */
  function setYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function setHeroSide() {
    var grid = document.querySelector("[data-hero-grid]");
    if (grid && behaviour.heroFormSide === "left") {
      grid.setAttribute("data-form-side", "left");
    }
  }

  /* ======================================================================
     IMAGES
     ----------------------------------------------------------------------
     Each photo points at a real file in assets/img/. If that file is not
     there yet we either show a stand-in photograph, so you can judge the
     layout, or a clean branded panel naming the shot that belongs there.
     Controlled by images.demoImages in config.js.
     ====================================================================== */
  function setupImages() {
    var imgs = document.querySelectorAll("img[data-img-label]");
    Array.prototype.forEach.call(imgs, function (img) {
      // The image may already have failed before this script ran.
      if (img.complete && img.naturalWidth === 0) {
        onImageError(img);
      } else if (!img.complete) {
        img.addEventListener("error", function () { onImageError(img); }, { once: true });
      }
    });
  }

  function onImageError(img) {
    if (img.dataset.lpFallback === "demo") { renderPlaceholder(img); return; }

    if (imagesCfg.demoImages && img.dataset.demoSeed) {
      img.dataset.lpFallback = "demo";
      img.addEventListener("error", function () { renderPlaceholder(img); }, { once: true });
      img.src = "https://picsum.photos/seed/" + encodeURIComponent(img.dataset.demoSeed) +
                "/" + (img.dataset.demoSize || "900/600");
      return;
    }
    renderPlaceholder(img);
  }

  function renderPlaceholder(img) {
    var size = (img.dataset.demoSize || "900/600").split("/");
    var file = (img.getAttribute("src") || "").split("?")[0];
    var box = document.createElement("div");

    box.className = "img-missing";
    box.style.aspectRatio = size[0] + " / " + size[1];
    box.innerHTML =
      '<span class="img-missing__label"></span>' +
      '<span class="img-missing__file"></span>';
    box.querySelector(".img-missing__label").textContent = img.dataset.imgLabel || "Image";
    box.querySelector(".img-missing__file").textContent = file;

    if (img.parentNode) img.parentNode.replaceChild(box, img);
  }

  /* ======================================================================
     REVEAL ON SCROLL
     Purpose: each section arrives as the reader reaches it, so attention
     lands on one block at a time. Nothing loops, nothing repeats.
     ====================================================================== */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add("is-in"); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    Array.prototype.forEach.call(items, function (el) { obs.observe(el); });
  }

  /* ======================================================================
     STICKY MOBILE BAR
     Appears once the hero form has scrolled away, hides again when the
     closing form is on screen so it never covers the thing it points to.
     ====================================================================== */
  function setupStickyBar() {
    var bar = document.querySelector("[data-sticky-bar]");
    if (!bar) return;

    if (behaviour.mobileStickyBar === false) { bar.remove(); return; }
    if (!("IntersectionObserver" in window)) return;

    var heroForm = document.getElementById("lead-form");
    var lastForm = document.getElementById("lead-form-2");
    var heroVisible = true;
    var lastVisible = false;

    function update() {
      var show = !heroVisible && !lastVisible;
      bar.classList.toggle("is-visible", show);
      document.documentElement.style.setProperty("--sticky-pad", show ? "72px" : "0px");
    }

    if (heroForm) {
      new IntersectionObserver(function (e) {
        heroVisible = e[0].isIntersecting; update();
      }, { threshold: 0.08 }).observe(heroForm);
    } else {
      heroVisible = false;
    }

    if (lastForm) {
      new IntersectionObserver(function (e) {
        lastVisible = e[0].isIntersecting; update();
      }, { threshold: 0.08 }).observe(lastForm);
    }

    update();
  }

  /* ======================================================================
     SCROLL TO THE NEAREST FORM
     ====================================================================== */
  function setupFormScrolling() {
    document.addEventListener("click", function (ev) {
      var trigger = ev.target.closest ? ev.target.closest("[data-scroll-to-form]") : null;
      if (!trigger) return;
      ev.preventDefault();

      var cards = document.querySelectorAll(".formcard");
      if (!cards.length) return;

      var best = cards[0], bestDist = Infinity;
      Array.prototype.forEach.call(cards, function (card) {
        var dist = Math.abs(card.getBoundingClientRect().top - 90);
        if (dist < bestDist) { bestDist = dist; best = card; }
      });

      best.scrollIntoView({ behavior: "smooth", block: "center" });

      var first = best.querySelector("input:not([type=hidden]):not([tabindex='-1'])");
      if (first) {
        window.setTimeout(function () {
          // Do not steal focus on touch devices, it forces the keyboard open.
          if (window.matchMedia("(hover: hover)").matches) first.focus({ preventScroll: true });
        }, 620);
      }
    });
  }

  /* ======================================================================
     reCAPTCHA v3  (invisible)
     ====================================================================== */
  var recaptchaReady = false;

  function loadRecaptcha() {
    var rc = cfg.recaptcha || {};
    if (!rc.enabled || isPlaceholder(rc.siteKey)) return;

    var s = document.createElement("script");
    s.src = "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(rc.siteKey);
    s.async = true;
    s.defer = true;
    s.onload = function () { recaptchaReady = true; };
    document.head.appendChild(s);
  }

  function getRecaptchaToken() {
    var rc = cfg.recaptcha || {};
    return new Promise(function (resolve) {
      if (!rc.enabled || isPlaceholder(rc.siteKey) || !recaptchaReady || !window.grecaptcha) {
        resolve(null);
        return;
      }
      // Never let a slow or blocked reCAPTCHA stop a genuine lead submitting.
      var settled = false;
      var timer = window.setTimeout(function () {
        if (!settled) { settled = true; resolve(null); }
      }, 6000);

      try {
        window.grecaptcha.ready(function () {
          window.grecaptcha
            .execute(rc.siteKey, { action: rc.action || "lead_submit" })
            .then(function (token) {
              if (settled) return;
              settled = true; window.clearTimeout(timer); resolve(token);
            })
            .catch(function () {
              if (settled) return;
              settled = true; window.clearTimeout(timer); resolve(null);
            });
        });
      } catch (e) {
        if (!settled) { settled = true; window.clearTimeout(timer); resolve(null); }
      }
    });
  }

  /* ======================================================================
     LEAD FORMS
     ====================================================================== */
  function setupForms() {
    var forms = document.querySelectorAll("[data-lead-form]");
    Array.prototype.forEach.call(forms, function (form) {
      form.dataset.startedAt = String(Date.now());

      // Clear an error the moment the visitor starts fixing it.
      form.addEventListener("input", function (ev) {
        var field = ev.target.closest(".field");
        if (field) field.classList.remove("is-invalid");
      });
      form.addEventListener("change", function (ev) {
        var field = ev.target.closest(".field");
        if (field) field.classList.remove("is-invalid");
      });

      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        submitForm(form);
      });
    });
  }

  /* ---------- validation --------------------------------------------------- */
  function markInvalid(input, message) {
    var field = input.closest(".field");
    if (!field) return;
    field.classList.add("is-invalid");
    if (message) {
      var err = field.querySelector("[data-error]");
      if (err) err.textContent = message;
    }
  }

  function validate(form) {
    var ok = true, firstBad = null;

    var name = form.elements.name;
    var phone = form.elements.phone;
    var email = form.elements.email;
    var timeline = form.elements.timeline;

    if (!name.value.trim() || name.value.trim().length < 2) {
      markInvalid(name, "Please enter your name."); ok = false; firstBad = firstBad || name;
    }

    var digits = phone.value.replace(/\D/g, "");
    if (digits.length < 6 || digits.length > 15) {
      markInvalid(phone, "Please enter a valid number."); ok = false; firstBad = firstBad || phone;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      markInvalid(email, "Please enter a valid email address."); ok = false; firstBad = firstBad || email;
    }

    if (!timeline.value) {
      markInvalid(timeline, "Please choose a timeline."); ok = false; firstBad = firstBad || timeline;
    }

    if (firstBad) firstBad.focus({ preventScroll: false });
    return ok;
  }

  /* ---------- spam traps --------------------------------------------------- */
  function looksLikeBot(form) {
    var rc = cfg.recaptcha || {};

    // 1. Honeypot. A person cannot see this field, so anything in it is a bot.
    if (rc.honeypot !== false) {
      var hp = form.elements.company;
      if (hp && hp.value.trim() !== "") return true;
    }

    // 2. Time on form. Scripts submit far faster than anyone can type.
    var minSeconds = typeof rc.minSecondsOnForm === "number" ? rc.minSecondsOnForm : 3;
    var elapsed = (Date.now() - Number(form.dataset.startedAt || 0)) / 1000;
    if (minSeconds > 0 && elapsed < minSeconds) return true;

    return false;
  }

  /* ---------- status helpers ---------------------------------------------- */
  function setStatus(form, type, message) {
    var el = form.querySelector("[data-status]");
    if (!el) return;
    el.className = "form__status" + (type ? " is-" + type : "");
    el.textContent = message || "";
  }

  function setBusy(form, busy) {
    var btn = form.querySelector("button[type=submit]");
    if (!btn) return;
    btn.setAttribute("aria-busy", busy ? "true" : "false");
    btn.disabled = !!busy;
    var label = btn.querySelector(".btn__label");
    if (label) label.textContent = busy ? "Sending" : "Get the Price List";
  }

  /* ---------- submit ------------------------------------------------------- */
  function submitForm(form) {
    setStatus(form, "", "");
    if (!validate(form)) return;

    // A bot gets the same friendly screen as everyone else, but nothing is
    // sent anywhere and no conversion is recorded.
    if (looksLikeBot(form)) {
      window.location.href = behaviour.thankYouUrl || "thank-you.html";
      return;
    }

    setBusy(form, true);

    getRecaptchaToken().then(function (token) {
      var lead = buildLead(form, token);

      return Promise.allSettled([sendEmailJS(lead), sendZapier(lead)])
        .then(function (results) {
          var attempted = results.filter(function (r) { return r.value !== "skipped"; });
          var anyOk = results.some(function (r) {
            return r.status === "fulfilled" && r.value === "sent";
          });

          // Nothing is configured yet. Let the page owner see that clearly
          // rather than silently pretending the lead was delivered.
          if (attempted.length === 0) {
            setBusy(form, false);
            setStatus(form, "error",
              "This form is not connected yet. Add your EmailJS and Zapier details in assets/js/config.js.");
            return;
          }

          if (!anyOk) {
            setBusy(form, false);
            setStatus(form, "error",
              "Something went wrong sending your details. Please try again, or message us directly on WhatsApp.");
            return;
          }

          handoff(lead);
        });
    }).catch(function () {
      setBusy(form, false);
      setStatus(form, "error",
        "Something went wrong sending your details. Please try again in a moment.");
    });
  }

  function buildLead(form, token) {
    var attribution = (window.LP_TRACK && window.LP_TRACK.attribution) || {};
    var code = form.elements.country_code ? form.elements.country_code.value : "";
    var digits = form.elements.phone.value.replace(/\D/g, "").replace(/^0+/, "");
    var eventId = (window.LP_TRACK && window.LP_TRACK.newEventId) ? window.LP_TRACK.newEventId() : "";

    return {
      name:        form.elements.name.value.trim(),
      email:       form.elements.email.value.trim(),
      phone:       code + digits,
      phone_local: digits,
      country_code: code,
      timeline:    form.elements.timeline.value,
      timeline_label: form.elements.timeline.options[form.elements.timeline.selectedIndex].text,
      form_location: form.elements.form_location ? form.elements.form_location.value : "",
      project:     "Al Ghadeer Parks",
      page_url:    window.location.href,
      submitted_at: new Date().toISOString(),
      event_id:    (cfg.meta && cfg.meta.sendEventId) ? eventId : "",
      recaptcha_token: token || "",
      utm_source:   attribution.utm_source || "",
      utm_medium:   attribution.utm_medium || "",
      utm_campaign: attribution.utm_campaign || "",
      utm_content:  attribution.utm_content || "",
      utm_term:     attribution.utm_term || "",
      fbclid:       attribution.fbclid || "",
      referrer:     attribution.referrer || ""
    };
  }

  /* ---------- EmailJS ------------------------------------------------------ */
  function sendEmailJS(lead) {
    var e = cfg.emailjs || {};
    if (!e.enabled || isPlaceholder(e.publicKey) || isPlaceholder(e.serviceId) || isPlaceholder(e.templateId)) {
      return Promise.resolve("skipped");
    }
    if (!window.emailjs) {
      console.warn("[form] The EmailJS library did not load.");
      return Promise.resolve("failed");
    }

    try {
      window.emailjs.init({ publicKey: e.publicKey });
    } catch (err) {
      try { window.emailjs.init(e.publicKey); } catch (err2) {}
    }

    /* These names are the {{variables}} you put in your EmailJS template. */
    var templateParams = {
      to_email:      e.toEmail || "",
      lead_name:     lead.name,
      lead_email:    lead.email,
      lead_phone:    lead.phone,
      lead_timeline: lead.timeline_label,
      project:       lead.project,
      page_source:   lead.form_location,
      utm_campaign:  lead.utm_campaign,
      utm_content:   lead.utm_content,
      utm_source:    lead.utm_source,
      submitted_at:  new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai" }),
      reply_to:      lead.email
    };

    return window.emailjs.send(e.serviceId, e.templateId, templateParams)
      .then(function () { return "sent"; })
      .catch(function (err) {
        console.error("[form] EmailJS failed:", err);
        return "failed";
      });
  }

  /* ---------- Zapier ------------------------------------------------------- */
  function sendZapier(lead) {
    var z = cfg.zapier || {};
    if (!z.enabled || !z.webhookUrl || z.webhookUrl.indexOf("YOUR_") !== -1) {
      return Promise.resolve("skipped");
    }

    return fetch(z.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    })
      .then(function (res) { return res.ok ? "sent" : "failed"; })
      .catch(function () {
        /* Some browsers block the response for cross origin webhooks. Fire the
           request again without reading the reply so the lead still lands. */
        return fetch(z.webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(lead)
        })
          .then(function () { return "sent"; })
          .catch(function () { return "failed"; });
      });
  }

  /* ---------- success handoff --------------------------------------------- */
  function handoff(lead) {
    try {
      sessionStorage.setItem("lp_lead", JSON.stringify({
        name: lead.name,
        timeline: lead.timeline_label,
        event_id: lead.event_id
      }));
    } catch (e) {}

    if (window.LP_TRACK) {
      window.LP_TRACK.event("LeadFormSubmitted", { form_location: lead.form_location });
    }

    window.location.href = behaviour.thankYouUrl || "thank-you.html";
  }
})();
