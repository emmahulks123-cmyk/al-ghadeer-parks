/* ================================================================
   BRAMWELL & PARTNERS, shared behaviour
   Plain vanilla JS, no build step. Every block checks for the
   elements it needs, so one file serves every page.
   ================================================================ */
(function(){
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = window.requestAnimationFrame;
  var MEDIA = window.BRAMWELL_MEDIA || "";
  var PROPS = window.BRAMWELL_PROPERTIES || [];
  var POSTS = window.BRAMWELL_POSTS || [];
  var CFG   = window.BRAMWELL_CONFIG || {};

  function $(s, r){ return (r || document).querySelector(s); }
  function $$(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }
  function aedShort(n){
    if(n >= 1000000) return "AED " + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "m";
    if(n >= 1000)    return "AED " + Math.round(n / 1000) + "k";
    return "AED " + Math.round(n).toLocaleString("en-US");
  }
  function aed(n){ return "AED " + Math.round(n).toLocaleString("en-US"); }

  /* price reads differently for each deal type */
  function priceLabel(p, full){
    var f = full ? aed : aedShort;
    if(p.deal === "Off plan") return "From " + f(p.price);
    if(p.deal === "Rental")   return f(p.price) + "<span class='per'> / year</span>";
    return f(p.price);
  }
  function dealClass(d){
    return d === "Off plan" ? "off" : d === "Rental" ? "rent" : "resale";
  }

  /* ---------- images fade in once decoded ---------- */
  function watchImages(root){
    $$(".ph img", root || document).forEach(function(img){
      if(img.dataset.w) return;
      img.dataset.w = "1";
      if(img.complete && img.naturalWidth){ img.classList.add("ready"); return; }
      img.addEventListener("load", function(){ img.classList.add("ready"); }, {once:true});
      /* on error the frame keeps its designed gradient, which is the point */
    });
  }
  watchImages();

  $$("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* ================================================================
     NAV
     ================================================================ */
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
    var here = location.pathname.split("/").pop() || "index.html";
    $$("#navLinks a:not(.btn)").forEach(function(a){
      var href = (a.getAttribute("href") || "").split("#")[0].split("?")[0];
      if(href && href === here) a.classList.add("here");
    });
  }

  /* ---------- scroll driven chrome: nav state and progress rule ---------- */
  var bar = $("#progress");
  var sTick = false;
  function onScroll(){
    if(sTick) return;
    sTick = true;
    raf(function(){
      sTick = false;
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if(nav) nav.classList.toggle("scrolled", y > 30);
      if(bar){
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h).toFixed(4) : 0) + ")";
      }
      if(!reduce) parallax(y);
    });
  }
  window.addEventListener("scroll", onScroll, {passive:true});

  /* ---------- parallax, a slow drift on marked frames ---------- */
  var pxEls = [];
  function collectParallax(){
    pxEls = $$("[data-parallax]").map(function(el){
      return { el: el, img: $("img", el) || el, amount: parseFloat(el.dataset.parallax) || 12 };
    });
  }
  function parallax(y){
    for(var i = 0; i < pxEls.length; i++){
      var o = pxEls[i], r = o.el.getBoundingClientRect();
      if(r.bottom < -200 || r.top > window.innerHeight + 200) continue;
      /* -1 above the fold, 0 centred, 1 below */
      var mid = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      o.img.style.transform = "scale(1.14) translate3d(0," + (mid * o.amount).toFixed(2) + "%,0)";
    }
  }
  collectParallax();

  /* ---------- hero entrance ---------- */
  var hero = $(".hero");
  if(hero) raf(function(){ raf(function(){ hero.classList.add("in"); }); });

  /* ================================================================
     REVEALS AND COUNTERS
     ================================================================ */
  var io = null;
  function observe(root){
    var els = $$(".rv:not(.in)", root || document);
    if(!("IntersectionObserver" in window) || reduce){
      els.forEach(function(e){ e.classList.add("in"); });
      $$("[data-count]", root || document).forEach(function(e){ e.textContent = e.dataset.count; });
      return;
    }
    if(!io){
      io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting) return;
          en.target.classList.add("in");
          io.unobserve(en.target);
          $$("[data-count]", en.target).forEach(countUp);
          if(en.target.hasAttribute("data-count")) countUp(en.target);
        });
      }, {rootMargin:"0px 0px -8% 0px", threshold:.08});
    }
    els.forEach(function(e){ io.observe(e); });
  }

  /* counts to the target, keeping any prefix or suffix in the label */
  function countUp(el){
    if(el.dataset.counted) return;
    el.dataset.counted = "1";
    var raw = el.dataset.count;
    var num = parseFloat(String(raw).replace(/[^0-9.]/g, ""));
    if(isNaN(num)){ el.textContent = raw; return; }
    var pre = String(raw).split(/[0-9]/)[0] || "";
    var post = String(raw).slice(pre.length + String(num).length) || "";
    var dec = (String(num).split(".")[1] || "").length;
    var t0 = null, dur = 1100;
    function step(t){
      if(!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (num * eased).toFixed(dec) + post;
      if(k < 1) raf(step); else el.textContent = raw;
    }
    raf(step);
  }
  observe();

  /* ================================================================
     PROPERTY CARD
     ================================================================ */
  function cardHTML(p){
    var facts = p.deal === "Off plan"
      ? "<span><i>Beds</i> " + esc(p.bedsRange || p.beds) + "</span>" +
        "<span><i>Handover</i> " + esc(p.offplan.handover) + "</span>" +
        "<span><i>Built</i> " + p.offplan.completionPct + "%</span>"
      : "<span><i>Beds</i> " + p.beds + "</span>" +
        "<span><i>Baths</i> " + p.baths + "</span>" +
        "<span><i>Area</i> " + p.area.toLocaleString("en-US") + " sq ft</span>";

    return '<a class="card-p rv" href="property.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="ph zoom">' +
        '<span class="tag ' + dealClass(p.deal) + '">' + esc(p.deal) + '</span>' +
        '<img alt="' + esc(p.title + ", " + p.community) + '" loading="lazy" decoding="async" src="' + MEDIA + p.images[0] + '">' +
      '</div>' +
      '<div class="card-p-body">' +
        '<span class="loc">' + esc(p.community) + ' &nbsp;·&nbsp; ' + esc(p.emirate) + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<span class="price">' + priceLabel(p) + '</span>' +
        '<div class="facts">' + facts + '</div>' +
      '</div>' +
    '</a>';
  }

  /* home page strips, filtered by deal */
  $$("[data-strip]").forEach(function(el){
    var want = el.dataset.strip;
    var n = parseInt(el.dataset.limit, 10) || 3;
    var set = PROPS.filter(function(p){ return want === "All" || p.deal === want; }).slice(0, n);
    el.innerHTML = set.map(cardHTML).join("");
    watchImages(el); observe(el);
  });

  /* ================================================================
     LISTINGS
     ================================================================ */
  var grid = $("#grid");
  if(grid){
    var state = { deal:"All", type:"All", emirate:"All", beds:0, sort:"price-desc" };
    var countEl = $("#fcount"), emptyEl = $("#empty");

    function apply(){
      var out = PROPS.filter(function(p){
        if(state.deal !== "All" && p.deal !== state.deal) return false;
        if(state.type !== "All" && p.type !== state.type) return false;
        if(state.emirate !== "All" && p.emirate !== state.emirate) return false;
        if(state.beds && p.beds < state.beds) return false;
        return true;
      });
      out.sort(function(a, b){
        if(state.sort === "price-asc")  return a.price - b.price;
        if(state.sort === "price-desc") return b.price - a.price;
        if(state.sort === "area-desc")  return b.area - a.area;
        return 0;
      });
      grid.innerHTML = out.map(cardHTML).join("");
      watchImages(grid);
      /* reveal at once after a filter change; a stagger here reads as lag */
      $$(".rv", grid).forEach(function(e){ e.classList.add("in"); });
      if(countEl) countEl.innerHTML = "<b>" + out.length + "</b> " + (out.length === 1 ? "property" : "properties");
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
      state = { deal:"All", type:"All", emirate:"All", beds:0, sort: sortSel ? sortSel.value : "price-desc" };
      $$("[data-filter]").forEach(function(b){
        b.setAttribute("aria-pressed", (b.dataset.value === "All" || b.dataset.value === "0") ? "true" : "false");
      });
      apply();
    });

    /* preselect from a link, e.g. properties.html?deal=Off%20plan or ?type=Villa */
    var q = new URLSearchParams(location.search);
    ["deal", "type"].forEach(function(key){
      var v = q.get(key);
      if(!v) return;
      var hit = $$('[data-filter="' + key + '"]').filter(function(b){ return b.dataset.value === v; })[0];
      if(hit){
        state[key] = v;
        $$('[data-filter="' + key + '"]').forEach(function(b){
          b.setAttribute("aria-pressed", b === hit ? "true" : "false");
        });
      }
    });
    apply();
  }

  /* ================================================================
     PROPERTY DETAIL
     Off plan, resale and rental show different things, because a
     buyer of each is deciding on different information.
     ================================================================ */
  var pd = $("#pd");
  if(pd){
    var id = new URLSearchParams(location.search).get("id");
    var p = PROPS.filter(function(x){ return x.id === id; })[0];

    if(!p){
      pd.innerHTML = '<div class="wrap pad"><div class="empty">' +
        '<h3>That property is no longer listed.</h3>' +
        '<p>It may have been sold, let or withdrawn. The current list is below.</p>' +
        '<a class="btn btn-solid" href="properties.html">View all properties</a></div></div>';
      document.title = "Property not found | Bramwell & Partners";
    } else {
      document.title = p.title + ", " + p.community + " | Bramwell & Partners";
      var meta = $("#pdDesc"); if(meta) meta.setAttribute("content", p.summary);

      /* ---- the spec strip, per deal ---- */
      var specs;
      if(p.deal === "Off plan"){
        specs = [
          [esc(p.bedsRange || p.beds), "Bedrooms"],
          [esc(p.offplan.handover), "Handover"],
          [p.offplan.completionPct + "%", "Built"],
          [p.offplan.bookingPct + "%", "On booking"]
        ];
      } else if(p.deal === "Rental"){
        specs = [
          [p.beds, "Bedrooms"],
          [p.baths, "Bathrooms"],
          [esc(p.rental.cheques), "Cheques"],
          [esc(p.rental.furnished), "Furnishing"]
        ];
      } else {
        specs = [
          [p.beds, "Bedrooms"],
          [p.baths, "Bathrooms"],
          [p.area.toLocaleString("en-US"), "Sq ft"],
          [p.parking, "Parking"]
        ];
      }

      /* ---- the sidebar rows, per deal ---- */
      var rows = [], extra = "";
      if(p.deal === "Off plan"){
        var o = p.offplan;
        rows = [
          ["Developer", esc(o.developer)],
          ["Handover", esc(o.handover)],
          ["Construction", o.completionPct + "% complete"],
          ["Unit mix", esc(o.unitMix)],
          ["Escrow", esc(o.escrow)],
          ["Registration", esc(o.registration)],
          ["Pricing", esc(o.launchPremium)]
        ];
        extra =
          '<div class="plan">' +
            '<h4>Payment plan</h4>' +
            '<div class="plan-bar" role="img" aria-label="Payment plan split">' +
              o.paymentPlan.map(function(s, i){
                return '<span class="s' + (i % 4) + '" style="flex:' + s.pct + '"><b>' + s.pct + '%</b></span>';
              }).join("") +
            '</div>' +
            '<ul class="plan-list">' +
              o.paymentPlan.map(function(s, i){
                return '<li><i class="s' + (i % 4) + '"></i><span>' + esc(s.stage) + '</span><b>' + s.pct + '%</b></li>';
              }).join("") +
            '</ul>' +
            '<p class="plan-note"><strong>Post handover:</strong> ' + esc(o.postHandover) + '</p>' +
          '</div>';
      } else if(p.deal === "Rental"){
        var r = p.rental;
        rows = [
          ["Annual rent", aed(r.annualRent)],
          ["Cheques", esc(r.cheques)],
          ["Deposit", esc(r.deposit)],
          ["Furnishing", esc(r.furnished)],
          ["Available", esc(r.availableFrom)],
          ["Minimum term", esc(r.minTerm)],
          ["Chiller", r.chillerIncluded ? "Included in rent" : "Paid by tenant"],
          ["Agency fee", esc(r.agencyFee)]
        ];
      } else {
        var s = p.resale;
        var grossRent = p.price * (s.grossYield / 100);
        var net = Math.max(0, grossRent - p.area * s.serviceCharge - grossRent * 0.05 - grossRent * 0.05);
        rows = [
          ["Completed", esc(s.completed)],
          ["Tenancy", esc(s.tenancy)],
          ["Service charge", "AED " + s.serviceCharge + " / sq ft"],
          ["Price per sq ft", "AED " + Math.round(p.price / p.area).toLocaleString("en-US")],
          ["Advertised gross", s.grossYield.toFixed(1) + "%"],
          ["Our net estimate", '<span class="hi">' + (net / p.price * 100).toFixed(1) + "%</span>"],
          ["Transfer fee, 4%", aed(p.price * 0.04)],
          ["Mortgageable", esc(s.mortgageable)]
        ];
      }

      var asideNote = p.deal === "Resale"
        ? "Net estimate deducts the building service charge, management at 5% and a 5% vacancy allowance. It is an estimate, not a forecast."
        : p.deal === "Off plan"
        ? "Construction percentage is taken from the latest developer progress report. Handover dates are the developer's stated target."
        : "Rent is quoted annually and excludes agency fee, deposit and utilities unless stated above.";

      pd.innerHTML =
      '<div class="wrap pad">' +
        '<a class="back mono" href="properties.html">&larr;&nbsp;&nbsp;All properties</a>' +
        '<div class="pd-top">' +
          '<div>' +
            '<span class="mono eyebrow">' + esc(p.community) + ' &nbsp;·&nbsp; ' + esc(p.emirate) + '</span>' +
            '<h1 class="pd-title">' + esc(p.title) + '</h1>' +
            '<span class="tag ' + dealClass(p.deal) + ' inline">' + esc(p.deal) + '</span>' +
          '</div>' +
          '<div class="pd-price">' + priceLabel(p, true) +
            '<small>' + esc(p.type) + ' &nbsp;·&nbsp; ' + esc(p.tenure) + '</small></div>' +
        '</div>' +

        '<div class="pd-gallery" id="gal">' +
          p.images.map(function(src, i){
            return '<div class="ph zoom g' + i + '" data-i="' + i + '" role="button" tabindex="0" aria-label="View image ' + (i+1) + ' of ' + p.images.length + '">' +
              '<img alt="' + esc(p.title) + ', image ' + (i+1) + '" ' + (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async" src="' + MEDIA + src + '"></div>';
          }).join("") +
        '</div>' +

        '<div class="specs">' + specs.map(function(s){
          return '<div><b>' + s[0] + '</b><small>' + s[1] + '</small></div>';
        }).join("") + '</div>' +

        '<div class="pd-body">' +
          '<div>' +
            '<div class="pd-prose">' +
              '<h2>The short version</h2>' +
              '<p>' + esc(p.summary) + '</p>' +
              '<p>' + esc(p.detail) + '</p>' +
            '</div>' +
            (p.deal === "Off plan" && p.offplan.amenities ?
              '<h3 class="pd-h">In the development</h3><div class="amen">' +
              p.offplan.amenities.map(function(a){ return '<span>' + esc(a) + '</span>'; }).join("") + '</div>' : "") +
            '<h3 class="pd-h">What stands out</h3>' +
            '<ul class="hl">' + p.highlights.map(function(h){ return '<li>' + esc(h) + '</li>'; }).join("") + '</ul>' +
            '<h3 class="pd-h">Our note on this one</h3>' +
            '<p class="pd-note">' + esc(p.note) + '</p>' +
          '</div>' +
          '<aside class="aside">' +
            '<h4>' + (p.deal === "Off plan" ? "The project" : p.deal === "Rental" ? "The terms" : "The numbers") + '</h4>' +
            '<div class="rows">' + rows.map(function(r){
              return '<div class="row"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>';
            }).join("") + '</div>' +
            extra +
            '<p class="aside-note">' + asideNote + '</p>' +
            '<a class="btn btn-solid full" href="contact.html?ref=' + encodeURIComponent(p.id) + '">' +
              (p.deal === "Rental" ? "Arrange a viewing" : p.deal === "Off plan" ? "Request the brochure" : "Arrange a viewing") +
            '</a>' +
          '</aside>' +
        '</div>' +
      '</div>';

      watchImages(pd); observe(pd); collectParallax();

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

      /* ---- others, preferring the same deal type ---- */
      var more = $("#more");
      if(more){
        var same = PROPS.filter(function(x){ return x.id !== p.id && x.deal === p.deal; });
        var rest = PROPS.filter(function(x){ return x.id !== p.id && x.deal !== p.deal; });
        more.innerHTML = same.concat(rest).slice(0, 3).map(cardHTML).join("");
        watchImages(more); observe(more);
      }
    }
  }

  /* ================================================================
     INSIGHTS: index and article
     ================================================================ */
  function fmtDate(iso){
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
  }
  function postCard(post, featured){
    return '<a class="card-b rv' + (featured ? " feat" : "") + '" href="post.html?id=' + encodeURIComponent(post.id) + '">' +
      '<div class="ph zoom"><img alt="' + esc(post.title) + '" loading="lazy" decoding="async" src="' + MEDIA + post.image + '"></div>' +
      '<div class="card-b-body">' +
        '<span class="loc">' + esc(post.category) + ' &nbsp;·&nbsp; ' + post.readMins + ' min read</span>' +
        '<h3>' + esc(post.title) + '</h3>' +
        '<p>' + esc(post.excerpt) + '</p>' +
        '<span class="date mono">' + fmtDate(post.date) + '</span>' +
      '</div></a>';
  }

  $$("[data-posts]").forEach(function(el){
    var n = parseInt(el.dataset.limit, 10) || POSTS.length;
    var skip = parseInt(el.dataset.skip, 10) || 0;
    var feat = el.dataset.posts === "featured";
    el.innerHTML = POSTS.slice(skip, skip + n).map(function(p){ return postCard(p, feat); }).join("");
    watchImages(el); observe(el);
  });

  var art = $("#article");
  if(art){
    var pid = new URLSearchParams(location.search).get("id");
    var post = POSTS.filter(function(x){ return x.id === pid; })[0];
    if(!post){
      art.innerHTML = '<div class="wrap pad"><div class="empty">' +
        '<h3>That article is not here.</h3><p>It may have moved. The full list is below.</p>' +
        '<a class="btn btn-solid" href="insights.html">All insights</a></div></div>';
      document.title = "Article not found | Bramwell & Partners";
    } else {
      document.title = post.title + " | Bramwell & Partners";
      var m = $("#artDesc"); if(m) m.setAttribute("content", post.excerpt);

      var body = post.body.map(function(b){
        if(b.h) return '<h2 class="rv">' + esc(b.h) + '</h2>';
        if(b.p) return '<p class="rv">' + esc(b.p) + '</p>';
        if(b.quote) return '<blockquote class="rv">' + esc(b.quote) +
          (b.by ? '<cite>' + esc(b.by) + '</cite>' : "") + '</blockquote>';
        if(b.list) return '<ul class="hl rv">' + b.list.map(function(i){ return '<li>' + esc(i) + '</li>'; }).join("") + '</ul>';
        if(b.img) return '<figure class="rv"><div class="ph"><img alt="' + esc(b.caption || "") + '" loading="lazy" src="' + MEDIA + b.img + '"></div>' +
          (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : "") + '</figure>';
        if(b.stat) return '<div class="statrow rv">' + b.stat.map(function(s){
          return '<div><b data-count="' + esc(s.n) + '">' + esc(s.n) + '</b><small>' + esc(s.l) + '</small></div>';
        }).join("") + '</div>';
        return "";
      }).join("");

      art.innerHTML =
        '<header class="art-head">' +
          '<div class="ph" data-parallax="10"><img alt="" decoding="async" src="' + MEDIA + post.image + '"></div>' +
          '<div class="art-head-in"><div class="wrap">' +
            '<a class="back mono light" href="insights.html">&larr;&nbsp;&nbsp;All insights</a>' +
            '<span class="mono eyebrow">' + esc(post.category) + '</span>' +
            '<h1>' + esc(post.title) + '</h1>' +
            '<p class="art-meta mono">' + fmtDate(post.date) + ' &nbsp;·&nbsp; ' + post.readMins + ' min read</p>' +
          '</div></div>' +
        '</header>' +
        '<div class="wrap pad"><div class="prose">' +
          '<p class="stand rv">' + esc(post.excerpt) + '</p>' + body +
        '</div></div>';

      watchImages(art); observe(art); collectParallax();

      var rel = $("#related");
      if(rel){
        rel.innerHTML = POSTS.filter(function(x){ return x.id !== post.id; }).slice(0, 3)
          .map(function(x){ return postCard(x); }).join("");
        watchImages(rel); observe(rel);
      }
    }
  }

  /* ================================================================
     YIELD CALCULATOR
     ================================================================ */
  var valueEl = $("#value"), grossEl = $("#gross");
  if(valueEl && grossEl){
    var SERVICE = 0.014, MGMT = 0.05, VAC = 0.05, DLD = 0.04;
    var out = {
      valueOut: $("#valueOut"), grossOut: $("#grossOut"), grossAed: $("#grossAed"),
      netAed: $("#netAed"), netPct: $("#netPct"), dldFee: $("#dldFee")
    };
    function recalc(){
      var v = parseFloat(valueEl.value), g = parseFloat(grossEl.value) / 100;
      var gr = v * g;
      var n = Math.max(0, gr - v * SERVICE - gr * MGMT - gr * VAC);
      out.valueOut.textContent = aed(v);
      out.grossOut.textContent = (g * 100).toFixed(1) + "%";
      out.grossAed.textContent = aed(gr);
      out.netAed.textContent   = aed(n);
      out.netPct.textContent   = ((n / v) * 100).toFixed(1) + "%";
      out.dldFee.textContent   = aed(v * DLD);
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
    collectParallax();
  });

  /* ================================================================
     LEAD FORMS
     Posts to the endpoint in CFG.endpoint, which verifies the
     reCAPTCHA token server side and emails the lead on. The captcha
     widget is rendered by Google once its script loads.
     ================================================================ */
  window.brOnCaptcha = function(){ /* reserved for the callback attribute */ };

  $$("form[data-form]").forEach(function(form){
    var wrap = form.closest("[data-formwrap]") || form.parentElement;
    var errBox = $(".form-error", wrap);
    var btn = $("button[type=submit]", form);

    function fail(msg){
      if(!errBox) return;
      errBox.textContent = msg;
      errBox.hidden = false;
    }

    form.addEventListener("submit", function(e){
      e.preventDefault();
      if(errBox) errBox.hidden = true;

      var ok = true, first = null;
      $$("[required]", form).forEach(function(f){
        var bad = !f.value.trim() ||
          (f.type === "email" && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(f.value));
        f.classList.toggle("bad", bad);
        if(bad){ ok = false; if(!first) first = f; }
      });
      if(!ok){ first.focus(); fail("Please check the highlighted fields."); return; }

      /* reCAPTCHA, when Google's script is present */
      var token = "";
      var hasCaptcha = typeof window.grecaptcha !== "undefined" && $(".g-recaptcha", form);
      if(hasCaptcha){
        try { token = window.grecaptcha.getResponse(); } catch(err){ token = ""; }
        if(!token){ fail("Please confirm you are not a robot."); return; }
      }

      var data = {};
      $$("input[name], select[name], textarea[name]", form).forEach(function(f){ data[f.name] = f.value; });
      data.token = token;
      data.page = location.pathname + location.search;

      if(btn){ btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending"; }

      fetch(CFG.endpoint || "api/lead.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(function(res){ return res.json().catch(function(){ return { ok: res.ok }; }); })
      .then(function(json){
        if(json && json.ok){
          wrap.classList.add("is-sent");
          var sent = $(".sent", wrap);
          if(sent) sent.scrollIntoView({behavior: reduce ? "auto" : "smooth", block:"center"});
        } else {
          fail((json && json.error) || "Something went wrong. Please email enquiries@bramwellre.com instead.");
          if(hasCaptcha) try { window.grecaptcha.reset(); } catch(err){}
        }
      })
      .catch(function(){
        /* no backend yet, for example when previewing from a local file */
        fail("The form could not reach the server. Please email enquiries@bramwellre.com.");
        if(hasCaptcha) try { window.grecaptcha.reset(); } catch(err){}
      })
      .then(function(){
        if(btn){ btn.disabled = false; btn.textContent = btn.dataset.label || "Send"; }
      });
    });

    $$("input, select, textarea", form).forEach(function(f){
      f.addEventListener("input", function(){ f.classList.remove("bad"); });
    });
  });

  /* a viewing request arrives with the property in the query string */
  var ref = new URLSearchParams(location.search).get("ref");
  if(ref){
    var rp = PROPS.filter(function(x){ return x.id === ref; })[0];
    var msg = $("#fmsg");
    if(rp && msg && !msg.value){
      msg.value = (rp.deal === "Off plan"
        ? "Please send me the full brochure and payment plan for "
        : "I would like to arrange a viewing of ") + rp.title + " in " + rp.community + ".";
    }
  }

  onScroll();
})();
