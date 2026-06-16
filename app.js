// DJDS Design Studio Compass — single-page app logic.
// Data comes from data.js (PHASES, TYPES, NEEDS, TEAM_PASSWORD).

(function () {
  "use strict";

  // ---- App state ----
  const state = {
    view: "phase",      // "phase" | "type" | "need"
    search: "",
    needFilter: null,   // need id when filtering via a shortcut / By need view
    phaseFilter: null,  // phase id when focused via the journey rail
    expanded: new Set(["concept"]), // phase ids open in "by phase" view (when nothing is forcing them open)
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

  // ---- Flatten all resources once, tagging each with its phase/subphase ----
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

  // ---- Filtering ----
  // Search + need filter apply everywhere. Phase focus only narrows the phase view.
  function matchesSearchNeed(r) {
    if (state.needFilter && !(r.needs || []).includes(state.needFilter)) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = (r.title + " " + r.type + " " + r.phaseName + " " + r.subName).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  // Count of resources matching search + need, per phase id (ignores phase focus,
  // so the rail can show where matches live).
  function phaseMatchCounts() {
    const counts = {};
    PHASES.forEach(function (p) { counts[p.id] = 0; });
    allResources().forEach(function (r) {
      if (matchesSearchNeed(r)) counts[r.phaseId] += 1;
    });
    return counts;
  }

  function isFiltering() {
    return !!(state.search || state.needFilter || state.phaseFilter);
  }

  // ---- Render helpers ----
  function resourceRow(r) {
    return (
      '<div class="resource">' +
      '<span class="type-tag">' + r.type + "</span>" +
      '<span class="resource-title">' + r.title + "</span>" +
      '<a class="resource-open" href="' + r.driveUrl + '" target="_blank" rel="noopener">Open in Drive ↗</a>' +
      "</div>"
    );
  }

  function renderByPhase() {
    const content = document.getElementById("content");
    let html = "";

    PHASES.forEach(function (phase, i) {
      // When a phase is focused (and not searching), show only that phase.
      if (state.phaseFilter && !state.search && !state.needFilter && phase.id !== state.phaseFilter) return;

      const subBlocks = phase.subphases
        .map(function (sub) {
          const visible = sub.resources
            .map(function (r) {
              return Object.assign({}, r, { phaseName: phase.name, subName: sub.name });
            })
            .filter(matchesSearchNeed);
          if (!visible.length) return "";
          return (
            '<div class="subphase">' +
            '<div class="subphase-name">' + sub.name + "</div>" +
            visible.map(resourceRow).join("") +
            "</div>"
          );
        })
        .join("");

      // While filtering, hide phases with no matches.
      if (isFiltering() && !subBlocks) return;

      const count = phase.subphases.reduce(function (n, s) {
        return n + s.resources.filter(matchesSearchNeed).length;
      }, 0);

      // Force phases open while filtering so results are visible without extra clicks.
      const isOpen = isFiltering() ? true : state.expanded.has(phase.id);

      html +=
        '<div class="phase-card' + (isOpen ? " is-open" : "") + '">' +
        '<div class="phase-head" data-phase="' + phase.id + '">' +
        '<span class="phase-num">' + (i + 1) + "</span>" +
        '<span class="phase-title">' + phase.name + "</span>" +
        '<span class="phase-count">' + count + "</span>" +
        '<span class="phase-blurb">' + phase.blurb + "</span>" +
        '<span class="phase-toggle" aria-hidden="true">' + (isOpen ? "▾" : "▸") + "</span>" +
        "</div>" +
        (isOpen ? '<div class="phase-body">' + (subBlocks || '<p class="empty">No matching resources in this phase.</p>') + "</div>" : "") +
        "</div>";
    });

    content.innerHTML = html || emptyState();

    // Expand/collapse only applies when not filtering (filtering forces open).
    content.querySelectorAll(".phase-head").forEach(function (head) {
      head.addEventListener("click", function () {
        if (isFiltering()) return;
        const id = head.getAttribute("data-phase");
        if (state.expanded.has(id)) state.expanded.delete(id);
        else state.expanded.add(id);
        render();
      });
    });
  }

  function renderGrouped(groupKey, groupOrder, labelFor) {
    const content = document.getElementById("content");
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
        items.map(resourceRow).join("") +
        "</div>";
    });

    content.innerHTML = html || emptyState();
  }

  function emptyState() {
    const what = state.search ? '"' + state.search + '"' : "the current filter";
    return (
      '<div class="empty-card">' +
      '<p class="empty-title">No resources match ' + what + ".</p>" +
      '<button class="empty-reset" id="empty-reset">Clear search &amp; filters</button>' +
      "</div>"
    );
  }

  // ---- Journey rail ----
  function buildJourney() {
    const rail = document.getElementById("journey-rail");
    rail.innerHTML = PHASES.map(function (phase, i) {
      return (
        '<li class="rail-node" data-phase="' + phase.id + '">' +
        '<span class="rail-num">' + (i + 1) + "</span>" +
        '<span class="rail-name">' + phase.name + "</span>" +
        '<span class="rail-count" aria-hidden="true"></span>' +
        "</li>"
      );
    }).join("");

    rail.querySelectorAll(".rail-node").forEach(function (node) {
      node.addEventListener("click", function () {
        const id = node.getAttribute("data-phase");
        // Clicking the focused phase again clears the focus.
        state.phaseFilter = state.phaseFilter === id ? null : id;
        state.view = "phase";
        render();
      });
    });
  }

  // ---- Main render ----
  function render() {
    // View toggle active state.
    document.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-view") === state.view);
    });

    // Render the active view.
    if (state.view === "phase") {
      renderByPhase();
    } else if (state.view === "type") {
      renderGrouped("type", TYPES, function (t) { return t + "s"; });
    } else if (state.view === "need") {
      renderGrouped("need", NEEDS.map(function (n) { return n.id; }), function (id) {
        const n = NEEDS.find(function (x) { return x.id === id; });
        return n ? n.label : id;
      });
    }

    updateJourney();
    updateMeta();
    wireEmptyReset();
  }

  // Update rail counts + active/dim state based on current search/need/focus.
  function updateJourney() {
    const counts = phaseMatchCounts();
    const filtering = !!(state.search || state.needFilter);
    document.querySelectorAll(".rail-node").forEach(function (node) {
      const id = node.getAttribute("data-phase");
      const c = counts[id];
      node.querySelector(".rail-count").textContent = c;
      node.classList.toggle("is-active", state.phaseFilter === id);
      // Dim phases with zero matches only while searching/need-filtering.
      node.classList.toggle("is-dim", filtering && c === 0);
    });
  }

  // Result count + clear-filter button.
  function updateMeta() {
    // Count what's actually visible — including a phase focus in the phase view.
    const total = allResources().filter(function (r) {
      if (!matchesSearchNeed(r)) return false;
      if (state.view === "phase" && state.phaseFilter && !state.search && !state.needFilter) {
        return r.phaseId === state.phaseFilter;
      }
      return true;
    }).length;
    const countEl = document.getElementById("result-count");
    countEl.textContent = total === 1 ? "1 resource" : total + " resources";

    const clearBtn = document.getElementById("clear-filter");
    const labels = [];
    if (state.phaseFilter) {
      const p = PHASES.find(function (x) { return x.id === state.phaseFilter; });
      labels.push(p ? p.name : state.phaseFilter);
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
    state.phaseFilter = null;
    document.getElementById("search").value = "";
    render();
  }

  function wireEmptyReset() {
    const btn = document.getElementById("empty-reset");
    if (btn) btn.addEventListener("click", clearAll);
  }

  // ---- Shortcuts row ----
  function buildShortcuts() {
    const row = document.getElementById("shortcuts-row");
    row.innerHTML = NEEDS.map(function (n) {
      return '<button class="shortcut-chip" data-need="' + n.id + '">' + n.label + "</button>";
    }).join("");
    row.querySelectorAll(".shortcut-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        const id = chip.getAttribute("data-need");
        state.needFilter = state.needFilter === id ? null : id;
        state.phaseFilter = null;
        state.view = state.needFilter ? "need" : "phase";
        render();
      });
    });
  }

  // ---- Controls: view toggles, search, clear filter ----
  document.querySelectorAll(".view-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.view = btn.getAttribute("data-view");
      render();
    });
  });

  document.getElementById("search").addEventListener("input", function (e) {
    state.search = e.target.value.trim();
    render();
  });

  document.getElementById("clear-filter").addEventListener("click", clearAll);

  // ---- Init ----
  buildJourney();
  buildShortcuts();
})();
