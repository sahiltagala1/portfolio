/**
 * Every fact the site publishes lives in this file.
 * Edit here; the pages read from these objects and nothing else.
 * Optional fields that are left out are simply not rendered, so never fill
 * a gap with a guess. See README.md, "Needs your review".
 */

export type Link = { label: string; href: string };

export type Profile = {
  name: string;
  positioning: string;
  location: string;
  summary: string;
  availability?: string;
  email?: string;
  resumeUrl?: string;
  links: Link[];
};

export type Decision = { title: string; approach: string; alternative?: string };

export type CaseStudy = {
  role: string;
  facts: Array<{ label: string; value: string }>;
  problem: string[];
  approach: string[];
  decisions: Decision[];
  outcome: string[];
  results?: Array<{ label: string; value: string }>;
};

export type Project = {
  slug: string;
  title: string;
  track: "Data science" | "Software engineering";
  context?: string;
  summary: string;
  technologies: string[];
  sourceUrl?: string;
  liveUrl?: string;
  caseStudy?: CaseStudy;
};

export const profile: Profile = {
  name: "Sahil Tagala",
  positioning: "I build backend systems, and models that explain their own alarms.",
  location: "Dublin, Ireland",
  summary:
    "I spent two years building EV charging software at Numocity in Bengaluru, then moved to Dublin for an MSc in Data Science at TU Dublin. My dissertation taught a model to flag abnormal charging sessions and show its reasons.",
  availability: "Looking for graduate roles in software engineering and data science in Dublin.",
  email: "sahiltagala1@gmail.com",
  links: [{ label: "GitHub", href: "https://github.com/sahiltagala1" }],
};

export const experience = [
  {
    title: "Backend engineering, Numocity Technologies",
    meta: "Bengaluru · about two years",
    points: [
      "Built backend services for EV charging infrastructure.",
      "Integrated the charging management system with other networks over the OCPI protocol.",
      "Worked in Python, Node.js and MongoDB, building and maintaining REST APIs.",
    ],
  },
  {
    title: "MSc in Computing (Data Science), TU Dublin",
    meta: "Dublin · 2025 to 2026 · Second Class Honours, First Division (2.1)",
    points: [
      "Modules included Applied Deep Learning, Machine Learning, Programming for Big Data and Data Management.",
      "Dissertation on explainable anomaly detection in EV charging infrastructure.",
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "explainable-anomaly-detection",
    title: "Explainable anomaly detection in EV charging infrastructure",
    track: "Data science",
    context: "MSc dissertation, TU Dublin",
    summary:
      "An LSTM that flags abnormal charging sessions, paired with SHAP so every flag comes with the features that caused it.",
    technologies: ["Python", "LSTM", "SHAP", "Time series"],
    caseStudy: {
      role: "Sole author. Supervised MSc dissertation.",
      facts: [
        { label: "Context", value: "MSc dissertation, TU Dublin" },
        { label: "Year", value: "2026" },
        { label: "Role", value: "Sole author, supervised" },
        { label: "Full title", value: "Explainable Anomaly Detection in EV Charging Infrastructure: An LSTM-Based Approach with SHAP Interpretability" },
      ],
      problem: [
        "A detector that only says “this session is abnormal” leaves the person on the other end to work out why. In charging infrastructure, that person is an operator deciding whether to send someone to a charger.",
        "I wanted flags that arrive with their reasons.",
      ],
      approach: [
        "An LSTM reads each charging session as a sequence and scores how abnormal it looks.",
        "SHAP then splits that score across the input features. A flagged session shows which measurements pushed it over the line, and by how much.",
      ],
      decisions: [
        {
          title: "Splitting the data by garage as well as by time",
          approach:
            "The sessions came from several garages, and the mix of garages changed over time. I split by time within each garage, so the training and test sets keep the same mix of garages while the test data still comes later than the training data.",
          alternative:
            "A plain chronological split trained on one mix of garages and tested on another. The scores it produced said more about the shift in garages than about the model.",
        },
      ],
      outcome: [
        "With the garage-stratified temporal split, the model reached the scores below.",
        "The dissertation was completed in 2026 as part of an MSc awarded with Second Class Honours, First Division.",
      ],
      results: [
        { label: "AUC-ROC", value: "0.9873" },
        { label: "F1 score", value: "0.8173" },
      ],
    },
  },
  {
    slug: "halal-food-scanner",
    title: "Halal Food Scanner",
    track: "Software engineering",
    context: "Portfolio project",
    summary: "A mobile app for checking whether a food product is halal.",
    technologies: ["React Native", "FastAPI", "Supabase"],
  },
  {
    slug: "task-management-api",
    title: "Real-Time Task Management API",
    track: "Software engineering",
    context: "Portfolio project",
    summary: "A backend API for managing tasks, with real-time updates.",
    technologies: ["REST API", "Real-time"],
  },
  {
    slug: "customer-churn-prediction",
    title: "Customer Churn Prediction",
    track: "Data science",
    context: "Portfolio project",
    summary: "A machine learning system that predicts which customers are likely to leave.",
    technologies: ["Python", "Classification"],
  },
  {
    slug: "eeg-motor-imagery",
    title: "EEG Motor Imagery Classifier",
    track: "Data science",
    summary:
      "A Streamlit app that classifies imagined movement from EEG signals, using CSP features with Random Forest and MLP models.",
    technologies: ["Streamlit", "CSP", "Random Forest", "MLP"],
    sourceUrl: "https://github.com/sahiltagala1/eeg-motor-imagery",
  },
  {
    slug: "facial-age-estimation",
    title: "Facial Age Estimation",
    track: "Data science",
    context: "Applied Deep Learning coursework, TU Dublin",
    summary: "Estimating age from face images with CNNs and transfer learning on ResNet18.",
    technologies: ["CNN", "ResNet18", "Transfer learning"],
  },
  {
    slug: "credit-risk-pyspark",
    title: "Credit Risk with PySpark",
    track: "Data science",
    context: "Programming for Big Data coursework, TU Dublin",
    summary: "Credit default analysis on the Give Me Some Credit dataset, built with PySpark.",
    technologies: ["PySpark"],
  },
];

/** Skills grouped by the work they make possible, each tied to where it was used. */
export const capabilities = [
  {
    title: "Building backend services",
    body: "REST APIs and services in Python and Node.js, with MongoDB behind them.",
    evidence: "Numocity, Real-Time Task Management API",
  },
  {
    title: "Connecting systems that were not built together",
    body: "Protocol integrations between charging networks using OCPI.",
    evidence: "Numocity",
  },
  {
    title: "Training models on sequences and images",
    body: "LSTMs for time series, CNNs and transfer learning for images, classical models where they fit.",
    evidence: "Dissertation, Facial Age Estimation, EEG Motor Imagery Classifier",
  },
  {
    title: "Explaining what a model did",
    body: "SHAP attributions, and evaluation splits that match how the data really arrives.",
    evidence: "Dissertation",
  },
  {
    title: "Shipping something people can use",
    body: "A mobile app with React Native, FastAPI and Supabase; a model wrapped in a Streamlit app.",
    evidence: "Halal Food Scanner, EEG Motor Imagery Classifier",
  },
  {
    title: "Working with larger datasets",
    body: "Data pipelines in PySpark. Also comfortable in Java and C++.",
    evidence: "Credit Risk with PySpark",
  },
];

export const featured = projects[0];
export const caseStudies = projects.filter((p) => p.caseStudy);
