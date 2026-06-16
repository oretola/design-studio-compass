// All placeholder data for the DJDS Design Studio Resource Hub.
// Drive links are dummy URLs — not real systems or client info.

const TEAM_PASSWORD = "DJDS2026";

// Resource types used for the "By type" view and filter chips.
const TYPES = ["Template", "Guide", "Checklist", "Example", "Tool"];

// Task-based shortcuts for the "jump to what you need" row and "By need" view.
const NEEDS = [
  { id: "start-project", label: "How do I start a new project?" },
  { id: "client-meeting", label: "How do I prep for a client meeting?" },
  { id: "cost-estimate", label: "How do I build a cost estimate?" },
  { id: "present-design", label: "How do I present a design?" },
  { id: "spec-materials", label: "How do I spec materials & FF&E?" },
];

// The 7 phases of the DJDS architecture design process.
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
        resources: [
          { title: "Project Kickoff Template", type: "Template", needs: ["start-project"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-kickoff" },
          { title: "Site Analysis Checklist", type: "Checklist", needs: ["start-project"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-site-analysis" },
          { title: "Community Engagement Guide", type: "Guide", needs: ["client-meeting"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-engagement" },
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
          { title: "Precedent Study Examples", type: "Example", needs: ["present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-precedents" },
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
      },
    ],
  },
  {
    id: "schematic",
    name: "Schematic Design",
    blurb: "Translate the concept into preliminary plans and layouts.",
    subphases: [
      {
        id: "schematic-general",
        name: "Resources",
        resources: [
          { title: "Schematic Plan Template", type: "Template", needs: ["start-project"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-schematic-plan" },
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
        id: "dd-general",
        name: "Resources",
        resources: [
          { title: "Material Selection Guide", type: "Guide", needs: ["spec-materials"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-materials" },
          { title: "Detailed Cost Estimate Tool", type: "Tool", needs: ["cost-estimate"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-detailed-cost" },
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
        id: "cd-general",
        name: "Resources",
        resources: [
          { title: "CD Drawing Standards", type: "Guide", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-cd-standards" },
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
        id: "bid-general",
        name: "Resources",
        resources: [
          { title: "Bid Comparison Tool", type: "Tool", needs: ["cost-estimate"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-bid-compare" },
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
        id: "ca-general",
        name: "Resources",
        resources: [
          { title: "Site Visit Report Template", type: "Template", needs: [], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-site-visit" },
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
        id: "ffe-general",
        name: "Resources",
        resources: [
          { title: "FF&E Schedule Template", type: "Template", needs: ["spec-materials"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-ffe-schedule" },
          { title: "Furniture Vendor List", type: "Guide", needs: ["spec-materials"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-vendors" },
        ],
      },
    ],
  },
];
