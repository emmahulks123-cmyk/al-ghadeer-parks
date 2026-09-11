/* ==========================================================================
   AL GHADEER - LANDING PAGE BEHAVIOUR
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
     ----------------------------------------------------------------------
     When a site key is configured, a valid token is MANDATORY. If reCAPTCHA
     cannot be reached, or returns nothing, the form refuses to submit and
     nothing is sent to EmailJS or Zapier. A form that quietly submits when
     its bot check failed is not protected at all.
     ====================================================================== */
  var recaptchaState = "idle";   // idle | loading | ready | failed

  function recaptchaRequired() {
    var rc = cfg.recaptcha || {};
    return !!(rc.enabled && !isPlaceholder(rc.siteKey));
  }

  function loadRecaptcha() {
    var rc = cfg.recaptcha || {};
    if (!rc.enabled) return;

    if (isPlaceholder(rc.siteKey)) {
      console.warn("[form] reCAPTCHA is enabled but siteKey is not set in config.js. " +
                   "The form will still work, but it is not protected by reCAPTCHA.");
      return;
    }

    recaptchaState = "loading";
    var s = document.createElement("script");
    s.src = "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(rc.siteKey);
    s.async = true;
    s.defer = true;
    s.onload = function () { recaptchaState = "ready"; };
    s.onerror = function () {
      recaptchaState = "failed";
      console.error("[form] reCAPTCHA failed to load. Submissions are blocked until it does.");
    };
    document.head.appendChild(s);
  }

  /* The visitor may submit before the reCAPTCHA script has finished loading,
     so wait for it rather than failing them straight away. */
  function whenRecaptchaReady(timeoutMs) {
    return new Promise(function (resolve) {
      if (recaptchaState === "ready")  { resolve(true);  return; }
      if (recaptchaState === "failed") { resolve(false); return; }

      var waited = 0, step = 120;
      var poll = window.setInterval(function () {
        if (recaptchaState === "ready") { window.clearInterval(poll); resolve(true); }
        else if (recaptchaState === "failed") { window.clearInterval(poll); resolve(false); }
        else if ((waited += step) >= timeoutMs) { window.clearInterval(poll); resolve(false); }
      }, step);
    });
  }

  function getRecaptchaToken() {
    var rc = cfg.recaptcha || {};
    if (!recaptchaRequired()) return Promise.resolve(null);

    return whenRecaptchaReady(10000).then(function (ready) {
      if (!ready || !window.grecaptcha) return null;

      return new Promise(function (resolve) {
        var settled = false;
        var timer = window.setTimeout(function () {
          if (!settled) { settled = true; resolve(null); }
        }, 10000);

        function done(token) {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resolve(token || null);
        }

        try {
          window.grecaptcha.ready(function () {
            window.grecaptcha
              .execute(rc.siteKey, { action: rc.action || "lead_submit" })
              .then(done)
              .catch(function () { done(null); });
          });
        } catch (e) { done(null); }
      });
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

    function fail(input, message) {
      markInvalid(input, message);
      ok = false;
      if (!firstBad) firstBad = input;
    }

    /* --- Full name. Required, and must actually contain letters. --------- */
    var name = form.elements.name;
    var nameValue = name.value.trim().replace(/\s+/g, " ");
    if (!nameValue) {
      fail(name, "Please enter your full name.");
    } else if (nameValue.length < 2) {
      fail(name, "Please enter your full name.");
    } else if (!/[A-Za-z\u00C0-\u024F\u0600-\u06FF]/.test(nameValue)) {
      fail(name, "Please enter your name using letters.");
    }

    /* --- WhatsApp number. Required, checked against the country code. ----
       UAE mobiles are nine digits starting with 5, so a wrong number is
       caught here rather than after you have paid for the click.          */
    var phone = form.elements.phone;
    var code = form.elements.country_code ? form.elements.country_code.value : "";
    var digits = phone.value.replace(/\D/g, "").replace(/^0+/, "");
    if (!digits) {
      fail(phone, "Please enter your WhatsApp number.");
    } else if (code === "+971" && !/^5\d{8}$/.test(digits)) {
      fail(phone, "Enter a UAE mobile number, for example 50 123 4567.");
    } else if (digits.length < 6 || digits.length > 15) {
      fail(phone, "Please enter a valid number.");
    }

    /* --- Email. Required. ------------------------------------------------ */
    var email = form.elements.email;
    var emailValue = email.value.trim();
    if (!emailValue) {
      fail(email, "Please enter your email address.");
    } else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(emailValue)) {
      fail(email, "Please enter a valid email address.");
    }

    /* --- Country code. Required, and must be one of the listed options. -- */
    var codeField = form.elements.country_code;
    if (codeField && !codeField.value) {
      fail(codeField, "Please choose a country code.");
    }

    /* --- Timeline. The one qualifying question. Required. ---------------- */
    var timeline = form.elements.timeline;
    if (!timeline.value) {
      fail(timeline, "Please choose a timeline.");
    }

    if (firstBad) firstBad.focus({ preventScroll: false });
    return ok;
  }

  /* ---------- spam traps ---------------------------------------------------
     Two separate signals, handled differently on purpose.

     The honeypot is conclusive: the field is invisible to people, so anything
     typed into it is automation. That submission is dropped without a word.

     A fast submission is only a hint. Browser autofill can complete this form
     in well under a second, so treating speed as proof of a bot silently threw
     away genuine enquiries and showed those buyers a thank you page for a lead
     that was never sent. It now asks them to submit again instead, which costs
     a real person one extra click and stops a scripted burst.
  -------------------------------------------------------------------------- */
  function honeypotTripped(form) {
    var rc = cfg.recaptcha || {};
    if (rc.honeypot === false) return false;
    var hp = form.elements.hp_field;
    return !!(hp && hp.value.trim() !== "");
  }

  function submittedTooFast(form) {
    var rc = cfg.recaptcha || {};
    var minSeconds = typeof rc.minSecondsOnForm === "number" ? rc.minSecondsOnForm : 3;
    if (minSeconds <= 0) return false;
    var elapsed = (Date.now() - Number(form.dataset.startedAt || 0)) / 1000;
    return elapsed < minSeconds;
  }

  /* ---------- status helpers ---------------------------------------------- */
  function setStatus(form, type, message) {
    var el = form.querySelector("[data-status]");
    if (!el) return;
    el.className = "form__status" + (type ? " is-" + type : "");
    el.textContent = message || "";
  }

  function setBusy(form, busy, busyLabel) {
    var btn = form.querySelector("button[type=submit]");
    if (!btn) return;
    btn.setAttribute("aria-busy", busy ? "true" : "false");
    btn.disabled = !!busy;
    var label = btn.querySelector(".btn__label");
    if (label) label.textContent = busy ? (busyLabel || "Sending") : "Get Prices & Sizes";
  }

  /* ---------- submit ------------------------------------------------------- */
  function submitForm(form) {
    setStatus(form, "", "");

    /* 1. Every field must be valid. Nothing else runs until it is. */
    if (!validate(form)) return;

    /* 2. Conclusive bot signal. Dropped silently, nothing sent. */
    if (honeypotTripped(form)) {
      window.location.href = behaviour.thankYouUrl || "thank-you.html";
      return;
    }

    /* 3. Suspiciously fast. Ask for a second attempt rather than binning it. */
    if (submittedTooFast(form)) {
      setStatus(form, "error", "Please take a moment to check your details, then send again.");
      return;
    }

    /* 4. reCAPTCHA. When a site key is configured this is mandatory: no
          valid token means the submission is refused and nothing is sent. */
    setBusy(form, true, recaptchaRequired() ? "Verifying" : "Sending");

    getRecaptchaToken().then(function (token) {
      if (recaptchaRequired() && !token) {
        setBusy(form, false);
        setStatus(form, "error",
          "We could not confirm that you are a real visitor, so your details were not sent. " +
          "Please reload the page and try again.");
        return;
      }

      setBusy(form, true, "Sending");
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

    /* Split the name so Go High Level can map First Name and Last Name
       directly, instead of you having to do it with a formatter step. */
    var fullName = form.elements.name.value.trim().replace(/\s+/g, " ");
    var nameParts = fullName.split(" ");
    var firstName = nameParts[0] || "";
    var lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    var timelineLabel = form.elements.timeline.options[form.elements.timeline.selectedIndex].text;

    return {
      name:        fullName,
      full_name:   fullName,
      first_name:  firstName,
      last_name:   lastName,
      email:       form.elements.email.value.trim(),
      phone:       code + digits,
      phone_local: digits,
      country_code: code,
      timeline:    form.elements.timeline.value,
      timeline_label: timelineLabel,
      form_location: form.elements.form_location ? form.elements.form_location.value : "",
      project:     "Al Ghadeer",
      source:      "Al Ghadeer Landing Page",
      /* A ready made line for the Go High Level contact note or opportunity */
      notes:       "Al Ghadeer enquiry. Buying timeline: " + timelineLabel +
                   ". Submitted from the " + (form.elements.form_location ? form.elements.form_location.value : "") +
                   " form.",
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

  /* ---------- Zapier ------------------------------------------------------
     Sent as application/x-www-form-urlencoded, on purpose.

     A POST carrying "Content-Type: application/json" is not a CORS simple
     request, so the browser first sends an OPTIONS preflight. Zapier's catch
     hook answers that preflight without allowing the content-type header, so
     the real POST is never sent and the console shows:

       "Request header field content-type is not allowed by
        Access-Control-Allow-Headers in preflight response"

     Form encoding is one of the three content types the CORS spec treats as
     simple, so there is no preflight at all. It also means Zapier parses the
     body into individual named fields, which is what you map in Go High Level,
     instead of dropping the whole payload into a single "querystring" value.

     Notes on the options used here:
       mode "no-cors"  we never read Zapier's reply, and asking to read it
                       would fail on the missing Access-Control-Allow-Origin
                       header and trigger a retry, which would duplicate leads
       keepalive       the page navigates to the thank you page immediately
                       after this call, and keepalive stops the browser
                       cancelling the request mid flight
       no headers set  passing URLSearchParams makes the browser set the
                       correct content type itself. Setting it by hand is what
                       caused the original failure.
  -------------------------------------------------------------------------- */
  function sendZapier(lead) {
    var z = cfg.zapier || {};
    if (!z.enabled || !z.webhookUrl || z.webhookUrl.indexOf("YOUR_") !== -1) {
      return Promise.resolve("skipped");
    }

    var body = new URLSearchParams();
    Object.keys(lead).forEach(function (key) {
      var value = lead[key];
      body.append(key, value === null || value === undefined ? "" : String(value));
    });

    return fetch(z.webhookUrl, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      body: body
    })
      .then(function () { return "sent"; })
      .catch(function (err) {
        console.error("[form] Zapier webhook failed:", err);
        return "failed";
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
