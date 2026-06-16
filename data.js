// All placeholder data for the DJDS Design Studio Resource Hub.
// Drive links are dummy URLs — not real systems or client info.

const TEAM_PASSWORD = "DJDS2026";

// Resource types used for the "By type" view and filter chips.
const TYPES = ["Template", "Guide", "Checklist", "Example", "Tool"];

// Task-based shortcuts for the "jump to what you need" row and "By need" view.
const NEEDS = [
  { id: "start-project", label: "Start a new project" },
  { id: "client-meeting", label: "Prep for a client meeting" },
  { id: "cost-estimate", label: "Build a cost estimate" },
  { id: "present-design", label: "Present a design" },
  { id: "spec-materials", label: "Spec materials & FF&E" },
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
        id: "discovery",
        name: "Discovery & Research",
        resources: [
          { title: "Project Kickoff Template", type: "Template", needs: ["start-project"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-kickoff" },
          { title: "Community Engagement Guide", type: "Guide", needs: ["client-meeting"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-engagement" },
          { title: "Site Analysis Checklist", type: "Checklist", needs: ["start-project"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-site-analysis" },
        ],
      },
      {
        id: "visioning",
        name: "Visioning",
        resources: [
          { title: "Vision Workshop Deck", type: "Template", needs: ["client-meeting", "present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-vision-deck" },
          { title: "Precedent Study Examples", type: "Example", needs: ["present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-precedents" },
        ],
      },
      {
        id: "concept-design",
        name: "Concept Design",
        resources: [
          { title: "Concept Diagram Template", type: "Template", needs: ["present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-concept-diagram" },
          { title: "Massing Study Guide", type: "Guide", needs: ["present-design"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-massing" },
          { title: "Rough Order Cost Estimate", type: "Tool", needs: ["cost-estimate"], driveUrl: "https://drive.google.com/drive/folders/PLACEHOLDER-rom-cost" },
        ],
      },
      {
        id: "concept-review",
        name: "Concept Review",
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
