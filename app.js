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
    view: "phase",      // "phase" | "question"
    search: "",
    typeFilter: null,   // resource type when filtering by type (null = all)
    needFilter: null,   // need id when filtering via a question chip
    openPhase: null,    // phase id when a tile is opened
    openSub: null,      // subphase id when a one-pager is opened
    openLens: null,     // lens id within a lens-structured subphase (e.g. Predesign)
    openStudioWide: false, // viewing the studio-wide catch-all list
    openStandard: null, // standard id when a standard page is opened
    calOffset: 0,       // months from the current month, for the calendar view
  };

  // Suggested prompts under the ask bar (each just runs a search for now).
  const ASK_SUGGESTIONS = [
    "Start a new project",
    "Cost estimate templates",
    "Massing diagram",
    "Community engagement",
    "Site analysis",
  ];

  // Icons for the three Concept lenses.
  const LENS_ICON = {
    "land": '<path d="M3 18l5-8 4 5 3-4 6 7"/><path d="M3 21h18"/>',
    "humans": '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M19.5 20a5.5 5.5 0 0 0-3.4-5.1"/>',
    "finances": '<circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M14.5 9.3c-.5-.8-1.4-1.3-2.5-1.3-1.4 0-2.3.8-2.3 1.9 0 1 .8 1.6 2.3 1.9s2.6.9 2.6 2-1 2-2.4 2c-1.2 0-2.1-.5-2.6-1.4"/>',
  };
  function lensIconSvg(id) {
    return (
      '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (LENS_ICON[id] || "") +
      "</svg>"
    );
  }

  // Icons for Studio Standards (deliverable types).
  const STD_ICON = {
    "massing": '<path d="M12 3l8 4.5L12 12 4 7.5z"/><path d="M4 12l8 4.5L20 12"/><path d="M4 16.5L12 21l8-4.5"/>',
    "program": '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    "rendering": '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5L5 20"/>',
    "plan-graphics": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>',
    "presentation": '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  };
  function stdIconSvg(id) {
    return (
      '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (STD_ICON[id] || "") +
      "</svg>"
    );
  }

  // ---- Sign-in gate ----
  // Temporarily disabled — set to true to re-enable the shared-password gate.
  const GATE_ENABLED = false;

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
    // Studio-wide (phase-agnostic) resources also live in the index.
    STUDIO_WIDE.forEach(function (r) {
      out.push(Object.assign({}, r, { phaseId: "studio-wide", phaseName: "Studio-wide", subName: "" }));
    });
    return out;
  }

  function matchesSearchNeed(r) {
    if (state.typeFilter && r.type !== state.typeFilter) return false;
    if (state.needFilter && !(r.needs || []).includes(state.needFilter)) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = (r.title + " " + r.type + " " + r.phaseName + " " + r.subName + " " + (r.tags || []).join(" ")).toLowerCase();
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

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Image placeholder slot — ready for real project photography.
  function imageSlot(label, cls) {
    return (
      '<div class="img-slot ' + (cls || "") + '">' +
      '<svg class="img-slot-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5L5 20"/></svg>' +
      '<span class="img-slot-label">' + label + " " + phTag() + "</span>" +
      "</div>"
    );
  }

  // "Why this matters" — the teaching layer, surfaced across the app.
  function whyCallout(label, text) {
    if (!text) return "";
    return (
      '<div class="why-callout">' +
      '<span class="why-label">' + label + "</span>" +
      "<p>" + text + "</p>" +
      "</div>"
    );
  }

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

  // ---- View: Process home (recently updated + phase browse) ----
  function renderHome() {
    const recent = WHATS_NEW.map(function (w) {
      return (
        '<li class="recent-item">' +
        '<span class="recent-dot" aria-hidden="true"></span>' +
        '<span class="recent-text">' +
        '<span class="recent-title">' + w.title + "</span>" +
        '<span class="recent-meta">' + w.note + " · " + w.where + " · " + w.daysAgo + "d ago</span>" +
        "</span></li>"
      );
    }).join("");
    const recentSection =
      '<section class="home-block"><h2 class="home-h">Recently updated ' + phTag() + "</h2>" +
      '<ul class="recent-list">' + recent + "</ul></section>";

    // Phases as hand-drawn circles with icons — a clean two rows of four.
    const circles = PHASES.map(function (p) {
      const featured = p.id === "concept";
      return (
        '<button class="phase-circle' + (featured ? " is-built" : "") + '" type="button" data-phase="' + p.id + '" ' +
        'style="--phase:' + phaseColor(p.id) + '" aria-label="' + p.name + (featured ? "" : " — in progress") + '">' +
        '<span class="pc-ring"><span class="pc-ic">' + iconSvg(p.id) + "</span></span>" +
        '<span class="pc-name">' + p.name + "</span>" +
        (featured
          ? '<span class="pc-tag">Built out · ' + plural(phaseTotal(p)) + "</span>"
          : '<span class="pc-tag pc-tag-stub">In progress</span>') +
        "</button>"
      );
    }).join("");

    const arcSection =
      '<section class="home-block">' +
      '<h2 class="home-h">How a project moves</h2>' +
      '<p class="arc-note">Eight phases, concept to close-out — though the work loops and overlaps, it’s rarely a straight line. Only <strong>Concept Development</strong> is built out yet. ' + phTag() + "</p>" +
      '<div class="phase-circles">' + circles + "</div>" +
      "</section>";

    const studioWide =
      '<button class="studio-wide-card" type="button" data-phase="__studio">' +
      '<span class="sw-icon">' + studioWideIcon() + "</span>" +
      '<span class="sw-text"><span class="sw-name">Studio-wide resources</span>' +
      '<span class="sw-sub">Guidelines &amp; standards that apply across every phase</span></span>' +
      '<span class="sw-cta">' + plural(STUDIO_WIDE.length) + " →</span></button>";
    const studioBlock = '<section class="home-block">' + studioWide + "</section>";

    document.getElementById("content").innerHTML = arcSection + recentSection + studioBlock;

    document.querySelectorAll("#content [data-phase]").forEach(function (b) {
      b.addEventListener("click", function () {
        const id = b.getAttribute("data-phase");
        if (id === "__studio") { state.openStudioWide = true; }
        else { state.openPhase = id; state.openStudioWide = false; }
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
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
        if (nav === "root") { state.openPhase = null; state.openSub = null; state.openLens = null; state.openStudioWide = false; }
        else if (nav === "phase") { state.openSub = null; state.openLens = null; }
        else if (nav === "subphase") { state.openLens = null; }
        else if (nav === "standards-root") { state.openStandard = null; }
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function studioWideIcon() {
    return (
      '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/>' +
      "</svg>"
    );
  }

  // ---- View: studio-wide catch-all ----
  function renderStudioWide() {
    const items = STUDIO_WIDE.map(function (r) {
      return Object.assign({}, r, { phaseId: "studio-wide", phaseName: "Studio-wide" });
    });
    document.getElementById("content").innerHTML =
      breadcrumbHtml([{ label: "How We Work", nav: "root" }, { label: "Studio-wide" }]) +
      '<div class="phase-detail" style="--phase: var(--accent)">' +
      '<header class="detail-head">' +
      '<span class="detail-icon">' + studioWideIcon() + "</span>" +
      "<div>" +
      '<span class="detail-kicker">Applies across all phases</span>' +
      "<h2>Studio-wide resources</h2>" +
      '<p class="detail-blurb">Guidelines and standards that apply to every project, regardless of phase.</p>' +
      "</div>" +
      '<span class="detail-count">' + plural(items.length) + "</span>" +
      "</header>" +
      '<div class="op-section" style="padding: 14px 20px 18px">' +
      items.map(function (r) { return resourceRow(r, false); }).join("") +
      "</div>" +
      "</div>";
    wireCrumbs();
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
      breadcrumbHtml([{ label: "How We Work", nav: "root" }, { label: phase.name }]) +
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
      imageSlot(phase.name + " banner", "img-slot-banner") +
      whyCallout("Why this phase matters", PHASE_WHY[phase.id]) +
      (SAMPLE_PHASES.indexOf(phase.id) !== -1
        ? '<p class="sample-note">This phase is an illustrative sample — its sections and resources are placeholders. ' + phTag() + "</p>"
        : "") +
      '<div class="subcard-list">' + cards + "</div>" +
      "</div>";

    wireCrumbs();
    document.querySelectorAll(".subcard").forEach(function (card) {
      card.addEventListener("click", function () {
        state.openSub = card.getAttribute("data-sub");
        state.openLens = null;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ---- View: lens index for a lens-structured subphase (e.g. Predesign) ----
  function renderLensIndex(phase, sub) {
    const color = phaseColor(phase.id);
    const overview = (sub.onePager && sub.onePager.overview) || sub.summary || "";
    const cards = sub.lenses.map(function (lens) {
      const n = lens.topics.length;
      return (
        '<button class="lens-card" type="button" data-lens="' + lens.id + '" style="--phase:' + color + '">' +
        '<span class="lens-card-icon">' + lensIconSvg(lens.id) + "</span>" +
        '<span class="lens-card-text">' +
        '<span class="lens-card-name">' + lens.name + "</span>" +
        '<span class="lens-card-summary">' + (lens.summary || "") + "</span>" +
        "</span>" +
        '<span class="lens-card-cta">' + n + " topic" + (n === 1 ? "" : "s") + " →</span>" +
        "</button>"
      );
    }).join("");

    document.getElementById("content").innerHTML =
      breadcrumbHtml([
        { label: "How We Work", nav: "root" },
        { label: phase.name, nav: "phase" },
        { label: sub.name },
      ]) +
      '<article class="onepager" style="--phase:' + color + '">' +
      '<header class="op-hero">' +
      '<span class="op-hero-icon">' + iconSvg(phase.id) + "</span>" +
      '<div class="op-hero-text">' +
      '<span class="op-kicker">' + phase.name + " · early concept work</span>" +
      "<h2>" + sub.name + "</h2>" +
      '<p class="op-summary">' + (sub.summary || "") + "</p>" +
      "</div>" +
      "</header>" +
      '<div class="op-body"><div class="op-main">' +
      '<section class="op-section"><h3>Overview</h3><p>' + overview + "</p></section>" +
      '<section class="op-section"><h3>What informs this work</h3>' +
      '<p class="op-section-note">Three lenses — open one to see what we look for, how we document it, and why it matters. ' + phTag() + "</p>" +
      '<div class="lens-grid">' + cards + "</div></section>" +
      "</div></div>" +
      "</article>";

    wireCrumbs();
    document.querySelectorAll(".lens-card").forEach(function (c) {
      c.addEventListener("click", function () {
        state.openLens = c.getAttribute("data-lens");
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ---- View: a single lens (topics × What / How / Why) ----
  function renderLensDetail(phase, sub, lensId) {
    const lens = sub.lenses.find(function (l) { return l.id === lensId; });
    if (!lens) { state.openLens = null; return renderLensIndex(phase, sub); }
    const color = phaseColor(phase.id);

    const topics = lens.topics.map(function (t) {
      const whatList = '<ul class="lens-list">' + t.what.map(function (w) { return "<li>" + w + "</li>"; }).join("") + "</ul>";
      const howBlock = (t.how && t.how.length)
        ? '<ul class="lens-list">' + t.how.map(function (h) { return "<li>" + h + "</li>"; }).join("") + "</ul>"
        : '<p class="op-empty">' + (t.howNote || "[Placeholder] Methods still to be developed.") + "</p>";
      return (
        '<div class="topic">' +
        '<h3 class="topic-name">' + t.name + "</h3>" +
        '<div class="topic-layers">' +
        '<div class="topic-layer"><span class="layer-label">What we look &amp; listen for</span>' + whatList + "</div>" +
        '<div class="topic-layer"><span class="layer-label">How we collect &amp; document</span>' + howBlock + "</div>" +
        "</div>" +
        '<div class="topic-why"><span class="why-label">Why it matters</span><p>' + t.why + "</p></div>" +
        "</div>"
      );
    }).join("");

    document.getElementById("content").innerHTML =
      breadcrumbHtml([
        { label: "How We Work", nav: "root" },
        { label: phase.name, nav: "phase" },
        { label: sub.name, nav: "subphase" },
        { label: lens.name },
      ]) +
      '<article class="onepager" style="--phase:' + color + '">' +
      '<header class="op-hero">' +
      '<span class="op-hero-icon">' + lensIconSvg(lens.id) + "</span>" +
      '<div class="op-hero-text">' +
      '<span class="op-kicker">' + sub.name + "</span>" +
      "<h2>" + lens.name + "</h2>" +
      '<p class="op-summary">' + (lens.summary || "") + "</p>" +
      "</div>" +
      "</header>" +
      '<div class="lens-detail-body">' + topics + "</div>" +
      "</article>";

    wireCrumbs();
  }

  // ---- View: a subphase one-pager ----
  function renderOnePager(phaseId, subId) {
    const phase = PHASES.find(function (p) { return p.id === phaseId; });
    const sub = phase && phase.subphases.find(function (s) { return s.id === subId; });
    if (!sub) { state.openSub = null; return renderPhaseDetail(phaseId); }

    // Lens-structured subphases (e.g. Predesign) use the lens views.
    if (sub.lenses) {
      if (state.openLens) return renderLensDetail(phase, sub, state.openLens);
      return renderLensIndex(phase, sub);
    }

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
        '<span class="op-start-label">Start here' +
        (primary.type === "Template" ? '<span class="op-start-badge">Current template</span>' : "") +
        "</span>" +
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
        { label: "How We Work", nav: "root" },
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
      whyCallout("Why this matters", SECTION_WHY[sub.id]) +
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

    // Phase shortcut if the query names a phase.
    const ql = state.search.toLowerCase();
    const phaseMatch = PHASES.find(function (p) {
      const pn = p.name.toLowerCase();
      return ql.indexOf(pn) !== -1 || pn.indexOf(ql) !== -1;
    });

    // Type filter chips (filter the results).
    const chips = [{ id: null, label: "All" }].concat(
      TYPES.map(function (t) { return { id: t, label: t === "Case Study" ? "Case studies" : t + "s" }; })
    );
    const chipRow = '<div class="type-chips">' + chips.map(function (c) {
      const active = (state.typeFilter || null) === c.id ? " is-active" : "";
      return '<button class="type-chip' + active + '" type="button" data-type="' + (c.id === null ? "" : c.id) + '">' + c.label + "</button>";
    }).join("") + "</div>";

    let html =
      '<div class="results-list">' +
      '<div class="results-head-row">' +
      '<h2 class="results-head">Results for “' + esc(state.search) + '” <span class="group-count">' + items.length + "</span></h2>" +
      '<button class="clear-search" type="button" id="clear-search">Clear ✕</button>' +
      "</div>" +
      chipRow +
      (phaseMatch ? '<button class="results-phase" type="button" data-phase="' + phaseMatch.id + '">Browse the ' + phaseMatch.name + " phase →</button>" : "") +
      (items.length ? items.map(function (r) { return resourceRow(r, true); }).join("") : emptyState()) +
      "</div>";

    document.getElementById("content").innerHTML = html;

    document.querySelectorAll(".type-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.typeFilter = chip.getAttribute("data-type") || null;
        render();
      });
    });
    const cs = document.getElementById("clear-search");
    if (cs) cs.addEventListener("click", clearAll);
    const rp = document.querySelector(".results-phase");
    if (rp) rp.addEventListener("click", function () {
      state.openPhase = rp.getAttribute("data-phase");
      state.search = ""; state.typeFilter = null; state.openStudioWide = false;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
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

    const intro = (Array.isArray(VALUES_INTRO.body) ? VALUES_INTRO.body : [VALUES_INTRO.body])
      .map(function (p) { return '<p class="values-lead">' + p + "</p>"; }).join("");

    document.getElementById("content").innerHTML =
      '<section class="values">' +
      '<div class="values-intro">' +
      '<span class="values-kicker">' + VALUES_INTRO.kicker + "</span>" +
      '<h2 class="values-statement">' + VALUES_INTRO.statement + "</h2>" +
      intro +
      "</div>" +
      imageSlot("Studio hero image", "img-slot-hero") +
      '<h3 class="values-section-head">Our values</h3>' +
      '<div class="value-grid">' + valueCards + "</div>" +
      '<h3 class="values-section-head">Design Studio Ethos</h3>' +
      '<p class="values-note">Hover (or focus) a square to read more.</p>' +
      '<div class="ethos-grid">' + ethosSquares + "</div>" +
      '<h3 class="values-section-head">Our culture ' + phTag() + "</h3>" +
      '<div class="culture-grid">' + cultureCards + "</div>" +
      "</section>";
  }

  // ---- View: Studio Standards (top-level) ----
  function renderStandards() {
    const cards = STANDARDS.map(function (s) {
      return (
        '<button class="std-card" type="button" data-std="' + s.id + '">' +
        '<span class="std-card-icon">' + stdIconSvg(s.id) + "</span>" +
        '<span class="std-card-text">' +
        '<span class="std-card-name">' + s.name + "</span>" +
        '<span class="std-card-summary">' + s.summary + "</span>" +
        "</span>" +
        '<span class="std-card-cta">View standard →</span>' +
        "</button>"
      );
    }).join("");

    document.getElementById("content").innerHTML =
      '<section class="standards">' +
      '<div class="browse-head"><span class="browse-kicker">Studio Standards ' + phTag() + "</span>" +
      '<span class="browse-hint">The latest templates and the style we use for each deliverable — so you never hunt for the current file or guess our style.</span></div>' +
      '<div class="std-grid">' + cards + "</div>" +
      "</section>";

    document.querySelectorAll(".std-card").forEach(function (c) {
      c.addEventListener("click", function () {
        state.openStandard = c.getAttribute("data-std");
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ---- View: a single standard ----
  function renderStandardDetail(stdId) {
    const std = STANDARDS.find(function (s) { return s.id === stdId; });
    if (!std) { state.openStandard = null; return renderStandards(); }

    const t = std.template;
    const teal = "var(--accent)";

    const specsAside = (std.specs && std.specs.length)
      ? '<aside class="op-stats-col"><h3 class="op-stats-title">Specs</h3><dl class="op-stats">' +
        std.specs.map(function (s) { return '<div class="op-stat"><dt>' + s.label + "</dt><dd>" + s.value + "</dd></div>"; }).join("") +
        "</dl></aside>"
      : "";

    const templateCard =
      '<a class="current-template" href="' + t.driveUrl + '" target="_blank" rel="noopener">' +
      '<span class="ct-badge">Current template</span>' +
      '<span class="ct-title">' + t.title + "</span>" +
      '<span class="ct-meta">' + t.version + " · updated " + t.updated + " · owner: " + t.owner + " · Open in Drive ↗</span>" +
      "</a>";

    const rules = (std.rules || []).map(function (r) { return "<li>" + r + "</li>"; }).join("");

    const usedIn = (std.usedIn || [])
      .map(function (pid) {
        const p = PHASES.find(function (x) { return x.id === pid; });
        if (!p) return "";
        return '<button class="usedin-chip" type="button" data-phase="' + pid + '" style="--phase:' + phaseColor(pid) + '">' + p.name + "</button>";
      })
      .join("");

    document.getElementById("content").innerHTML =
      breadcrumbHtml([{ label: "Standards", nav: "standards-root" }, { label: std.name }]) +
      '<article class="onepager" style="--phase:' + teal + '">' +
      '<header class="op-hero">' +
      '<span class="op-hero-icon">' + stdIconSvg(std.id) + "</span>" +
      '<div class="op-hero-text">' +
      '<span class="op-kicker">Studio standard</span>' +
      "<h2>" + std.name + "</h2>" +
      '<p class="op-summary">' + std.summary + "</p>" +
      "</div>" +
      "</header>" +
      '<div class="op-body">' +
      specsAside +
      '<div class="op-main">' +
      whyCallout("Why this matters", STANDARD_WHY[std.id]) +
      '<section class="op-section"><h3>Current template</h3>' +
      '<p class="op-section-note">The single source of truth — always start from this file. ' + phTag() + "</p>" +
      templateCard +
      "</section>" +
      '<section class="op-section"><h3>Style &amp; standards</h3><ul class="std-rules">' + rules + "</ul></section>" +
      '<section class="op-section"><h3>Style exemplar</h3>' +
      '<p class="op-section-note">The reference for what good looks like. For real project examples, see the phases below. ' + phTag() + "</p>" +
      '<div class="std-exemplar">[Placeholder] Example image of our ' + std.name.toLowerCase() + " style.</div></section>" +
      (usedIn ? '<section class="op-section"><h3>Used in — see examples in these phases</h3><div class="usedin-row">' + usedIn + "</div></section>" : "") +
      "</div>" +
      "</div>" +
      "</article>";

    wireCrumbs();
    document.querySelectorAll(".usedin-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.section = "process";
        state.openStandard = null;
        state.openPhase = chip.getAttribute("data-phase");
        state.openSub = null;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
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
    document.querySelectorAll(".topnav-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-section") === state.section);
    });
    const askHero = document.getElementById("ask-hero");

    // Standalone top-level sections (no ask hero).
    if (state.section === "values" || state.section === "calendar" || state.section === "standards") {
      if (askHero) askHero.hidden = true;
      if (state.section === "values") renderValues();
      else if (state.section === "calendar") renderCalendar();
      else if (state.openStandard) renderStandardDetail(state.openStandard);
      else renderStandards();
      return;
    }

    // Process & Resources — the ask/search hero is the primary path.
    const drilled = !!(state.openPhase || state.openStudioWide);
    if (askHero) askHero.hidden = drilled;
    syncAsk();

    if (state.search) renderSearchResults();
    else if (state.openStudioWide) renderStudioWide();
    else if (state.openPhase && state.openSub) renderOnePager(state.openPhase, state.openSub);
    else if (state.openPhase) renderPhaseDetail(state.openPhase);
    else renderHome();

    wireEmptyReset();
  }

  function typeLabel(t) { return t === "Case Study" ? "Case studies &amp; examples" : t + "s"; }

  // Keep the ask input + suggestion chips in sync with state.
  function syncAsk() {
    const input = document.getElementById("ask-input");
    const clear = document.getElementById("ask-clear");
    const sug = document.getElementById("ask-suggests");
    if (input && input.value !== state.search) input.value = state.search;
    if (clear) clear.hidden = !state.search;
    if (!sug) return;
    if (state.search) { sug.hidden = true; return; }
    sug.hidden = false;
    sug.innerHTML = ASK_SUGGESTIONS.map(function (s) {
      return '<button class="ask-suggest" type="button">' + s + "</button>";
    }).join("");
    sug.querySelectorAll(".ask-suggest").forEach(function (b) {
      b.addEventListener("click", function () { setSearch(b.textContent); });
    });
  }

  function setSearch(q) {
    state.search = q;
    state.openPhase = null; state.openSub = null; state.openLens = null;
    state.openStudioWide = false; state.typeFilter = null;
    render();
    const input = document.getElementById("ask-input");
    if (input) input.focus();
  }

  function clearAll() {
    state.search = "";
    state.typeFilter = null;
    state.openPhase = null;
    state.openSub = null;
    state.openLens = null;
    state.openStudioWide = false;
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
      // Returning to a top-level section lands on its clean index.
      state.openPhase = null;
      state.openSub = null;
      state.openLens = null;
      state.openStudioWide = false;
      state.openStandard = null;
      state.calOffset = 0;
      state.search = "";
      state.typeFilter = null;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Ask / search hero — the primary path.
  (function initAsk() {
    const input = document.getElementById("ask-input");
    const form = document.getElementById("ask-form");
    const clear = document.getElementById("ask-clear");
    if (!input || !form) return;
    input.addEventListener("input", function (e) {
      state.search = e.target.value.trim();
      if (state.search) {
        state.section = "process";
        state.openPhase = null; state.openSub = null; state.openLens = null; state.openStudioWide = false;
      }
      render();
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    if (clear) clear.addEventListener("click", function () { clearAll(); input.focus(); });
  })();

  // "New here?" — onboarding on demand (jumps to Values & Culture).
  (function initNewHere() {
    const btn = document.getElementById("new-here");
    if (!btn) return;
    btn.addEventListener("click", function () {
      state.section = "values";
      state.openPhase = null; state.openSub = null; state.openLens = null;
      state.openStudioWide = false; state.openStandard = null;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  })();

  // "/" focuses the ask bar (returns to the Process home if needed).
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || app.hidden) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    e.preventDefault();
    if (state.section !== "process" || state.openPhase || state.openStudioWide) {
      state.section = "process";
      state.openPhase = null; state.openSub = null; state.openLens = null; state.openStudioWide = false;
      render();
    }
    const input = document.getElementById("ask-input");
    if (input) input.focus();
  });

  // ---- Init: when the gate is disabled, reveal the app directly ----
  if (!GATE_ENABLED) {
    gate.hidden = true;
    app.hidden = false;
    render();
  }

  // ---- Dismissible prototype banner ----
  (function initBanner() {
    const banner = document.querySelector(".proto-banner");
    const x = document.getElementById("proto-dismiss");
    if (!banner || !x) return;
    try { if (localStorage.getItem("dsc-banner-dismissed") === "1") banner.hidden = true; } catch (e) {}
    x.addEventListener("click", function () {
      banner.hidden = true;
      try { localStorage.setItem("dsc-banner-dismissed", "1"); } catch (e) {}
    });
  })();

  // ---- Ambience: time-aware greeting + daylight warmth ----
  (function initAmbience() {
    const h = new Date().getHours();
    const greet = h < 12 ? "Good morning." : h < 17 ? "Good afternoon." : "Good evening.";
    const title = document.getElementById("ask-title");
    if (title) title.textContent = greet + " What are you working on?";
    // Warmer at the start/end of day, cooler at midday (0 = cool, 1 = warm).
    const warm = h < 8 ? 0.95 : h < 11 ? 0.5 : h < 16 ? 0.18 : h < 20 ? 0.7 : 1;
    document.documentElement.style.setProperty("--daylight", String(warm));
  })();

})();
