// All placeholder data for the DJDS Design Studio Resource Hub.
// Drive links are dummy URLs — not real systems or client info.

const TEAM_PASSWORD = "DJDS2026";

// Resource types used for the "By type" view and filter chips.
// "Case Study" = finished work from past projects (decks, drawings, renderings,
// diagrams) shown as examples of how something is done at a given phase.
const TYPES = ["Template", "Guide", "Checklist", "Tool", "Case Study"];

// Task-based shortcuts for the "jump to what you need" row and "By need" view.
const NEEDS = [
  { id: "start-project", label: "How do I start a new project?" },
  { id: "client-meeting", label: "How do I prep for a client meeting?" },
  { id: "cost-estimate", label: "How do I build a cost estimate?" },
  { id: "present-design", label: "How do I present a design?" },
  { id: "spec-materials", label: "How do I spec materials & FF&E?" },
];

// ---- Top level: Values & Culture (high-level beliefs) ----
// Mission + values are the studio's real copy. Value descriptions still pending.
const VALUES_INTRO = {
  kicker: "Our mission",
  statement: "We believe space shapes society.",
  body: [
    "Architecture and real estate have long been used to exclude and control — through stolen land, redlining, dispossession, and hostile design, most visibly in the prisons and jails built to warehouse people instead of repair harm. The result is a built world that encodes inequity in our daily lives. DJDS is changing who holds this power of world-building.",
    "We work alongside community-based organizations to dream, design, build, and own spaces that affirm life rather than diminish it. From restorative justice hubs to supportive housing, we create physical infrastructure that anchors and fortifies movements — making abolition a lived reality, one project at a time.",
  ],
};

// Value names are real; descriptions are placeholder pending studio copy.
const VALUES = [
  { title: "Abundance", body: "[Placeholder] Description to come from the studio." },
  { title: "Relationships", body: "[Placeholder] Description to come from the studio." },
  { title: "Interconnectedness", body: "[Placeholder] Description to come from the studio." },
  { title: "Transformation", body: "[Placeholder] Description to come from the studio." },
  { title: "Solutionary", body: "[Placeholder] Description to come from the studio." },
];

const CULTURE = [
  { title: "We share the work", body: "Credit, decisions, and learning are distributed across the team." },
  { title: "We work in the open", body: "Process, drafts, and rationale stay visible so anyone can pick up the thread." },
  { title: "We make room to learn", body: "Questions are welcome; nobody is expected to know everything." },
  { title: "We protect the mission", body: "We choose projects and partners that advance justice — and we can say no." },
];

// Design Studio Ethos — the studio's 9 real design principles.
// Titles are the actual ethos; descriptions are placeholder pending studio copy.
const ETHOS = [
  { title: "Abundance & Beauty", body: "[Placeholder] Beauty is non-negotiable — even on a tight budget." },
  { title: "Responding to Cultural Context", body: "[Placeholder] Design that listens to the culture and history of a place." },
  { title: "Embrace Color, Materiality, & Texture", body: "[Placeholder] Rich color and real materials over flat, neutral minimalism." },
  { title: "Design, Build, Craft", body: "[Placeholder] We design, build, and make — craft across the whole process." },
  { title: "Embedded Arts & Culture", body: "[Placeholder] Art and artists are part of the work from the start." },
  { title: "Express the Maker's Hand in the Design", body: "[Placeholder] Evidence of the human hand — made, not machine-generated." },
  { title: "Work Across Scales", body: "[Placeholder] From the body to the building to the neighborhood and city." },
  { title: "Biophilic / Biomimicry Design: Embedded Nature", body: "[Placeholder] Nature embedded throughout — light, air, growth, organic form." },
  { title: "Respond to the Scale of the Body", body: "[Placeholder] Human-scaled and sensory — designed for how bodies feel space." },
];

// ---- Design Studio Calendar — placeholder upcoming events ----
// Dates are expressed as offsets in days from "today" so the prototype always
// shows upcoming events. All titles are placeholder.
const EVENTS = [
  { title: "All-Studio Meeting", kind: "Meeting", inDays: 0, time: "10:00 AM" },
  { title: "Design Critique", kind: "Critique", inDays: 2, time: "2:00 PM" },
  { title: "Community Workshop — Project Aspen", kind: "Workshop", inDays: 5, time: "5:30 PM" },
  { title: "Studio Pin-Up", kind: "Review", inDays: 9, time: "11:00 AM" },
  { title: "Lunch & Learn — Materials", kind: "Learning", inDays: 14, time: "12:00 PM" },
  { title: "Client Presentation — Project Cedar", kind: "Presentation", inDays: 21, time: "3:00 PM" },
  { title: "Site Visit — LOVE Building", kind: "Site Visit", inDays: 28, time: "9:00 AM" },
];

// ---- Studio Standards — deliverable templates + style guidance ----
// Organized by deliverable type (cuts across phases). All content placeholder.
// Each `template` is the single canonical/latest source of truth.
const STANDARDS = [
  {
    id: "massing",
    name: "Massing Diagram",
    summary: "How we show building volume, scale, and site relationships.",
    template: { title: "Massing Diagram Template", version: "v3", updated: "Jun 2026", owner: "Studio Standards Lead", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-std-massing-template" },
    specs: [
      { label: "Software", value: "Rhino + Illustrator" },
      { label: "File format", value: ".ai / .pdf" },
      { label: "Color palette", value: "DJDS greys + teal accent" },
      { label: "Typeface", value: "Raleway" },
    ],
    rules: [
      "[Placeholder] Show context massing in light grey; subject volume in solid tone.",
      "[Placeholder] Use consistent line weights — to be defined by the studio.",
      "[Placeholder] Keep annotations minimal; label only key volumes.",
    ],
    usedIn: ["concept", "schematic"],
  },
  {
    id: "program",
    name: "Program Diagram",
    summary: "How we communicate spaces, adjacencies, and program areas.",
    template: { title: "Program Diagram Template", version: "v2", updated: "May 2026", owner: "Studio Standards Lead", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-std-program-template" },
    specs: [
      { label: "Software", value: "Illustrator" },
      { label: "File format", value: ".ai / .pdf" },
      { label: "Color palette", value: "Program color key (placeholder)" },
      { label: "Typeface", value: "Raleway" },
    ],
    rules: [
      "[Placeholder] Use the studio program color key consistently across projects.",
      "[Placeholder] Size blocks to relative area where possible.",
      "[Placeholder] Show adjacencies with simple connectors.",
    ],
    usedIn: ["concept", "schematic"],
  },
  {
    id: "rendering",
    name: "Rendering",
    summary: "Our house style for renderings — mood, color, people, and entourage.",
    template: { title: "Rendering Style Kit", version: "v4", updated: "Jun 2026", owner: "Visualization Lead", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-std-rendering-kit" },
    specs: [
      { label: "Software", value: "Enscape / Photoshop" },
      { label: "File format", value: ".psd / .jpg" },
      { label: "Mood", value: "Warm, inclusive, daylit (placeholder)" },
      { label: "Entourage", value: "Studio people library" },
    ],
    rules: [
      "[Placeholder] Warm, natural light; avoid heavy post-processing.",
      "[Placeholder] Show diverse, real-feeling people at human scale.",
      "[Placeholder] Use the studio entourage and color treatment.",
    ],
    usedIn: ["concept", "design-dev"],
  },
  {
    id: "plan-graphics",
    name: "Plan Graphics",
    summary: "Standards for plan drawings — line weights, poché, scale, and labels.",
    template: { title: "Plan Graphics Standard", version: "v5", updated: "Apr 2026", owner: "Studio Standards Lead", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-std-plan-graphics" },
    specs: [
      { label: "Software", value: "Revit + Illustrator" },
      { label: "File format", value: ".dwg / .pdf" },
      { label: "Line weights", value: "Studio pen set (placeholder)" },
      { label: "Typeface", value: "Raleway" },
    ],
    rules: [
      "[Placeholder] Use the studio pen/line-weight set for hierarchy.",
      "[Placeholder] Poché walls per standard; keep north arrow + scale bar.",
      "[Placeholder] Consistent room labels and font sizes.",
    ],
    usedIn: ["schematic", "design-dev", "construction-docs"],
  },
  {
    id: "presentation",
    name: "Presentation Deck",
    summary: "Our deck template and layout standards for client and community presentations.",
    template: { title: "Presentation Deck Template", version: "v6", updated: "Jun 2026", owner: "Studio Standards Lead", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-std-deck-template" },
    specs: [
      { label: "Software", value: "Figma / PowerPoint" },
      { label: "Aspect ratio", value: "16:9" },
      { label: "Color palette", value: "DJDS brand" },
      { label: "Typeface", value: "Raleway" },
    ],
    rules: [
      "[Placeholder] Lead with the story; one idea per slide.",
      "[Placeholder] Use brand colors and Raleway throughout.",
      "[Placeholder] Caption every image; credit the community.",
    ],
    usedIn: ["concept", "design-dev"],
  },
];

// Recently updated — what returning users most want to see. Placeholder.
// `daysAgo` keeps it fresh relative to today.
const WHATS_NEW = [
  { title: "Massing Diagram Template", note: "v3 released", daysAgo: 2, where: "Standards" },
  { title: "Predesign — Informed by the Land", note: "lens content added", daysAgo: 4, where: "Concept Development" },
  { title: "Community Engagement Guide", note: "updated", daysAgo: 9, where: "Concept Development" },
  { title: "File Naming & Folder Standards", note: "added", daysAgo: 12, where: "Studio-wide" },
];

// Studio-wide resources — apply across every phase (catch-all home for
// things that don't belong to one phase). Placeholder. `tags` aid search.
const STUDIO_WIDE = [
  { title: "Studio Brand Guidelines", type: "Guide", needs: [], tags: ["brand", "logo", "fonts", "color"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-studio-brand" },
  { title: "Accessibility Standards", type: "Guide", needs: [], tags: ["accessibility", "ada", "inclusive", "neurodivergent"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-studio-accessibility" },
  { title: "Community Engagement Principles", type: "Guide", needs: ["client-meeting"], tags: ["community", "engagement", "participatory"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-studio-engagement" },
  { title: "DEI in Subcontracting Guide", type: "Guide", needs: [], tags: ["dei", "equity", "contractors", "hiring"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-studio-dei" },
  { title: "File Naming & Folder Standards", type: "Checklist", needs: [], tags: ["files", "naming", "organization"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-studio-filenaming" },
];

// "Why this matters" teaching copy (placeholder — needs senior-leadership voice).
// Keyed by phase id, standard id, and Concept section id.
const PHASE_WHY = {
  "concept": "[Placeholder — senior voice] This is where the project's values and direction are set. Get it right and everything downstream is easier; rush it and the design loses its grounding in the community and the land.",
  "schematic": "[Placeholder — senior voice] Translating concept into plans is where ideas meet constraints — the moment to protect the vision as code, budget, and site start pushing back.",
  "design-dev": "[Placeholder — senior voice] The details resolved here — materials, systems, how a space feels to the body — are where dignity and care become tangible, not just intended.",
  "entitlements": "[Placeholder — senior voice] Approvals are where community trust and public process are won or lost; how we show up signals whether the project is done with the neighborhood or to it.",
  "construction-docs": "[Placeholder — senior voice] CDs are the studio's intent made precise — clarity here protects the design through the hands of everyone who builds it.",
  "bidding": "[Placeholder — senior voice] Who builds it, and on what terms, shapes whether the project creates local opportunity or extracts from the community.",
  "construction-admin": "[Placeholder — senior voice] Intent erodes in the field unless we steward it; this phase keeps the built result true to the people it's for.",
  "ffe": "[Placeholder — senior voice] The objects people touch every day carry the project's care into daily use — furniture and fixtures are not an afterthought.",
};
const SECTION_WHY = {
  "ideation": "[Placeholder — senior voice] Divergence before convergence — this is where we resist the first idea and make room for the community's.",
  "integration": "[Placeholder — senior voice] Synthesis is a values exercise: what we keep and cut reveals whose needs the design actually centers.",
  "final-concept": "[Placeholder — senior voice] Alignment here isn't sign-off theater — it's making sure the people affected recognize and own the direction.",
};
const STANDARD_WHY = {
  "massing": "[Placeholder — senior voice] How we show volume shapes how communities understand what's coming — clarity here builds trust before a wall is built.",
  "program": "[Placeholder — senior voice] A program diagram makes spatial priorities legible to non-designers, so the people we serve can actually weigh in.",
  "rendering": "[Placeholder — senior voice] Renderings set expectation and emotion; our style choices decide who sees themselves in the future we're drawing.",
  "plan-graphics": "[Placeholder — senior voice] Consistent plan graphics are how the studio speaks with one voice — and how anyone can pick up a drawing and read our intent.",
  "presentation": "[Placeholder — senior voice] A deck is often the only artifact a community keeps; it should honor their contribution and tell the truth about the work.",
};
// Phases that are illustrative stubs (only Concept Development is built out).
const SAMPLE_PHASES = ["schematic", "design-dev", "entitlements", "construction-docs", "bidding", "construction-admin", "ffe"];

// The 8 phases of the DJDS architecture design process.
// Concept Development is fully fleshed out with 4 subphases for v1;
// the others carry a few sample resources each.
const PHASES = [
  {
    id: "concept",
    name: "Concept Development",
    blurb: "Define the vision, test ideas, and align on direction.",
    subphases: [
      {
        id: "predesign",
        name: "Predesign | Due Diligence and Data Collection",
        summary: "Gather the site, regulatory, budget, and community context that grounds every decision downstream.",
        onePager: {
          overview: "Predesign is where the project's reality comes into focus. Before any design moves, the team gathers everything that shapes what's possible — the site and its history, zoning and code constraints, the budget, and the hopes of the people who will use the space. The goal is a shared, well-documented starting point so the rest of Concept Development builds on facts, not assumptions. [Placeholder copy — replace with the studio's real guidance.]",
          stats: [
            { label: "Typical duration", value: "2–6 weeks" },
            { label: "Key participants", value: "Project lead, client, community partners" },
            { label: "Primary deliverables", value: "Site analysis, program brief, due-diligence memo" },
            { label: "Inputs needed", value: "Survey, zoning data, stated client goals" },
          ],
          steps: [
            "Confirm project goals, scope, and success metrics with the client and community.",
            "Collect site, zoning, environmental, and regulatory data.",
            "Document existing conditions and known constraints.",
            "Run initial stakeholder and community listening sessions.",
            "Synthesize findings into a shared predesign brief.",
          ],
        },
        // Early site analysis + programming, organized by three lenses.
        // Each topic carries three layers: what (collect), how (methods), why (critical thinking).
        // Why copy is placeholder and needs senior-leadership voice.
        lenses: [
          {
            id: "land",
            name: "Informed by the Land",
            summary: "The physical and sensory reality of the site.",
            topics: [
              {
                id: "site-unbuilt",
                name: "Site Analysis (Unbuilt)",
                what: ["Rain Patterns", "Wind & Air Patterns", "Wildlife Patterns", "Sun Paths", "Solar Analysis", "Seasonal Weather Patterns", "Climate", "Ecology", "Hydrology / Water"],
                how: ["Environmental Maps / Diagrams", "Site / Environmental Diagrams", "Solar / Wind Studies", "Photographs"],
                why: "[Placeholder — senior voice] Reading the land's natural systems first lets us design with climate and ecology rather than against them — and signals to the community that we respect the place before proposing to change it.",
              },
              {
                id: "sensory",
                name: "Sensory Analysis",
                what: ["Views From the Site", "Views to the Site", "Sounds", "Materiality / Textures", "Smells"],
                how: ["Sensory Maps", "Photographs"],
                why: "[Placeholder — senior voice] The felt experience of a site — what you see, hear, and smell — shapes whether a space reads as safe, dignified, and welcoming to the people who will use it.",
              },
              {
                id: "site-built",
                name: "Site Analysis (Built)",
                what: ["Vehicle Patterns", "Physical Neighborhood Context", "Zoning & Site Parameters", "Public Transit Patterns", "Pedestrian Patterns", "Utilities", "Land Use Patterns", "Existing Building / Site History"],
                how: ["Physical Site Model", "Digital Site Model", "Photographs", "Site Surveys", "Environmental Analysis / Reports", "Site Diagrams", "Zoning Diagrams", "As-Builts", "Historical Maps & Photos", "2D Diagrams", "3D Diagrams"],
                why: "[Placeholder — senior voice] Understanding the existing neighborhood fabric helps us avoid displacement, connect to what already works, and design infrastructure the community can actually use.",
              },
            ],
          },
          {
            id: "humans",
            name: "Informed by the Humans",
            summary: "The people who will use, inhabit, or be affected by the project.",
            topics: [
              {
                id: "program",
                name: "Program",
                what: ["Adjacencies", "Qualitative Needs", "Sensory Needs", "Trauma-Informed Needs", "Social / Privacy Needs", "Quantitative Needs"],
                how: ["2D Diagrams", "3D Diagrams", "Spreadsheets"],
                why: "[Placeholder — senior voice] Programming around qualitative, sensory, and trauma-informed needs — not just square footage — is how we design spaces that heal rather than control.",
              },
              {
                id: "community",
                name: "Community + People",
                what: ["Cultural Context", "History", "Rituals", "Art", "Neighborhood", "City", "Street", "Community Resources", "Community", "Client", "Staff", "Service / Program Participants"],
                how: ["Immersive Site Visits", "Deep Listening Sessions", "Generative Design Engagements", "Participatory Design Sessions", "Independent Research", "Attending Local / Community / Neighborhood Events"],
                why: "[Placeholder — senior voice] Centering the people most impacted — their history, rituals, and knowledge — ensures the design builds community power rather than imposing outside assumptions.",
              },
            ],
          },
          {
            id: "finances",
            name: "Informed by the Finances",
            summary: "The economic and funding context that shapes what's possible.",
            topics: [
              {
                id: "finances-core",
                name: "Finances",
                what: ["Market Study", "Cost Estimates", "Client Budgets", "Fundraising Needs / Goals", "Funding Sources", "Income-Generating Uses"],
                how: [],
                howNote: "[Placeholder] Methods for the Finances lens were not developed in the session — this layer needs another working session.",
                why: "[Placeholder — senior voice] Naming the funding reality early protects the vision: it lets us design what can actually be built, owned, and sustained by the community over time.",
              },
            ],
          },
        ],
        resources: [
          { title: "Project Kickoff Template", type: "Template", needs: ["start-project"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-kickoff" },
          { title: "Site Analysis Checklist", type: "Checklist", needs: ["start-project"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-site-analysis" },
          { title: "Community Engagement Guide", type: "Guide", needs: ["client-meeting"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-engagement" },
        ],
        examples: [
          { title: "[Placeholder] Predesign findings deck — Project Aspen", kind: "Presentation", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ex-predesign-deck" },
          { title: "[Placeholder] Site & context analysis diagram — Project Birch", kind: "Diagram", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ex-site-diagram" },
        ],
      },
      {
        id: "ideation",
        name: "Ideation, Visioning and Analysis",
        summary: "Turn research into a shared vision and a set of design directions worth testing.",
        onePager: {
          overview: "With the context in hand, the team opens up the solution space. This is where insights from predesign become a vision and a handful of distinct design directions. The work balances divergent thinking — generating many possibilities — with analysis that tests each direction against the program, budget, and community priorities. [Placeholder copy — replace with the studio's real guidance.]",
          stats: [
            { label: "Typical duration", value: "2–4 weeks" },
            { label: "Key participants", value: "Design team, client, community advisors" },
            { label: "Primary deliverables", value: "Vision statement, design directions, analysis summary" },
            { label: "Inputs needed", value: "Predesign brief, precedents, program" },
          ],
          steps: [
            "Facilitate a visioning workshop with the client and community.",
            "Gather precedents and analogous inspiration.",
            "Generate multiple distinct design directions.",
            "Analyze each direction against program, budget, and goals.",
            "Align on the directions to carry into concept design.",
          ],
        },
        resources: [
          { title: "Vision Workshop Deck", type: "Template", needs: ["client-meeting", "present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-vision-deck" },
          { title: "Precedent Study Examples", type: "Guide", needs: ["present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-precedents" },
        ],
        examples: [
          { title: "[Placeholder] Visioning workshop output — Project Cedar", kind: "Presentation", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ex-vision-output" },
          { title: "[Placeholder] Concept options board — Project Cedar", kind: "Diagram", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ex-options-board" },
        ],
      },
      {
        id: "integration",
        name: "Integration and Concept Design",
        summary: "Combine the strongest ideas into one coherent concept and pressure-test it.",
        onePager: {
          overview: "Integration is where the chosen directions converge into a single, coherent concept. The team resolves tensions between competing ideas, develops massing and diagrams, and runs a rough-order cost check to keep the concept grounded in reality. The output is a concept clear enough to share and defend. [Placeholder copy — replace with the studio's real guidance.]",
          stats: [
            { label: "Typical duration", value: "2–4 weeks" },
            { label: "Key participants", value: "Design team, cost estimator, client" },
            { label: "Primary deliverables", value: "Concept diagrams, massing study, rough-order cost" },
            { label: "Inputs needed", value: "Selected design directions, program, budget" },
          ],
          steps: [
            "Synthesize the selected directions into one concept.",
            "Develop concept diagrams and massing studies.",
            "Run a rough-order-of-magnitude cost estimate.",
            "Test the concept against program and budget.",
            "Prepare the concept for internal review.",
          ],
        },
        resources: [
          { title: "Concept Diagram Template", type: "Template", needs: ["present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-concept-diagram" },
          { title: "Massing Study Guide", type: "Guide", needs: ["present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-massing" },
          { title: "Rough Order Cost Estimate", type: "Tool", needs: ["cost-estimate"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-rom-cost" },
        ],
        examples: [
          { title: "[Placeholder] Concept massing rendering — Project Dogwood", kind: "Rendering", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ex-massing-render" },
          { title: "[Placeholder] Integrated concept diagram — Project Dogwood", kind: "Diagram", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ex-integrated-diagram" },
        ],
      },
      {
        id: "final-concept",
        name: "Final Concept Design | Iteration and finalization",
        summary: "Refine, document, and align the team and client on the concept to carry forward.",
        onePager: {
          overview: "The final stage of Concept Development tightens the concept through review and iteration, then packages it for client sign-off. The team incorporates feedback, resolves open questions, and produces a clear presentation that secures alignment before moving into Schematic Design. [Placeholder copy — replace with the studio's real guidance.]",
          stats: [
            { label: "Typical duration", value: "1–3 weeks" },
            { label: "Key participants", value: "Design team, client, reviewers" },
            { label: "Primary deliverables", value: "Final concept package, client presentation" },
            { label: "Inputs needed", value: "Integrated concept, review feedback" },
          ],
          steps: [
            "Run an internal design review against the checklist.",
            "Incorporate feedback and iterate on the concept.",
            "Resolve remaining open questions and risks.",
            "Assemble the final concept presentation.",
            "Secure client alignment and sign-off to proceed.",
          ],
        },
        resources: [
          { title: "Design Review Checklist", type: "Checklist", needs: ["present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-review-checklist" },
          { title: "Client Presentation Template", type: "Template", needs: ["present-design", "client-meeting"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-client-present" },
        ],
        examples: [
          { title: "[Placeholder] Final concept presentation — Project Elm", kind: "Presentation", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ex-final-deck" },
          { title: "[Placeholder] Concept design drawing set — Project Elm", kind: "Drawing set", driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ex-drawing-set" },
        ],
      },
    ],
  },
  {
    id: "schematic",
    name: "Schematic Design",
    blurb: "Translate the concept into preliminary plans and layouts.",
    subphases: [
      {
        id: "schematic-plans",
        name: "Plans & Layouts",
        summary: "Develop preliminary floor plans, sections, and site layout from the approved concept.",
        resources: [
          { title: "Schematic Plan Template", type: "Template", needs: ["start-project"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-schematic-plan" },
        ],
      },
      {
        id: "schematic-code",
        name: "Code & Zoning",
        summary: "Check the emerging design against building code and zoning requirements.",
        resources: [
          { title: "Code & Zoning Checklist", type: "Checklist", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-code-zoning" },
        ],
      },
    ],
  },
  {
    id: "design-dev",
    name: "Design Development",
    blurb: "Refine systems, materials, and details.",
    subphases: [
      {
        id: "dd-systems",
        name: "Systems & Materials",
        summary: "Resolve structural, MEP, and material decisions in detail.",
        resources: [
          { title: "Material Selection Guide", type: "Guide", needs: ["spec-materials"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-materials" },
        ],
      },
      {
        id: "dd-estimating",
        name: "Detailed Estimating",
        summary: "Price the developed design and track it against budget.",
        resources: [
          { title: "Detailed Cost Estimate Tool", type: "Tool", needs: ["cost-estimate"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-detailed-cost" },
        ],
      },
    ],
  },
  {
    id: "entitlements",
    name: "Entitlements & Approvals",
    blurb: "Secure the zoning, planning, and permitting approvals needed to build.",
    subphases: [
      {
        id: "ent-submittals",
        name: "Planning Submittals",
        summary: "Prepare and track the submittals required for planning and permitting.",
        resources: [
          { title: "Entitlement Tracker Template", type: "Template", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-entitlement-tracker" },
          { title: "Planning Submittal Checklist", type: "Checklist", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-planning-submittal" },
        ],
      },
      {
        id: "ent-approvals",
        name: "Community & Agency Approvals",
        summary: "Secure sign-off from community boards and review agencies.",
        resources: [
          { title: "Community Approvals Guide", type: "Guide", needs: ["client-meeting"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-community-approvals" },
        ],
      },
    ],
  },
  {
    id: "construction-docs",
    name: "Construction Documents",
    blurb: "Produce the drawings and specs needed to build.",
    subphases: [
      {
        id: "cd-drawings",
        name: "Drawings & Standards",
        summary: "Produce the coordinated construction drawings to studio standards.",
        resources: [
          { title: "CD Drawing Standards", type: "Guide", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-cd-standards" },
        ],
      },
      {
        id: "cd-specs",
        name: "Specifications",
        summary: "Write the specifications that define materials and workmanship.",
        resources: [
          { title: "Specification Template", type: "Template", needs: ["spec-materials"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-spec-template" },
        ],
      },
    ],
  },
  {
    id: "bidding",
    name: "Bidding & Negotiation",
    blurb: "Support contractor selection and pricing.",
    subphases: [
      {
        id: "bid-package",
        name: "Bid Package & Comparison",
        summary: "Issue the bid package and compare contractor pricing.",
        resources: [
          { title: "Bid Comparison Tool", type: "Tool", needs: ["cost-estimate"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-bid-compare" },
        ],
      },
      {
        id: "bid-selection",
        name: "Contractor Selection",
        summary: "Run contractor Q&A and negotiate the award.",
        resources: [
          { title: "Contractor Q&A Guide", type: "Guide", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-contractor-qa" },
        ],
      },
    ],
  },
  {
    id: "construction-admin",
    name: "Construction Administration",
    blurb: "Keep the build on track and on intent.",
    subphases: [
      {
        id: "ca-site",
        name: "Site Observation",
        summary: "Visit the site, document progress, and confirm work matches design intent.",
        resources: [
          { title: "Site Visit Report Template", type: "Template", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-site-visit" },
        ],
      },
      {
        id: "ca-submittals",
        name: "Submittals & RFIs",
        summary: "Review submittals and respond to requests for information.",
        resources: [
          { title: "Submittal Review Checklist", type: "Checklist", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-submittal" },
        ],
      },
    ],
  },
  {
    id: "ffe",
    name: "FF&E",
    blurb: "Furniture, fixtures & equipment selection and procurement.",
    subphases: [
      {
        id: "ffe-selection",
        name: "Selection & Scheduling",
        summary: "Select furniture and fixtures and build the FF&E schedule.",
        resources: [
          { title: "FF&E Schedule Template", type: "Template", needs: ["spec-materials"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ffe-schedule" },
        ],
      },
      {
        id: "ffe-procurement",
        name: "Procurement & Vendors",
        summary: "Source and procure FF&E through vetted vendors.",
        resources: [
          { title: "Furniture Vendor List", type: "Guide", needs: ["spec-materials"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-vendors" },
        ],
      },
    ],
  },
];
