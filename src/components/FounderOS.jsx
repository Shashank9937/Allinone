import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  FunnelChart,
  Funnel,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Lightbulb,
  FlaskConical,
  Users,
  Handshake,
  TrendingUp,
  Coins,
  CalendarCheck2,
  BarChart3,
  BookOpen,
  Brain,
  AlertTriangle,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock3,
  Phone,
  Send,
  ChevronRight,
  Download,
  Upload,
  CheckCheck,
  XCircle,
  Target,
  RefreshCw,
  BrainCircuit,
} from "lucide-react";

const TOKENS = {
  bg: "#0B0B0D",
  surface: "#111113",
  card: "#17171A",
  border: "#252528",
  orange: "#F04E23",
  orangeDim: "#2D1209",
  text: "#EDEAE3",
  muted: "#7A7875",
  green: "#10B981",
  blue: "#3B82F6",
  yellow: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
};

const FONT_TITLE = "Syne, sans-serif";
const FONT_BODY = "DM Sans, sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const MODULES = [
  { key: "Dashboard", icon: LayoutDashboard },
  { key: "Ideas Lab", icon: Lightbulb },
  { key: "Startup Probability Engine", icon: Target },
  { key: "Validation", icon: FlaskConical },
  { key: "Customer CRM", icon: Users },
  { key: "Sales Pipeline", icon: Handshake },
  { key: "Revenue Analytics", icon: TrendingUp },
  { key: "Fundraising", icon: Coins },
  { key: "Daily OS", icon: CalendarCheck2 },
  { key: "Weekly Metrics", icon: BarChart3 },
  { key: "Learning Hub", icon: BookOpen },
  { key: "Mindset", icon: Brain },
  { key: "AI Agents", icon: BrainCircuit },
];

const CHECKLIST_ITEMS = [
  "Talk to 5 customers",
  "Send 20 outreach messages",
  "Research industry problems",
  "Build product",
  "Document ideas",
  "Exercise",
  "Journal",
  "Read startup material",
  "Review day",
];

const VALIDATION_STAGES = ["Exploring", "Researching", "Interviewing", "Testing", "Validated"];
const CRM_STAGES = ["Lead", "Contacted", "Discovery", "Demo", "Pilot", "Customer"];
const SALES_STAGES = ["Prospect", "Connect", "Discover", "Demo", "Pilot", "Close"];
const FUND_STAGES = ["Researching", "Contacted", "Meeting", "Due Diligence", "Committed", "Passed"];

const SALES_PROB = {
  Prospect: 0.1,
  Connect: 0.2,
  Discover: 0.35,
  Demo: 0.55,
  Pilot: 0.75,
  Close: 1,
};

const PROBABILITY_FACTORS = [
  { key: "marketSize", label: "Market Size", weight: 0.2 },
  { key: "problemSeverity", label: "Problem Severity", weight: 0.15 },
  { key: "willingnessToPay", label: "Willingness to Pay", weight: 0.15 },
  { key: "competitionIntensity", label: "Competition Intensity", weight: 0.1 },
  { key: "distributionAdvantage", label: "Distribution Advantage", weight: 0.1 },
  { key: "founderInsight", label: "Founder Insight", weight: 0.1 },
  { key: "recurringRevenuePotential", label: "Recurring Revenue Potential", weight: 0.1 },
  { key: "scalability", label: "Scalability", weight: 0.1 },
];

const VC_SCALE_FACTORS = [
  {
    title: "1. Market Size (Most Important)",
    detail:
      "VC lens: can this market produce a $1B company? Rule: $100M company needs roughly $5B market; $1B company needs roughly $20B market.",
  },
  {
    title: "2. Problem Severity",
    detail:
      "Great startups solve painful recurring expensive problems, not nice-to-have features. Teams should prove monetary impact and urgency.",
  },
  {
    title: "3. Willingness to Pay",
    detail:
      "Strong signal when customers already spend budget or commit to buy. Weak signal when feedback is only 'interesting'.",
  },
  {
    title: "4. Founder-Market Fit",
    detail:
      "VCs ask why this founder is uniquely positioned through domain expertise, insider access, network, or direct lived problem.",
  },
  {
    title: "5. Distribution Advantage",
    detail:
      "Winning startups reach customers cheaply via networks, partnerships, communities, or built-in channels.",
  },
  {
    title: "6. Scalability",
    detail:
      "Prefer software/platform models that scale without linear headcount growth; avoid labor-heavy execution traps.",
  },
  {
    title: "7. Recurring Revenue",
    detail:
      "Recurring models (SaaS, usage, platform fees) compound and create predictable growth visibility.",
  },
  {
    title: "8. Competitive Advantage (Moat)",
    detail:
      "Long-term defensibility requires data, network effects, switching costs, proprietary tech, or regulation barriers.",
  },
  {
    title: "9. Speed of Iteration",
    detail:
      "Fast learning loops matter. Winning teams test, ship, and learn faster than peers.",
  },
  {
    title: "10. Early Traction",
    detail:
      "Even modest traction matters: paying customers, active pilots, rising usage, and revenue momentum.",
  },
  {
    title: "11. Market Timing",
    detail:
      "Right timing amplifies outcomes via regulation shifts, infrastructure readiness, and technology inflection points.",
  },
  {
    title: "12. Expansion Potential",
    detail:
      "Best companies start narrow and expand into adjacent categories, compounding into a platform opportunity.",
  },
];

const VC_WEIGHT_MODEL = [
  { factor: "Market Size", weight: "20%" },
  { factor: "Problem Severity", weight: "15%" },
  { factor: "Willingness to Pay", weight: "15%" },
  { factor: "Founder-Market Fit", weight: "10%" },
  { factor: "Distribution", weight: "10%" },
  { factor: "Scalability", weight: "10%" },
  { factor: "Recurring Revenue", weight: "5%" },
  { factor: "Competitive Advantage", weight: "5%" },
  { factor: "Speed of Execution", weight: "5%" },
  { factor: "Traction", weight: "3%" },
  { factor: "Timing", weight: "1%" },
  { factor: "Expansion Potential", weight: "1%" },
];

const SCALE_PATTERN_PLAYBOOK = [
  {
    title: "1. Digitize an Offline Industry",
    why:
      "Works when market size is huge, tech penetration is low, and software can unlock major efficiency gains.",
    examples: "Stripe, Toast, Flexport",
    indiaFit: "Logistics, manufacturing, agriculture supply chain, construction, energy operations",
  },
  {
    title: "2. Infrastructure Layer",
    why:
      "Build core rails other businesses depend on. Deep integration, recurring revenue, and switching costs create durable scale.",
    examples: "AWS, Twilio, Snowflake",
    indiaFit: "Payments rails, compliance infrastructure, industrial data platforms",
  },
  {
    title: "3. Marketplace Liquidity",
    why:
      "Connect two sides of a market and win by building liquidity. Once both sides are active, flywheel strength grows fast.",
    examples: "Uber, Airbnb, DoorDash",
    indiaFit: "B2B procurement, logistics capacity, agri and energy exchanges",
  },
  {
    title: "4. Developer Platform",
    why:
      "Developer tools spread bottom-up with strong community-led adoption and expansion inside teams.",
    examples: "GitHub, Vercel, Datadog",
    indiaFit: "API tooling, observability, workflow SDKs for Indian SaaS builders",
  },
  {
    title: "5. Workflow Automation",
    why:
      "Automating multi-step enterprise workflows reduces labor, errors, and cycle time, driving clear ROI.",
    examples: "UiPath, ServiceNow, Monday.com",
    indiaFit: "Factory ops, field-force operations, finance workflow automation",
  },
  {
    title: "6. Regulation Creates Opportunity",
    why:
      "Policy shifts can create demand quickly for compliance and infrastructure tooling.",
    examples: "Plaid, Stripe, Gusto",
    indiaFit: "GST compliance, energy markets, carbon credits, financial data access",
  },
  {
    title: "7. Aggregation Layer",
    why:
      "Become system-of-record for fragmented markets by aggregating suppliers, demand, and data over time.",
    examples: "Zomato, Redfin, Shopify",
    indiaFit: "Fragmented SME and industrial clusters with poor digital coordination",
  },
];

const MILESTONES = [1, 10, 50, 100, 500];

const INITIAL_MRR_HISTORY = [
  { month: "Jan", mrr: 0.8 },
  { month: "Feb", mrr: 1.2 },
  { month: "Mar", mrr: 2.1 },
  { month: "Apr", mrr: 2.9 },
  { month: "May", mrr: 3.6 },
  { month: "Jun", mrr: 5.1 },
];

const INVESTOR_SEED = [
  { id: "inv_1", name: "Antler India", stage: "Researching", notes: "" },
  { id: "inv_2", name: "Titan Capital", stage: "Researching", notes: "" },
  { id: "inv_3", name: "Blume Ventures", stage: "Researching", notes: "" },
  { id: "inv_4", name: "Peak XV", stage: "Researching", notes: "" },
  { id: "inv_5", name: "Elevation Capital", stage: "Researching", notes: "" },
  { id: "inv_6", name: "Chiratae Ventures", stage: "Researching", notes: "" },
];

const BOOKS = [
  { id: "b1", title: "The Lean Startup", category: "Execution" },
  { id: "b2", title: "Zero to One", category: "Strategy" },
  { id: "b3", title: "The Mom Test", category: "Customer Research" },
  { id: "b4", title: "Traction", category: "Growth" },
  { id: "b5", title: "Inspired", category: "Product" },
  { id: "b6", title: "Crossing the Chasm", category: "Go-to-Market" },
  { id: "b7", title: "Blitzscaling", category: "Scale" },
  { id: "b8", title: "Venture Deals", category: "Fundraising" },
  { id: "b9", title: "High Output Management", category: "Leadership" },
  { id: "b10", title: "Atomic Habits", category: "Discipline" },
  { id: "b11", title: "The Hard Thing About Hard Things", category: "Leadership" },
  { id: "b12", title: "Nail It Then Scale It", category: "Validation" },
];

const FRAMEWORKS = [
  "Painkiller over Vitamin: solve a must-fix business pain.",
  "Jobs-to-be-Done: capture trigger, desired outcome, switching force.",
  "RICE Prioritization: reach, impact, confidence, effort.",
  "OODA Loop: observe, orient, decide, act faster than competitors.",
  "80/20 Revenue Focus: prioritize customers and channels driving 80% growth.",
  "Single Constraint Thinking: fix the bottleneck each week.",
  "Pre-mortem: list failure reasons before execution.",
  "Flywheel Design: map repeatable actions that compound.",
];

const STARTUP_MISTAKES = [
  "Building before talking to customers.",
  "Choosing idea by trend, not pain severity.",
  "Ignoring willingness to pay signals.",
  "Overbuilding MVP scope.",
  "Shipping without clear success metric.",
  "Not following up after interviews.",
  "Treating every lead equally.",
  "Weak ICP definition.",
  "No outreach system.",
  "No weekly review ritual.",
  "Confusing interest with intent.",
  "Underpricing initial pilots.",
  "Waiting too long to ask for sale.",
  "Hiring before product-market signal.",
  "Not documenting learnings.",
  "Not measuring churn drivers.",
  "Channel hopping every week.",
  "No cadence for investor updates.",
  "Pushing roadmap over customer problems.",
  "Ignoring founder energy and health.",
  "No strong onboarding flow.",
  "Not building case studies early.",
  "Selling features, not outcomes.",
  "Not validating enterprise buying process.",
  "Failing to track sales cycle time.",
  "No clear ownership of metrics.",
  "Low quality discovery questions.",
  "No objections library.",
  "No counter-positioning vs incumbents.",
  "No focus on repeatable revenue motions.",
];

const HABITS = [
  "Wake early",
  "Workout",
  "Deep work block",
  "Customer calls",
  "Read and reflect",
  "Plan tomorrow",
];

const AI_ROADMAP = [
  {
    phase: "Phase 1: Foundations & Fundamentals",
    description: "Understand the core concepts of LLMs, Prompt Engineering, and AI APIs.",
    topics: ["Prompt Engineering mastery (Chain of Thought, Few-Shot)", "Understanding Context Windows & Tokens", "Basic API Integrations (OpenAI, Anthropic)"],
  },
  {
    phase: "Phase 2: RAG & Knowledge Integration",
    description: "Connect AI models to your own data to ground responses and reduce hallucinations.",
    topics: ["Vector Databases (Pinecone, Weaviate)", "Embeddings & Semantic Search", "Document Loaders & Chunking Strategies"],
  },
  {
    phase: "Phase 3: Tool Use & Function Calling",
    description: "Give AI the ability to take actions, interact with APIs, and execute code.",
    topics: ["OpenAI Function Calling", "API chaining & workflow automation", "Building custom tools for specific enterprise tasks"],
  },
  {
    phase: "Phase 4: Agentic Frameworks",
    description: "Develop autonomous agents that plan, reason, and execute multi-step tasks.",
    topics: ["LangChain & LlamaIndex", "AutoGPT & BabyAGI concepts", "Agent architectures (ReAct, Plan-and-Solve)"],
  },
  {
    phase: "Phase 5: Multi-Agent Systems",
    description: "Deploy swarms of specialized agents collaborating to solve complex objectives.",
    topics: ["AutoGen & CrewAI frameworks", "Agent roles, delegation, and inter-agent communication", "Evaluation and monitoring of agentic loops"],
  }
];

const LEVERAGE_AI = [
  {
    title: "1. Automate Tedious Admin Tasks",
    detail: "Use AI to classify support tickets, summarize meeting notes, and extract data from invoices, freeing up your team for high-leverage work."
  },
  {
    title: "2. Personalize Customer Outreach",
    detail: "Generate hyper-personalized cold emails and marketing copy at scale using data scraped from LinkedIn and company websites."
  },
  {
    title: "3. Rapid Prototyping & Coding",
    detail: "Use AI pair programmers (like GitHub Copilot or cursor) to write boilerplate code, debug errors, and ship MVP features 10x faster."
  },
  {
    title: "4. Enhanced Decision Making",
    detail: "Feed your financial and operational data into an LLM to identify trends, forecast anomalies, and uncover cost-saving opportunities."
  },
  {
    title: "5. 24/7 Customer Support",
    detail: "Deploy custom RAG-powered chatbots trained on your internal documentation to resolve common customer queries instantly and accurately."
  }
];

const AI_ENGINES_DATA = [
  {
    id: "eng_1",
    name: "Customer Acquisition Engine",
    objective: "Generate predictable inbound + outbound demand without humans.",
    label: "Replaces Marketing Team",
    kpis: ["Cost per lead → Near zero", "Meetings booked → 5–10/day", "CAC → Declining monthly"],
    agents: [
      { id: "agt_1", name: "Lead Mining Agent", description: "Sources from IndiaMART, Maps, GST, LinkedIn, Tenders. Scrapes, filters, enriches, scores, and pushes to CRM." },
      { id: "agt_2", name: "Personalization Agent", description: "Reads website/reviews, identifies pain signals, generates hyper-personalized pitch, selects channel." },
      { id: "agt_3", name: "Campaign Orchestrator", description: "Sends outreach sequences, tracks open/reply, auto follow-ups, escalates hot leads to founder." }
    ]
  },
  {
    id: "eng_2",
    name: "Sales Conversion Engine",
    objective: "Close deals without heavy human involvement.",
    label: "Replaces Sales Team",
    kpis: ["Close rate > 25%", "Sales cycle < 14 days", "Average contract value increasing"],
    agents: [
      { id: "agt_4", name: "Qualification Agent", description: "Analyzes replies, extracts budget/authority/urgency, scores leads, disqualifies bad leads." },
      { id: "agt_5", name: "Proposal Agent", description: "Generates ROI calculation, pricing proposal, implementation timeline, and contract draft." },
      { id: "agt_6", name: "Negotiation Assistant", description: "Simulates counter-offers, recommends discount boundaries, risk analysis. Approves final deal." }
    ]
  },
  {
    id: "eng_3",
    name: "Product Delivery Engine",
    objective: "Ship continuously without large dev team.",
    label: "Replaces Engineering + Ops",
    kpis: ["Deployment frequency weekly", "Uptime > 99.9%", "Dev cost minimal"],
    agents: [
      { id: "agt_7", name: "Feature Builder Agent", description: "Translates customer feedback to specs, generates code, tests automatically, deploys, monitors errors." },
      { id: "agt_8", name: "Infrastructure Agent", description: "Auto-scales servers, optimizes costs, monitors uptime, security patching." },
      { id: "agt_9", name: "Automation Agent", description: "Builds workflows between tools, eliminates manual steps, auto-alerts failures." }
    ]
  },
  {
    id: "eng_4",
    name: "Customer Success Engine",
    objective: "Retention and expansion without humans.",
    label: "Replaces Support Team",
    kpis: ["Churn < 5%", "Expansion revenue > 30%", "Support resolution < 5 mins"],
    agents: [
      { id: "agt_10", name: "Onboarding Agent", description: "Auto-creates accounts, sends tutorials, schedules setup flows, verifies activation." },
      { id: "agt_11", name: "Health Monitoring Agent", description: "Tracks usage, detects drop-offs, triggers intervention, upsell opportunities." },
      { id: "agt_12", name: "Support Agent", description: "Handles tickets, routes edge cases to founder, builds knowledge base automatically." }
    ]
  },
  {
    id: "eng_5",
    name: "Finance + Compliance Engine",
    objective: "Zero admin burden.",
    label: "Replaces Accountant",
    kpis: [],
    agents: [
      { id: "agt_13", name: "Billing Agent", description: "Auto invoice, payment reminders, reconciliation, GST tagging." },
      { id: "agt_14", name: "Compliance Agent", description: "Tracks filings, collects documents, generates reports, audit prep." },
      { id: "agt_15", name: "Cash Flow Agent", description: "Forecasts runway, optimizes pricing, flags risk." }
    ]
  },
  {
    id: "eng_6",
    name: "Data Moat Engine",
    objective: "Build irreplaceable data advantage.",
    label: "Your Defensibility",
    kpis: [],
    agents: [
      { id: "agt_16", name: "Intelligence Agent", description: "Aggregates ops benchmarks, pricing sensitivity, compliance cycles, performance metrics, generates insights." },
      { id: "agt_17", name: "Product Intelligence Agent", description: "Recommends new features, market expansion ideas, cross-sell signals." }
    ]
  },
  {
    id: "eng_7",
    name: "Capital + Expansion Engine",
    objective: "Scale aggressively.",
    label: "Replaces Strategy Team",
    kpis: [],
    agents: [
      { id: "agt_18", name: "Market Expansion Agent", description: "Identifies adjacent markets, simulates TAM, localization planning." },
      { id: "agt_19", name: "Fundraising Agent", description: "Prepares metrics, deck generation, investor targeting, narrative optimization." }
    ]
  }
];

const IDEAS = [
  {
    id: "idea_1",
    title: "Last-Mile Route Intelligence for Tier-2 Cities",
    sector: "Logistics",
    difficulty: "Medium",
    problem: "Delivery fleets lose margin due to poor routing in non-metro roads.",
    customer: "Regional e-commerce and 3PL operators.",
    solution: "AI route optimizer tuned for India traffic and lane-level constraints.",
    marketSize: "₹6,000Cr TAM in domestic last-mile optimization stack.",
    revenueModel: "SaaS per vehicle plus optimization usage fee.",
    mvpApproach: "Route planner dashboard + driver app for 20 vehicles.",
    competitiveAdvantage: "Indian map edge-case learning and vernacular UX.",
    indiaContext: "Works across cash-on-delivery and variable pin-code delivery density.",
  },
  {
    id: "idea_2",
    title: "Cold Chain Compliance Tracker",
    sector: "Logistics",
    difficulty: "Hard",
    problem: "Food and pharma shipments lose value due to temperature excursions.",
    customer: "Cold chain transporters and pharma distributors.",
    solution: "Low-cost IoT + compliance dashboard for trip-level alerts.",
    marketSize: "₹4,500Cr opportunity in pharma and food compliance operations.",
    revenueModel: "Hardware margin + monthly monitoring subscription.",
    mvpApproach: "Pilot 100 sensors across two pharma routes.",
    competitiveAdvantage: "Cheaper sensors and predictive spoilage model.",
    indiaContext: "Addresses power interruptions and route delays in summer heat zones.",
  },
  {
    id: "idea_3",
    title: "Freight Reconciliation Automation",
    sector: "Logistics",
    difficulty: "Medium",
    problem: "Freight invoices and POD reconciliation is manual and error-prone.",
    customer: "Manufacturers and mid-market distributors.",
    solution: "OCR + rule engine matching GRN, POD, and invoices.",
    marketSize: "₹3,800Cr across finance ops digitization for logistics.",
    revenueModel: "Per document + enterprise workflow subscription.",
    mvpApproach: "Upload portal with 5 workflow templates.",
    competitiveAdvantage: "India GST and transporter format coverage.",
    indiaContext: "Built for fragmented transporter ecosystem and mixed digital/manual docs.",
  },
  {
    id: "idea_4",
    title: "Factory Downtime Root-Cause SaaS",
    sector: "Manufacturing",
    difficulty: "Hard",
    problem: "Factories lose output due to untracked downtime reasons.",
    customer: "Auto components and process manufacturing plants.",
    solution: "Machine data + operator inputs to classify downtime causes.",
    marketSize: "₹7,200Cr in OEE improvement platforms.",
    revenueModel: "Plant subscription based on machine count.",
    mvpApproach: "Line-level dashboard on one production line.",
    competitiveAdvantage: "No-code taxonomy and Hindi operator interface.",
    indiaContext: "Handles mixed legacy PLC and manual logging setups.",
  },
  {
    id: "idea_5",
    title: "SME Procurement Bidding Exchange",
    sector: "Manufacturing",
    difficulty: "Medium",
    problem: "SMEs overpay for raw materials due to low negotiation power.",
    customer: "Small manufacturers in clusters.",
    solution: "Aggregated bidding marketplace for steel, polymers, chemicals.",
    marketSize: "₹10,000Cr+ value unlock in input procurement.",
    revenueModel: "Transaction fee + premium supplier analytics.",
    mvpApproach: "Single-category RFQ board for one cluster.",
    competitiveAdvantage: "Cluster network effects and verified supply quality scoring.",
    indiaContext: "Targets industrial clusters like Rajkot, Ludhiana, and Coimbatore.",
  },
  {
    id: "idea_6",
    title: "Predictive Maintenance for CNC Shops",
    sector: "Manufacturing",
    difficulty: "Hard",
    problem: "Unexpected CNC machine failures delay order fulfillment.",
    customer: "Precision machining shops.",
    solution: "Sensor-lite vibration anomaly detection with maintenance scheduler.",
    marketSize: "₹3,200Cr in SME maintenance digitization.",
    revenueModel: "Per machine subscription and service partner commission.",
    mvpApproach: "Mobile first app + CSV imports from machine controllers.",
    competitiveAdvantage: "Low-integration onboarding and local partner network.",
    indiaContext: "Fits job-work units with low IT budgets.",
  },
  {
    id: "idea_7",
    title: "Quality Escape Detection for Textiles",
    sector: "Manufacturing",
    difficulty: "Medium",
    problem: "Export returns happen due to late defect detection.",
    customer: "Textile processors and exporters.",
    solution: "Computer vision checks at fabric inspection stage.",
    marketSize: "₹2,900Cr in textile QA automation.",
    revenueModel: "Per line camera subscription + QA analytics tier.",
    mvpApproach: "Defect image classifier for top 10 defect types.",
    competitiveAdvantage: "Indian fabric defect dataset and process-specific models.",
    indiaContext: "Aligned with export compliance and buyer audit expectations.",
  },
  {
    id: "idea_8",
    title: "Input Cost Intelligence for Farmers",
    sector: "Agriculture",
    difficulty: "Medium",
    problem: "Farmers overpay for seeds and fertilizers due to fragmented pricing.",
    customer: "Farmer producer organizations and agri retailers.",
    solution: "Regional price intelligence + demand pooling app.",
    marketSize: "₹8,000Cr in agri input commerce efficiency.",
    revenueModel: "Platform fee from suppliers + analytics subscription for FPOs.",
    mvpApproach: "District-level pricing dashboard and group order flow.",
    competitiveAdvantage: "Localized language support and mandi-linked pricing models.",
    indiaContext: "Supports mixed online/offline purchase behavior.",
  },
  {
    id: "idea_9",
    title: "Crop Advisory with Revenue Forecasting",
    sector: "Agriculture",
    difficulty: "Hard",
    problem: "Farm planning ignores demand-side price trends.",
    customer: "Commercial farmers and agri cooperatives.",
    solution: "Advisory engine combining weather, mandi trends, and demand signals.",
    marketSize: "₹5,500Cr in premium agri decision platforms.",
    revenueModel: "Subscription per acre + advisory partner marketplace.",
    mvpApproach: "Single crop pilot with weekly advisory nudges.",
    competitiveAdvantage: "Yield + price outcome prediction for Indian markets.",
    indiaContext: "Includes monsoon variability and mandi arrival behaviors.",
  },
  {
    id: "idea_10",
    title: "Dairy Collection Digitization Stack",
    sector: "Agriculture",
    difficulty: "Medium",
    problem: "Milk collection centers struggle with fat/SNF disputes and leakages.",
    customer: "Dairy cooperatives and private milk aggregators.",
    solution: "Collection app with test integration and instant payout ledger.",
    marketSize: "₹4,200Cr in dairy process software opportunity.",
    revenueModel: "Center-based monthly fee and payment rail integrations.",
    mvpApproach: "Deploy at 10 village collection points.",
    competitiveAdvantage: "Offline-first syncing and local language receipts.",
    indiaContext: "Built for intermittent connectivity and village operator workflows.",
  },
  {
    id: "idea_11",
    title: "Solar Rooftop Maintenance Network",
    sector: "Energy",
    difficulty: "Medium",
    problem: "Rooftop installations underperform due to poor O&M visibility.",
    customer: "Commercial rooftop operators and EPC partners.",
    solution: "Performance anomaly dashboard + field technician dispatch.",
    marketSize: "₹3,000Cr in distributed solar O&M software and services.",
    revenueModel: "Annual maintenance contracts with software upsell.",
    mvpApproach: "Performance alerts and ticketing for 50 rooftops.",
    competitiveAdvantage: "Low-cost telemetry adapters and service SLAs.",
    indiaContext: "Targets rapid rooftop growth in C&I segments.",
  },
  {
    id: "idea_12",
    title: "Industrial Power Quality Monitor",
    sector: "Energy",
    difficulty: "Hard",
    problem: "Factories face outages and penalties due to power quality issues.",
    customer: "Energy-intensive manufacturing units.",
    solution: "Continuous power quality analytics with corrective recommendations.",
    marketSize: "₹2,700Cr in energy diagnostics and compliance stack.",
    revenueModel: "Device + annual software monitoring.",
    mvpApproach: "Install monitors in three factories and benchmark losses.",
    competitiveAdvantage: "Actionable RCA tied to tariff penalties.",
    indiaContext: "Handles DISCOM variability and captive power blending.",
  },
  {
    id: "idea_13",
    title: "Battery Lifecycle SaaS for EV Fleets",
    sector: "Energy",
    difficulty: "Hard",
    problem: "EV fleet operators lack visibility into battery health degradation.",
    customer: "Two-wheeler and three-wheeler fleet operators.",
    solution: "Battery SOH scoring and replacement planning.",
    marketSize: "₹6,500Cr in EV fleet operations optimization.",
    revenueModel: "Per vehicle subscription + battery partner leads.",
    mvpApproach: "Telematics ingest + health dashboard for one fleet.",
    competitiveAdvantage: "India driving pattern models for SOH prediction.",
    indiaContext: "Focused on high-usage last-mile EV fleets.",
  },
  {
    id: "idea_14",
    title: "AI SDR for Indian B2B Outreach",
    sector: "AI/SaaS",
    difficulty: "Medium",
    problem: "Founders spend too much time on low-yield outbound messaging.",
    customer: "B2B SaaS founders and agencies.",
    solution: "AI-generated personalized outreach with reply intent scoring.",
    marketSize: "₹5,800Cr in outbound automation tools.",
    revenueModel: "Per seat + usage-based personalization credits.",
    mvpApproach: "LinkedIn + email drafting assistant with CRM sync.",
    competitiveAdvantage: "India persona datasets and local context language tuning.",
    indiaContext: "Supports India-first targeting and global export outreach.",
  },
  {
    id: "idea_15",
    title: "GST Workflow Copilot for SMEs",
    sector: "AI/SaaS",
    difficulty: "Medium",
    problem: "GST filing workflows remain complex for growing SMEs.",
    customer: "SME finance teams and CA firms.",
    solution: "AI assistant for reconciliation, exceptions, and filing prep.",
    marketSize: "₹7,000Cr in tax-tech automation.",
    revenueModel: "Monthly subscription tiered by invoice volume.",
    mvpApproach: "Exception triage copilot for GSTR-1 and 3B.",
    competitiveAdvantage: "Indian tax rules and filing calendar intelligence.",
    indiaContext: "Designed for CA-assisted filing model common in India.",
  },
  {
    id: "idea_16",
    title: "Regional Language Support Automation",
    sector: "AI/SaaS",
    difficulty: "Medium",
    problem: "Support teams struggle with multilingual customer conversations.",
    customer: "D2C and BFSI support teams.",
    solution: "LLM assistant for response drafts in major Indian languages.",
    marketSize: "₹4,000Cr in customer support efficiency tooling.",
    revenueModel: "Per agent + API usage.",
    mvpApproach: "Ticket response copilot for 3 regional languages.",
    competitiveAdvantage: "Domain-tuned language quality for business use-cases.",
    indiaContext: "Supports Hindi, Tamil, Telugu, Marathi workflow at scale.",
  },
  {
    id: "idea_17",
    title: "B2B Tender Intelligence Platform",
    sector: "AI/SaaS",
    difficulty: "Hard",
    problem: "SMEs miss tenders and RFPs due to poor discovery processes.",
    customer: "Government suppliers and infra contractors.",
    solution: "Tender scraping, relevance scoring, and bid calendar automation.",
    marketSize: "₹3,400Cr in govtech procurement support.",
    revenueModel: "Subscription by tender volume and sectors tracked.",
    mvpApproach: "Daily tender digest + keyword relevance alerts.",
    competitiveAdvantage: "Contextual ranking and compliance checklist generation.",
    indiaContext: "Optimized for GeM and state procurement portals.",
  },
  {
    id: "idea_18",
    title: "Warehouse Workforce Productivity OS",
    sector: "Logistics",
    difficulty: "Medium",
    problem: "Warehouse picking productivity is not measured in real-time.",
    customer: "3PL warehouses and D2C fulfillment operators.",
    solution: "Task allocation and worker productivity dashboard.",
    marketSize: "₹2,600Cr in warehouse operations software.",
    revenueModel: "Per warehouse subscription + handheld device integrations.",
    mvpApproach: "Pick-pack productivity tracker in one warehouse.",
    competitiveAdvantage: "Shift-based gamification and vernacular worker flows.",
    indiaContext: "Aligned with labor-intensive fulfillment centers.",
  },
  {
    id: "idea_19",
    title: "Spare Parts Demand Forecasting",
    sector: "Manufacturing",
    difficulty: "Hard",
    problem: "OEM suppliers face stock-outs and excess inventory in service parts.",
    customer: "Auto OEM vendors and distributor networks.",
    solution: "SKU-level forecasting and replenishment recommendations.",
    marketSize: "₹4,800Cr in inventory planning software.",
    revenueModel: "Annual license + SKU volume fee.",
    mvpApproach: "Demand prediction for top 300 SKUs.",
    competitiveAdvantage: "India vehicle parc and regional service trend data.",
    indiaContext: "Works with fragmented dealer and distributor network.",
  },
  {
    id: "idea_20",
    title: "FPO Working Capital Marketplace",
    sector: "Agriculture",
    difficulty: "Hard",
    problem: "FPOs lack fast short-term credit for procurement cycles.",
    customer: "Farmer producer organizations and agri traders.",
    solution: "Embedded finance marketplace with invoice-based underwriting.",
    marketSize: "₹9,000Cr potential in agri working capital.",
    revenueModel: "Lender commission + platform fee.",
    mvpApproach: "Onboard 10 FPOs and two NBFC partners.",
    competitiveAdvantage: "Commodity cycle risk model and repayment behavior scoring.",
    indiaContext: "Supports crop seasonality and mandi-linked cash cycles.",
  },
  {
    id: "idea_21",
    title: "EV Charging Utilization Optimizer",
    sector: "Energy",
    difficulty: "Medium",
    problem: "Public chargers have low utilization and uneven load distribution.",
    customer: "Charge point operators and fleet depots.",
    solution: "Dynamic pricing and demand routing platform.",
    marketSize: "₹3,300Cr in charging network software.",
    revenueModel: "SaaS + incremental utilization revenue share.",
    mvpApproach: "Pilot with one CPO across 25 chargers.",
    competitiveAdvantage: "Demand forecasting by corridor and time block.",
    indiaContext: "Optimized for mixed EV segments and grid constraints.",
  },
  {
    id: "idea_22",
    title: "Vendor Compliance AI for Enterprises",
    sector: "AI/SaaS",
    difficulty: "Medium",
    problem: "Enterprise procurement teams struggle with vendor compliance checks.",
    customer: "Large Indian enterprises with many vendors.",
    solution: "Automated compliance collection and risk scoring.",
    marketSize: "₹4,900Cr in procurement automation.",
    revenueModel: "Enterprise subscription by vendor count.",
    mvpApproach: "Workflow for onboarding + annual renewals.",
    competitiveAdvantage: "Indian statutory document validation engine.",
    indiaContext: "Covers GST, PF, ESI, and labor-law documentation.",
  },
  {
    id: "idea_23",
    title: "B2B Credit Risk Assistant",
    sector: "AI/SaaS",
    difficulty: "Hard",
    problem: "SME suppliers struggle with payment defaults from buyers.",
    customer: "B2B suppliers extending credit terms.",
    solution: "Buyer risk scoring with invoice collection workflow.",
    marketSize: "₹6,700Cr in trade-credit intelligence.",
    revenueModel: "Subscription + recovery partner referral fee.",
    mvpApproach: "Risk engine with past invoice behavior and bureau inputs.",
    competitiveAdvantage: "Collections playbooks and cash-flow adjusted scoring.",
    indiaContext: "Designed for Udyam/MSME credit ecosystems.",
  },
  {
    id: "idea_24",
    title: "Agri Input Counterfeit Detection",
    sector: "Agriculture",
    difficulty: "Medium",
    problem: "Counterfeit agri inputs reduce yield and farmer trust.",
    customer: "Input manufacturers and agri retailers.",
    solution: "QR traceability with field verification app.",
    marketSize: "₹2,400Cr in brand protection and traceability tooling.",
    revenueModel: "Per SKU tagging + brand dashboard subscription.",
    mvpApproach: "Pilot with one seed brand across two states.",
    competitiveAdvantage: "Tamper-proof verification linked to dealer network.",
    indiaContext: "Useful in high counterfeit markets with rural retail chains.",
  },
  {
    id: "idea_25",
    title: "Industrial Waste-to-Value Exchange",
    sector: "Manufacturing",
    difficulty: "Hard",
    problem: "Factories discard recyclable waste with poor monetization.",
    customer: "Mid-sized manufacturing plants.",
    solution: "Marketplace matching waste streams to recyclers.",
    marketSize: "₹5,000Cr in circular economy process efficiency.",
    revenueModel: "Transaction fee and compliance reporting SaaS.",
    mvpApproach: "Waste listing + verified recycler bidding flow.",
    competitiveAdvantage: "Quality scoring and logistics tie-ups.",
    indiaContext: "Aligned with tightening EPR and sustainability reporting.",
  },
];

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (err) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      // Ignore storage errors silently.
    }
  }, [key, state]);

  return [state, setState];
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function dateKeyShift(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function scoreColor(score) {
  if (score < 40) return TOKENS.red;
  if (score < 70) return TOKENS.yellow;
  return TOKENS.green;
}

function hasNoZeroActivity(dayActivity) {
  if (!dayActivity) return false;
  return (
    (dayActivity.customerConversations || 0) > 0 ||
    (dayActivity.outreachMessages || 0) > 0 ||
    (dayActivity.ideasLogged || 0) > 0 ||
    !!dayActivity.journalEntry ||
    !!dayActivity.dailyChecklistCompletion
  );
}

function normalizeAiErrorMessage(errorText) {
  const raw = String(errorText || "");
  if (raw.toLowerCase().includes("insufficient_quota")) {
    return "OpenAI quota exceeded. Update billing/credits and redeploy with a valid OPENAI_API_KEY.";
  }
  if (raw.toLowerCase().includes("openai_api_key is not set")) {
    return "OPENAI_API_KEY is missing on server. Add it in Render environment variables.";
  }
  return raw || "AI request failed.";
}

function normalizeAnthropicErrorMessage(errorText) {
  const raw = String(errorText || "");
  const lower = raw.toLowerCase();
  if (lower.includes("anthropic_api_key is not set")) {
    return "ANTHROPIC_API_KEY is missing on server. Add it in Render environment variables.";
  }
  if (lower.includes("insufficient") || lower.includes("credit") || lower.includes("quota")) {
    return "Anthropic quota or credits are exhausted. Update billing/credits and retry.";
  }
  return raw || "Anthropic request failed.";
}

async function callOpenAI({ prompt, system }) {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      system,
      prompt,
    }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(normalizeAiErrorMessage(json.error));
  }
  return json.content || "";
}

async function callAnthropic({ prompt, system }) {
  const response = await fetch("/api/anthropic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-latest",
      temperature: 0.3,
      max_tokens: 1200,
      system,
      prompt,
    }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(normalizeAnthropicErrorMessage(json.error));
  }
  return json.content || "";
}

function clampScore(value, min = 0, max = 10) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function computeWeightedProbabilityScore(factors) {
  return Math.round(
    PROBABILITY_FACTORS.reduce((sum, factor) => {
      return sum + (Number(factors[factor.key]) || 0) * factor.weight * 10;
    }, 0)
  );
}

function getRevenueTier(score) {
  if (score <= 40) return "Low probability startup";
  if (score <= 60) return "Moderate potential startup";
  if (score <= 80) return "High potential startup";
  return "Venture scale startup";
}

function getRevenueProbabilities(score) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  return {
    tenCr: Math.max(5, Math.min(99, Math.round(s * 1.15))),
    hundredCr: Math.max(1, Math.min(95, Math.round((s - 20) * 1.25))),
    fiveHundredCr: Math.max(0, Math.min(85, Math.round((s - 45) * 1.3))),
  };
}

function getDecisionActions(score) {
  if (score >= 81) {
    return [
      "Conduct 20 customer interviews in 14 days.",
      "Build and ship MVP in 3 weeks.",
      "Launch 3 paid pilots with explicit ROI targets.",
    ];
  }
  if (score >= 61) {
    return [
      "Run 12 customer interviews with pricing tests.",
      "Prototype core workflow and measure activation.",
      "Secure 2 design partners before expanding scope.",
    ];
  }
  if (score >= 41) {
    return [
      "Tighten ICP and narrow one painful use-case.",
      "Run willingness-to-pay interviews before building.",
      "Validate distribution channel with 50 targeted outreaches.",
    ];
  }
  return [
    "Reframe problem to a higher-urgency segment.",
    "Rework monetization model with clear ROI proof.",
    "Collect stronger evidence before MVP investment.",
  ];
}

function parseMarketSizeCr(text) {
  const normalized = String(text || "").replace(/,/g, "");
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/i);
  return match ? Number(match[1]) : 0;
}

function keywordHits(text, words) {
  const hay = String(text || "").toLowerCase();
  return words.reduce((count, word) => (hay.includes(word) ? count + 1 : count), 0);
}

function createIdeaSignature(idea) {
  return [
    idea.title,
    idea.problem,
    idea.customer,
    idea.solution,
    idea.marketSize,
    idea.revenueModel,
    idea.competition,
    idea.mvpApproach,
    idea.moat,
    idea.competitiveAdvantage,
    idea.indiaContext,
  ]
    .map((item) => String(item || "").trim())
    .join("|");
}

function computeHeuristicFactorScores(idea) {
  const marketCr = parseMarketSizeCr(idea.marketSize);
  const marketSize =
    marketCr >= 10000
      ? 10
      : marketCr >= 7000
        ? 9
        : marketCr >= 5000
          ? 8
          : marketCr >= 3000
            ? 7
            : marketCr >= 1500
              ? 6
              : 5;

  const problemHitCount = keywordHits(idea.problem, [
    "loss",
    "delay",
    "penalty",
    "failure",
    "default",
    "urgent",
    "outage",
    "compliance",
    "critical",
  ]);
  const problemSeverity = clampScore(4 + problemHitCount, 1, 10);

  const wtpHits =
    keywordHits(idea.revenueModel, ["subscription", "annual", "license", "usage", "transaction", "contract"]) +
    keywordHits(idea.customer, ["enterprise", "operators", "manufacturers", "commercial", "b2b"]);
  const willingnessToPay = clampScore(4 + Math.round(wtpHits / 2), 1, 10);

  const competitionText = `${idea.competition || ""} ${idea.competitiveAdvantage || ""} ${idea.moat || ""}`;
  let competitionIntensity = 6;
  competitionIntensity -= keywordHits(competitionText, ["crowded", "saturated", "many competitors", "incumbent"]);
  competitionIntensity += keywordHits(competitionText, ["network effect", "proprietary", "differentiated", "moat"]);
  competitionIntensity = clampScore(competitionIntensity, 1, 10);

  const distributionHits =
    keywordHits(`${idea.customer} ${idea.indiaContext}`, [
      "cluster",
      "network",
      "aggregator",
      "partner",
      "marketplace",
      "existing",
    ]) + keywordHits(idea.solution, ["integration", "workflow"]);
  const distributionAdvantage = clampScore(4 + Math.round(distributionHits / 2), 1, 10);

  const founderInsightHits = keywordHits(`${idea.indiaContext} ${idea.problem}`, [
    "india",
    "vernacular",
    "gst",
    "discom",
    "mandi",
    "tier-2",
    "local",
    "regulatory",
  ]);
  const founderInsight = clampScore(4 + Math.round(founderInsightHits / 2), 1, 10);

  const recurringRevenuePotential = clampScore(
    3 +
    keywordHits(idea.revenueModel, ["subscription", "monthly", "annual", "platform fee", "saas", "monitoring"]) +
    keywordHits(idea.solution, ["dashboard", "analytics"]),
    1,
    10
  );

  const scalability = clampScore(
    3 +
    keywordHits(`${idea.solution} ${idea.mvpApproach}`, [
      "ai",
      "automation",
      "platform",
      "dashboard",
      "software",
      "api",
    ]) -
    keywordHits(`${idea.solution} ${idea.mvpApproach}`, ["manual", "services only", "consulting only"]),
    1,
    10
  );

  return {
    marketSize,
    problemSeverity,
    willingnessToPay,
    competitionIntensity,
    distributionAdvantage,
    founderInsight,
    recurringRevenuePotential,
    scalability,
  };
}

function buildProbabilityRecord({ idea, factors, reasoning, source, ideaSignature }) {
  const totalScore = computeWeightedProbabilityScore(factors);
  return {
    ideaId: idea.id,
    factors,
    totalScore,
    tier: getRevenueTier(totalScore),
    probabilities: getRevenueProbabilities(totalScore),
    reasoning:
      reasoning ||
      "Heuristic estimate based on market size, pain severity, monetization fit, distribution, and scalability signals.",
    source: source || "heuristic",
    ideaSignature: ideaSignature || createIdeaSignature(idea),
    updatedAt: new Date().toISOString(),
  };
}

function extractJsonObject(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    // Keep trying with code fences / embedded JSON blocks.
  }

  const fenced = raw.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1]);
    } catch (err) {
      // fall through
    }
  }

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(raw.slice(firstBrace, lastBrace + 1));
    } catch (err) {
      return null;
    }
  }
  return null;
}

function normalizeFactorScores(rawFactors, fallbackFactors) {
  const source = rawFactors && typeof rawFactors === "object" ? rawFactors : {};
  const findScore = (keys, fallback) => {
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") {
        return clampScore(Number(value), 0, 10);
      }
    }
    return clampScore(fallback, 0, 10);
  };

  return {
    marketSize: findScore(["marketSize", "market_size", "marketSizeScore"], fallbackFactors.marketSize),
    problemSeverity: findScore(
      ["problemSeverity", "problem_severity", "problemSeverityScore"],
      fallbackFactors.problemSeverity
    ),
    willingnessToPay: findScore(
      ["willingnessToPay", "willingness_to_pay", "willingnessToPayScore"],
      fallbackFactors.willingnessToPay
    ),
    competitionIntensity: findScore(
      ["competitionIntensity", "competition", "competition_intensity", "competitionScore"],
      fallbackFactors.competitionIntensity
    ),
    distributionAdvantage: findScore(
      ["distributionAdvantage", "distribution", "distribution_advantage", "distributionScore"],
      fallbackFactors.distributionAdvantage
    ),
    founderInsight: findScore(
      ["founderInsight", "founder_insight", "founderAdvantage", "founder_advantage"],
      fallbackFactors.founderInsight
    ),
    recurringRevenuePotential: findScore(
      ["recurringRevenuePotential", "recurring_revenue_potential", "revenuePotential", "revenue_potential"],
      fallbackFactors.recurringRevenuePotential
    ),
    scalability: findScore(["scalability", "scalabilityScore"], fallbackFactors.scalability),
  };
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
        backdropFilter: "blur(6px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Input({ style, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        background: TOKENS.surface,
        color: TOKENS.text,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        fontFamily: FONT_BODY,
        fontSize: 14,
        ...style,
      }}
    />
  );
}

function TextArea({ style, ...props }) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        background: TOKENS.surface,
        color: TOKENS.text,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        fontFamily: FONT_BODY,
        fontSize: 14,
        minHeight: 96,
        resize: "vertical",
        ...style,
      }}
    />
  );
}

function Select({ style, children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        background: TOKENS.surface,
        color: TOKENS.text,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        fontFamily: FONT_BODY,
        fontSize: 14,
        ...style,
      }}
    >
      {children}
    </select>
  );
}

function Button({ children, tone = "default", style, ...props }) {
  const toneStyles = {
    default: {
      background: TOKENS.surface,
      color: TOKENS.text,
      border: `1px solid ${TOKENS.border}`,
    },
    primary: {
      background: TOKENS.orange,
      color: "#fff",
      border: `1px solid ${TOKENS.orange}`,
    },
    success: {
      background: TOKENS.green,
      color: "#fff",
      border: `1px solid ${TOKENS.green}`,
    },
    danger: {
      background: TOKENS.red,
      color: "#fff",
      border: `1px solid ${TOKENS.red}`,
    },
  };

  return (
    <button
      {...props}
      style={{
        cursor: props.disabled ? "not-allowed" : "pointer",
        fontFamily: FONT_BODY,
        fontWeight: 600,
        fontSize: 14,
        borderRadius: 10,
        padding: "10px 14px",
        transition: "all 180ms ease",
        opacity: props.disabled ? 0.55 : 1,
        ...toneStyles[tone],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SectionTitle({ title, subtitle, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0, color: TOKENS.text, fontFamily: FONT_TITLE, fontSize: 28, fontWeight: 800 }}>
          {title}
        </h2>
        {subtitle ? (
          <div style={{ marginTop: 6, color: TOKENS.muted, fontFamily: FONT_BODY, fontSize: 14 }}>{subtitle}</div>
        ) : null}
      </div>
      {right}
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const toneColor =
    tone === "green" ? TOKENS.green : tone === "orange" ? TOKENS.orange : tone === "blue" ? TOKENS.blue : TOKENS.text;
  return (
    <Card>
      <div style={{ color: TOKENS.muted, fontFamily: FONT_BODY, fontSize: 13 }}>{label}</div>
      <div style={{ marginTop: 8, color: toneColor, fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700 }}>{value}</div>
    </Card>
  );
}

function FounderOS() {
  const [activeModule, setActiveModule] = useLocalStorageState("fo_active_module", "Dashboard");
  const [checklistItems, setChecklistItems] = useLocalStorageState("fo_checklist_items", CHECKLIST_ITEMS);
  const [dailyChecklistByDate, setDailyChecklistByDate] = useLocalStorageState("fo_daily_checklist", {});
  const [dailyActivity, setDailyActivity] = useLocalStorageState("fo_daily_activity", {});
  const [mrrHistory, setMrrHistory] = useLocalStorageState("fo_mrr_history", INITIAL_MRR_HISTORY);

  const [ideaLibrary, setIdeaLibrary] = useLocalStorageState("fo_idea_library", IDEAS);
  const [industriesLog, setIndustriesLog] = useLocalStorageState("fo_ideas_industries_log", []);
  const [painPointsLog, setPainPointsLog] = useLocalStorageState("fo_ideas_pain_points_log", []);
  const [ideaNotes, setIdeaNotes] = useLocalStorageState("fo_ideas_notes", []);
  const [shortlistedIdeaIds, setShortlistedIdeaIds] = useLocalStorageState("fo_ideas_shortlist", []);
  const [generatedIdeas, setGeneratedIdeas] = useLocalStorageState("fo_ideas_generated_ai", []);
  const [probabilityByIdea, setProbabilityByIdea] = useLocalStorageState("fo_probability_scores", {});
  const [probabilityOnlyHigh, setProbabilityOnlyHigh] = useLocalStorageState("fo_probability_only_high", false);

  const [validationItems, setValidationItems] = useLocalStorageState("fo_validation_items", []);
  const [interviewLogs, setInterviewLogs] = useLocalStorageState("fo_interview_logs", []);

  const [crmContacts, setCrmContacts] = useLocalStorageState("fo_crm_contacts", []);
  const [crmCallLogs, setCrmCallLogs] = useLocalStorageState("fo_crm_call_logs", []);

  const [deals, setDeals] = useLocalStorageState("fo_sales_deals", []);
  const [investors, setInvestors] = useLocalStorageState("fo_investors", INVESTOR_SEED);

  const [dailyPrioritiesByDate, setDailyPrioritiesByDate] = useLocalStorageState("fo_daily_priorities", {});
  const [dailyScheduleByDate, setDailyScheduleByDate] = useLocalStorageState("fo_daily_schedule", {});
  const [journalByDate, setJournalByDate] = useLocalStorageState("fo_journal_by_date", {});

  const [weeklyManualMetrics, setWeeklyManualMetrics] = useLocalStorageState("fo_weekly_manual_metrics", {
    meetingsBooked: 0,
    linkedinConnections: 0,
    featuresShipped: 0,
    revenueCalls: 0,
  });

  const [bookLibrary, setBookLibrary] = useLocalStorageState("fo_book_library", BOOKS);
  const [bookState, setBookState] = useLocalStorageState("fo_books_state", {});
  const [podcasts, setPodcasts] = useLocalStorageState("fo_podcasts", []);

  const [aiEngineProgress, setAiEngineProgress] = useLocalStorageState("fo_ai_engine_progress", {});
  const [aiEngineNotes, setAiEngineNotes] = useLocalStorageState("fo_ai_engine_notes", {});
  const [frameworkList, setFrameworkList] = useLocalStorageState("fo_framework_list", FRAMEWORKS);
  const [startupMistakeList, setStartupMistakeList] = useLocalStorageState("fo_mistake_list", STARTUP_MISTAKES);
  const [habitList, setHabitList] = useLocalStorageState("fo_habit_list", HABITS);
  const [vcScaleFactors, setVcScaleFactors] = useLocalStorageState("fo_vc_scale_factors", VC_SCALE_FACTORS);
  const [vcWeightModel, setVcWeightModel] = useLocalStorageState("fo_vc_weight_model", VC_WEIGHT_MODEL);
  const [scalePatternPlaybook, setScalePatternPlaybook] = useLocalStorageState(
    "fo_scale_pattern_playbook",
    SCALE_PATTERN_PLAYBOOK
  );
  const [mistakeChecks, setMistakeChecks] = useLocalStorageState("fo_mistake_checks", {});
  const [habitByDate, setHabitByDate] = useLocalStorageState("fo_habit_by_date", {});
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);

  const [ideaQuery, setIdeaQuery] = useState("");
  const [ideaSectorFilter, setIdeaSectorFilter] = useState("All");
  const [ideaDifficultyFilter, setIdeaDifficultyFilter] = useState("All");
  const [ideaCompareIds, setIdeaCompareIds] = useState([]);
  const [ideaPrompt, setIdeaPrompt] = useState("");
  const [ideaAiLoading, setIdeaAiLoading] = useState(false);
  const [ideaAiError, setIdeaAiError] = useState("");
  const [probabilityAiLoadingIdeaId, setProbabilityAiLoadingIdeaId] = useState("");
  const [probabilityAiError, setProbabilityAiError] = useState("");

  const [interviewAiInput, setInterviewAiInput] = useState("");
  const [interviewAiSummary, setInterviewAiSummary] = useState("");
  const [interviewAiLoading, setInterviewAiLoading] = useState(false);
  const [interviewAiError, setInterviewAiError] = useState("");

  const [outreachInput, setOutreachInput] = useState("");
  const [outreachOutput, setOutreachOutput] = useState("");
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [outreachError, setOutreachError] = useState("");

  const [investorUpdateInput, setInvestorUpdateInput] = useState("");
  const [investorUpdateOutput, setInvestorUpdateOutput] = useState("");
  const [investorUpdateLoading, setInvestorUpdateLoading] = useState(false);
  const [investorUpdateError, setInvestorUpdateError] = useState("");

  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroCycles, setPomodoroCycles] = useLocalStorageState("fo_pomodoro_cycles", 0);

  const [mrrInputMonth, setMrrInputMonth] = useState("");
  const [mrrInputValue, setMrrInputValue] = useState("");
  const [churnRate, setChurnRate] = useLocalStorageState("fo_churn_rate", 4);
  const [cacInput, setCacInput] = useState(40000);
  const [ltvArpu, setLtvArpu] = useState(12000);
  const [ltvGrossMargin, setLtvGrossMargin] = useState(0.75);
  const [ltvChurnMonthly, setLtvChurnMonthly] = useState(0.04);

  const [newContact, setNewContact] = useState({
    name: "",
    company: "",
    industry: "",
    problem: "",
    stage: "Lead",
    notes: "",
    lastContactDate: todayKey(),
  });

  const [newDeal, setNewDeal] = useState({
    name: "",
    company: "",
    stage: "Prospect",
    value: "",
  });

  const [newInterview, setNewInterview] = useState({
    company: "",
    contact: "",
    date: todayKey(),
    signalStrength: 3,
    keyInsight: "",
    stage: "Exploring",
    problemReal: false,
    budgetConfirmed: false,
    urgency: 3,
  });

  const [newCallLog, setNewCallLog] = useState({
    contactId: "",
    date: todayKey(),
    summary: "",
  });

  const [newIndustry, setNewIndustry] = useState("");
  const [newPainPoint, setNewPainPoint] = useState("");
  const [newIdeaNote, setNewIdeaNote] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newScheduleTask, setNewScheduleTask] = useState({ slot: "", task: "" });
  const [newInvestorName, setNewInvestorName] = useState("");
  const [newBookDraft, setNewBookDraft] = useState({ title: "", category: "Execution" });
  const [newFrameworkText, setNewFrameworkText] = useState("");
  const [newMistakeText, setNewMistakeText] = useState("");
  const [newHabitText, setNewHabitText] = useState("");
  const [newIdeaDraft, setNewIdeaDraft] = useState({
    title: "",
    sector: "AI/SaaS",
    difficulty: "Medium",
    problem: "",
    customer: "",
    solution: "",
    marketSize: "",
    revenueModel: "",
    mvpApproach: "",
    competitiveAdvantage: "",
    indiaContext: "",
  });

  const [dailyLogInput, setDailyLogInput] = useState({
    customerConversations: "",
    outreachMessages: "",
  });

  const [newPriority, setNewPriority] = useState("");
  const [bookFilter, setBookFilter] = useState("All");
  const [newPodcast, setNewPodcast] = useState({ title: "", host: "", status: "Planned", notes: "" });
  const [notice, setNotice] = useState(null);
  const backupFileRef = useRef(null);

  const todaysDate = todayKey();

  const showNotice = (text, tone = "info") => {
    setNotice({ text, tone, id: Date.now() });
  };

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const fontId = "founder-os-fonts";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@500;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (!pomodoroRunning) return undefined;
    const timer = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          setPomodoroRunning(false);
          setPomodoroCycles((x) => x + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pomodoroRunning, setPomodoroCycles]);

  const exportBackup = () => {
    try {
      const payload = {};
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (!key || !key.startsWith("fo_")) continue;
        const value = window.localStorage.getItem(key);
        payload[key] = value ? JSON.parse(value) : null;
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `founderos-backup-${todaysDate}.json`;
      anchor.click();
      window.URL.revokeObjectURL(url);
      showNotice("Backup exported successfully.", "success");
    } catch (err) {
      showNotice("Backup export failed. Please try again.", "error");
    }
  };

  const triggerImportPicker = () => {
    backupFileRef.current?.click();
  };

  const importBackup = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid backup format");
      }
      Object.keys(parsed).forEach((key) => {
        if (!key.startsWith("fo_")) return;
        window.localStorage.setItem(key, JSON.stringify(parsed[key]));
      });
      showNotice("Backup imported. Reloading...", "success");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      showNotice("Backup import failed. Use a valid FounderOS backup JSON.", "error");
    } finally {
      event.target.value = "";
    }
  };

  const updateTodayActivity = (updates) => {
    setDailyActivity((prev) => {
      const current = prev[todaysDate] || {
        customerConversations: 0,
        outreachMessages: 0,
        ideasLogged: 0,
        journalEntry: false,
        dailyChecklistCompletion: false,
        interviewsConducted: 0,
        ideasShortlisted: 0,
        contactsAdded: 0,
        industriesResearched: 0,
        painPointsLogged: 0,
        ideasGenerated: 0,
      };

      const next = { ...current };
      Object.keys(updates).forEach((k) => {
        const value = updates[k];
        if (typeof value === "number") {
          next[k] = (next[k] || 0) + value;
        } else {
          next[k] = value;
        }
      });

      return { ...prev, [todaysDate]: next };
    });
  };

  const checklistForToday = dailyChecklistByDate[todaysDate] || {};
  const completedChecklistCount = checklistItems.filter((item) => checklistForToday[item]).length;

  useEffect(() => {
    const allDone = checklistItems.length > 0 && completedChecklistCount === checklistItems.length;
    setDailyActivity((prev) => {
      const day = prev[todaysDate] || {};
      if (day.dailyChecklistCompletion === allDone) return prev;
      return {
        ...prev,
        [todaysDate]: {
          ...day,
          dailyChecklistCompletion: allDone,
        },
      };
    });
  }, [completedChecklistCount, todaysDate, setDailyActivity]);

  useEffect(() => {
    const hasJournal = !!(journalByDate[todaysDate] || "").trim();
    setDailyActivity((prev) => {
      const day = prev[todaysDate] || {};
      if (day.journalEntry === hasJournal) return prev;
      return {
        ...prev,
        [todaysDate]: {
          ...day,
          journalEntry: hasJournal,
        },
      };
    });
  }, [journalByDate, todaysDate, setDailyActivity]);

  const isMobile = windowWidth < 980;
  const mrrCurrent = (mrrHistory[mrrHistory.length - 1]?.mrr || 0) * 100000;

  const mrrChartData = useMemo(
    () =>
      mrrHistory.map((x) => ({
        month: x.month,
        mrr: Number((x.mrr || 0) * 100000),
      })),
    [mrrHistory]
  );

  const allIdeas = useMemo(() => {
    return [
      ...ideaLibrary,
      ...generatedIdeas.map((g, index) => ({
        id: `ai_${index}_${g.title || "idea"}`,
        title: g.title || `AI Idea ${index + 1}`,
        sector: g.sector || "AI/SaaS",
        difficulty: g.difficulty || "Medium",
        problem: g.problem || "",
        customer: g.customer || "",
        solution: g.solution || "",
        marketSize: g.marketSize || "",
        revenueModel: g.revenueModel || "",
        mvpApproach: g.mvpApproach || "",
        competitiveAdvantage: g.competitiveAdvantage || "",
        indiaContext: g.indiaContext || "",
      })),
    ];
  }, [ideaLibrary, generatedIdeas]);

  const filteredIdeas = useMemo(() => {
    return allIdeas.filter((idea) => {
      const bySector = ideaSectorFilter === "All" || idea.sector === ideaSectorFilter;
      const byDifficulty = ideaDifficultyFilter === "All" || idea.difficulty === ideaDifficultyFilter;
      const hay = `${idea.title} ${idea.problem} ${idea.customer} ${idea.solution}`.toLowerCase();
      const bySearch = !ideaQuery.trim() || hay.includes(ideaQuery.toLowerCase());
      return bySector && byDifficulty && bySearch;
    });
  }, [allIdeas, ideaSectorFilter, ideaDifficultyFilter, ideaQuery]);

  useEffect(() => {
    setProbabilityByIdea((prev) => {
      const next = { ...prev };
      const liveIds = new Set();
      let changed = false;

      allIdeas.forEach((idea) => {
        liveIds.add(idea.id);
        const ideaSignature = createIdeaSignature(idea);
        const current = prev[idea.id];
        if (!current || current.ideaSignature !== ideaSignature) {
          const factors = computeHeuristicFactorScores(idea);
          next[idea.id] = buildProbabilityRecord({
            idea,
            factors,
            source: "heuristic",
            ideaSignature,
            reasoning:
              "Auto-recalculated using weighted framework due to new idea data or updated idea fields.",
          });
          changed = true;
        }
      });

      Object.keys(next).forEach((ideaId) => {
        if (!liveIds.has(ideaId)) {
          delete next[ideaId];
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [allIdeas, setProbabilityByIdea]);

  const probabilityRows = useMemo(() => {
    return allIdeas
      .map((idea) => {
        const fallback = buildProbabilityRecord({
          idea,
          factors: computeHeuristicFactorScores(idea),
          source: "heuristic",
          ideaSignature: createIdeaSignature(idea),
        });
        const probability = probabilityByIdea[idea.id] || fallback;
        return { idea, probability };
      })
      .sort((a, b) => b.probability.totalScore - a.probability.totalScore);
  }, [allIdeas, probabilityByIdea]);

  const filteredProbabilityRows = useMemo(() => {
    if (!probabilityOnlyHigh) return probabilityRows;
    return probabilityRows.filter((row) => row.probability.totalScore >= 70);
  }, [probabilityRows, probabilityOnlyHigh]);

  const validationByStage = useMemo(() => {
    const map = {};
    VALIDATION_STAGES.forEach((stage) => {
      map[stage] = validationItems.filter((item) => item.stage === stage);
    });
    return map;
  }, [validationItems]);

  const currentDayActivity = dailyActivity[todaysDate] || {};
  const noZeroToday = hasNoZeroActivity(currentDayActivity);
  const activeDaysCount = useMemo(
    () => Object.values(dailyActivity).filter((d) => hasNoZeroActivity(d)).length,
    [dailyActivity]
  );

  const executionStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 3650; i += 1) {
      const key = dateKeyShift(i);
      if (hasNoZeroActivity(dailyActivity[key])) streak += 1;
      else break;
    }
    return streak;
  }, [dailyActivity]);

  const weeklyExecutionScore = useMemo(() => {
    let checklistDays = 0;
    let interviews = 0;
    let ideasShortlistedCount = 0;
    let journals = 0;
    let contacts = 0;
    for (let i = 0; i < 7; i += 1) {
      const d = dailyActivity[dateKeyShift(i)] || {};
      if (d.dailyChecklistCompletion) checklistDays += 1;
      interviews += d.interviewsConducted || 0;
      ideasShortlistedCount += d.ideasShortlisted || 0;
      if (d.journalEntry) journals += 1;
      contacts += d.contactsAdded || 0;
    }
    const checklistScore = Math.min((checklistDays / 7) * 100, 100) * 0.3;
    const interviewScore = Math.min((interviews / 10) * 100, 100) * 0.2;
    const shortlistScore = Math.min((ideasShortlistedCount / 10) * 100, 100) * 0.2;
    const journalScore = Math.min((journals / 7) * 100, 100) * 0.15;
    const contactScore = Math.min((contacts / 20) * 100, 100) * 0.15;
    return Math.round(checklistScore + interviewScore + shortlistScore + journalScore + contactScore);
  }, [dailyActivity]);

  const scoreTone = scoreColor(weeklyExecutionScore);

  const opportunityCounter = useMemo(() => {
    let industries = 0;
    let painPoints = 0;
    let ideas = 0;
    Object.values(dailyActivity).forEach((d) => {
      industries += d.industriesResearched || 0;
      painPoints += d.painPointsLogged || 0;
      ideas += d.ideasGenerated || 0;
    });
    return {
      industries,
      painPoints,
      ideas,
      total: industries + painPoints + ideas,
    };
  }, [dailyActivity]);

  const customerCount = useMemo(
    () => crmContacts.filter((contact) => contact.stage === "Customer").length,
    [crmContacts]
  );

  const arrValue = mrrCurrent * 12;
  const acv = customerCount > 0 ? arrValue / customerCount : 0;

  const salesStageCounts = useMemo(
    () =>
      SALES_STAGES.map((stage) => ({
        stage,
        count: deals.filter((deal) => deal.stage === stage).length,
      })),
    [deals]
  );

  const funnelData = useMemo(
    () =>
      SALES_STAGES.map((stage, idx) => ({
        name: stage,
        value: deals.filter((deal) => deal.stage === stage).length || 0.1,
        fill: [TOKENS.orange, TOKENS.blue, TOKENS.purple, TOKENS.yellow, TOKENS.green, TOKENS.red][idx],
      })),
    [deals]
  );

  const expectedRevenue = useMemo(
    () =>
      deals.reduce((sum, deal) => {
        const value = Number(deal.value) || 0;
        return sum + value * (SALES_PROB[deal.stage] || 0);
      }, 0),
    [deals]
  );

  const weeklyDerived = useMemo(() => {
    let customerInterviews = 0;
    let outreachSent = 0;
    for (let i = 0; i < 7; i += 1) {
      const d = dailyActivity[dateKeyShift(i)] || {};
      customerInterviews += d.interviewsConducted || 0;
      outreachSent += d.outreachMessages || 0;
    }
    return {
      customerInterviews,
      outreachSent,
    };
  }, [dailyActivity]);

  const weeklyKpis = useMemo(
    () => [
      { key: "customerInterviews", label: "Customer Interviews", value: weeklyDerived.customerInterviews, target: 25 },
      { key: "outreachSent", label: "Outreach Sent", value: weeklyDerived.outreachSent, target: 120 },
      { key: "meetingsBooked", label: "Meetings Booked", value: weeklyManualMetrics.meetingsBooked, target: 20 },
      {
        key: "linkedinConnections",
        label: "LinkedIn Connections",
        value: weeklyManualMetrics.linkedinConnections,
        target: 80,
      },
      { key: "featuresShipped", label: "Features Shipped", value: weeklyManualMetrics.featuresShipped, target: 8 },
      { key: "revenueCalls", label: "Revenue Calls", value: weeklyManualMetrics.revenueCalls, target: 15 },
    ],
    [weeklyDerived, weeklyManualMetrics]
  );

  const ltv = useMemo(() => {
    const churn = Number(ltvChurnMonthly) || 0;
    if (churn <= 0) return 0;
    return ((Number(ltvArpu) || 0) * (Number(ltvGrossMargin) || 0)) / churn;
  }, [ltvArpu, ltvGrossMargin, ltvChurnMonthly]);

  const ltvCacRatio = (Number(cacInput) || 0) > 0 ? ltv / Number(cacInput) : 0;

  const filteredBooks = useMemo(
    () => bookLibrary.filter((book) => bookFilter === "All" || book.category === bookFilter),
    [bookFilter, bookLibrary]
  );

  const toggleChecklist = (item) => {
    setDailyChecklistByDate((prev) => {
      const day = prev[todaysDate] || {};
      return {
        ...prev,
        [todaysDate]: {
          ...day,
          [item]: !day[item],
        },
      };
    });
  };

  const promptEditText = (title, initialValue = "") => {
    const next = window.prompt(title, String(initialValue || ""));
    if (next === null) return null;
    return next.trim();
  };

  const addChecklistItem = () => {
    const item = newChecklistItem.trim();
    if (!item) {
      showNotice("Checklist item cannot be empty.", "error");
      return;
    }
    if (checklistItems.includes(item)) {
      showNotice("Checklist item already exists.", "error");
      return;
    }
    setChecklistItems((prev) => [...prev, item]);
    setNewChecklistItem("");
    showNotice("Checklist item added.", "success");
  };

  const editChecklistItem = (index) => {
    const updated = promptEditText("Edit checklist item", checklistItems[index]);
    if (updated === null) return;
    if (!updated) {
      showNotice("Checklist item cannot be empty.", "error");
      return;
    }
    setChecklistItems((prev) => prev.map((item, i) => (i === index ? updated : item)));
    setDailyChecklistByDate((prev) => {
      const next = {};
      Object.keys(prev).forEach((date) => {
        const day = { ...(prev[date] || {}) };
        if (day[checklistItems[index]] !== undefined) {
          day[updated] = day[checklistItems[index]];
          delete day[checklistItems[index]];
        }
        next[date] = day;
      });
      return next;
    });
    showNotice("Checklist item updated.", "success");
  };

  const deleteChecklistItem = (index) => {
    const item = checklistItems[index];
    if (!window.confirm(`Delete checklist item "${item}"?`)) return;
    setChecklistItems((prev) => prev.filter((_, i) => i !== index));
    setDailyChecklistByDate((prev) => {
      const next = {};
      Object.keys(prev).forEach((date) => {
        const day = { ...(prev[date] || {}) };
        delete day[item];
        next[date] = day;
      });
      return next;
    });
    showNotice("Checklist item deleted.", "success");
  };

  const addMRREntry = () => {
    const m = mrrInputMonth.trim();
    const v = Number(mrrInputValue);
    if (!m || !v) {
      showNotice("Enter both month and MRR value to add a data point.", "error");
      return;
    }
    setMrrHistory((prev) => [...prev, { month: m, mrr: v / 100000 }]);
    setMrrInputMonth("");
    setMrrInputValue("");
    showNotice(`MRR entry added for ${m}.`, "success");
  };

  const editMRREntry = (index) => {
    const row = mrrHistory[index];
    const month = promptEditText("Edit month", row?.month || "");
    if (month === null || !month) return;
    const valueRaw = promptEditText("Edit MRR value (INR)", String(Math.round((row?.mrr || 0) * 100000)));
    if (valueRaw === null) return;
    const value = Number(valueRaw);
    if (!value) {
      showNotice("MRR value must be a valid number.", "error");
      return;
    }
    setMrrHistory((prev) => prev.map((entry, i) => (i === index ? { ...entry, month, mrr: value / 100000 } : entry)));
    showNotice("MRR entry updated.", "success");
  };

  const deleteMRREntry = (index) => {
    if (!window.confirm("Delete this MRR entry?")) return;
    setMrrHistory((prev) => prev.filter((_, i) => i !== index));
    showNotice("MRR entry deleted.", "success");
  };

  const addIdeaNote = () => {
    const text = newIdeaNote.trim();
    if (!text) {
      showNotice("Write an idea before adding it.", "error");
      return;
    }
    setIdeaNotes((prev) => [...prev, { id: `note_${Date.now()}`, text, date: todaysDate }]);
    setNewIdeaNote("");
    updateTodayActivity({ ideasLogged: 1, ideasGenerated: 1 });
    showNotice("Idea logged.", "success");
  };

  const editIdeaNote = (id) => {
    const current = ideaNotes.find((item) => item.id === id);
    if (!current) return;
    const text = promptEditText("Edit idea note", current.text);
    if (text === null || !text) return;
    setIdeaNotes((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)));
    showNotice("Idea note updated.", "success");
  };

  const deleteIdeaNote = (id) => {
    if (!window.confirm("Delete this idea note?")) return;
    setIdeaNotes((prev) => prev.filter((item) => item.id !== id));
    showNotice("Idea note deleted.", "success");
  };

  const addIndustry = () => {
    const value = newIndustry.trim();
    if (!value) {
      showNotice("Enter an industry name first.", "error");
      return;
    }
    setIndustriesLog((prev) => [...prev, { id: `ind_${Date.now()}`, value, date: todaysDate }]);
    setNewIndustry("");
    updateTodayActivity({ industriesResearched: 1 });
    showNotice("Industry research logged.", "success");
  };

  const editIndustryLog = (id) => {
    const current = industriesLog.find((item) => item.id === id);
    if (!current) return;
    const value = promptEditText("Edit industry log", current.value);
    if (value === null || !value) return;
    setIndustriesLog((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
    showNotice("Industry log updated.", "success");
  };

  const deleteIndustryLog = (id) => {
    if (!window.confirm("Delete this industry log?")) return;
    setIndustriesLog((prev) => prev.filter((item) => item.id !== id));
    showNotice("Industry log deleted.", "success");
  };

  const addPainPoint = () => {
    const value = newPainPoint.trim();
    if (!value) {
      showNotice("Enter a pain point before adding.", "error");
      return;
    }
    setPainPointsLog((prev) => [...prev, { id: `pain_${Date.now()}`, value, date: todaysDate }]);
    setNewPainPoint("");
    updateTodayActivity({ painPointsLogged: 1 });
    showNotice("Pain point logged.", "success");
  };

  const editPainPointLog = (id) => {
    const current = painPointsLog.find((item) => item.id === id);
    if (!current) return;
    const value = promptEditText("Edit pain point", current.value);
    if (value === null || !value) return;
    setPainPointsLog((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
    showNotice("Pain point updated.", "success");
  };

  const deletePainPointLog = (id) => {
    if (!window.confirm("Delete this pain point?")) return;
    setPainPointsLog((prev) => prev.filter((item) => item.id !== id));
    showNotice("Pain point deleted.", "success");
  };

  const addIdeaToLibrary = () => {
    if (!newIdeaDraft.title.trim() || !newIdeaDraft.problem.trim() || !newIdeaDraft.customer.trim()) {
      showNotice("Add at least title, problem, and customer for a new idea.", "error");
      return;
    }
    const entry = {
      id: `idea_custom_${Date.now()}`,
      title: newIdeaDraft.title.trim(),
      sector: newIdeaDraft.sector,
      difficulty: newIdeaDraft.difficulty,
      problem: newIdeaDraft.problem.trim(),
      customer: newIdeaDraft.customer.trim(),
      solution: newIdeaDraft.solution.trim(),
      marketSize: newIdeaDraft.marketSize.trim(),
      revenueModel: newIdeaDraft.revenueModel.trim(),
      mvpApproach: newIdeaDraft.mvpApproach.trim(),
      competitiveAdvantage: newIdeaDraft.competitiveAdvantage.trim(),
      indiaContext: newIdeaDraft.indiaContext.trim(),
      competition: "",
      moat: "",
    };
    setIdeaLibrary((prev) => [entry, ...prev]);
    setNewIdeaDraft({
      title: "",
      sector: "AI/SaaS",
      difficulty: "Medium",
      problem: "",
      customer: "",
      solution: "",
      marketSize: "",
      revenueModel: "",
      mvpApproach: "",
      competitiveAdvantage: "",
      indiaContext: "",
    });
    showNotice("Custom idea added to Ideas Lab.", "success");
  };

  const editIdeaRecord = (ideaId) => {
    const current = ideaLibrary.find((idea) => idea.id === ideaId);
    if (!current) return;
    const title = promptEditText("Edit idea title", current.title);
    if (title === null || !title) return;
    const problem = promptEditText("Edit problem", current.problem);
    if (problem === null || !problem) return;
    const customer = promptEditText("Edit customer", current.customer);
    if (customer === null || !customer) return;
    const solution = promptEditText("Edit solution", current.solution);
    if (solution === null) return;
    const marketSize = promptEditText("Edit market size", current.marketSize);
    if (marketSize === null) return;
    const revenueModel = promptEditText("Edit revenue model", current.revenueModel);
    if (revenueModel === null) return;
    const mvpApproach = promptEditText("Edit MVP approach", current.mvpApproach);
    if (mvpApproach === null) return;
    const competitiveAdvantage = promptEditText("Edit competitive advantage", current.competitiveAdvantage);
    if (competitiveAdvantage === null) return;
    const indiaContext = promptEditText("Edit India context", current.indiaContext);
    if (indiaContext === null) return;
    setIdeaLibrary((prev) =>
      prev.map((idea) =>
        idea.id === ideaId
          ? {
            ...idea,
            title,
            problem,
            customer,
            solution,
            marketSize,
            revenueModel,
            mvpApproach,
            competitiveAdvantage,
            indiaContext,
          }
          : idea
      )
    );
    showNotice("Idea updated.", "success");
  };

  const deleteIdeaRecord = (ideaId) => {
    const current = ideaLibrary.find((idea) => idea.id === ideaId);
    if (!current) return;
    if (!window.confirm(`Delete idea "${current.title}"?`)) return;
    setIdeaLibrary((prev) => prev.filter((idea) => idea.id !== ideaId));
    setShortlistedIdeaIds((prev) => prev.filter((id) => id !== ideaId));
    setIdeaCompareIds((prev) => prev.filter((id) => id !== ideaId));
    setProbabilityByIdea((prev) => {
      const next = { ...prev };
      delete next[ideaId];
      return next;
    });
    showNotice("Idea deleted.", "success");
  };

  const saveAiIdeaToLibrary = (idea) => {
    const saved = {
      ...idea,
      id: `idea_ai_saved_${Date.now()}`,
    };
    setIdeaLibrary((prev) => [saved, ...prev]);
    showNotice("AI idea saved to editable library.", "success");
  };

  const deleteAiIdea = (ideaId) => {
    const parts = String(ideaId).split("_");
    const aiIndex = Number(parts[1]);
    if (Number.isNaN(aiIndex)) return;
    setGeneratedIdeas((prev) => prev.filter((_, idx) => idx !== aiIndex));
    setShortlistedIdeaIds((prev) => prev.filter((id) => id !== ideaId));
    setIdeaCompareIds((prev) => prev.filter((id) => id !== ideaId));
    setProbabilityByIdea((prev) => {
      const next = { ...prev };
      delete next[ideaId];
      return next;
    });
    showNotice("AI idea removed.", "success");
  };

  const toggleShortlist = (ideaId) => {
    setShortlistedIdeaIds((prev) => {
      const exists = prev.includes(ideaId);
      if (exists) {
        showNotice("Idea removed from shortlist.", "info");
        return prev.filter((id) => id !== ideaId);
      }
      updateTodayActivity({ ideasShortlisted: 1, ideasLogged: 1 });
      showNotice("Idea shortlisted.", "success");
      return [...prev, ideaId];
    });
  };

  const toggleCompare = (ideaId) => {
    setIdeaCompareIds((prev) => {
      if (prev.includes(ideaId)) return prev.filter((id) => id !== ideaId);
      if (prev.length >= 3) {
        showNotice("Comparison supports max 3 ideas. Oldest replaced.", "info");
        return [...prev.slice(1), ideaId];
      }
      return [...prev, ideaId];
    });
  };

  const runIdeaGenerator = async () => {
    setIdeaAiLoading(true);
    setIdeaAiError("");
    try {
      const prompt = `
Generate 3 India-first B2B startup ideas in JSON array format.
Each object keys:
title, sector, difficulty, problem, customer, solution, marketSize, revenueModel, mvpApproach, competitiveAdvantage, indiaContext.
Context from founder: ${ideaPrompt || "26-year-old founder targeting high-growth B2B in India"}.
Return only JSON.
      `;
      const result = await callOpenAI({
        prompt,
        system: "You are a startup strategist focused on practical execution in India.",
      });
      const parsed = JSON.parse(result);
      if (Array.isArray(parsed)) {
        setGeneratedIdeas((prev) => [...parsed, ...prev].slice(0, 40));
        updateTodayActivity({ ideasGenerated: parsed.length, ideasLogged: parsed.length });
        showNotice(`Generated ${parsed.length} AI ideas.`, "success");
      } else {
        throw new Error("Model did not return a valid JSON array.");
      }
    } catch (err) {
      const message = err.message || "Idea generation failed.";
      setIdeaAiError(message);
      showNotice(message, "error");
    } finally {
      setIdeaAiLoading(false);
    }
  };

  const recalculateProbabilityHeuristics = () => {
    setProbabilityByIdea((prev) => {
      const next = { ...prev };
      allIdeas.forEach((idea) => {
        next[idea.id] = buildProbabilityRecord({
          idea,
          factors: computeHeuristicFactorScores(idea),
          source: "heuristic",
          ideaSignature: createIdeaSignature(idea),
          reasoning: "Recalculated using FounderOS weighted heuristic model.",
        });
      });
      return next;
    });
    showNotice("Startup Probability Engine recalculated from current idea data.", "success");
  };

  const evaluateIdeaProbabilityWithAI = async (idea) => {
    setProbabilityAiError("");
    setProbabilityAiLoadingIdeaId(idea.id);
    try {
      const prompt = `
Evaluate the startup idea below and score it across market size, problem severity, willingness to pay, competition intensity, distribution advantage, founder insight, recurring revenue potential, and scalability.
Return strict JSON:
{
  "scores": {
    "marketSize": 0-10,
    "problemSeverity": 0-10,
    "willingnessToPay": 0-10,
    "competitionIntensity": 0-10,
    "distributionAdvantage": 0-10,
    "founderInsight": 0-10,
    "recurringRevenuePotential": 0-10,
    "scalability": 0-10
  },
  "reasoning": "short explanation",
  "recommendedActions": ["action1","action2","action3"]
}
Idea Data:
${JSON.stringify(
        {
          title: idea.title,
          problem: idea.problem,
          customer: idea.customer,
          solution: idea.solution,
          marketSize: idea.marketSize,
          revenueModel: idea.revenueModel,
          competition: idea.competition || "",
          mvpApproach: idea.mvpApproach,
          moat: idea.moat || idea.competitiveAdvantage || "",
          indiaContext: idea.indiaContext || "",
        },
        null,
        2
      )}
      `;

      const responseText = await callAnthropic({
        system:
          "You are an investor-grade startup evaluator. Be critical, realistic, and output strict JSON only.",
        prompt,
      });

      const parsed = extractJsonObject(responseText);
      if (!parsed) {
        throw new Error("AI response was not valid JSON. Please retry.");
      }

      const baseline = computeHeuristicFactorScores(idea);
      const factors = normalizeFactorScores(parsed.scores || parsed.factors || parsed, baseline);
      const reasoning =
        parsed.reasoning ||
        parsed.explanation ||
        "AI evaluated this idea across market, monetization, competition, and scalability factors.";

      const recommendedActions = Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [];
      const finalReasoning =
        recommendedActions.length > 0 ? `${reasoning}\nActions: ${recommendedActions.join(" | ")}` : reasoning;

      setProbabilityByIdea((prev) => ({
        ...prev,
        [idea.id]: buildProbabilityRecord({
          idea,
          factors,
          source: "anthropic",
          ideaSignature: createIdeaSignature(idea),
          reasoning: finalReasoning,
        }),
      }));

      showNotice(`AI probability evaluation updated for "${idea.title}".`, "success");
    } catch (err) {
      const message = err.message || "AI probability evaluation failed.";
      setProbabilityAiError(message);
      showNotice(message, "error");
    } finally {
      setProbabilityAiLoadingIdeaId("");
    }
  };

  const addInterview = () => {
    if (!newInterview.company.trim() || !newInterview.contact.trim()) {
      showNotice("Company and contact are required for interview logs.", "error");
      return;
    }
    const entry = { ...newInterview, id: `int_${Date.now()}` };
    setInterviewLogs((prev) => [...prev, entry]);

    if (newInterview.keyInsight.trim()) {
      setValidationItems((prev) => [
        ...prev,
        {
          id: `val_${Date.now()}`,
          title: `${newInterview.company} - ${newInterview.contact}`,
          stage: newInterview.stage,
          notes: newInterview.keyInsight,
          problemReal: newInterview.problemReal,
          budgetConfirmed: newInterview.budgetConfirmed,
          urgency: Number(newInterview.urgency) || 3,
        },
      ]);
    }

    updateTodayActivity({ customerConversations: 1, interviewsConducted: 1 });
    showNotice("Interview logged successfully.", "success");
    setNewInterview({
      company: "",
      contact: "",
      date: todaysDate,
      signalStrength: 3,
      keyInsight: "",
      stage: "Exploring",
      problemReal: false,
      budgetConfirmed: false,
      urgency: 3,
    });
  };

  const moveValidation = (id, stage) => {
    setValidationItems((prev) => prev.map((item) => (item.id === id ? { ...item, stage } : item)));
  };

  const editValidationItemNotes = (id) => {
    const current = validationItems.find((item) => item.id === id);
    if (!current) return;
    const notes = promptEditText("Edit validation notes", current.notes || "");
    if (notes === null) return;
    setValidationItems((prev) => prev.map((item) => (item.id === id ? { ...item, notes } : item)));
    showNotice("Validation note updated.", "success");
  };

  const deleteValidationItem = (id) => {
    if (!window.confirm("Delete this validation card?")) return;
    setValidationItems((prev) => prev.filter((item) => item.id !== id));
    showNotice("Validation card deleted.", "success");
  };

  const editInterviewLog = (id) => {
    const current = interviewLogs.find((item) => item.id === id);
    if (!current) return;
    const keyInsight = promptEditText("Edit interview insight", current.keyInsight || "");
    if (keyInsight === null) return;
    setInterviewLogs((prev) => prev.map((item) => (item.id === id ? { ...item, keyInsight } : item)));
    showNotice("Interview log updated.", "success");
  };

  const deleteInterviewLog = (id) => {
    if (!window.confirm("Delete this interview log?")) return;
    setInterviewLogs((prev) => prev.filter((item) => item.id !== id));
    showNotice("Interview log deleted.", "success");
  };

  const runInterviewAnalysis = async () => {
    if (!interviewAiInput.trim()) {
      setInterviewAiError("Paste interview notes first.");
      showNotice("Paste interview notes first.", "error");
      return;
    }
    setInterviewAiLoading(true);
    setInterviewAiError("");
    try {
      const result = await callOpenAI({
        system: "You summarize customer interviews for startup validation decisions.",
        prompt: `
Analyze these startup interview notes and output:
1) Problem reality score /10
2) Budget confidence /10
3) Urgency score /10
4) Top objections
5) Recommended next experiment
Notes:
${interviewAiInput}
        `,
      });
      setInterviewAiSummary(result);
      showNotice("Interview analysis generated.", "success");
    } catch (err) {
      const message = err.message || "Interview analysis failed.";
      setInterviewAiError(message);
      showNotice(message, "error");
    } finally {
      setInterviewAiLoading(false);
    }
  };

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.company.trim()) {
      showNotice("Name and company are required to add a contact.", "error");
      return;
    }
    const id = `c_${Date.now()}`;
    setCrmContacts((prev) => [...prev, { ...newContact, id }]);
    setNewContact({
      name: "",
      company: "",
      industry: "",
      problem: "",
      stage: "Lead",
      notes: "",
      lastContactDate: todaysDate,
    });
    updateTodayActivity({ contactsAdded: 1 });
    showNotice("Contact added to CRM.", "success");
  };

  const updateContactField = (id, key, value) => {
    setCrmContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, [key]: value } : contact)));
  };

  const deleteContact = (id) => {
    if (!window.confirm("Delete this contact?")) return;
    setCrmContacts((prev) => prev.filter((contact) => contact.id !== id));
    setCrmCallLogs((prev) => prev.filter((log) => log.contactId !== id));
    showNotice("Contact deleted.", "success");
  };

  const addCallLog = () => {
    if (!newCallLog.contactId || !newCallLog.summary.trim()) {
      showNotice("Select a contact and add call notes.", "error");
      return;
    }
    setCrmCallLogs((prev) => [...prev, { id: `call_${Date.now()}`, ...newCallLog }]);
    setNewCallLog({ contactId: "", date: todaysDate, summary: "" });
    showNotice("Call log saved.", "success");
  };

  const editCallLog = (id) => {
    const current = crmCallLogs.find((item) => item.id === id);
    if (!current) return;
    const summary = promptEditText("Edit call summary", current.summary);
    if (summary === null || !summary) return;
    setCrmCallLogs((prev) => prev.map((log) => (log.id === id ? { ...log, summary } : log)));
    showNotice("Call log updated.", "success");
  };

  const deleteCallLog = (id) => {
    if (!window.confirm("Delete this call log?")) return;
    setCrmCallLogs((prev) => prev.filter((log) => log.id !== id));
    showNotice("Call log deleted.", "success");
  };

  const runOutreachGenerator = async () => {
    if (!outreachInput.trim()) {
      setOutreachError("Add outreach context first.");
      showNotice("Add outreach context first.", "error");
      return;
    }
    setOutreachLoading(true);
    setOutreachError("");
    try {
      const result = await callOpenAI({
        system: "You write concise B2B outreach messages with clear CTA.",
        prompt: `
Create 3 outreach variants (email + LinkedIn DM) for this context:
${outreachInput}
Tone: founder-led, practical, high credibility.
Include a strong CTA and one line value proposition each.
        `,
      });
      setOutreachOutput(result);
      updateTodayActivity({ outreachMessages: 3 });
      showNotice("Outreach messages generated.", "success");
    } catch (err) {
      const message = err.message || "Outreach generation failed.";
      setOutreachError(message);
      showNotice(message, "error");
    } finally {
      setOutreachLoading(false);
    }
  };

  const addDeal = () => {
    if (!newDeal.name.trim() || !newDeal.company.trim()) {
      showNotice("Deal name and company are required.", "error");
      return;
    }
    setDeals((prev) => [...prev, { ...newDeal, id: `deal_${Date.now()}`, value: Number(newDeal.value) || 0 }]);
    setNewDeal({ name: "", company: "", stage: "Prospect", value: "" });
    showNotice("Deal added to pipeline.", "success");
  };

  const updateDeal = (id, key, value) => {
    setDeals((prev) =>
      prev.map((deal) => (deal.id === id ? { ...deal, [key]: key === "value" ? Number(value) || 0 : value } : deal))
    );
  };

  const deleteDeal = (id) => {
    if (!window.confirm("Delete this deal?")) return;
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
    showNotice("Deal deleted.", "success");
  };

  const updateInvestorStage = (id, stage) => {
    setInvestors((prev) => prev.map((inv) => (inv.id === id ? { ...inv, stage } : inv)));
  };

  const updateInvestorNotes = (id, notes) => {
    setInvestors((prev) => prev.map((inv) => (inv.id === id ? { ...inv, notes } : inv)));
  };

  const addInvestor = () => {
    const name = newInvestorName.trim();
    if (!name) {
      showNotice("Investor name is required.", "error");
      return;
    }
    setInvestors((prev) => [...prev, { id: `inv_custom_${Date.now()}`, name, stage: "Researching", notes: "" }]);
    setNewInvestorName("");
    showNotice("Investor added.", "success");
  };

  const deleteInvestor = (id) => {
    if (!window.confirm("Delete this investor entry?")) return;
    setInvestors((prev) => prev.filter((inv) => inv.id !== id));
    showNotice("Investor deleted.", "success");
  };

  const runInvestorUpdateGenerator = async () => {
    setInvestorUpdateLoading(true);
    setInvestorUpdateError("");
    try {
      const result = await callOpenAI({
        system: "You write crisp investor updates with traction and asks.",
        prompt: `
Create a weekly investor update email for an Indian founder.
Include sections:
Highlights, Metrics, Product, Customers, Risks, Asks.
Context:
${investorUpdateInput || "No custom context provided."}
Core numbers:
MRR: ${formatINR(mrrCurrent)}
Expected Pipeline Revenue: ${formatINR(expectedRevenue)}
Execution Score: ${weeklyExecutionScore}
        `,
      });
      setInvestorUpdateOutput(result);
      showNotice("Investor update generated.", "success");
    } catch (err) {
      const message = err.message || "Investor update generation failed.";
      setInvestorUpdateError(message);
      showNotice(message, "error");
    } finally {
      setInvestorUpdateLoading(false);
    }
  };

  const prioritiesForToday = dailyPrioritiesByDate[todaysDate] || [];
  const scheduleForToday = dailyScheduleByDate[todaysDate] || [
    { id: "s1", slot: "07:00-09:00", task: "Deep Work", done: false },
    { id: "s2", slot: "09:30-11:00", task: "Sales Outreach", done: false },
    { id: "s3", slot: "11:30-13:00", task: "Customer Interviews", done: false },
    { id: "s4", slot: "15:00-16:00", task: "Learning", done: false },
    { id: "s5", slot: "17:00-18:00", task: "Networking", done: false },
  ];

  const addPriority = () => {
    const text = newPriority.trim();
    if (!text) {
      showNotice("Write a priority before adding.", "error");
      return;
    }
    setDailyPrioritiesByDate((prev) => ({
      ...prev,
      [todaysDate]: [...(prev[todaysDate] || []), { id: `p_${Date.now()}`, text, done: false }],
    }));
    setNewPriority("");
    showNotice("Priority added.", "success");
  };

  const editPriority = (id) => {
    const current = prioritiesForToday.find((item) => item.id === id);
    if (!current) return;
    const text = promptEditText("Edit priority", current.text);
    if (text === null || !text) return;
    setDailyPrioritiesByDate((prev) => ({
      ...prev,
      [todaysDate]: (prev[todaysDate] || []).map((item) => (item.id === id ? { ...item, text } : item)),
    }));
    showNotice("Priority updated.", "success");
  };

  const deletePriority = (id) => {
    if (!window.confirm("Delete this priority?")) return;
    setDailyPrioritiesByDate((prev) => ({
      ...prev,
      [todaysDate]: (prev[todaysDate] || []).filter((item) => item.id !== id),
    }));
    showNotice("Priority deleted.", "success");
  };

  const togglePriority = (id) => {
    setDailyPrioritiesByDate((prev) => ({
      ...prev,
      [todaysDate]: (prev[todaysDate] || []).map((p) => (p.id === id ? { ...p, done: !p.done } : p)),
    }));
  };

  const toggleSchedule = (id) => {
    setDailyScheduleByDate((prev) => ({
      ...prev,
      [todaysDate]: scheduleForToday.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    }));
  };

  const addScheduleItem = () => {
    if (!newScheduleTask.slot.trim() || !newScheduleTask.task.trim()) {
      showNotice("Schedule slot and task are required.", "error");
      return;
    }
    setDailyScheduleByDate((prev) => ({
      ...prev,
      [todaysDate]: [
        ...(prev[todaysDate] || scheduleForToday),
        { id: `s_${Date.now()}`, slot: newScheduleTask.slot.trim(), task: newScheduleTask.task.trim(), done: false },
      ],
    }));
    setNewScheduleTask({ slot: "", task: "" });
    showNotice("Schedule item added.", "success");
  };

  const editScheduleItem = (id) => {
    const current = scheduleForToday.find((item) => item.id === id);
    if (!current) return;
    const slot = promptEditText("Edit time slot", current.slot);
    if (slot === null || !slot) return;
    const task = promptEditText("Edit task", current.task);
    if (task === null || !task) return;
    setDailyScheduleByDate((prev) => ({
      ...prev,
      [todaysDate]: scheduleForToday.map((item) => (item.id === id ? { ...item, slot, task } : item)),
    }));
    showNotice("Schedule item updated.", "success");
  };

  const deleteScheduleItem = (id) => {
    if (!window.confirm("Delete this schedule item?")) return;
    setDailyScheduleByDate((prev) => ({
      ...prev,
      [todaysDate]: scheduleForToday.filter((item) => item.id !== id),
    }));
    showNotice("Schedule item deleted.", "success");
  };

  const updateJournal = (text) => {
    setJournalByDate((prev) => ({ ...prev, [todaysDate]: text }));
  };

  const saveQuickLog = () => {
    const conv = Number(dailyLogInput.customerConversations) || 0;
    const out = Number(dailyLogInput.outreachMessages) || 0;
    if (!conv && !out) {
      showNotice("Enter conversations or outreach count to save.", "error");
      return;
    }
    updateTodayActivity({ customerConversations: conv, outreachMessages: out });
    setDailyLogInput({ customerConversations: "", outreachMessages: "" });
    showNotice("Execution activity logged.", "success");
  };

  const progressToGoal = Math.min((opportunityCounter.total / 100) * 100, 100);

  const toggleBookRead = (id) => {
    setBookState((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        read: !(prev[id]?.read || false),
      },
    }));
  };

  const updateBookNote = (id, note) => {
    setBookState((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        notes: note,
      },
    }));
  };

  const addBook = () => {
    if (!newBookDraft.title.trim()) {
      showNotice("Book title is required.", "error");
      return;
    }
    const entry = { id: `book_${Date.now()}`, title: newBookDraft.title.trim(), category: newBookDraft.category.trim() || "Execution" };
    setBookLibrary((prev) => [entry, ...prev]);
    setNewBookDraft({ title: "", category: "Execution" });
    showNotice("Book added.", "success");
  };

  const editBook = (id) => {
    const current = bookLibrary.find((book) => book.id === id);
    if (!current) return;
    const title = promptEditText("Edit book title", current.title);
    if (title === null || !title) return;
    const category = promptEditText("Edit book category", current.category);
    if (category === null || !category) return;
    setBookLibrary((prev) => prev.map((book) => (book.id === id ? { ...book, title, category } : book)));
    showNotice("Book updated.", "success");
  };

  const deleteBook = (id) => {
    if (!window.confirm("Delete this book?")) return;
    setBookLibrary((prev) => prev.filter((book) => book.id !== id));
    setBookState((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    showNotice("Book deleted.", "success");
  };

  const addPodcast = () => {
    if (!newPodcast.title.trim()) {
      showNotice("Podcast title is required.", "error");
      return;
    }
    setPodcasts((prev) => [...prev, { id: `pod_${Date.now()}`, ...newPodcast }]);
    setNewPodcast({ title: "", host: "", status: "Planned", notes: "" });
    showNotice("Podcast added.", "success");
  };

  const editPodcast = (id) => {
    const current = podcasts.find((pod) => pod.id === id);
    if (!current) return;
    const title = promptEditText("Edit podcast title", current.title);
    if (title === null || !title) return;
    const host = promptEditText("Edit podcast host", current.host || "");
    if (host === null) return;
    const notes = promptEditText("Edit podcast notes", current.notes || "");
    if (notes === null) return;
    setPodcasts((prev) => prev.map((pod) => (pod.id === id ? { ...pod, title, host, notes } : pod)));
    showNotice("Podcast updated.", "success");
  };

  const deletePodcast = (id) => {
    if (!window.confirm("Delete this podcast?")) return;
    setPodcasts((prev) => prev.filter((pod) => pod.id !== id));
    showNotice("Podcast deleted.", "success");
  };

  const runDiscoveryKit = () => {
    setActiveModule("Ideas Lab");
    showNotice("Discovery Kit activated: move to Ideas Lab and log 3 pain points.", "info");
  };

  const runValidationKit = () => {
    setActiveModule("Validation");
    showNotice("Validation Kit activated: log one interview now.", "info");
  };

  const runRevenueKit = () => {
    setActiveModule("Sales Pipeline");
    showNotice("Revenue Kit activated: add one deal and generate outreach.", "info");
  };

  const toggleMistake = (index) => {
    setMistakeChecks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const addFramework = () => {
    const text = newFrameworkText.trim();
    if (!text) {
      showNotice("Framework text is required.", "error");
      return;
    }
    setFrameworkList((prev) => [...prev, text]);
    setNewFrameworkText("");
    showNotice("Framework added.", "success");
  };

  const editFramework = (index) => {
    const updated = promptEditText("Edit framework", frameworkList[index]);
    if (updated === null || !updated) return;
    setFrameworkList((prev) => prev.map((item, i) => (i === index ? updated : item)));
    showNotice("Framework updated.", "success");
  };

  const deleteFramework = (index) => {
    if (!window.confirm("Delete this framework?")) return;
    setFrameworkList((prev) => prev.filter((_, i) => i !== index));
    showNotice("Framework deleted.", "success");
  };

  const addStartupMistake = () => {
    const text = newMistakeText.trim();
    if (!text) {
      showNotice("Mistake text is required.", "error");
      return;
    }
    setStartupMistakeList((prev) => [...prev, text]);
    setNewMistakeText("");
    showNotice("Mistake added.", "success");
  };

  const editStartupMistake = (index) => {
    const updated = promptEditText("Edit startup mistake", startupMistakeList[index]);
    if (updated === null || !updated) return;
    setStartupMistakeList((prev) => prev.map((item, i) => (i === index ? updated : item)));
    showNotice("Startup mistake updated.", "success");
  };

  const deleteStartupMistake = (index) => {
    if (!window.confirm("Delete this startup mistake?")) return;
    setStartupMistakeList((prev) => prev.filter((_, i) => i !== index));
    setMistakeChecks((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => {
        const numeric = Number(key);
        if (Number.isNaN(numeric)) return;
        if (numeric < index) next[numeric] = prev[key];
        if (numeric > index) next[numeric - 1] = prev[key];
      });
      return next;
    });
    showNotice("Startup mistake deleted.", "success");
  };

  const addHabit = () => {
    const text = newHabitText.trim();
    if (!text) {
      showNotice("Habit text is required.", "error");
      return;
    }
    setHabitList((prev) => [...prev, text]);
    setNewHabitText("");
    showNotice("Habit added.", "success");
  };

  const editHabit = (index) => {
    const oldHabit = habitList[index];
    const updated = promptEditText("Edit habit", oldHabit);
    if (updated === null || !updated) return;
    setHabitList((prev) => prev.map((item, i) => (i === index ? updated : item)));
    setHabitByDate((prev) => {
      const next = {};
      Object.keys(prev).forEach((date) => {
        const day = { ...(prev[date] || {}) };
        if (Object.prototype.hasOwnProperty.call(day, oldHabit)) {
          day[updated] = day[oldHabit];
          delete day[oldHabit];
        }
        next[date] = day;
      });
      return next;
    });
    showNotice("Habit updated.", "success");
  };

  const deleteHabit = (index) => {
    const habit = habitList[index];
    if (!window.confirm("Delete this habit?")) return;
    setHabitList((prev) => prev.filter((_, i) => i !== index));
    setHabitByDate((prev) => {
      const next = {};
      Object.keys(prev).forEach((date) => {
        const day = { ...(prev[date] || {}) };
        delete day[habit];
        next[date] = day;
      });
      return next;
    });
    showNotice("Habit deleted.", "success");
  };

  const addVcScaleFactor = () => {
    const title = promptEditText("New VC factor title", "");
    if (title === null || !title) return;
    const detail = promptEditText("New VC factor detail", "");
    if (detail === null || !detail) return;
    setVcScaleFactors((prev) => [...prev, { title, detail }]);
    showNotice("VC factor added.", "success");
  };

  const editVcScaleFactor = (index) => {
    const current = vcScaleFactors[index];
    if (!current) return;
    const title = promptEditText("Edit VC factor title", current.title);
    if (title === null || !title) return;
    const detail = promptEditText("Edit VC factor detail", current.detail);
    if (detail === null || !detail) return;
    setVcScaleFactors((prev) => prev.map((item, i) => (i === index ? { ...item, title, detail } : item)));
    showNotice("VC factor updated.", "success");
  };

  const deleteVcScaleFactor = (index) => {
    if (!window.confirm("Delete this VC factor?")) return;
    setVcScaleFactors((prev) => prev.filter((_, i) => i !== index));
    showNotice("VC factor deleted.", "success");
  };

  const addVcWeightRow = () => {
    const factor = promptEditText("New weight factor", "");
    if (factor === null || !factor) return;
    const weight = promptEditText("Weight (e.g. 10%)", "");
    if (weight === null || !weight) return;
    setVcWeightModel((prev) => [...prev, { factor, weight }]);
    showNotice("Weight row added.", "success");
  };

  const editVcWeightRow = (index) => {
    const current = vcWeightModel[index];
    if (!current) return;
    const factor = promptEditText("Edit factor", current.factor);
    if (factor === null || !factor) return;
    const weight = promptEditText("Edit weight", current.weight);
    if (weight === null || !weight) return;
    setVcWeightModel((prev) => prev.map((item, i) => (i === index ? { factor, weight } : item)));
    showNotice("Weight row updated.", "success");
  };

  const deleteVcWeightRow = (index) => {
    if (!window.confirm("Delete this weight row?")) return;
    setVcWeightModel((prev) => prev.filter((_, i) => i !== index));
    showNotice("Weight row deleted.", "success");
  };

  const addScalePattern = () => {
    const title = promptEditText("New pattern title", "");
    if (title === null || !title) return;
    const why = promptEditText("Why this pattern works", "");
    if (why === null || !why) return;
    const examples = promptEditText("Examples", "");
    if (examples === null) return;
    const indiaFit = promptEditText("India fit", "");
    if (indiaFit === null) return;
    setScalePatternPlaybook((prev) => [...prev, { title, why, examples, indiaFit }]);
    showNotice("Scale pattern added.", "success");
  };

  const editScalePattern = (index) => {
    const current = scalePatternPlaybook[index];
    if (!current) return;
    const title = promptEditText("Edit pattern title", current.title);
    if (title === null || !title) return;
    const why = promptEditText("Edit why this pattern works", current.why);
    if (why === null || !why) return;
    const examples = promptEditText("Edit examples", current.examples);
    if (examples === null) return;
    const indiaFit = promptEditText("Edit India fit", current.indiaFit);
    if (indiaFit === null) return;
    setScalePatternPlaybook((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title, why, examples, indiaFit } : item))
    );
    showNotice("Scale pattern updated.", "success");
  };

  const deleteScalePattern = (index) => {
    if (!window.confirm("Delete this scale pattern?")) return;
    setScalePatternPlaybook((prev) => prev.filter((_, i) => i !== index));
    showNotice("Scale pattern deleted.", "success");
  };

  const toggleHabit = (habit) => {
    setHabitByDate((prev) => {
      const day = prev[todaysDate] || {};
      return {
        ...prev,
        [todaysDate]: {
          ...day,
          [habit]: !day[habit],
        },
      };
    });
  };

  const interviewsCompleted = interviewLogs.length;
  const averageUrgency =
    validationItems.length > 0
      ? (
        validationItems.reduce((sum, item) => sum + (Number(item.urgency) || 0), 0) / validationItems.length
      ).toFixed(1)
      : "0.0";

  const problemRealPct =
    validationItems.length > 0
      ? Math.round((validationItems.filter((item) => item.problemReal).length / validationItems.length) * 100)
      : 0;

  const budgetConfirmedPct =
    validationItems.length > 0
      ? Math.round((validationItems.filter((item) => item.budgetConfirmed).length / validationItems.length) * 100)
      : 0;

  const renderDashboard = () => (
    <div style={{ display: "grid", gap: 16 }}>
      {!noZeroToday ? (
        <Card style={{ borderColor: TOKENS.red, background: "#2A1112" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle size={18} color={TOKENS.red} />
            <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 600 }}>
              No-Zero-Day Alert: no execution activity logged for {todaysDate}
            </div>
          </div>
        </Card>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 12 }}>
        <StatCard label="MRR" value={formatINR(mrrCurrent)} tone="orange" />
        <StatCard label="Customer Interviews" value={String(interviewsCompleted)} />
        <StatCard label="Outreach Sent (7d)" value={String(weeklyDerived.outreachSent)} />
        <StatCard label="Days Active" value={String(activeDaysCount)} />
        <StatCard label="Execution Streak" value={`${executionStreak} days`} tone="green" />
      </div>

      <Card>
        <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 12 }}>MRR Growth</div>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={mrrChartData}>
              <CartesianGrid stroke={TOKENS.border} />
              <XAxis dataKey="month" stroke={TOKENS.muted} />
              <YAxis stroke={TOKENS.muted} tickFormatter={(v) => `₹${Math.round(v / 100000)}L`} />
              <Tooltip
                contentStyle={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, color: TOKENS.text }}
                formatter={(value) => [formatINR(value), "MRR"]}
              />
              <Line type="monotone" dataKey="mrr" stroke={TOKENS.orange} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Input
            placeholder="Month (e.g. Jul)"
            value={mrrInputMonth}
            onChange={(e) => setMrrInputMonth(e.target.value)}
            style={{ maxWidth: 140 }}
          />
          <Input
            placeholder="MRR in INR"
            type="number"
            value={mrrInputValue}
            onChange={(e) => setMrrInputValue(e.target.value)}
            style={{ maxWidth: 180 }}
          />
          <Button tone="primary" onClick={addMRREntry}>
            Add MRR
          </Button>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 6, maxHeight: 190, overflow: "auto", paddingRight: 4 }}>
          {mrrHistory.map((row, index) => (
            <div
              key={`${row.month}_${index}`}
              style={{
                border: `1px solid ${TOKENS.border}`,
                borderRadius: 10,
                background: TOKENS.surface,
                padding: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ color: TOKENS.text, fontSize: 13 }}>
                {row.month} | <span style={{ fontFamily: FONT_MONO }}>{formatINR(Number(row.mrr || 0) * 100000)}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button style={{ padding: "5px 8px", fontSize: 12 }} onClick={() => editMRREntry(index)}>
                  Edit
                </Button>
                <Button
                  style={{ padding: "5px 8px", fontSize: 12 }}
                  tone="danger"
                  onClick={() => deleteMRREntry(index)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 12 }}>Milestone Tracker</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", gap: 10 }}>
          {MILESTONES.map((m) => {
            const target = m * 10000000;
            const done = arrValue >= target;
            return (
              <div
                key={m}
                style={{
                  border: `1px solid ${done ? TOKENS.green : TOKENS.border}`,
                  background: done ? "#0E221B" : TOKENS.surface,
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ color: TOKENS.muted, fontFamily: FONT_BODY, fontSize: 13 }}>Target ARR</div>
                <div style={{ marginTop: 6, color: TOKENS.text, fontFamily: FONT_MONO, fontWeight: 700 }}>
                  {formatINR(target)}
                </div>
                <div style={{ marginTop: 8, color: done ? TOKENS.green : TOKENS.muted, fontSize: 12 }}>
                  {done ? "Achieved" : "Pending"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 12 }}>
            Daily Checklist ({completedChecklistCount}/{checklistItems.length})
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {checklistItems.map((item, index) => (
              <label key={item} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={!!checklistForToday[item]} onChange={() => toggleChecklist(item)} />
                <span style={{ color: TOKENS.text, fontFamily: FONT_BODY }}>{item}</span>
                <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editChecklistItem(index)}>
                  Edit
                </Button>
                <Button style={{ padding: "4px 8px", fontSize: 12 }} tone="danger" onClick={() => deleteChecklistItem(index)}>
                  Delete
                </Button>
              </label>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <Input
              placeholder="New checklist item"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
            />
            <Button onClick={addChecklistItem}>Add</Button>
          </div>
        </Card>

        <Card>
          <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 12 }}>Execution Log</div>
          <div style={{ display: "grid", gap: 10 }}>
            <Input
              type="number"
              placeholder="Customer conversations (count)"
              value={dailyLogInput.customerConversations}
              onChange={(e) => setDailyLogInput((s) => ({ ...s, customerConversations: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Outreach messages (count)"
              value={dailyLogInput.outreachMessages}
              onChange={(e) => setDailyLogInput((s) => ({ ...s, outreachMessages: e.target.value }))}
            />
            <Button tone="primary" onClick={saveQuickLog}>
              Save Activity
            </Button>
          </div>

          <div style={{ marginTop: 14, fontSize: 13, color: TOKENS.muted }}>
            Today tracked: {currentDayActivity.customerConversations || 0} conversations,{" "}
            {currentDayActivity.outreachMessages || 0} outreach, {currentDayActivity.ideasLogged || 0} ideas, journal{" "}
            {currentDayActivity.journalEntry ? "done" : "pending"}, checklist{" "}
            {currentDayActivity.dailyChecklistCompletion ? "done" : "pending"}.
          </div>
        </Card>
      </div>

      <Card style={{ background: TOKENS.surface }}>
        <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 10 }}>Instant Action Kits</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          <Button onClick={runDiscoveryKit}>
            <Lightbulb size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Discovery Kit
          </Button>
          <Button onClick={runValidationKit}>
            <FlaskConical size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Validation Kit
          </Button>
          <Button onClick={runRevenueKit}>
            <TrendingUp size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Revenue Kit
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderIdeasLab = () => {
    const sectors = ["All", "Logistics", "Manufacturing", "Agriculture", "Energy", "AI/SaaS"];
    const difficulties = ["All", "Easy", "Medium", "Hard"];
    const compareIdeas = allIdeas.filter((idea) => ideaCompareIds.includes(idea.id));

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <Card style={{ background: TOKENS.surface }}>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700 }}>
              Opportunity Discovery Counter ({opportunityCounter.total}/100)
            </div>
            <div style={{ height: 8, borderRadius: 8, background: TOKENS.border, overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressToGoal}%`,
                  height: "100%",
                  background: progressToGoal >= 100 ? TOKENS.green : TOKENS.orange,
                  transition: "width 200ms ease",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: TOKENS.muted, fontSize: 13 }}>
              <span>Industries researched: {opportunityCounter.industries}</span>
              <span>Pain points logged: {opportunityCounter.painPoints}</span>
              <span>Ideas generated: {opportunityCounter.ideas}</span>
            </div>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
          <Card>
            <div style={{ color: TOKENS.muted, fontSize: 13 }}>Log industry researched</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Input value={newIndustry} onChange={(e) => setNewIndustry(e.target.value)} placeholder="e.g. Pharma logistics" />
              <Button onClick={addIndustry}>
                <Plus size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                Add
              </Button>
            </div>
            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
              {industriesLog
                .slice()
                .reverse()
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: `1px solid ${TOKENS.border}`,
                      borderRadius: 8,
                      padding: 8,
                      background: TOKENS.surface,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div style={{ color: TOKENS.text, fontSize: 12 }}>{item.value}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => editIndustryLog(item.id)}>
                        Edit
                      </Button>
                      <Button
                        tone="danger"
                        style={{ padding: "4px 8px", fontSize: 11 }}
                        onClick={() => deleteIndustryLog(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              {!industriesLog.length ? (
                <div style={{ color: TOKENS.muted, fontSize: 12 }}>No entries yet</div>
              ) : null}
            </div>
          </Card>
          <Card>
            <div style={{ color: TOKENS.muted, fontSize: 13 }}>Log pain point</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Input
                value={newPainPoint}
                onChange={(e) => setNewPainPoint(e.target.value)}
                placeholder="e.g. 12% spoilage in cold chain"
              />
              <Button onClick={addPainPoint}>
                <Plus size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                Add
              </Button>
            </div>
            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
              {painPointsLog
                .slice()
                .reverse()
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: `1px solid ${TOKENS.border}`,
                      borderRadius: 8,
                      padding: 8,
                      background: TOKENS.surface,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div style={{ color: TOKENS.text, fontSize: 12 }}>{item.value}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => editPainPointLog(item.id)}>
                        Edit
                      </Button>
                      <Button
                        tone="danger"
                        style={{ padding: "4px 8px", fontSize: 11 }}
                        onClick={() => deletePainPointLog(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              {!painPointsLog.length ? (
                <div style={{ color: TOKENS.muted, fontSize: 12 }}>No entries yet</div>
              ) : null}
            </div>
          </Card>
          <Card>
            <div style={{ color: TOKENS.muted, fontSize: 13 }}>Log idea</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Input value={newIdeaNote} onChange={(e) => setNewIdeaNote(e.target.value)} placeholder="Idea headline" />
              <Button onClick={addIdeaNote}>
                <Plus size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                Add
              </Button>
            </div>
            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
              {ideaNotes
                .slice()
                .reverse()
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: `1px solid ${TOKENS.border}`,
                      borderRadius: 8,
                      padding: 8,
                      background: TOKENS.surface,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div style={{ color: TOKENS.text, fontSize: 12 }}>{item.text}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => editIdeaNote(item.id)}>
                        Edit
                      </Button>
                      <Button
                        tone="danger"
                        style={{ padding: "4px 8px", fontSize: 11 }}
                        onClick={() => deleteIdeaNote(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              {!ideaNotes.length ? <div style={{ color: TOKENS.muted, fontSize: 12 }}>No entries yet</div> : null}
            </div>
          </Card>
        </div>

        <Card>
          <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Add Custom Idea</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 8 }}>
            <Input
              placeholder="Idea title"
              value={newIdeaDraft.title}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, title: e.target.value }))}
            />
            <Select value={newIdeaDraft.sector} onChange={(e) => setNewIdeaDraft((s) => ({ ...s, sector: e.target.value }))}>
              {sectors.slice(1).map((sector) => (
                <option key={sector}>{sector}</option>
              ))}
            </Select>
            <Select
              value={newIdeaDraft.difficulty}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, difficulty: e.target.value }))}
            >
              {difficulties.slice(1).map((level) => (
                <option key={level}>{level}</option>
              ))}
            </Select>
          </div>
          <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
            <TextArea
              placeholder="Problem"
              value={newIdeaDraft.problem}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, problem: e.target.value }))}
            />
            <TextArea
              placeholder="Customer"
              value={newIdeaDraft.customer}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, customer: e.target.value }))}
            />
            <TextArea
              placeholder="Solution"
              value={newIdeaDraft.solution}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, solution: e.target.value }))}
            />
            <TextArea
              placeholder="Market Size"
              value={newIdeaDraft.marketSize}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, marketSize: e.target.value }))}
            />
            <TextArea
              placeholder="Revenue Model"
              value={newIdeaDraft.revenueModel}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, revenueModel: e.target.value }))}
            />
            <TextArea
              placeholder="MVP Approach"
              value={newIdeaDraft.mvpApproach}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, mvpApproach: e.target.value }))}
            />
            <TextArea
              placeholder="Competitive Advantage"
              value={newIdeaDraft.competitiveAdvantage}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, competitiveAdvantage: e.target.value }))}
            />
            <TextArea
              placeholder="India Context"
              value={newIdeaDraft.indiaContext}
              onChange={(e) => setNewIdeaDraft((s) => ({ ...s, indiaContext: e.target.value }))}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <Button tone="primary" onClick={addIdeaToLibrary}>
              Add Idea
            </Button>
          </div>
        </Card>

        <Card>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 170px 170px", gap: 10 }}>
            <Input placeholder="Search ideas..." value={ideaQuery} onChange={(e) => setIdeaQuery(e.target.value)} />
            <Select value={ideaSectorFilter} onChange={(e) => setIdeaSectorFilter(e.target.value)}>
              {sectors.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Select value={ideaDifficultyFilter} onChange={(e) => setIdeaDifficultyFilter(e.target.value)}>
              {difficulties.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </div>
        </Card>

        <Card>
          <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 10 }}>
            AI Idea Generator (OpenAI)
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <TextArea
              value={ideaPrompt}
              onChange={(e) => setIdeaPrompt(e.target.value)}
              placeholder="Describe your target sector, customer, and constraints..."
            />
            <div style={{ display: "flex", gap: 8 }}>
              <Button tone="primary" onClick={runIdeaGenerator} disabled={ideaAiLoading}>
                <Sparkles size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                {ideaAiLoading ? "Generating..." : "Generate AI Ideas"}
              </Button>
              {ideaAiError ? <div style={{ color: TOKENS.red, fontSize: 13 }}>{ideaAiError}</div> : null}
            </div>
          </div>
        </Card>

        <div style={{ display: "grid", gap: 10 }}>
          {filteredIdeas.map((idea) => {
            const shortlisted = shortlistedIdeaIds.includes(idea.id);
            const selectedCompare = ideaCompareIds.includes(idea.id);
            const aiIdea = String(idea.id).startsWith("ai_");
            return (
              <Card key={idea.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: TOKENS.text, fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 20 }}>{idea.title}</div>
                    <div style={{ color: TOKENS.muted, marginTop: 4, fontSize: 13 }}>
                      {idea.sector} | {idea.difficulty}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button tone={shortlisted ? "success" : "default"} onClick={() => toggleShortlist(idea.id)}>
                      {shortlisted ? "Shortlisted" : "Shortlist"}
                    </Button>
                    <Button tone={selectedCompare ? "primary" : "default"} onClick={() => toggleCompare(idea.id)}>
                      Compare
                    </Button>
                    {!aiIdea ? (
                      <>
                        <Button onClick={() => editIdeaRecord(idea.id)}>Edit</Button>
                        <Button tone="danger" onClick={() => deleteIdeaRecord(idea.id)}>
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => saveAiIdeaToLibrary(idea)}>Save</Button>
                        <Button tone="danger" onClick={() => deleteAiIdea(idea.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ display: "grid", gap: 6, marginTop: 10, color: TOKENS.text, fontSize: 14 }}>
                  <div>
                    <strong style={{ color: TOKENS.orange }}>Problem:</strong> {idea.problem}
                  </div>
                  <div>
                    <strong style={{ color: TOKENS.orange }}>Customer:</strong> {idea.customer}
                  </div>
                  <div>
                    <strong style={{ color: TOKENS.orange }}>Solution:</strong> {idea.solution}
                  </div>
                  <div>
                    <strong style={{ color: TOKENS.orange }}>Market Size:</strong> {idea.marketSize}
                  </div>
                  <div>
                    <strong style={{ color: TOKENS.orange }}>Revenue Model:</strong> {idea.revenueModel}
                  </div>
                  <div>
                    <strong style={{ color: TOKENS.orange }}>MVP Approach:</strong> {idea.mvpApproach}
                  </div>
                  <div>
                    <strong style={{ color: TOKENS.orange }}>Competitive Advantage:</strong> {idea.competitiveAdvantage}
                  </div>
                  <div>
                    <strong style={{ color: TOKENS.orange }}>India Context:</strong> {idea.indiaContext}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {compareIdeas.length > 0 ? (
          <Card>
            <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 12 }}>Idea Comparison</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : `repeat(${compareIdeas.length}, minmax(0, 1fr))`,
                gap: 10,
              }}
            >
              {compareIdeas.map((idea) => (
                <div key={idea.id} style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 12, padding: 12 }}>
                  <div style={{ color: TOKENS.text, fontWeight: 700 }}>{idea.title}</div>
                  <div style={{ color: TOKENS.muted, marginTop: 6, fontSize: 13 }}>{idea.sector}</div>
                  <div style={{ color: TOKENS.text, marginTop: 8, fontSize: 13 }}>{idea.problem}</div>
                  <div style={{ color: TOKENS.text, marginTop: 8, fontSize: 13 }}>
                    <strong>Revenue:</strong> {idea.revenueModel}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    );
  };

  const renderStartupProbabilityEngine = () => {
    const leaderboard = filteredProbabilityRows;
    const topScoresData = leaderboard.slice(0, 10).map((row, index) => ({
      name: row.idea.title.length > 20 ? `${row.idea.title.slice(0, 20)}...` : row.idea.title,
      score: row.probability.totalScore,
      rank: index + 1,
    }));

    const tierBuckets = [
      { name: "Low", value: probabilityRows.filter((row) => row.probability.totalScore <= 40).length, color: TOKENS.red },
      {
        name: "Moderate",
        value: probabilityRows.filter(
          (row) => row.probability.totalScore > 40 && row.probability.totalScore <= 60
        ).length,
        color: TOKENS.yellow,
      },
      {
        name: "High",
        value: probabilityRows.filter(
          (row) => row.probability.totalScore > 60 && row.probability.totalScore <= 80
        ).length,
        color: TOKENS.blue,
      },
      { name: "Venture", value: probabilityRows.filter((row) => row.probability.totalScore > 80).length, color: TOKENS.green },
    ];

    const potentialDistributionData = probabilityRows.slice(0, 7).map((row) => ({
      name: row.idea.title.length > 14 ? `${row.idea.title.slice(0, 14)}...` : row.idea.title,
      tenCr: row.probability.probabilities.tenCr,
      hundredCr: row.probability.probabilities.hundredCr,
      fiveHundredCr: row.probability.probabilities.fiveHundredCr,
    }));

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <Card style={{ background: TOKENS.surface }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ color: TOKENS.text, fontWeight: 700 }}>Startup Probability Engine</div>
              <div style={{ color: TOKENS.muted, fontSize: 13, marginTop: 4 }}>
                Scores ideas from Ideas Lab to estimate probability of reaching ₹10Cr, ₹100Cr, and ₹500Cr outcomes.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ color: TOKENS.text, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={!!probabilityOnlyHigh}
                  onChange={(e) => setProbabilityOnlyHigh(e.target.checked)}
                />
                Only show score above 70
              </label>
              <Button onClick={recalculateProbabilityHeuristics}>
                <RefreshCw size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Recalculate
              </Button>
            </div>
          </div>
          {probabilityAiError ? <div style={{ marginTop: 8, color: TOKENS.red, fontSize: 13 }}>{probabilityAiError}</div> : null}
        </Card>

        <Card style={{ background: TOKENS.surface }}>
          <div style={{ color: TOKENS.text, fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 22 }}>VC Scale Probability Playbook</div>
          <div style={{ color: TOKENS.muted, fontSize: 13, marginTop: 6 }}>
            One-section reference for evaluating startup ideas before heavy execution.
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 10 }}>
            <div style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 12, background: TOKENS.card, padding: 12 }}>
              <div style={{ color: TOKENS.orange, fontWeight: 700, marginBottom: 6 }}>Market Size Rule of Thumb</div>
              <div style={{ color: TOKENS.text, fontSize: 13, lineHeight: 1.45 }}>
                $100M company usually needs at least a $5B market. $1B company usually needs at least a $20B market.
                Even 2-5% share of a huge market can create large outcomes.
              </div>
              <div style={{ color: TOKENS.muted, fontSize: 12, marginTop: 8 }}>
                Large India categories: logistics, manufacturing digitization, energy, agriculture supply chains, fintech infrastructure.
              </div>
            </div>
            <div style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 12, background: "#2A1112", padding: 12 }}>
              <div style={{ color: TOKENS.red, fontWeight: 700, marginBottom: 6 }}>Brutal Truth</div>
              <div style={{ color: TOKENS.text, fontSize: 13, lineHeight: 1.45 }}>
                Most ideas fail on market size. Perfect execution cannot turn a small market into a billion-dollar company.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={addVcScaleFactor}>
              <Plus size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Add Factor
            </Button>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {vcScaleFactors.map((item, index) => (
              <div
                key={`${item.title}_${index}`}
                style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 10, background: TOKENS.card }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ color: TOKENS.text, fontWeight: 700, fontSize: 13 }}>{item.title}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editVcScaleFactor(index)}>
                      Edit
                    </Button>
                    <Button
                      tone="danger"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                      onClick={() => deleteVcScaleFactor(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div style={{ color: TOKENS.muted, marginTop: 4, fontSize: 13 }}>{item.detail}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
            <div style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, background: TOKENS.card, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <div style={{ color: TOKENS.text, fontWeight: 700 }}>VC Mental Scoring Weights</div>
                <Button style={{ padding: "5px 8px", fontSize: 12 }} onClick={addVcWeightRow}>
                  Add
                </Button>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {vcWeightModel.map((row, index) => (
                  <div
                    key={`${row.factor}_${index}`}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, color: TOKENS.text, fontSize: 13 }}
                  >
                    <span>{row.factor}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: FONT_MONO }}>{row.weight}</span>
                      <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editVcWeightRow(index)}>
                        Edit
                      </Button>
                      <Button
                        tone="danger"
                        style={{ padding: "4px 8px", fontSize: 12 }}
                        onClick={() => deleteVcWeightRow(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, background: TOKENS.card, padding: 10 }}>
              <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>How To Use This</div>
              <div style={{ display: "grid", gap: 6 }}>
                {[
                  "Is the market massive?",
                  "Is the problem painful and expensive?",
                  "Will customers pay immediately?",
                  "Do you have unique founder advantage?",
                  "Can this scale globally without linear cost growth?",
                ].map((line) => (
                  <div key={line} style={{ color: TOKENS.text, fontSize: 13 }}>
                    • {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ background: TOKENS.surface }}>
          <div style={{ color: TOKENS.text, fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 22 }}>Proven Scale Pattern Playbook</div>
          <div style={{ color: TOKENS.muted, fontSize: 13, marginTop: 6 }}>
            Use these pattern filters daily so ideas are not random. Prefer ideas that match one or more proven scale patterns.
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={addScalePattern}>
              <Plus size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Add Pattern
            </Button>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {scalePatternPlaybook.map((item, index) => (
              <div
                key={`${item.title}_${index}`}
                style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 10, background: TOKENS.card }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ color: TOKENS.text, fontWeight: 700, fontSize: 13 }}>{item.title}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editScalePattern(index)}>
                      Edit
                    </Button>
                    <Button
                      tone="danger"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                      onClick={() => deleteScalePattern(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div style={{ color: TOKENS.muted, marginTop: 4, fontSize: 13 }}>
                  <strong style={{ color: TOKENS.text }}>Why it works:</strong> {item.why}
                </div>
                <div style={{ color: TOKENS.muted, marginTop: 4, fontSize: 13 }}>
                  <strong style={{ color: TOKENS.text }}>Examples:</strong> {item.examples}
                </div>
                <div style={{ color: TOKENS.muted, marginTop: 4, fontSize: 13 }}>
                  <strong style={{ color: TOKENS.text }}>India fit:</strong> {item.indiaFit}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
            <div style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, background: TOKENS.card, padding: 10 }}>
              <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Daily Pattern Check</div>
              <div style={{ display: "grid", gap: 6 }}>
                {[
                  "Does this idea digitize an offline industry?",
                  "Does it build infrastructure or a platform layer?",
                  "Can it create marketplace liquidity?",
                  "Can it become a developer or workflow platform?",
                  "Does regulation create tailwind for adoption?",
                  "Can it aggregate a fragmented ecosystem?",
                ].map((line) => (
                  <div key={line} style={{ color: TOKENS.text, fontSize: 13 }}>
                    • {line}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, background: TOKENS.card, padding: 10 }}>
              <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Idea Quality Direction</div>
              <div style={{ color: TOKENS.muted, fontSize: 13 }}>
                <strong style={{ color: TOKENS.red }}>Weak direction:</strong> random consumer app, niche lifestyle tool.
              </div>
              <div style={{ color: TOKENS.muted, fontSize: 13, marginTop: 6 }}>
                <strong style={{ color: TOKENS.green }}>Stronger direction:</strong> factory workflow software, logistics automation platform, energy analytics SaaS.
              </div>
              <div style={{ marginTop: 10, border: `1px solid ${TOKENS.border}`, borderRadius: 8, padding: 8, background: TOKENS.surface }}>
                <div style={{ color: TOKENS.text, fontWeight: 700, fontSize: 13 }}>Final Insight</div>
                <div style={{ color: TOKENS.muted, marginTop: 4, fontSize: 13 }}>
                  Most billion-dollar startups combine two or more patterns. Stripe = infrastructure + developer platform.
                  Uber = marketplace + aggregation.
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
          <StatCard label="Ideas Evaluated" value={String(probabilityRows.length)} />
          <StatCard
            label="Venture Scale (81+)"
            value={String(probabilityRows.filter((row) => row.probability.totalScore >= 81).length)}
            tone="green"
          />
          <StatCard
            label="High Potential (61+)"
            value={String(probabilityRows.filter((row) => row.probability.totalScore >= 61).length)}
            tone="blue"
          />
          <StatCard
            label="Avg Score"
            value={
              probabilityRows.length
                ? String(
                  Math.round(
                    probabilityRows.reduce((sum, row) => sum + row.probability.totalScore, 0) / probabilityRows.length
                  )
                )
                : "0"
            }
            tone="orange"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 16 }}>
          <Card>
            <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Idea Score Leaderboard</div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={topScoresData}>
                  <CartesianGrid stroke={TOKENS.border} />
                  <XAxis dataKey="name" stroke={TOKENS.muted} hide={isMobile} />
                  <YAxis stroke={TOKENS.muted} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}` }} />
                  <Bar dataKey="score" fill={TOKENS.orange} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Market Potential Distribution</div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={tierBuckets} dataKey="value" nameKey="name" outerRadius={95} label>
                    {tierBuckets.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}` }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card>
          <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Top Ideas Revenue Outcome Probability</div>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={potentialDistributionData}>
                <CartesianGrid stroke={TOKENS.border} />
                <XAxis dataKey="name" stroke={TOKENS.muted} hide={isMobile} />
                <YAxis stroke={TOKENS.muted} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}` }} />
                <Bar dataKey="tenCr" fill={TOKENS.blue} />
                <Bar dataKey="hundredCr" fill={TOKENS.orange} />
                <Bar dataKey="fiveHundredCr" fill={TOKENS.green} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div style={{ display: "grid", gap: 12 }}>
          {leaderboard.map((row, index) => {
            const { idea, probability } = row;
            const actions = getDecisionActions(probability.totalScore);
            return (
              <Card key={idea.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: TOKENS.text, fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 20 }}>
                      #{index + 1} {idea.title}
                    </div>
                    <div style={{ color: TOKENS.muted, marginTop: 4, fontSize: 13 }}>
                      {idea.sector} | {idea.difficulty} | Source: {probability.source}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <div
                      style={{
                        borderRadius: 10,
                        border: `1px solid ${TOKENS.border}`,
                        background: TOKENS.surface,
                        padding: "8px 10px",
                        color: scoreColor(probability.totalScore),
                        fontFamily: FONT_MONO,
                        fontWeight: 700,
                      }}
                    >
                      Score {probability.totalScore}/100
                    </div>
                    <Button
                      tone="primary"
                      onClick={() => evaluateIdeaProbabilityWithAI(idea)}
                      disabled={probabilityAiLoadingIdeaId === idea.id}
                    >
                      <BrainCircuit size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                      {probabilityAiLoadingIdeaId === idea.id ? "Evaluating..." : "AI Evaluate"}
                    </Button>
                  </div>
                </div>

                <div style={{ marginTop: 10, color: TOKENS.text, fontSize: 13 }}>
                  <strong>Tier:</strong> {probability.tier}
                </div>

                <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 8 }}>
                  {PROBABILITY_FACTORS.map((factor) => (
                    <div key={factor.key} style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 8 }}>
                      <div style={{ color: TOKENS.muted, fontSize: 12 }}>{factor.label}</div>
                      <div style={{ color: TOKENS.text, fontFamily: FONT_MONO, marginTop: 4 }}>
                        {Number(probability.factors[factor.key] || 0).toFixed(1)}/10
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                  {[
                    { label: "₹10Cr Probability", key: "tenCr", color: TOKENS.blue },
                    { label: "₹100Cr Probability", key: "hundredCr", color: TOKENS.orange },
                    { label: "₹500Cr Probability", key: "fiveHundredCr", color: TOKENS.green },
                  ].map((item) => (
                    <div key={item.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: TOKENS.muted, fontSize: 12 }}>
                        <span>{item.label}</span>
                        <span>{probability.probabilities[item.key]}%</span>
                      </div>
                      <div style={{ marginTop: 4, height: 7, borderRadius: 8, background: TOKENS.border, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${probability.probabilities[item.key]}%`,
                            height: "100%",
                            background: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    background: TOKENS.surface,
                    border: `1px solid ${TOKENS.border}`,
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <div style={{ color: TOKENS.muted, fontSize: 12 }}>Reasoning</div>
                  <div style={{ color: TOKENS.text, marginTop: 4, whiteSpace: "pre-wrap", fontSize: 13 }}>
                    {probability.reasoning}
                  </div>
                </div>

                {probability.totalScore >= 61 ? (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ color: TOKENS.green, fontWeight: 700, marginBottom: 6 }}>Recommended Actions</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {actions.map((action) => (
                        <div key={action} style={{ color: TOKENS.text, fontSize: 13 }}>
                          • {action}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderValidation = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <StatCard label="Interviews Completed" value={String(interviewsCompleted)} tone="blue" />
        <StatCard label="Problem Real" value={`${problemRealPct}%`} />
        <StatCard label="Budget Confirmed" value={`${budgetConfirmedPct}%`} />
        <StatCard label="Customer Urgency" value={`${averageUrgency}/5`} />
      </div>

      <Card>
        <div style={{ color: TOKENS.text, fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 12 }}>Log Customer Interview</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          <Input
            placeholder="Company"
            value={newInterview.company}
            onChange={(e) => setNewInterview((s) => ({ ...s, company: e.target.value }))}
          />
          <Input
            placeholder="Contact"
            value={newInterview.contact}
            onChange={(e) => setNewInterview((s) => ({ ...s, contact: e.target.value }))}
          />
          <Input
            type="date"
            value={newInterview.date}
            onChange={(e) => setNewInterview((s) => ({ ...s, date: e.target.value }))}
          />
          <Select
            value={newInterview.stage}
            onChange={(e) => setNewInterview((s) => ({ ...s, stage: e.target.value }))}
          >
            {VALIDATION_STAGES.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </Select>
          <Input
            type="number"
            min="1"
            max="5"
            placeholder="Signal Strength (1-5)"
            value={newInterview.signalStrength}
            onChange={(e) => setNewInterview((s) => ({ ...s, signalStrength: e.target.value }))}
          />
          <Input
            type="number"
            min="1"
            max="5"
            placeholder="Urgency (1-5)"
            value={newInterview.urgency}
            onChange={(e) => setNewInterview((s) => ({ ...s, urgency: e.target.value }))}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <TextArea
            placeholder="Key Insight"
            value={newInterview.keyInsight}
            onChange={(e) => setNewInterview((s) => ({ ...s, keyInsight: e.target.value }))}
          />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8, color: TOKENS.muted, fontSize: 13 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={!!newInterview.problemReal}
              onChange={(e) => setNewInterview((s) => ({ ...s, problemReal: e.target.checked }))}
            />
            Problem Real
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={!!newInterview.budgetConfirmed}
              onChange={(e) => setNewInterview((s) => ({ ...s, budgetConfirmed: e.target.checked }))}
            />
            Budget Confirmed
          </label>
        </div>
        <Button tone="primary" onClick={addInterview} style={{ marginTop: 10 }}>
          Add Interview
        </Button>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 12 }}>Validation Kanban</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(5, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {VALIDATION_STAGES.map((stage) => (
            <div key={stage} style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 12, padding: 10 }}>
              <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>{stage}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {(validationByStage[stage] || []).map((item) => (
                  <div key={item.id} style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 8 }}>
                    <div style={{ color: TOKENS.text, fontSize: 13 }}>{item.title}</div>
                    <div style={{ color: TOKENS.muted, fontSize: 12, marginTop: 4 }}>{item.notes}</div>
                    <Select value={item.stage} onChange={(e) => moveValidation(item.id, e.target.value)} style={{ marginTop: 8 }}>
                      {VALIDATION_STAGES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                      <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editValidationItemNotes(item.id)}>
                        Edit
                      </Button>
                      <Button
                        tone="danger"
                        style={{ padding: "4px 8px", fontSize: 12 }}
                        onClick={() => deleteValidationItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Interview Logs</div>
        <div style={{ display: "grid", gap: 8 }}>
          {interviewLogs
            .slice()
            .reverse()
            .map((log) => (
              <div
                key={log.id}
                style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 10, background: TOKENS.surface }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <div style={{ color: TOKENS.text, fontSize: 13 }}>
                    {log.company} | {log.contact} | {log.date}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editInterviewLog(log.id)}>
                      Edit
                    </Button>
                    <Button
                      tone="danger"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                      onClick={() => deleteInterviewLog(log.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div style={{ color: TOKENS.muted, fontSize: 12, marginTop: 6 }}>
                  Signal {log.signalStrength}/5 | Urgency {log.urgency}/5 | Stage {log.stage}
                </div>
                <div style={{ color: TOKENS.text, marginTop: 6, fontSize: 13 }}>{log.keyInsight}</div>
              </div>
            ))}
          {!interviewLogs.length ? <div style={{ color: TOKENS.muted, fontSize: 13 }}>No interview logs yet.</div> : null}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>AI Interview Analysis (OpenAI)</div>
        <TextArea
          value={interviewAiInput}
          onChange={(e) => setInterviewAiInput(e.target.value)}
          placeholder="Paste interview notes here..."
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <Button tone="primary" onClick={runInterviewAnalysis} disabled={interviewAiLoading}>
            {interviewAiLoading ? "Analyzing..." : "Analyze Notes"}
          </Button>
          {interviewAiError ? <span style={{ color: TOKENS.red, fontSize: 13 }}>{interviewAiError}</span> : null}
        </div>
        {interviewAiSummary ? (
          <div
            style={{
              marginTop: 10,
              whiteSpace: "pre-wrap",
              color: TOKENS.text,
              fontFamily: FONT_BODY,
              background: TOKENS.surface,
              border: `1px solid ${TOKENS.border}`,
              borderRadius: 10,
              padding: 12,
            }}
          >
            {interviewAiSummary}
          </div>
        ) : null}
      </Card>
    </div>
  );

  const renderCustomerCRM = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Add CRM Contact</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          <Input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact((s) => ({ ...s, name: e.target.value }))} />
          <Input
            placeholder="Company"
            value={newContact.company}
            onChange={(e) => setNewContact((s) => ({ ...s, company: e.target.value }))}
          />
          <Input
            placeholder="Industry"
            value={newContact.industry}
            onChange={(e) => setNewContact((s) => ({ ...s, industry: e.target.value }))}
          />
          <Input
            placeholder="Problem"
            value={newContact.problem}
            onChange={(e) => setNewContact((s) => ({ ...s, problem: e.target.value }))}
          />
          <Select value={newContact.stage} onChange={(e) => setNewContact((s) => ({ ...s, stage: e.target.value }))}>
            {CRM_STAGES.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </Select>
          <Input
            type="date"
            value={newContact.lastContactDate}
            onChange={(e) => setNewContact((s) => ({ ...s, lastContactDate: e.target.value }))}
          />
        </div>
        <TextArea
          style={{ marginTop: 8 }}
          placeholder="Notes"
          value={newContact.notes}
          onChange={(e) => setNewContact((s) => ({ ...s, notes: e.target.value }))}
        />
        <Button tone="primary" onClick={addContact} style={{ marginTop: 8 }}>
          Add Contact
        </Button>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Call Log</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 170px 1fr auto", gap: 8 }}>
          <Select
            value={newCallLog.contactId}
            onChange={(e) => setNewCallLog((s) => ({ ...s, contactId: e.target.value }))}
          >
            <option value="">Select contact</option>
            {crmContacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.company}
              </option>
            ))}
          </Select>
          <Input type="date" value={newCallLog.date} onChange={(e) => setNewCallLog((s) => ({ ...s, date: e.target.value }))} />
          <Input
            placeholder="Call notes"
            value={newCallLog.summary}
            onChange={(e) => setNewCallLog((s) => ({ ...s, summary: e.target.value }))}
          />
          <Button onClick={addCallLog}>
            <Phone size={14} />
          </Button>
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>AI Outreach Message Generator (OpenAI)</div>
        <TextArea
          value={outreachInput}
          onChange={(e) => setOutreachInput(e.target.value)}
          placeholder="Describe ICP, product, pain, and CTA..."
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <Button tone="primary" onClick={runOutreachGenerator} disabled={outreachLoading}>
            <Send size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            {outreachLoading ? "Generating..." : "Generate Outreach"}
          </Button>
          {outreachError ? <span style={{ color: TOKENS.red, fontSize: 13 }}>{outreachError}</span> : null}
        </div>
        {outreachOutput ? (
          <div
            style={{
              marginTop: 10,
              whiteSpace: "pre-wrap",
              color: TOKENS.text,
              background: TOKENS.surface,
              border: `1px solid ${TOKENS.border}`,
              borderRadius: 10,
              padding: 12,
            }}
          >
            {outreachOutput}
          </div>
        ) : null}
      </Card>

      <div style={{ display: "grid", gap: 10 }}>
        {crmContacts.map((contact) => (
          <Card key={contact.id}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(6, minmax(0, 1fr))", gap: 8 }}>
              <Input value={contact.name} onChange={(e) => updateContactField(contact.id, "name", e.target.value)} />
              <Input value={contact.company} onChange={(e) => updateContactField(contact.id, "company", e.target.value)} />
              <Input value={contact.industry} onChange={(e) => updateContactField(contact.id, "industry", e.target.value)} />
              <Input value={contact.problem} onChange={(e) => updateContactField(contact.id, "problem", e.target.value)} />
              <Select value={contact.stage} onChange={(e) => updateContactField(contact.id, "stage", e.target.value)}>
                {CRM_STAGES.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </Select>
              <Input
                type="date"
                value={contact.lastContactDate}
                onChange={(e) => updateContactField(contact.id, "lastContactDate", e.target.value)}
              />
            </div>
            <TextArea
              style={{ marginTop: 8 }}
              value={contact.notes || ""}
              onChange={(e) => updateContactField(contact.id, "notes", e.target.value)}
            />
            <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
              <Button tone="danger" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => deleteContact(contact.id)}>
                Delete Contact
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Recent Call Logs</div>
        <div style={{ display: "grid", gap: 8 }}>
          {crmCallLogs.slice().reverse().slice(0, 15).map((log) => {
            const contact = crmContacts.find((c) => c.id === log.contactId);
            return (
              <div key={log.id} style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <div style={{ color: TOKENS.text }}>
                    {log.date} | {contact ? `${contact.name} (${contact.company})` : "Unknown Contact"}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editCallLog(log.id)}>
                      Edit
                    </Button>
                    <Button
                      tone="danger"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                      onClick={() => deleteCallLog(log.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div style={{ color: TOKENS.muted, marginTop: 4 }}>{log.summary}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const renderSalesPipeline = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
        <StatCard label="Total Deals" value={String(deals.length)} />
        <StatCard label="Pipeline Value" value={formatINR(deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0))} />
        <StatCard label="Expected Revenue" value={formatINR(expectedRevenue)} tone="green" />
      </div>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Add Deal</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 180px 180px auto", gap: 8 }}>
          <Input placeholder="Deal name" value={newDeal.name} onChange={(e) => setNewDeal((s) => ({ ...s, name: e.target.value }))} />
          <Input
            placeholder="Company"
            value={newDeal.company}
            onChange={(e) => setNewDeal((s) => ({ ...s, company: e.target.value }))}
          />
          <Select value={newDeal.stage} onChange={(e) => setNewDeal((s) => ({ ...s, stage: e.target.value }))}>
            {SALES_STAGES.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder="Deal value (INR)"
            value={newDeal.value}
            onChange={(e) => setNewDeal((s) => ({ ...s, value: e.target.value }))}
          />
          <Button tone="primary" onClick={addDeal}>
            Add
          </Button>
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Funnel Chart</div>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <FunnelChart>
              <Tooltip
                contentStyle={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, color: TOKENS.text }}
              />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill={TOKENS.text} stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Deals</div>
        <div style={{ display: "grid", gap: 8 }}>
          {deals.map((deal) => (
            <div
              key={deal.id}
              style={{
                border: `1px solid ${TOKENS.border}`,
                background: TOKENS.surface,
                borderRadius: 10,
                padding: 10,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 160px 160px 1fr auto",
                gap: 8,
              }}
            >
              <Input value={deal.name} onChange={(e) => updateDeal(deal.id, "name", e.target.value)} />
              <Input value={deal.company} onChange={(e) => updateDeal(deal.id, "company", e.target.value)} />
              <Select value={deal.stage} onChange={(e) => updateDeal(deal.id, "stage", e.target.value)}>
                {SALES_STAGES.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </Select>
              <Input type="number" value={deal.value} onChange={(e) => updateDeal(deal.id, "value", e.target.value)} />
              <div style={{ color: TOKENS.muted, alignSelf: "center", fontSize: 13 }}>
                Prob {(SALES_PROB[deal.stage] || 0) * 100}% | Exp {formatINR((Number(deal.value) || 0) * SALES_PROB[deal.stage])}
              </div>
              <Button tone="danger" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => deleteDeal(deal.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderRevenueAnalytics = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 12 }}>
        <StatCard label="MRR" value={formatINR(mrrCurrent)} tone="orange" />
        <StatCard label="ARR" value={formatINR(arrValue)} />
        <StatCard label="Customers" value={String(customerCount)} />
        <StatCard label="ACV" value={formatINR(acv)} />
        <StatCard label="Churn Rate" value={`${Number(churnRate).toFixed(1)}%`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>MRR Growth</div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={mrrChartData}>
                <CartesianGrid stroke={TOKENS.border} />
                <XAxis dataKey="month" stroke={TOKENS.muted} />
                <YAxis stroke={TOKENS.muted} tickFormatter={(v) => `₹${Math.round(v / 100000)}L`} />
                <Tooltip
                  contentStyle={{
                    background: TOKENS.surface,
                    border: `1px solid ${TOKENS.border}`,
                    color: TOKENS.text,
                  }}
                  formatter={(v) => [formatINR(v), "MRR"]}
                />
                <Line type="monotone" dataKey="mrr" stroke={TOKENS.green} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Funnel Metrics</div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={salesStageCounts}>
                <CartesianGrid stroke={TOKENS.border} />
                <XAxis dataKey="stage" stroke={TOKENS.muted} />
                <YAxis stroke={TOKENS.muted} allowDecimals={false} />
                <Tooltip contentStyle={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}` }} />
                <Bar dataKey="count" fill={TOKENS.blue} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Milestone Progress to ₹500Cr ARR</div>
        <div style={{ display: "grid", gap: 8 }}>
          {MILESTONES.map((m) => {
            const target = m * 10000000;
            const pct = Math.min((arrValue / target) * 100, 100);
            return (
              <div key={m}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: TOKENS.muted }}>
                  <span>{formatINR(target)}</span>
                  <span>{pct.toFixed(1)}%</span>
                </div>
                <div style={{ marginTop: 5, height: 8, borderRadius: 8, background: TOKENS.border, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: pct >= 100 ? TOKENS.green : TOKENS.orange,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>CAC / LTV Calculator</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 8 }}>
          <Input type="number" value={cacInput} onChange={(e) => setCacInput(e.target.value)} placeholder="CAC (INR)" />
          <Input type="number" value={ltvArpu} onChange={(e) => setLtvArpu(e.target.value)} placeholder="ARPU Monthly (INR)" />
          <Input
            type="number"
            step="0.01"
            value={ltvGrossMargin}
            onChange={(e) => setLtvGrossMargin(e.target.value)}
            placeholder="Gross Margin (0-1)"
          />
          <Input
            type="number"
            step="0.01"
            value={ltvChurnMonthly}
            onChange={(e) => setLtvChurnMonthly(e.target.value)}
            placeholder="Monthly Churn (0-1)"
          />
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap", color: TOKENS.text }}>
          <div style={{ fontFamily: FONT_MONO }}>LTV: {formatINR(ltv)}</div>
          <div style={{ fontFamily: FONT_MONO }}>LTV/CAC: {ltvCacRatio.toFixed(2)}x</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: TOKENS.muted, fontSize: 13 }}>Churn Rate (%)</span>
            <Input type="number" value={churnRate} onChange={(e) => setChurnRate(e.target.value)} style={{ width: 90 }} />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderFundraising = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 12 }}>Investor Pipeline</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <Input
            placeholder="Add investor / angel name"
            value={newInvestorName}
            onChange={(e) => setNewInvestorName(e.target.value)}
          />
          <Button tone="primary" onClick={addInvestor}>
            <Plus size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Add
          </Button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {investors.map((inv) => (
            <div
              key={inv.id}
              style={{
                border: `1px solid ${TOKENS.border}`,
                borderRadius: 10,
                padding: 10,
                background: TOKENS.surface,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 220px 2fr auto",
                gap: 8,
              }}
            >
              <div style={{ color: TOKENS.text, alignSelf: "center" }}>{inv.name}</div>
              <Select value={inv.stage} onChange={(e) => updateInvestorStage(inv.id, e.target.value)}>
                {FUND_STAGES.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </Select>
              <Input value={inv.notes || ""} onChange={(e) => updateInvestorNotes(inv.id, e.target.value)} placeholder="Notes / next action" />
              <Button tone="danger" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => deleteInvestor(inv.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Investor Update Generator (OpenAI)</div>
        <TextArea
          value={investorUpdateInput}
          onChange={(e) => setInvestorUpdateInput(e.target.value)}
          placeholder="Add updates: wins, metrics, asks..."
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <Button tone="primary" onClick={runInvestorUpdateGenerator} disabled={investorUpdateLoading}>
            {investorUpdateLoading ? "Generating..." : "Generate Update"}
          </Button>
          {investorUpdateError ? <span style={{ color: TOKENS.red, fontSize: 13 }}>{investorUpdateError}</span> : null}
        </div>
        {investorUpdateOutput ? (
          <div
            style={{
              marginTop: 10,
              whiteSpace: "pre-wrap",
              color: TOKENS.text,
              border: `1px solid ${TOKENS.border}`,
              borderRadius: 10,
              background: TOKENS.surface,
              padding: 12,
            }}
          >
            {investorUpdateOutput}
          </div>
        ) : null}
      </Card>
    </div>
  );

  const renderDailyOS = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Today's Priorities</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Input value={newPriority} onChange={(e) => setNewPriority(e.target.value)} placeholder="Add top priority" />
            <Button onClick={addPriority}>
              <Plus size={14} />
            </Button>
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
            {prioritiesForToday.map((p) => (
              <div
                key={p.id}
                style={{
                  border: `1px solid ${TOKENS.border}`,
                  borderRadius: 8,
                  padding: 8,
                  background: TOKENS.surface,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" checked={!!p.done} onChange={() => togglePriority(p.id)} />
                  <span style={{ color: TOKENS.text }}>{p.text}</span>
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editPriority(p.id)}>
                    Edit
                  </Button>
                  <Button tone="danger" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => deletePriority(p.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Pomodoro Timer</div>
          <div style={{ color: TOKENS.text, fontFamily: FONT_MONO, fontSize: 40 }}>
            {`${String(Math.floor(pomodoroSeconds / 60)).padStart(2, "0")}:${String(pomodoroSeconds % 60).padStart(2, "0")}`}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <Button tone="primary" onClick={() => setPomodoroRunning((r) => !r)}>
              <Clock3 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              {pomodoroRunning ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={() => {
                setPomodoroRunning(false);
                setPomodoroSeconds(25 * 60);
              }}
            >
              Reset
            </Button>
          </div>
          <div style={{ marginTop: 8, color: TOKENS.muted, fontSize: 13 }}>Completed cycles: {pomodoroCycles}</div>
        </Card>
      </div>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>Daily Schedule</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "180px 1fr auto", gap: 8, marginBottom: 8 }}>
          <Input
            placeholder="Time slot"
            value={newScheduleTask.slot}
            onChange={(e) => setNewScheduleTask((s) => ({ ...s, slot: e.target.value }))}
          />
          <Input
            placeholder="Task"
            value={newScheduleTask.task}
            onChange={(e) => setNewScheduleTask((s) => ({ ...s, task: e.target.value }))}
          />
          <Button tone="primary" onClick={addScheduleItem}>
            Add
          </Button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {scheduleForToday.map((item) => (
            <div
              key={item.id}
              style={{
                border: `1px solid ${TOKENS.border}`,
                borderRadius: 10,
                padding: 10,
                background: TOKENS.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div>
                <div style={{ color: TOKENS.text }}>{item.task}</div>
                <div style={{ color: TOKENS.muted, fontSize: 13 }}>{item.slot}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button tone={item.done ? "success" : "default"} onClick={() => toggleSchedule(item.id)}>
                  {item.done ? "Done" : "Mark Done"}
                </Button>
                <Button style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => editScheduleItem(item.id)}>
                  Edit
                </Button>
                <Button
                  tone="danger"
                  style={{ padding: "6px 10px", fontSize: 12 }}
                  onClick={() => deleteScheduleItem(item.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 8 }}>End-of-Day Journal</div>
        <TextArea
          value={journalByDate[todaysDate] || ""}
          onChange={(e) => updateJournal(e.target.value)}
          placeholder="What worked, what failed, what changes tomorrow?"
        />
        <div style={{ marginTop: 8, color: TOKENS.muted, fontSize: 13 }}>
          Journal status: {journalByDate[todaysDate]?.trim() ? "Logged" : "Pending"}
        </div>
      </Card>
    </div>
  );

  const renderWeeklyMetrics = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Weekly KPI Tracker</div>
        <div style={{ display: "grid", gap: 10 }}>
          {weeklyKpis.map((kpi) => {
            const progress = Math.min((kpi.value / kpi.target) * 100, 100);
            const isManual = ["meetingsBooked", "linkedinConnections", "featuresShipped", "revenueCalls"].includes(kpi.key);
            return (
              <div key={kpi.key} style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: TOKENS.text }}>
                  <span>{kpi.label}</span>
                  <span style={{ fontFamily: FONT_MONO }}>
                    {kpi.value}/{kpi.target}
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 8, background: TOKENS.border, overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: progress >= 100 ? TOKENS.green : TOKENS.blue }} />
                </div>
                {isManual ? (
                  <Input
                    type="number"
                    value={weeklyManualMetrics[kpi.key]}
                    onChange={(e) =>
                      setWeeklyManualMetrics((prev) => ({ ...prev, [kpi.key]: Number(e.target.value) || 0 }))
                    }
                    style={{ maxWidth: 150 }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Weekly KPI Chart</div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={weeklyKpis.map((x) => ({ name: x.label, progress: Math.min((x.value / x.target) * 100, 100) }))}
            >
              <CartesianGrid stroke={TOKENS.border} />
              <XAxis dataKey="name" stroke={TOKENS.muted} hide={isMobile} />
              <YAxis stroke={TOKENS.muted} />
              <Tooltip contentStyle={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}` }} />
              <Bar dataKey="progress" fill={TOKENS.purple} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );

  const renderLearningHub = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
          <div style={{ color: TOKENS.text, fontWeight: 700 }}>Startup Book Stack</div>
          <Select value={bookFilter} onChange={(e) => setBookFilter(e.target.value)} style={{ width: 220 }}>
            <option value="All">All Categories</option>
            {[...new Set(bookLibrary.map((book) => book.category).filter(Boolean))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 220px auto", gap: 8 }}>
          <Input
            placeholder="Book title"
            value={newBookDraft.title}
            onChange={(e) => setNewBookDraft((s) => ({ ...s, title: e.target.value }))}
          />
          <Input
            placeholder="Category"
            value={newBookDraft.category}
            onChange={(e) => setNewBookDraft((s) => ({ ...s, category: e.target.value }))}
          />
          <Button tone="primary" onClick={addBook}>
            <Plus size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Add
          </Button>
        </div>
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {filteredBooks.map((book) => (
            <div key={book.id} style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ color: TOKENS.text }}>{book.title}</div>
                  <div style={{ color: TOKENS.muted, fontSize: 12 }}>{book.category}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Button tone={bookState[book.id]?.read ? "success" : "default"} onClick={() => toggleBookRead(book.id)}>
                    {bookState[book.id]?.read ? <CheckCircle2 size={14} /> : "Mark Read"}
                  </Button>
                  <Button style={{ padding: "5px 8px", fontSize: 12 }} onClick={() => editBook(book.id)}>
                    Edit
                  </Button>
                  <Button tone="danger" style={{ padding: "5px 8px", fontSize: 12 }} onClick={() => deleteBook(book.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <TextArea
                style={{ marginTop: 8, minHeight: 70 }}
                placeholder="Key notes"
                value={bookState[book.id]?.notes || ""}
                onChange={(e) => updateBookNote(book.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Podcast Tracking</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 160px auto", gap: 8 }}>
          <Input
            placeholder="Podcast title"
            value={newPodcast.title}
            onChange={(e) => setNewPodcast((s) => ({ ...s, title: e.target.value }))}
          />
          <Input placeholder="Host" value={newPodcast.host} onChange={(e) => setNewPodcast((s) => ({ ...s, host: e.target.value }))} />
          <Select value={newPodcast.status} onChange={(e) => setNewPodcast((s) => ({ ...s, status: e.target.value }))}>
            <option>Planned</option>
            <option>Listening</option>
            <option>Completed</option>
          </Select>
          <Button onClick={addPodcast}>Add</Button>
        </div>
        <TextArea
          style={{ marginTop: 8 }}
          placeholder="Podcast notes"
          value={newPodcast.notes}
          onChange={(e) => setNewPodcast((s) => ({ ...s, notes: e.target.value }))}
        />
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {podcasts.map((pod) => (
            <div key={pod.id} style={{ border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 160px auto", gap: 8, alignItems: "center" }}>
                <div style={{ color: TOKENS.text }}>
                  {pod.title} | {pod.host}
                </div>
                <Select
                  value={pod.status}
                  onChange={(e) =>
                    setPodcasts((prev) => prev.map((item) => (item.id === pod.id ? { ...item, status: e.target.value } : item)))
                  }
                >
                  <option>Planned</option>
                  <option>Listening</option>
                  <option>Completed</option>
                </Select>
                <div style={{ display: "flex", gap: 6 }}>
                  <Button style={{ padding: "5px 8px", fontSize: 12 }} onClick={() => editPodcast(pod.id)}>
                    Edit
                  </Button>
                  <Button tone="danger" style={{ padding: "5px 8px", fontSize: 12 }} onClick={() => deletePodcast(pod.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <div style={{ color: TOKENS.text, marginTop: 6, fontSize: 13 }}>{pod.notes}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderMindset = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Mental Frameworks</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <Input
            placeholder="Add framework"
            value={newFrameworkText}
            onChange={(e) => setNewFrameworkText(e.target.value)}
          />
          <Button tone="primary" onClick={addFramework}>
            Add
          </Button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {frameworkList.map((f, index) => (
            <div
              key={`${f}_${index}`}
              style={{
                border: `1px solid ${TOKENS.border}`,
                borderRadius: 10,
                padding: 10,
                color: TOKENS.text,
                background: TOKENS.surface,
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span>{f}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editFramework(index)}>
                  Edit
                </Button>
                <Button tone="danger" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => deleteFramework(index)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>
          Startup Mistakes Checklist ({startupMistakeList.length})
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <Input
            placeholder="Add startup mistake"
            value={newMistakeText}
            onChange={(e) => setNewMistakeText(e.target.value)}
          />
          <Button tone="primary" onClick={addStartupMistake}>
            Add
          </Button>
        </div>
        <div style={{ display: "grid", gap: 6, maxHeight: 420, overflow: "auto", paddingRight: 4 }}>
          {startupMistakeList.map((mistake, idx) => (
            <div
              key={`${mistake}_${idx}`}
              style={{
                border: `1px solid ${TOKENS.border}`,
                borderRadius: 8,
                padding: 8,
                background: TOKENS.surface,
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "flex-start",
              }}
            >
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <input type="checkbox" checked={!!mistakeChecks[idx]} onChange={() => toggleMistake(idx)} />
                <span style={{ color: TOKENS.text }}>{mistake}</span>
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editStartupMistake(idx)}>
                  Edit
                </Button>
                <Button tone="danger" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => deleteStartupMistake(idx)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, marginBottom: 10 }}>Daily Habit Tracker</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <Input
            placeholder="Add habit"
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
          />
          <Button tone="primary" onClick={addHabit}>
            Add
          </Button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {habitList.map((habit, index) => (
            <div
              key={`${habit}_${index}`}
              style={{
                border: `1px solid ${TOKENS.border}`,
                borderRadius: 8,
                padding: 8,
                background: TOKENS.surface,
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "center",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={!!habitByDate[todaysDate]?.[habit]} onChange={() => toggleHabit(habit)} />
                <span style={{ color: TOKENS.text }}>{habit}</span>
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                <Button style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => editHabit(index)}>
                  Edit
                </Button>
                <Button tone="danger" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => deleteHabit(index)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAIAgents = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
          Learning Roadmap for AI Agents
        </div>
        <div style={{ color: TOKENS.muted, fontSize: 13, marginBottom: 20 }}>
          Follow this structured path to move from basic prompting to building sophisticated autonomous agents.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {AI_ROADMAP.map((item, i) => (
            <div
              key={i}
              style={{
                background: TOKENS.surface,
                padding: 16,
                borderRadius: 8,
                border: `1px solid ${TOKENS.border}`,
              }}
            >
              <div style={{ color: TOKENS.green, fontWeight: 700, marginBottom: 6 }}>{item.phase}</div>
              <div style={{ color: TOKENS.text, fontSize: 14, marginBottom: 10 }}>{item.description}</div>
              <ul style={{ margin: 0, paddingLeft: 20, color: TOKENS.muted, fontSize: 13 }}>
                {item.topics.map((topic, j) => (
                  <li key={j} style={{ marginBottom: 4 }}>{topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
          Agentic System Architecture (7 Engines)
        </div>
        <div style={{ color: TOKENS.muted, fontSize: 13, marginBottom: 20 }}>
          Scale to ₹1,000+ Cr by replacing traditional headcount with specialized agentic engines. Track your progress below.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {AI_ENGINES_DATA.map((engine) => {
            const completed = engine.agents.filter((a) => aiEngineProgress[a.id]).length;
            const isFinished = completed === engine.agents.length;

            return (
              <div
                key={engine.id}
                style={{
                  background: TOKENS.surface,
                  padding: 16,
                  borderRadius: 8,
                  border: `1px solid ${isFinished ? TOKENS.green : TOKENS.border}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: TOKENS.orange, fontWeight: 700, fontSize: 16 }}>{engine.name}</span>
                      <span style={{ background: TOKENS.orangeDim, color: TOKENS.orange, fontSize: 11, padding: "2px 6px", borderRadius: 4 }}>
                        {engine.label}
                      </span>
                    </div>
                    <div style={{ color: TOKENS.text, fontSize: 13, marginTop: 4 }}>
                      <span style={{ fontWeight: 700 }}>Obj:</span> {engine.objective}
                    </div>
                  </div>
                  <div style={{ color: isFinished ? TOKENS.green : TOKENS.muted, fontSize: 13, fontWeight: 700 }}>
                    {completed} / {engine.agents.length} Agents
                  </div>
                </div>

                {engine.kpis && engine.kpis.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, marginTop: 8 }}>
                    {engine.kpis.map((kpi, kIdx) => (
                      <span key={kIdx} style={{ fontSize: 11, color: TOKENS.muted, border: `1px solid ${TOKENS.border}`, padding: "2px 8px", borderRadius: 10 }}>
                        {kpi}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                  {engine.agents.map((agent) => (
                    <label key={agent.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", background: TOKENS.bg, padding: "8px 12px", borderRadius: 6, border: `1px solid ${aiEngineProgress[agent.id] ? TOKENS.green : TOKENS.border}` }}>
                      <input
                        type="checkbox"
                        style={{ marginTop: 2, accentColor: TOKENS.green }}
                        checked={!!aiEngineProgress[agent.id]}
                        onChange={() => setAiEngineProgress(prev => ({ ...prev, [agent.id]: !prev[agent.id] }))}
                      />
                      <div>
                        <div style={{ color: aiEngineProgress[agent.id] ? TOKENS.green : TOKENS.blue, fontWeight: 700, fontSize: 14 }}>
                          {agent.name}
                        </div>
                        <div style={{ color: TOKENS.muted, fontSize: 12 }}>
                          {agent.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 12 }}>
                  <textarea
                    placeholder="Notes, stack context, or agent tracking for this engine..."
                    value={aiEngineNotes[engine.id] || ""}
                    onChange={(e) => setAiEngineNotes(prev => ({ ...prev, [engine.id]: e.target.value }))}
                    style={{
                      width: "100%",
                      minHeight: 60,
                      background: TOKENS.bg,
                      border: `1px solid ${TOKENS.border}`,
                      color: TOKENS.text,
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: 13,
                      fontFamily: FONT_BODY,
                      resize: "vertical"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ color: TOKENS.text, fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
          Why You Can Win (Compounding Edge)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <div style={{ background: TOKENS.surface, padding: 16, borderRadius: 8, border: `1px solid ${TOKENS.border}` }}>
            <div style={{ color: TOKENS.orange, fontWeight: 700, marginBottom: 8 }}>The 1,000 Cr Equation</div>
            <ul style={{ color: TOKENS.muted, fontSize: 13, margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 4 }}><strong>ARR Target:</strong> ₹1,000 Cr</li>
              <li style={{ marginBottom: 4 }}><strong>ARPA:</strong> ₹5L/year/customer</li>
              <li style={{ marginBottom: 4 }}><strong>Customers:</strong> 20,000 businesses</li>
              <li>Agents enable scale without massive headcount explosion.</li>
            </ul>
          </div>
          <div style={{ background: TOKENS.surface, padding: 16, borderRadius: 8, border: `1px solid ${TOKENS.border}` }}>
            <div style={{ color: TOKENS.blue, fontWeight: 700, marginBottom: 8 }}>Your Unfair Advantage</div>
            <ul style={{ color: TOKENS.muted, fontSize: 13, margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 4 }}>Industrial access & Operational credibility</li>
              <li style={{ marginBottom: 4 }}>Carbon + energy domain exposure</li>
              <li style={{ marginBottom: 4 }}>Pre-existing distribution networks</li>
              <li>Execution discipline — AI turns this into a compounding weapon.</li>
            </ul>
          </div>
          <div style={{ background: TOKENS.surface, padding: 16, borderRadius: 8, border: `1px solid ${TOKENS.border}`, gridColumn: "1 / -1" }}>
            <div style={{ color: TOKENS.green, fontWeight: 700, marginBottom: 8 }}>Tech Stack Matrix</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Agents", value: "OpenAI, LangChain" },
                { label: "Automation", value: "n8n" },
                { label: "CRM", value: "HubSpot" },
                { label: "Data", value: "Supabase" },
                { label: "Infra", value: "AWS" },
                { label: "Payments", value: "Razorpay" },
                { label: "Messaging", value: "WhatsApp API" }
              ].map(stack => (
                <div key={stack.label} style={{ display: "flex", alignItems: "center", gap: 6, background: TOKENS.bg, padding: "4px 8px", borderRadius: 4, border: `1px solid ${TOKENS.border}` }}>
                  <span style={{ color: TOKENS.muted, fontSize: 11, fontWeight: 700 }}>{stack.label}:</span>
                  <span style={{ color: TOKENS.text, fontSize: 12 }}>{stack.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: TOKENS.surface, padding: 16, borderRadius: 8, border: `1px solid ${TOKENS.border}`, gridColumn: "1 / -1" }}>
            <div style={{ color: TOKENS.purple, fontWeight: 700, marginBottom: 8 }}>Daily Execution Algorithm</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
              {["Morning", "Midday", "Afternoon", "Evening"].map((time, idx) => (
                <div key={time} style={{ background: TOKENS.bg, padding: 10, borderRadius: 6, border: `1px solid ${TOKENS.border}` }}>
                  <div style={{ color: TOKENS.text, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{time}</div>
                  <div style={{ color: TOKENS.muted, fontSize: 11 }}>
                    {idx === 0 && "Review dashboards\nPrioritize bottleneck"}
                    {idx === 1 && "Close deals\nCustomer conversations"}
                    {idx === 2 && "Improve agents\nImprove automation"}
                    {idx === 3 && "Strategy + expansion"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderModule = () => {
    if (activeModule === "Dashboard") return renderDashboard();
    if (activeModule === "Ideas Lab") return renderIdeasLab();
    if (activeModule === "Startup Probability Engine") return renderStartupProbabilityEngine();
    if (activeModule === "Validation") return renderValidation();
    if (activeModule === "Customer CRM") return renderCustomerCRM();
    if (activeModule === "Sales Pipeline") return renderSalesPipeline();
    if (activeModule === "Revenue Analytics") return renderRevenueAnalytics();
    if (activeModule === "Fundraising") return renderFundraising();
    if (activeModule === "Daily OS") return renderDailyOS();
    if (activeModule === "Weekly Metrics") return renderWeeklyMetrics();
    if (activeModule === "Learning Hub") return renderLearningHub();
    if (activeModule === "Mindset") return renderMindset();
    if (activeModule === "AI Agents") return renderAIAgents();
    return null;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 15% 10%, ${TOKENS.orangeDim} 0%, ${TOKENS.bg} 40%)`,
        color: TOKENS.text,
        fontFamily: FONT_BODY,
      }}
    >
      {notice ? (
        <div
          style={{
            position: "fixed",
            right: 14,
            top: 14,
            zIndex: 1000,
            background: notice.tone === "error" ? "#341414" : notice.tone === "success" ? "#0F2B1E" : TOKENS.surface,
            border: `1px solid ${notice.tone === "error" ? TOKENS.red : notice.tone === "success" ? TOKENS.green : TOKENS.border
              }`,
            borderRadius: 12,
            padding: "10px 12px",
            minWidth: isMobile ? 240 : 340,
            maxWidth: 460,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          {notice.tone === "error" ? (
            <XCircle size={16} color={TOKENS.red} />
          ) : (
            <CheckCheck size={16} color={notice.tone === "success" ? TOKENS.green : TOKENS.blue} />
          )}
          <span style={{ color: TOKENS.text, fontSize: 13 }}>{notice.text}</span>
        </div>
      ) : null}

      <input
        ref={backupFileRef}
        type="file"
        accept="application/json"
        onChange={importBackup}
        style={{ display: "none" }}
      />

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px minmax(0, 1fr)" }}>
        <aside
          style={{
            background: TOKENS.surface,
            borderRight: `1px solid ${TOKENS.border}`,
            padding: 16,
            position: isMobile ? "static" : "sticky",
            top: 0,
            height: isMobile ? "auto" : "100vh",
            overflow: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 24, fontWeight: 800, color: TOKENS.text }}>FounderOS</div>
              <div style={{ color: TOKENS.muted, fontSize: 12 }}>Execution Operating System</div>
            </div>
          </div>

          <Card style={{ marginBottom: 12, padding: 12 }}>
            <div style={{ color: TOKENS.muted, fontSize: 12 }}>Weekly Execution Score</div>
            <div style={{ color: scoreTone, fontFamily: FONT_MONO, fontSize: 28, marginTop: 4 }}>{weeklyExecutionScore}</div>
          </Card>

          <div style={{ display: "grid", gap: 6 }}>
            {MODULES.map((module) => {
              const Icon = module.icon;
              const active = activeModule === module.key;
              return (
                <button
                  key={module.key}
                  onClick={() => setActiveModule(module.key)}
                  style={{
                    cursor: "pointer",
                    background: active ? TOKENS.orangeDim : "transparent",
                    border: `1px solid ${active ? TOKENS.orange : TOKENS.border}`,
                    borderRadius: 10,
                    color: TOKENS.text,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: FONT_BODY,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon size={15} />
                    {module.key}
                  </span>
                  <ChevronRight size={14} color={active ? TOKENS.orange : TOKENS.muted} />
                </button>
              );
            })}
          </div>
        </aside>

        <main style={{ padding: isMobile ? 12 : 20 }}>
          <div style={{ display: "grid", gap: 16 }}>
            <Card
              style={{
                background: TOKENS.surface,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
              }}
            >
              <SectionTitle
                title={activeModule}
                subtitle="Idea discovery -> validation -> MVP -> customers -> revenue -> scale"
              />
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: `1px solid ${TOKENS.border}`,
                    background: TOKENS.card,
                    color: TOKENS.blue,
                    fontFamily: FONT_MONO,
                    fontWeight: 700,
                  }}
                >
                  AI via Server Key
                </div>
                <Button onClick={exportBackup}>
                  <Download size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Export
                </Button>
                <Button onClick={triggerImportPicker}>
                  <Upload size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Import
                </Button>
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: `1px solid ${TOKENS.border}`,
                    background: TOKENS.card,
                    color: scoreTone,
                    fontFamily: FONT_MONO,
                    fontWeight: 700,
                  }}
                >
                  Score {weeklyExecutionScore}
                </div>
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: `1px solid ${TOKENS.border}`,
                    background: TOKENS.card,
                    color: TOKENS.text,
                    fontFamily: FONT_MONO,
                  }}
                >
                  Streak {executionStreak}d
                </div>
              </div>
            </Card>

            <Card style={{ background: TOKENS.surface }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
                <div>
                  <div style={{ color: TOKENS.muted, fontSize: 12 }}>No-Zero-Day Engine</div>
                  <div style={{ marginTop: 6, color: noZeroToday ? TOKENS.green : TOKENS.red, fontWeight: 700 }}>
                    {noZeroToday ? "Active today" : "No activity yet"}
                  </div>
                </div>
                <div>
                  <div style={{ color: TOKENS.muted, fontSize: 12 }}>Opportunity Discovery</div>
                  <div style={{ marginTop: 6, color: TOKENS.text, fontFamily: FONT_MONO }}>
                    {opportunityCounter.total}/100
                  </div>
                </div>
                <div>
                  <div style={{ color: TOKENS.muted, fontSize: 12 }}>Goal</div>
                  <div style={{ marginTop: 6, color: TOKENS.text }}>₹500Cr annual revenue in 5 years</div>
                </div>
              </div>
            </Card>

            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default FounderOS;
