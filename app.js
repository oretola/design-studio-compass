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
    view: "phase",      // "phase" | "type" | "question"
    search: "",
    needFilter: null,   // need id when filtering via a question chip
    openPhase: null,    // phase id when a tile is opened
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
  function allResources() {
    const out = [];
    PHASES.forEach(function (phase) {
      phase.subphases.forEach(function (sub) {
        sub.resources.forEach(function (r) {
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
    return phase.subphases.reduce(function (n, s) { return n + s.resources.length; }, 0);
  }

  function plural(n) { return n === 1 ? "1 resource" : n + " resources"; }

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

  // ---- View: one phase opened ----
  function renderPhaseDetail(phaseId) {
    const phase = PHASES.find(function (p) { return p.id === phaseId; });
    if (!phase) { state.openPhase = null; return renderTiles(); }

    const idx = PHASES.indexOf(phase) + 1;
    const count = phaseTotal(phase);
    const body = phase.subphases
      .map(function (sub) {
        return (
          '<div class="subphase">' +
          '<div class="subphase-name">' + sub.name + "</div>" +
          sub.resources
            .map(function (r) {
              return resourceRow(Object.assign({}, r, { phaseId: phase.id, phaseName: phase.name }), false);
            })
            .join("") +
          "</div>"
        );
      })
      .join("");

    document.getElementById("content").innerHTML =
      '<div class="phase-detail" style="--phase:' + phaseColor(phase.id) + '">' +
      '<button class="back-link" type="button" id="back-to-phases">← All phases</button>' +
      '<header class="detail-head">' +
      '<span class="detail-icon">' + iconSvg(phase.id) + "</span>" +
      "<div>" +
      '<span class="detail-kicker">Phase ' + idx + " of " + PHASES.length + "</span>" +
      "<h2>" + phase.name + "</h2>" +
      '<p class="detail-blurb">' + phase.blurb + "</p>" +
      "</div>" +
      '<span class="detail-count">' + plural(count) + "</span>" +
      "</header>" +
      '<div class="detail-body">' + body + "</div>" +
      "</div>";

    document.getElementById("back-to-phases").addEventListener("click", function () {
      state.openPhase = null;
      render();
    });
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

  // ---- Main render ----
  function render() {
    // Filter bar active state.
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-view") === state.view);
    });

    if (state.search) {
      renderSearchResults();
    } else if (state.view === "phase") {
      if (state.openPhase) renderPhaseDetail(state.openPhase);
      else renderTiles();
    } else if (state.view === "type") {
      renderGrouped("type", TYPES, function (t) { return t + "s"; });
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
    document.getElementById("search").value = "";
    render();
  }

  function wireEmptyReset() {
    const btn = document.getElementById("empty-reset");
    if (btn) btn.addEventListener("click", clearAll);
  }

  // ---- Controls ----
  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.view = btn.getAttribute("data-view");
      state.openPhase = null;
      state.needFilter = null;
      render();
    });
  });

  document.getElementById("search").addEventListener("input", function (e) {
    state.search = e.target.value.trim();
    render();
  });

  document.getElementById("clear-filter").addEventListener("click", clearAll);
})();
