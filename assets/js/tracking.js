/* ==========================================================================
   TRACKING BOOTSTRAP
   --------------------------------------------------------------------------
   Loads the Meta Pixel and, optionally, GA4 using the values you set in
   assets/js/config.js. Also captures the UTM parameters from the ad click so
   they can travel with the lead all the way into your inbox and your CRM.

   You should not need to edit this file.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.LP_CONFIG || {};

  /* ---------- UTM and click id capture -------------------------------------
     Meta appends fbclid to the destination URL. Capturing it, along with any
     utm_* parameters, lets you match a lead in your CRM back to the exact ad
     that produced it. Stored for the session so the thank you page can read
     them too.
  -------------------------------------------------------------------------- */
  var TRACK_KEYS = [
    "utm_source", "utm_medium", "utm_campaign",
    "utm_content", "utm_term", "fbclid", "gclid", "ttclid"
  ];

  function captureAttribution() {
    var params, stored, i, key, value;
    try {
      params = new URLSearchParams(window.location.search);
      stored = JSON.parse(sessionStorage.getItem("lp_attribution") || "{}");
    } catch (e) {
      return {};
    }
    for (i = 0; i < TRACK_KEYS.length; i++) {
      key = TRACK_KEYS[i];
      value = params.get(key);
      // First touch wins. Do not let an internal navigation overwrite the ad data.
      if (value && !stored[key]) { stored[key] = value; }
    }
    if (!stored.landing_page) { stored.landing_page = window.location.pathname; }
    if (!stored.referrer) { stored.referrer = document.referrer || "direct"; }
    try { sessionStorage.setItem("lp_attribution", JSON.stringify(stored)); } catch (e) {}
    return stored;
  }

  var attribution = captureAttribution();

  /* ---------- Meta Pixel --------------------------------------------------- */
  var meta = cfg.meta || {};
  var pixelReady = false;

  if (meta.enabled && meta.pixelId && String(meta.pixelId).indexOf("YOUR_") !== 0) {
    /* Official Meta Pixel base code */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", String(meta.pixelId));
    window.fbq("track", "PageView");
    pixelReady = true;
  } else if (meta.enabled) {
    console.warn("[tracking] Meta Pixel is enabled but pixelId is not set in config.js");
  }

  /* ---------- Google Analytics 4 (optional) -------------------------------- */
  var ga4 = cfg.ga4 || {};
  if (ga4.enabled && ga4.measurementId) {
    var gs = document.createElement("script");
    gs.async = true;
    gs.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4.measurementId);
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ga4.measurementId);
  }

  /* ---------- Shared helpers ----------------------------------------------- */
  window.LP_TRACK = {
    attribution: attribution,

    /* Random id used to deduplicate a browser Pixel event against the same
       event sent server side through the Conversions API. */
    newEventId: function () {
      try {
        if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
      } catch (e) {}
      return "lp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
    },

    /* Fires the Meta conversion. Called on the thank you page, which is what
       makes this a clean, countable conversion instead of a raw click. */
    lead: function (eventId, params) {
      if (!pixelReady || !window.fbq) return;
      var opts = eventId ? { eventID: eventId } : undefined;
      window.fbq("track", "Lead", params || {}, opts);
    },

    event: function (name, params) {
      if (pixelReady && window.fbq) window.fbq("trackCustom", name, params || {});
      if (window.gtag) window.gtag("event", name, params || {});
    }
  };
})();
