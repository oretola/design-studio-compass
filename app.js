// DJDS Design Studio Compass — single-page app logic.
// Data comes from data.js (PHASES, TYPES, NEEDS, TEAM_PASSWORD).

(function () {
  "use strict";

  // ---- Per-phase color + icon (presentation; keyed by phase id) ----
  const PHASE_STYLE = {
    "concept": {
      color: "#c2410c",
      icon: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M8.4 14a5 5 0 1 1 7.2 0c-.6.6-1.1 1.3-1.1 2.2H9.5c0-.9-.5-1.6-1.1-2.2z"/>',
    },
    "schematic": {
      color: "#b45309",
      icon: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
    },
    "design-dev": {
      color: "#0d9488",
      icon: '<path d="M12 3l8 4.5L12 12 4 7.5z"/><path d="M4 12l8 4.5L20 12"/><path d="M4 16.5L12 21l8-4.5"/>',
    },
    "entitlements": {
      color: "#4338ca",
      icon: '<path d="M12 3l2.1 1.4 2.5-.3 1 2.3 2.1 1.4-.6 2.5.6 2.5-2.1 1.4-1 2.3-2.5-.3L12 21l-2.1-1.4-2.5.3-1-2.3L4.3 16l.6-2.5-.6-2.5 2.1-1.4 1-2.3 2.5.3z"/><path d="M9 12l2 2 4-4"/>',
    },
    "construction-docs": {
      color: "#2563eb",
      icon: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12h5"/><path d="M9.5 15.5h5"/>',
    },
    "bidding": {
      color: "#7c3aed",
      icon: '<path d="M4 13l7.4-7.4a2 2 0 0 1 1.4-.6H19a1 1 0 0 1 1 1v6.2a2 2 0 0 1-.6 1.4L12 21a1.5 1.5 0 0 1-2.1 0L4 15.1a1.5 1.5 0 0 1 0-2.1z"/><circle cx="15.4" cy="8.6" r="1.3"/>',
    },
    "construction-admin": {
      color: "#db2777",
      icon: '<path d="M2.5 18.5h19"/><path d="M4.5 18a7.5 7.5 0 0 1 15 0"/><path d="M9.5 5.5h5l1 5h-7z"/>',
    },
    "ffe": {
      color: "#15803d",
      icon: '<path d="M5 12V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3.5 12.5a2 2 0 0 1 2 2v2.5h13V14.5a2 2 0 0 1 2-2"/><path d="M6 19.5v-2M18 19.5v-2"/>',
    },
  };

  function iconSvg(phaseId) {
    const s = PHASE_STYLE[phaseId];
    const paths = s ? s.icon : "";
    return (
      '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      paths +
      "</svg>"
    );
  }
  function phaseColor(phaseId) {
    return (PHASE_STYLE[phaseId] && PHASE_STYLE[phaseId].color) || "#c2410c";
  }

  // ---- App state ----
  const state = {
    section: "process", // "values" | "process"
    view: "phase",      // "phase" | "type" | "question"
    search: "",
    needFilter: null,   // need id when filtering via a question chip
    openPhase: null,    // phase id when a tile is opened
    openSub: null,      // subphase id when a one-pager is opened
    calOffset: 0,       // months from the current month, for the calendar view
  };

  // ---- Sign-in gate ----
  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const gateForm = document.getElementById("gate-form");
  const gateInput = document.getElementById("gate-input");
  const gateError = document.getElementById("gate-error");

  gateForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (gateInput.value === TEAM_PASSWORD) {
      gate.hidden = true;
      app.hidden = false;
      render();
    } else {
      gateError.hidden = false;
      gateInput.value = "";
      gateInput.focus();
    }
  });

  // ---- Theme toggle ----
  const themeToggle = document.getElementById("theme-toggle");
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/></svg>';
  function syncThemeButton() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    // Show the icon for the theme you'd switch TO.
    themeToggle.querySelector(".theme-icon").innerHTML = isDark ? SUN : MOON;
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }
  themeToggle.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("dsc-theme", next); } catch (e) {}
    syncThemeButton();
  });
  syncThemeButton();

  // ---- Data helpers ----
  // Templates/guides + case-study examples, flattened. Examples are tagged
  // with the "Case Study" type so they surface in By type / search too.
  function subItems(sub) {
    const examples = (sub.examples || []).map(function (e) {
      return { title: e.title, type: "Case Study", kind: e.kind, needs: [], driveUrl: e.driveUrl };
    });
    return sub.resources.concat(examples);
  }

  function allResources() {
    const out = [];
    PHASES.forEach(function (phase) {
      phase.subphases.forEach(function (sub) {
        subItems(sub).forEach(function (r) {
          out.push(Object.assign({}, r, {
            phaseId: phase.id,
            phaseName: phase.name,
            subName: sub.name,
          }));
        });
      });
    });
    return out;
  }

  function matchesSearchNeed(r) {
    if (state.needFilter && !(r.needs || []).includes(state.needFilter)) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = (r.title + " " + r.type + " " + r.phaseName + " " + r.subName).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  function phaseTotal(phase) {
    return phase.subphases.reduce(function (n, s) { return n + subItems(s).length; }, 0);
  }

  function plural(n) { return n === 1 ? "1 resource" : n + " resources"; }

  // Small inline marker so generated/sample text is never mistaken for real content.
  function phTag() { return '<span class="ph-tag">Placeholder</span>'; }

  // ---- Render: a single resource row (optionally tagged with its phase) ----
  function resourceRow(r, showPhase) {
    const phaseTag = showPhase
      ? '<span class="row-phase" style="--phase:' + phaseColor(r.phaseId) + '">' + r.phaseName + "</span>"
      : "";
    return (
      '<div class="resource">' +
      '<span class="type-tag">' + r.type + "</span>" +
      '<span class="resource-title">' + r.title + "</span>" +
      phaseTag +
      '<a class="resource-open" href="' + r.driveUrl + '" target="_blank" rel="noopener">Open in Drive ↗</a>' +
      "</div>"
    );
  }

  // ---- View: phase tiles (the landing) ----
  function renderTiles() {
    const tiles = PHASES.map(function (phase, i) {
      const count = phaseTotal(phase);
      return (
        '<button class="tile" type="button" data-phase="' + phase.id + '" style="--phase:' + phaseColor(phase.id) + '" ' +
        'aria-label="' + phase.name + " — " + plural(count) + '">' +
        '<span class="tile-top">' +
        '<span class="tile-num">' + (i + 1) + "</span>" +
        '<span class="tile-icon">' + iconSvg(phase.id) + "</span>" +
        "</span>" +
        '<span class="tile-name">' + phase.name + "</span>" +
        '<span class="tile-count">' + plural(count) + "</span>" +
        '<span class="tile-reveal" aria-hidden="true">' +
        '<span class="tile-blurb">' + phase.blurb + "</span>" +
        '<span class="tile-cta">View resources →</span>' +
        "</span>" +
        "</button>"
      );
    }).join("");

    const chips =
      '<div class="tasks">' +
      '<span class="tasks-label">Or jump to a task</span>' +
      '<div class="tasks-row">' +
      NEEDS.map(function (n) {
        return '<button class="task-chip" type="button" data-need="' + n.id + '">' + n.label + "</button>";
      }).join("") +
      "</div></div>";

    document.getElementById("content").innerHTML =
      '<div class="tile-grid">' + tiles + "</div>" + chips;

    document.querySelectorAll(".tile").forEach(function (t) {
      t.addEventListener("click", function () {
        state.openPhase = t.getAttribute("data-phase");
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    document.querySelectorAll(".task-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.needFilter = chip.getAttribute("data-need");
        state.view = "question";
        render();
      });
    });
  }

  // ---- Breadcrumb wayfinding ----
  function breadcrumbHtml(segments) {
    return (
      '<nav class="crumbs" aria-label="Breadcrumb">' +
      segments
        .map(function (seg, i) {
          const sep = i > 0 ? '<span class="crumb-sep" aria-hidden="true">›</span>' : "";
          const last = i === segments.length - 1;
          if (last || !seg.nav) {
            return sep + '<span class="crumb-current" aria-current="page">' + seg.label + "</span>";
          }
          return sep + '<button class="crumb" type="button" data-nav="' + seg.nav + '">' + seg.label + "</button>";
        })
        .join("") +
      "</nav>"
    );
  }
  function wireCrumbs() {
    document.querySelectorAll(".crumb[data-nav]").forEach(function (c) {
      c.addEventListener("click", function () {
        const nav = c.getAttribute("data-nav");
        if (nav === "root") { state.openPhase = null; state.openSub = null; }
        else if (nav === "phase") { state.openSub = null; }
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ---- View: one phase opened (section cards) ----
  function renderPhaseDetail(phaseId) {
    const phase = PHASES.find(function (p) { return p.id === phaseId; });
    if (!phase) { state.openPhase = null; return renderTiles(); }

    const idx = PHASES.indexOf(phase) + 1;
    const count = phaseTotal(phase);

    // Every phase renders the same way: a list of section cards.
    const cards = phase.subphases
      .map(function (sub, i) {
        return (
          '<button class="subcard" type="button" data-sub="' + sub.id + '" style="--phase:' + phaseColor(phase.id) + '" ' +
          'aria-label="Open: ' + sub.name + '">' +
          '<span class="subcard-step">' + (i + 1) + "</span>" +
          '<span class="subcard-text">' +
          '<span class="subcard-name">' + sub.name + "</span>" +
          '<span class="subcard-summary">' + (sub.summary || "") + "</span>" +
          "</span>" +
          '<span class="subcard-cta">' + plural(subItems(sub).length) + " · Open →</span>" +
          "</button>"
        );
      })
      .join("");

    document.getElementById("content").innerHTML =
      breadcrumbHtml([{ label: "Process & Resources", nav: "root" }, { label: phase.name }]) +
      '<div class="phase-detail" style="--phase:' + phaseColor(phase.id) + '">' +
      '<header class="detail-head">' +
      '<span class="detail-icon">' + iconSvg(phase.id) + "</span>" +
      "<div>" +
      '<span class="detail-kicker">Phase ' + idx + " of " + PHASES.length + "</span>" +
      "<h2>" + phase.name + "</h2>" +
      '<p class="detail-blurb">' + phase.blurb + "</p>" +
      "</div>" +
      '<span class="detail-count">' + plural(count) + "</span>" +
      "</header>" +
      '<div class="subcard-list">' + cards + "</div>" +
      "</div>";

    wireCrumbs();
    document.querySelectorAll(".subcard").forEach(function (card) {
      card.addEventListener("click", function () {
        state.openSub = card.getAttribute("data-sub");
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ---- View: a subphase one-pager ----
  function renderOnePager(phaseId, subId) {
    const phase = PHASES.find(function (p) { return p.id === phaseId; });
    const sub = phase && phase.subphases.find(function (s) { return s.id === subId; });
    if (!sub) { state.openSub = null; return renderPhaseDetail(phaseId); }

    const op = sub.onePager || {};
    const stepIdx = phase.subphases.indexOf(sub) + 1;
    const color = phaseColor(phase.id);

    const tagged = sub.resources.map(function (r) {
      return Object.assign({}, r, { phaseId: phase.id, phaseName: phase.name });
    });
    const primary = tagged[0];
    const rest = tagged.slice(1);

    // #5 — lead with the primary "do this now" resource.
    const startHere = primary
      ? '<a class="op-start" href="' + primary.driveUrl + '" target="_blank" rel="noopener">' +
        '<span class="op-start-label">Start here</span>' +
        '<span class="op-start-title">' + primary.title + "</span>" +
        '<span class="op-start-meta">' + primary.type + " · Open in Drive ↗</span>" +
        "</a>"
      : "";

    const overview = op.overview ||
      ("[Placeholder] This one-pager for " + sub.name + " will explain how this part of " +
        phase.name + " works. Content to be added.");

    const statsAside = (op.stats && op.stats.length)
      ? '<aside class="op-stats-col"><h3 class="op-stats-title">Stats</h3><dl class="op-stats">' +
        op.stats.map(function (s) { return '<div class="op-stat"><dt>' + s.label + "</dt><dd>" + s.value + "</dd></div>"; }).join("") +
        "</dl></aside>"
      : "";

    const stepsSection = (op.steps && op.steps.length)
      ? '<section class="op-section"><h3>Steps</h3><ol class="op-steps">' +
        op.steps.map(function (st) { return "<li>" + st + "</li>"; }).join("") +
        "</ol></section>"
      : "";

    const restSection = rest.length
      ? '<section class="op-section"><h3>More in this section</h3>' +
        rest.map(function (r) { return resourceRow(r, false); }).join("") +
        "</section>"
      : "";

    // Case studies & examples — finished work showing how this is done at this phase.
    const exampleRows = (sub.examples || [])
      .map(function (e) {
        return (
          '<a class="example-row" href="' + e.driveUrl + '" target="_blank" rel="noopener">' +
          '<span class="example-tag">Example</span>' +
          '<span class="example-kind">' + e.kind + "</span>" +
          '<span class="example-title">' + e.title + "</span>" +
          '<span class="example-open">Open in Drive ↗</span>' +
          "</a>"
        );
      })
      .join("");
    const examplesSection =
      '<section class="op-section op-examples">' +
      "<h3>Case studies &amp; examples</h3>" +
      '<p class="op-section-note">Finished work from past projects — examples of how this is done during ' +
      phase.name + ". " + phTag() + "</p>" +
      (exampleRows || '<p class="op-empty">[Placeholder] Examples for this phase will be added here.</p>') +
      "</section>";

    document.getElementById("content").innerHTML =
      breadcrumbHtml([
        { label: "Process & Resources", nav: "root" },
        { label: phase.name, nav: "phase" },
        { label: sub.name },
      ]) +
      '<article class="onepager" style="--phase:' + color + '">' +
      '<header class="op-hero">' +
      '<span class="op-hero-icon">' + iconSvg(phase.id) + "</span>" +
      '<div class="op-hero-text">' +
      '<span class="op-kicker">' + phase.name + " · Step " + stepIdx + " of " + phase.subphases.length + "</span>" +
      "<h2>" + sub.name + "</h2>" +
      '<p class="op-summary">' + (sub.summary || "") + "</p>" +
      "</div>" +
      "</header>" +
      '<div class="op-body">' +
      statsAside +
      '<div class="op-main">' +
      startHere +
      '<section class="op-section"><h3>Overview</h3><p>' + overview + "</p></section>" +
      stepsSection +
      restSection +
      examplesSection +
      "</div>" +
      "</div>" +
      "</article>";

    wireCrumbs();
  }

  // ---- View: grouped (by type or by question) ----
  function renderGrouped(groupKey, groupOrder, labelFor) {
    const resources = allResources().filter(matchesSearchNeed);
    let html = "";
    groupOrder.forEach(function (key) {
      const items = resources.filter(function (r) {
        if (groupKey === "type") return r.type === key;
        if (groupKey === "need") return (r.needs || []).includes(key);
        return false;
      });
      if (!items.length) return;
      html +=
        '<div class="group-card">' +
        '<h2 class="group-title">' + labelFor(key) +
        ' <span class="group-count">' + items.length + "</span></h2>" +
        items.map(function (r) { return resourceRow(r, true); }).join("") +
        "</div>";
    });
    document.getElementById("content").innerHTML = html || emptyState();
  }

  // ---- View: search results (flat, across everything) ----
  function renderSearchResults() {
    const items = allResources().filter(matchesSearchNeed);
    if (!items.length) {
      document.getElementById("content").innerHTML = emptyState();
      return;
    }
    document.getElementById("content").innerHTML =
      '<div class="results-list">' +
      '<h2 class="results-head">Results for "' + state.search + '" <span class="group-count">' + items.length + "</span></h2>" +
      items.map(function (r) { return resourceRow(r, true); }).join("") +
      "</div>";
  }

  function emptyState() {
    const what = state.search ? '"' + state.search + '"' : "the current filter";
    return (
      '<div class="empty-card">' +
      '<p class="empty-title">No resources match ' + what + ".</p>" +
      '<button class="empty-reset" type="button" id="empty-reset">Clear search &amp; filters</button>' +
      "</div>"
    );
  }

  // ---- View: Values & Culture (top-level) ----
  function renderValues() {
    const valueCards = VALUES.map(function (v) {
      return (
        '<div class="value-card">' +
        '<h3 class="value-title">' + v.title + "</h3>" +
        '<p class="value-body">' + v.body + "</p>" +
        "</div>"
      );
    }).join("");

    // Design Studio Ethos — 8 hover squares (reveal on hover/focus).
    const ethosSquares = ETHOS.map(function (e) {
      return (
        '<div class="ethos-square" tabindex="0">' +
        '<span class="ethos-title">' + e.title + "</span>" +
        '<span class="ethos-reveal" aria-hidden="true"><span class="ethos-body">' + e.body + "</span></span>" +
        "</div>"
      );
    }).join("");

    const cultureCards = CULTURE.map(function (c) {
      return (
        '<div class="culture-item">' +
        '<h4 class="culture-title">' + c.title + "</h4>" +
        '<p class="culture-body">' + c.body + "</p>" +
        "</div>"
      );
    }).join("");

    document.getElementById("content").innerHTML =
      '<section class="values">' +
      '<div class="values-intro">' +
      '<span class="values-kicker">' + VALUES_INTRO.kicker + " " + phTag() + "</span>" +
      '<h2 class="values-statement">' + VALUES_INTRO.statement + "</h2>" +
      '<p class="values-lead">' + VALUES_INTRO.body + "</p>" +
      "</div>" +
      '<h3 class="values-section-head">Our values ' + phTag() + "</h3>" +
      '<div class="value-grid">' + valueCards + "</div>" +
      '<h3 class="values-section-head">Design Studio Ethos ' + phTag() + "</h3>" +
      '<p class="values-note">Hover (or focus) a square to read more.</p>' +
      '<div class="ethos-grid">' + ethosSquares + "</div>" +
      '<h3 class="values-section-head">Our culture ' + phTag() + "</h3>" +
      '<div class="culture-grid">' + cultureCards + "</div>" +
      "</section>";
  }

  // ---- View: Design Studio Calendar (top-level) ----
  function renderCalendar() {
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Resolve placeholder events (day offsets) to real dates anchored to today.
    const events = EVENTS.map(function (e) {
      return {
        title: e.title,
        kind: e.kind,
        time: e.time,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + e.inDays),
      };
    });

    function sameDay(a, b) {
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    // Month being viewed.
    const view = new Date(today.getFullYear(), today.getMonth() + state.calOffset, 1);
    const vy = view.getFullYear();
    const vm = view.getMonth();
    const firstWeekday = view.getDay();
    const daysInMonth = new Date(vy, vm + 1, 0).getDate();

    let cells = WD.map(function (w) { return '<div class="cal-wd">' + w + "</div>"; }).join("");
    for (let i = 0; i < firstWeekday; i++) cells += '<div class="cal-cell cal-empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(vy, vm, d);
      const isToday = sameDay(dayDate, today);
      const evs = events.filter(function (ev) { return sameDay(ev.date, dayDate); });
      const labels = evs.map(function (ev) { return '<span class="cal-ev">' + ev.title + "</span>"; }).join("");
      cells +=
        '<div class="cal-cell' + (isToday ? " is-today" : "") + (evs.length ? " has-ev" : "") + '">' +
        '<span class="cal-num">' + d + "</span>" +
        labels +
        "</div>";
    }

    const upcoming = events
      .filter(function (ev) { return ev.date >= today; })
      .sort(function (a, b) { return a.date - b.date; });
    const upcomingHtml = upcoming
      .map(function (ev) {
        return (
          '<div class="cal-up">' +
          '<span class="cal-up-date"><span class="cal-up-mon">' + MONTHS[ev.date.getMonth()].slice(0, 3) + "</span>" +
          '<span class="cal-up-day">' + ev.date.getDate() + "</span></span>" +
          '<span class="cal-up-text"><span class="cal-up-title">' + ev.title + "</span>" +
          '<span class="cal-up-meta">' + ev.time + " · " + ev.kind + "</span></span>" +
          "</div>"
        );
      })
      .join("");

    document.getElementById("content").innerHTML =
      '<section class="calendar">' +
      '<div class="cal-head">' +
      '<h2 class="cal-title">Design Studio Calendar ' + phTag() + "</h2>" +
      '<div class="cal-nav">' +
      '<button class="cal-navbtn" id="cal-prev" type="button" aria-label="Previous month">‹</button>' +
      '<span class="cal-month">' + MONTHS[vm] + " " + vy + "</span>" +
      '<button class="cal-navbtn" id="cal-next" type="button" aria-label="Next month">›</button>' +
      "</div>" +
      "</div>" +
      '<div class="cal-grid">' + cells + "</div>" +
      '<h3 class="cal-up-head">Upcoming events</h3>' +
      '<div class="cal-up-list">' + (upcomingHtml || '<p class="op-empty">No upcoming events.</p>') + "</div>" +
      "</section>";

    document.getElementById("cal-prev").addEventListener("click", function () { state.calOffset -= 1; render(); });
    document.getElementById("cal-next").addEventListener("click", function () { state.calOffset += 1; render(); });
  }

  // ---- Main render ----
  function render() {
    // Top-level section active state.
    document.querySelectorAll(".topnav-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-section") === state.section);
    });
    const filterbar = document.getElementById("filterbar");
    const browseHead = document.getElementById("browse-head");

    // Values & Culture and the Calendar are standalone top-level sections.
    if (state.section === "values" || state.section === "calendar") {
      filterbar.hidden = true;
      if (browseHead) browseHead.hidden = true;
      if (state.section === "values") renderValues();
      else renderCalendar();
      document.getElementById("result-count").textContent = "";
      document.getElementById("clear-filter").hidden = true;
      return;
    }
    filterbar.hidden = false;
    if (browseHead) browseHead.hidden = false;

    // Filter bar active state.
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-view") === state.view);
    });

    if (state.search) {
      renderSearchResults();
    } else if (state.view === "phase") {
      if (state.openPhase && state.openSub) renderOnePager(state.openPhase, state.openSub);
      else if (state.openPhase) renderPhaseDetail(state.openPhase);
      else renderTiles();
    } else if (state.view === "type") {
      renderGrouped("type", TYPES, function (t) { return t === "Case Study" ? "Case studies &amp; examples" : t + "s"; });
    } else if (state.view === "question") {
      renderGrouped("need", NEEDS.map(function (n) { return n.id; }), function (id) {
        const n = NEEDS.find(function (x) { return x.id === id; });
        return n ? n.label : id;
      });
    }

    updateMeta();
    wireEmptyReset();
  }

  function updateMeta() {
    const total = allResources().filter(matchesSearchNeed).length;
    document.getElementById("result-count").textContent = plural(total);

    const clearBtn = document.getElementById("clear-filter");
    const labels = [];
    if (state.openPhase) {
      const p = PHASES.find(function (x) { return x.id === state.openPhase; });
      labels.push(p ? p.name : state.openPhase);
      if (state.openSub && p) {
        const sub = p.subphases.find(function (s) { return s.id === state.openSub; });
        if (sub) labels.push(sub.name);
      }
    }
    if (state.needFilter) {
      const n = NEEDS.find(function (x) { return x.id === state.needFilter; });
      labels.push(n ? n.label : state.needFilter);
    }
    if (state.search) labels.push('"' + state.search + '"');

    if (labels.length) {
      clearBtn.hidden = false;
      clearBtn.textContent = "Clear: " + labels.join(" · ") + " ✕";
    } else {
      clearBtn.hidden = true;
    }
  }

  function clearAll() {
    state.search = "";
    state.needFilter = null;
    state.openPhase = null;
    state.openSub = null;
    document.getElementById("search").value = "";
    render();
  }

  function wireEmptyReset() {
    const btn = document.getElementById("empty-reset");
    if (btn) btn.addEventListener("click", clearAll);
  }

  // ---- Controls ----
  document.querySelectorAll(".topnav-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.section = btn.getAttribute("data-section");
      // Returning to a top-level section lands on its index, not a deep view.
      state.openPhase = null;
      state.openSub = null;
      state.calOffset = 0;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.view = btn.getAttribute("data-view");
      state.openPhase = null;
      state.openSub = null;
      state.needFilter = null;
      render();
    });
  });

  document.getElementById("search").addEventListener("input", function (e) {
    state.search = e.target.value.trim();
    // Searching is about resources — jump to Process & Resources.
    if (state.search) state.section = "process";
    render();
  });

  document.getElementById("clear-filter").addEventListener("click", clearAll);

  // ---- Placeholder AI assistant (future integration) ----
  (function initChat() {
    const fab = document.getElementById("chat-fab");
    const panel = document.getElementById("chat-panel");
    const closeBtn = document.getElementById("chat-close");
    const messages = document.getElementById("chat-messages");
    const suggests = document.getElementById("chat-suggests");
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-text");
    if (!fab || !panel) return;

    const SUGGESTIONS = [
      "How do I start a new project?",
      "Where are the cost estimate templates?",
      "What happens during Entitlements & Approvals?",
    ];
    const INTRO = "Hi! I'm the Design Studio Assistant — coming soon. Tell me what you're trying to do and I'll point you to the right phase, template, or example.";
    const CANNED = "[Placeholder] I'm not connected to a real assistant yet. In the future I'll answer directly and link you to the right phase, template, or example. For now, use the tabs above to browse.";
    let seeded = false;

    function addMessage(role, text) {
      const el = document.createElement("div");
      el.className = "chat-msg chat-msg-" + role;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function renderSuggestions() {
      suggests.innerHTML = SUGGESTIONS.map(function (s) {
        return '<button class="chat-suggest" type="button">' + s + "</button>";
      }).join("");
      suggests.querySelectorAll(".chat-suggest").forEach(function (b) {
        b.addEventListener("click", function () { sendMessage(b.textContent); });
      });
    }

    function seed() {
      if (seeded) return;
      seeded = true;
      addMessage("assistant", INTRO);
      renderSuggestions();
    }

    function sendMessage(text) {
      text = (text || "").trim();
      if (!text) return;
      addMessage("user", text);
      input.value = "";
      suggests.hidden = true;
      addMessage("assistant", CANNED);
    }

    function openChat() {
      seed();
      panel.hidden = false;
      fab.setAttribute("aria-expanded", "true");
      input.focus();
    }
    function closeChat() {
      panel.hidden = true;
      fab.setAttribute("aria-expanded", "false");
      fab.focus();
    }

    fab.addEventListener("click", function () { if (panel.hidden) openChat(); else closeChat(); });
    closeBtn.addEventListener("click", closeChat);
    form.addEventListener("submit", function (e) { e.preventDefault(); sendMessage(input.value); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) closeChat();
    });
  })();
})();
