/* ================================================================
   BRAMWELL & PARTNERS, shared behaviour
   Plain vanilla JS, no build step. Each block checks for the
   elements it needs, so one file serves every page.
   ================================================================ */
(function(){
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = window.requestAnimationFrame;
  var MEDIA = window.BRAMWELL_MEDIA || "";
  var PROPS = window.BRAMWELL_PROPERTIES || [];

  /* ---------- helpers ---------- */
  function $(s, r){ return (r || document).querySelector(s); }
  function $$(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function aed(n){
    if(n >= 1000000) return "AED " + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "m";
    return "AED " + Math.round(n).toLocaleString("en-US");
  }
  function aedFull(n){ return "AED " + Math.round(n).toLocaleString("en-US"); }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }
  window.BR = { aed: aed, aedFull: aedFull, esc: esc, $: $, $$: $$, MEDIA: MEDIA, PROPS: PROPS };

  /* ---------- images fade in once decoded ---------- */
  function watchImages(root){
    $$(".ph img", root || document).forEach(function(img){
      if(img.dataset.watched) return;
      img.dataset.watched = "1";
      if(img.complete && img.naturalWidth){ img.classList.add("ready"); return; }
      img.addEventListener("load", function(){ img.classList.add("ready"); }, {once:true});
      /* on error the frame keeps its designed gradient, which is the point */
    });
  }
  window.BR.watchImages = watchImages;
  watchImages();

  /* ---------- year ---------- */
  $$("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* ---------- nav ---------- */
  var nav = $("#nav");
  if(nav){
    var menuBtn = $("#menuBtn"), links = $("#navLinks");
    if(menuBtn && links){
      menuBtn.addEventListener("click", function(){
        var open = links.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });
      links.addEventListener("click", function(e){
        if(e.target.closest("a") && links.classList.contains("open")){
          links.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    }
    var tick = false;
    function navScroll(){
      if(tick) return;
      tick = true;
      raf(function(){
        tick = false;
        nav.classList.toggle("scrolled", (window.pageYOffset || document.documentElement.scrollTop) > 30);
      });
    }
    window.addEventListener("scroll", navScroll, {passive:true});
    navScroll();

    /* mark the current page in the nav */
    var here = location.pathname.split("/").pop() || "index.html";
    $$("#navLinks a:not(.btn)").forEach(function(a){
      var href = (a.getAttribute("href") || "").split("#")[0].split("?")[0];
      if(href && href === here) a.classList.add("here");
    });
  }

  /* ---------- hero entrance ---------- */
  var hero = $(".hero");
  if(hero) raf(function(){ raf(function(){ hero.classList.add("in"); }); });

  /* ---------- reveals ---------- */
  var io = null;
  function observe(root){
    var els = $$(".rv:not(.in)", root || document);
    if(!("IntersectionObserver" in window) || reduce){
      els.forEach(function(e){ e.classList.add("in"); });
      return;
    }
    if(!io){
      io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, {rootMargin:"0px 0px -8% 0px", threshold:.08});
    }
    els.forEach(function(e){ io.observe(e); });
  }
  window.BR.observe = observe;
  observe();

  /* ================================================================
     PROPERTY CARD
     ================================================================ */
  function cardHTML(p){
    return '<a class="card-p rv" href="property.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="ph zoom">' +
        '<span class="tag' + (p.status === "Off plan" ? " off" : "") + '">' + esc(p.status) + '</span>' +
        '<img alt="' + esc(p.title + ", " + p.community) + '" loading="lazy" decoding="async" src="' + MEDIA + p.images[0] + '">' +
      '</div>' +
      '<div class="card-p-body">' +
        '<span class="loc">' + esc(p.community) + ' &nbsp;·&nbsp; ' + esc(p.emirate) + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<span class="price">' + aed(p.price) + '</span>' +
        '<div class="facts">' +
          '<span><i>Beds</i> ' + p.beds + '</span>' +
          '<span><i>Baths</i> ' + p.baths + '</span>' +
          '<span><i>Area</i> ' + p.area.toLocaleString("en-US") + ' sq ft</span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }
  window.BR.cardHTML = cardHTML;

  /* featured strip on the home page */
  var featured = $("#featured");
  if(featured){
    var pick = PROPS.slice(0, 3);
    featured.innerHTML = pick.map(cardHTML).join("");
    watchImages(featured); observe(featured);
  }

  /* ================================================================
     LISTINGS
     ================================================================ */
  var grid = $("#grid");
  if(grid){
    var state = { type:"All", emirate:"All", beds:0, sort:"price-desc" };
    var countEl = $("#fcount"), emptyEl = $("#empty");

    function apply(){
      var out = PROPS.filter(function(p){
        if(state.type !== "All" && p.type !== state.type) return false;
        if(state.emirate !== "All" && p.emirate !== state.emirate) return false;
        if(state.beds && p.beds < state.beds) return false;
        return true;
      });

      out.sort(function(a, b){
        if(state.sort === "price-asc")  return a.price - b.price;
        if(state.sort === "price-desc") return b.price - a.price;
        if(state.sort === "area-desc")  return b.area - a.area;
        if(state.sort === "yield-desc") return b.grossYield - a.grossYield;
        return 0;
      });

      grid.innerHTML = out.map(cardHTML).join("");
      watchImages(grid);
      /* reveal immediately after a filter change; a stagger here would
         read as lag rather than polish */
      $$(".rv", grid).forEach(function(e){ e.classList.add("in"); });

      if(countEl){
        countEl.innerHTML = "<b>" + out.length + "</b> " + (out.length === 1 ? "property" : "properties");
      }
      if(emptyEl) emptyEl.hidden = out.length !== 0;
      grid.hidden = out.length === 0;
    }

    $$("[data-filter]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var key = btn.dataset.filter, val = btn.dataset.value;
        state[key] = (key === "beds") ? parseInt(val, 10) : val;
        $$('[data-filter="' + key + '"]').forEach(function(b){
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        apply();
      });
    });

    var sortSel = $("#sort");
    if(sortSel) sortSel.addEventListener("change", function(){ state.sort = sortSel.value; apply(); });

    var reset = $("#reset");
    if(reset) reset.addEventListener("click", function(){
      state = { type:"All", emirate:"All", beds:0, sort:sortSel ? sortSel.value : "price-desc" };
      $$("[data-filter]").forEach(function(b){
        b.setAttribute("aria-pressed", b.dataset.value === "All" || b.dataset.value === "0" ? "true" : "false");
      });
      apply();
    });

    /* a type can be preselected from a link, e.g. properties.html?type=Villa */
    var qType = new URLSearchParams(location.search).get("type");
    if(qType){
      var match = $$('[data-filter="type"]').filter(function(b){ return b.dataset.value === qType; })[0];
      if(match){
        state.type = qType;
        $$('[data-filter="type"]').forEach(function(b){ b.setAttribute("aria-pressed", b === match ? "true" : "false"); });
      }
    }
    apply();
  }

  /* ================================================================
     PROPERTY DETAIL
     ================================================================ */
  var pd = $("#pd");
  if(pd){
    var id = new URLSearchParams(location.search).get("id");
    var p = PROPS.filter(function(x){ return x.id === id; })[0];

    if(!p){
      pd.innerHTML =
        '<div class="wrap pad"><div class="empty">' +
          '<h3>That property is no longer listed.</h3>' +
          '<p>It may have been sold or withdrawn. The current list is below.</p>' +
          '<a class="btn btn-solid" href="properties.html">View all properties</a>' +
        '</div></div>';
      document.title = "Property not found | Bramwell & Partners";
    } else {
      document.title = p.title + ", " + p.community + " | Bramwell & Partners";
      var d = $("#pdDesc");
      if(d) d.setAttribute("content", p.summary);

      /* net yield, using the same assumptions as the calculator */
      var grossRent = p.price * (p.grossYield / 100);
      var svc = p.area * p.serviceCharge;
      var net = Math.max(0, grossRent - svc - grossRent * 0.05 - grossRent * 0.05);
      var netYield = (net / p.price) * 100;

      pd.innerHTML =
      '<div class="wrap pad">' +
        '<a class="mono" href="properties.html" style="color:var(--brass);display:inline-block;margin-bottom:1.6rem">&larr;&nbsp;&nbsp;All properties</a>' +

        '<div class="pd-top">' +
          '<div>' +
            '<span class="mono eyebrow">' + esc(p.community) + ' &nbsp;·&nbsp; ' + esc(p.emirate) + '</span>' +
            '<h1 style="font-size:clamp(1.9rem,1.2rem + 2.6vw,3.4rem);max-width:16ch;margin-top:1rem">' + esc(p.title) + '</h1>' +
          '</div>' +
          '<div class="pd-price">' + aedFull(p.price) + '<small>' + esc(p.status) + ' &nbsp;·&nbsp; ' + esc(p.tenure) + '</small></div>' +
        '</div>' +

        '<div class="pd-gallery" id="gal">' +
          p.images.map(function(src, i){
            return '<div class="ph zoom g' + i + '" data-i="' + i + '" role="button" tabindex="0" aria-label="View image ' + (i+1) + ' of ' + p.images.length + '">' +
              '<img alt="' + esc(p.title) + ', image ' + (i+1) + '" ' + (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async" src="' + MEDIA + src + '">' +
            '</div>';
          }).join("") +
        '</div>' +

        '<div class="specs">' +
          '<div><b>' + p.beds + '</b><small>Bedrooms</small></div>' +
          '<div><b>' + p.baths + '</b><small>Bathrooms</small></div>' +
          '<div><b>' + p.area.toLocaleString("en-US") + '</b><small>Sq ft</small></div>' +
          '<div><b>' + p.parking + '</b><small>Parking</small></div>' +
        '</div>' +

        '<div class="pd-body">' +
          '<div>' +
            '<div class="pd-prose">' +
              '<h2 style="font-size:clamp(1.5rem,1.1rem + 1.4vw,2.2rem);max-width:18ch">The short version</h2>' +
              '<p>' + esc(p.summary) + '</p>' +
              '<p>' + esc(p.detail) + '</p>' +
            '</div>' +
            '<h3 style="margin-top:2.5rem">What stands out</h3>' +
            '<ul class="hl">' + p.highlights.map(function(h){ return '<li>' + esc(h) + '</li>'; }).join("") + '</ul>' +
            '<h3 style="margin-top:2.5rem">Our note on this one</h3>' +
            '<p style="color:var(--ink-2);margin-top:.9rem;max-width:60ch">' + esc(p.note) + '</p>' +
          '</div>' +

          '<aside class="aside">' +
            '<h4>The numbers</h4>' +
            '<div class="rows">' +
              '<div class="row"><span>Type</span><b>' + esc(p.type) + '</b></div>' +
              '<div class="row"><span>Outlook</span><b>' + esc(p.outlook) + '</b></div>' +
              '<div class="row"><span>' + (p.status === "Off plan" ? "Handover" : "Completed") + '</span><b>' + esc(p.completed) + '</b></div>' +
              '<div class="row"><span>Service charge</span><b>AED ' + p.serviceCharge + ' / sq ft</b></div>' +
              '<div class="row"><span>Advertised gross</span><b>' + p.grossYield.toFixed(1) + '%</b></div>' +
              '<div class="row"><span>Our net estimate</span><b style="color:var(--brass)">' + netYield.toFixed(1) + '%</b></div>' +
              '<div class="row"><span>Transfer fee, 4%</span><b>' + aedFull(p.price * 0.04) + '</b></div>' +
            '</div>' +
            '<p style="font-size:.76rem;color:var(--muted);line-height:1.65">Net estimate deducts the building service charge, management at 5% and a 5% vacancy allowance. It is an estimate, not a forecast.</p>' +
            '<a class="btn btn-solid" href="contact.html?ref=' + encodeURIComponent(p.id) + '" style="width:100%">Arrange a viewing</a>' +
          '</aside>' +
        '</div>' +
      '</div>';

      watchImages(pd);

      /* ---- lightbox ---- */
      var lb = $("#lb"), lbImg = $("#lbImg"), lbCount = $("#lbCount");
      if(lb && lbImg){
        var cur = 0;
        function show(i){
          cur = (i + p.images.length) % p.images.length;
          lbImg.src = MEDIA + p.images[cur];
          lbImg.alt = p.title + ", image " + (cur + 1);
          if(lbCount) lbCount.textContent = (cur + 1) + " / " + p.images.length;
        }
        function open(i){ show(i); lb.classList.add("on"); document.body.style.overflow = "hidden"; }
        function close(){ lb.classList.remove("on"); document.body.style.overflow = ""; }

        $$("#gal .ph").forEach(function(f){
          f.addEventListener("click", function(){ open(+f.dataset.i); });
          f.addEventListener("keydown", function(e){
            if(e.key === "Enter" || e.key === " "){ e.preventDefault(); open(+f.dataset.i); }
          });
        });
        $("#lbClose").addEventListener("click", close);
        $("#lbPrev").addEventListener("click", function(e){ e.stopPropagation(); show(cur - 1); });
        $("#lbNext").addEventListener("click", function(e){ e.stopPropagation(); show(cur + 1); });
        lb.addEventListener("click", function(e){ if(e.target === lb) close(); });
        document.addEventListener("keydown", function(e){
          if(!lb.classList.contains("on")) return;
          if(e.key === "Escape") close();
          if(e.key === "ArrowLeft") show(cur - 1);
          if(e.key === "ArrowRight") show(cur + 1);
        });
      }

      /* ---- more properties ---- */
      var more = $("#more");
      if(more){
        var others = PROPS.filter(function(x){ return x.id !== p.id; }).slice(0, 3);
        more.innerHTML = others.map(cardHTML).join("");
        watchImages(more); observe(more);
      }
    }
  }

  /* ================================================================
     YIELD CALCULATOR
     ================================================================ */
  var valueEl = $("#value"), grossEl = $("#gross");
  if(valueEl && grossEl){
    var SERVICE = 0.014, MGMT = 0.05, VAC = 0.05, DLD = 0.04;
    var o = {
      valueOut: $("#valueOut"), grossOut: $("#grossOut"), grossAed: $("#grossAed"),
      netAed: $("#netAed"), netPct: $("#netPct"), dldFee: $("#dldFee")
    };
    function recalc(){
      var v = parseFloat(valueEl.value), g = parseFloat(grossEl.value) / 100;
      var gr = v * g;
      var n = Math.max(0, gr - v * SERVICE - gr * MGMT - gr * VAC);
      o.valueOut.textContent = aedFull(v);
      o.grossOut.textContent = (g * 100).toFixed(1) + "%";
      o.grossAed.textContent = aedFull(gr);
      o.netAed.textContent   = aedFull(n);
      o.netPct.textContent   = ((n / v) * 100).toFixed(1) + "%";
      o.dldFee.textContent   = aedFull(v * DLD);
    }
    valueEl.addEventListener("input", recalc);
    grossEl.addEventListener("input", recalc);
    recalc();
  }

  /* ================================================================
     FAQ
     ================================================================ */
  $$(".q").forEach(function(q){
    var btn = $("button", q), body = $(".qb", q);
    if(!btn || !body) return;
    var inner = body.firstElementChild;
    btn.addEventListener("click", function(){
      var open = q.getAttribute("data-open") === "true";
      $$('.q[data-open="true"]').forEach(function(other){
        if(other !== q){
          other.setAttribute("data-open", "false");
          $("button", other).setAttribute("aria-expanded", "false");
          $(".qb", other).style.height = "0px";
        }
      });
      body.style.height = open ? "0px" : inner.offsetHeight + "px";
      q.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });
  window.addEventListener("resize", function(){
    var open = $('.q[data-open="true"]');
    if(open){ var b = $(".qb", open); b.style.height = b.firstElementChild.offsetHeight + "px"; }
  });

  /* ================================================================
     FORMS
     There is no backend here, so the form validates and shows its
     confirmation. Wire it to a form service before taking real leads.
     ================================================================ */
  $$("form[data-form]").forEach(function(form){
    var wrap = form.closest("[data-formwrap]") || form.parentElement;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var ok = true, first = null;
      $$("[required]", form).forEach(function(f){
        var bad = !f.value.trim() ||
          (f.type === "email" && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(f.value));
        f.style.borderBottomColor = bad ? "#B4534A" : "";
        if(bad){ ok = false; if(!first) first = f; }
      });
      if(!ok){ first.focus(); return; }
      wrap.classList.add("is-sent");
      var sent = $(".sent", wrap);
      if(sent) sent.scrollIntoView({behavior: reduce ? "auto" : "smooth", block:"center"});
    });
  });

  /* a viewing request arrives with the property in the query string */
  var ref = new URLSearchParams(location.search).get("ref");
  if(ref){
    var refProp = PROPS.filter(function(x){ return x.id === ref; })[0];
    var msg = $("#fmsg");
    if(refProp && msg && !msg.value){
      msg.value = "I would like to arrange a viewing of " + refProp.title + " in " + refProp.community + ".";
    }
  }
})();
