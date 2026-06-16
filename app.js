// DJDS Design Studio Compass — single-page app logic.
// Data comes from data.js (PHASES, TYPES, NEEDS, TEAM_PASSWORD).

(function () {
  "use strict";

  // ---- App state ----
  const state = {
    view: "phase",      // "phase" | "type" | "need"
    search: "",
    needFilter: null,   // need id when filtering via a shortcut
    expanded: new Set(["concept"]), // phase ids open in "by phase" view
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

  // ---- Filtering shared by all views ----
  function matchesFilters(r) {
    if (state.needFilter && !(r.needs || []).includes(state.needFilter)) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = (r.title + " " + r.type + " " + r.phaseName + " " + r.subName).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
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
    PHASES.forEach(function (phase) {
      const isOpen = state.expanded.has(phase.id);
      // Gather visible resources for this phase under current filters.
      const subBlocks = phase.subphases
        .map(function (sub) {
          const visible = sub.resources
            .map(function (r) {
              return Object.assign({}, r, { phaseName: phase.name, subName: sub.name });
            })
            .filter(matchesFilters);
          if (!visible.length) return "";
          return (
            '<div class="subphase">' +
            '<div class="subphase-name">' + sub.name + "</div>" +
            visible.map(resourceRow).join("") +
            "</div>"
          );
        })
        .join("");

      // When a filter/search is active, hide phases with no matches.
      const hasFilter = state.search || state.needFilter;
      if (hasFilter && !subBlocks) return;

      html +=
        '<div class="phase-card">' +
        '<div class="phase-head" data-phase="' + phase.id + '">' +
        '<span class="phase-toggle">' + (isOpen ? "▼" : "▶") + "</span>" +
        '<span class="phase-title">' + phase.name + "</span>" +
        '<span class="phase-blurb">' + phase.blurb + "</span>" +
        "</div>" +
        (isOpen ? '<div class="phase-body">' + (subBlocks || '<p class="empty">No matching resources.</p>') + "</div>" : "") +
        "</div>";
    });

    content.innerHTML = html || '<p class="empty">No resources match your search.</p>';

    // Wire up expand/collapse.
    content.querySelectorAll(".phase-head").forEach(function (head) {
      head.addEventListener("click", function () {
        const id = head.getAttribute("data-phase");
        if (state.expanded.has(id)) state.expanded.delete(id);
        else state.expanded.add(id);
        render();
      });
    });
  }

  function renderGrouped(groupKey, groupOrder, labelFor) {
    const content = document.getElementById("content");
    const resources = allResources().filter(matchesFilters);
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
        '<h2 class="group-title">' + labelFor(key) + " <span style=\"color:var(--muted);font-weight:400;font-size:0.85rem\">(" + items.length + ")</span></h2>" +
        items.map(resourceRow).join("") +
        "</div>";
    });

    content.innerHTML = html || '<p class="empty">No resources match your search.</p>';
  }

  // ---- Main render ----
  function render() {
    // View toggle active state.
    document.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-view") === state.view);
    });

    // Clear-filter button visibility.
    const clearBtn = document.getElementById("clear-filter");
    if (state.needFilter) {
      const need = NEEDS.find(function (n) { return n.id === state.needFilter; });
      clearBtn.hidden = false;
      clearBtn.textContent = "Filter: " + (need ? need.label : state.needFilter) + " ✕";
    } else {
      clearBtn.hidden = true;
    }

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
  }

  // ---- Shortcuts row ----
  function buildShortcuts() {
    const row = document.getElementById("shortcuts-row");
    row.innerHTML = NEEDS.map(function (n) {
      return '<button class="shortcut-chip" data-need="' + n.id + '">' + n.label + "</button>";
    }).join("");
    row.querySelectorAll(".shortcut-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.needFilter = chip.getAttribute("data-need");
        state.view = "need";
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

  document.getElementById("clear-filter").addEventListener("click", function () {
    state.needFilter = null;
    render();
  });

  // ---- Init ----
  buildShortcuts();
})();
