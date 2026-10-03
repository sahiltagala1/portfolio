/**
 * Every fact the site publishes lives in this file.
 * Edit here; the pages read from these objects and nothing else.
 * Optional fields that are left out are simply not rendered, so never fill
 * a gap with a guess. See README.md, "Needs your review".
 */

export type Link = { label: string; href: string };

export type Profile = {
  name: string;
  /** Used where space is tight, such as the top-left corner. */
  shortName: string;
  role: string;
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
  comparison?: { caption: string; columns: string[]; rows: string[][]; highlight: number };
  limitations?: string[];
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
  name: "Mohammed Sahil Tagala",
  shortName: "Sahil Tagala",
  role: "Software engineer",
  positioning: "I build backend systems, and models that explain their own alarms.",
  location: "Dublin, Ireland",
  summary:
    "I spent two years building EV charging software at Numocity in Bengaluru, then moved to Dublin for an MSc in Data Science at TU Dublin. My dissertation taught a model to flag abnormal charging sessions and show its reasons.",
  availability: "Looking for graduate roles in software engineering and data science in Dublin.",
  email: "sahiltagala1@gmail.com",
  resumeUrl: "/Mohammed-Sahil-Tagala-CV.pdf",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sahil-tagala" },
    { label: "GitHub", href: "https://github.com/sahiltagala1" },
  ],
};

export const experience = [
  {
    title: "MSc in Computing (Data Science), TU Dublin",
    meta: "Dublin · Sep 2025 to Aug 2026 · Second Class Honours, First Division · GPA 3.4/4.0",
    points: [
      "Coursework in machine learning, deep learning, big data analytics, statistical analysis and data mining.",
      "Dissertation on explainable anomaly detection in EV charging infrastructure.",
    ],
  },
  {
    title: "Software Engineer, Numocity Technologies",
    meta: "Bengaluru · Jun 2023 to Jan 2025",
    points: [
      "Built and maintained backend services for EV charging platforms in Node.js, Python and MongoDB.",
      "Implemented OCPI integrations between Numocity's Charge Management System and external network operators.",
      "Automated real-time monitoring and alerting with Bull Queue and Redis.",
      "Debugged production issues from logs and metrics, shipped permanent fixes and documented how each was resolved.",
      "Mentored junior engineers during onboarding.",
    ],
  },
  {
    title: "Software Engineer Intern, Numocity Technologies",
    meta: "Bengaluru · Feb 2023 to May 2023",
    points: [
      "Built and optimised REST APIs, and refactored legacy code in the Charge Management System.",
      "Wrote unit tests with Mocha and Chai.",
      "Documented API endpoints and integration flows for the wider team.",
    ],
  },
  {
    title: "B.E. in Computer Science, Dayananda Sagar Academy of Technology and Management",
    meta: "India · Sep 2019 to May 2023 · CGPA 8.06/10",
    points: [],
  },
];

export const projects: Project[] = [
  {
    slug: "explainable-anomaly-detection",
    title: "Explainable anomaly detection in EV charging infrastructure",
    track: "Data science",
    context: "MSc dissertation, TU Dublin",
    summary:
      "An LSTM autoencoder that flags abnormal charging sessions without fault labels, paired with SHAP so every flag comes with the features that caused it.",
    technologies: ["Python", "LSTM autoencoder", "SHAP", "Time series"],
    sourceUrl: "https://github.com/sahiltagala1/ev-charging-anomaly-detection",
    caseStudy: {
      role: "Sole author. Supervised MSc dissertation.",
      facts: [
        { label: "Context", value: "MSc dissertation, TU Dublin" },
        { label: "Year", value: "2026" },
        { label: "Role", value: "Sole author, supervised" },
        { label: "Data", value: "ACN-Data (Lee et al., 2019): 15,700 sessions, 3 sites, 7 garages" },
      ],
      problem: [
        "A detector that only says “this session is abnormal” leaves the person on the other end to work out why. In charging infrastructure, that person is an operator deciding whether to send someone to a charger.",
        "Real fault labels are also rare. I wanted a model that learns from normal sessions alone, and flags that arrive with their reasons.",
      ],
      approach: [
        "I started from 15,700 public charging sessions and filtered them down to 3,595 that were clearly normal. Each session is described by 17 features: 10 about the session itself, 5 comparing it with recent history, and 2 about how busy the station was.",
        "An LSTM autoencoder is trained on normal sessions only. It learns to reconstruct them, and a session it reconstructs badly is flagged. No fault labels are used in training.",
        "To measure it, I injected 633 synthetic faults of three kinds: energy shortfall, current dropout and session timeout. SHAP then splits each flag across the 17 features.",
      ],
      decisions: [
        {
          title: "Splitting the data by garage as well as by time",
          alternative:
            "A plain chronological split trained on one mix of garages and tested on another, so the scores partly measured the shift in garages.",
          approach:
            "I sorted sessions by time within each garage and split 60/20/20. Training, validation and test sets keep the same mix of garages, and later data is still never used to predict earlier data.",
        },
        {
          title: "Making the injected faults honest",
          alternative:
            "With standard injection settings, 90 to 100% of the faulty feature values still fell inside the normal range. The faults were faults in name only, and no model could be fairly judged on them.",
          approach:
            "I ran an overlap analysis on each fault type and strengthened the injection until the faults were separated from normal behaviour.",
        },
        {
          title: "Using the explanations to improve the model",
          alternative:
            "With every feature weighted equally in the reconstruction error, the autoencoder reached an AUPRC of 0.5776.",
          approach:
            "SHAP showed one dominant feature per fault type. I gave the four dominant features a weight of 5 in the error. AUPRC rose to 0.9268 with no retraining.",
        },
      ],
      outcome: [
        "The autoencoder beat both unsupervised baselines, and the difference held up under cross-validation (p = 0.009 against the threshold rule, p < 0.001 against Isolation Forest).",
        "It reached 83% of the F1 score of a supervised LSTM that was given the fault labels.",
        "SHAP named a single clear driver for each fault type: energy delivered for shortfalls, the share of time at zero current for dropouts, and deviation in duration for timeouts.",
      ],
      results: [
        { label: "AUPRC", value: "0.9268" },
        { label: "F1 score", value: "0.8173" },
        { label: "AUC-ROC", value: "0.9869" },
      ],
      comparison: {
        caption: "Test-set results. The supervised LSTM is a reference that sees fault labels; the other three do not.",
        columns: ["Model", "F1", "False positive rate", "AUC-ROC", "AUPRC"],
        rows: [
          ["Threshold rule", "0.7135", "0.1415", "0.8297", "0.7297"],
          ["Isolation Forest", "0.4542", "0.1165", "0.8625", "0.4045"],
          ["LSTM autoencoder", "0.8173", "0.0707", "0.9869", "0.9268"],
          ["Supervised LSTM (reference)", "0.9844", "0.0042", "0.9992", "0.9943"],
        ],
        highlight: 2,
      },
      limitations: [
        "The faults are synthetic. They were injected into real sessions and deliberately separated from normal behaviour, so real faults are likely to be harder to catch.",
        "The data comes from three sites. I have not tested the model on another network.",
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
    summary:
      "A pipeline that predicts which customers will leave, built on 7,000+ records. It compares four classifiers (best ROC-AUC 0.891), uses SMOTE for class imbalance, and presents the results in a Streamlit dashboard.",
    technologies: ["Python", "XGBoost", "scikit-learn", "pandas", "Streamlit"],
    sourceUrl: "https://github.com/sahiltagala1/churn-prediction",
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
    body: "REST APIs and services in Node.js and Python, with MongoDB, MySQL and Redis behind them.",
    evidence: "Numocity, Real-Time Task Management API",
  },
  {
    title: "Connecting systems that were not built together",
    body: "Protocol integrations between charging networks using OCPI.",
    evidence: "Numocity",
  },
  {
    title: "Keeping production systems observable",
    body: "Monitoring and alerting with Bull Queue and Redis, and debugging live issues from logs and metrics.",
    evidence: "Numocity",
  },
  {
    title: "Training models on sequences and images",
    body: "LSTMs for time series, CNNs and transfer learning for images, XGBoost and scikit-learn where they fit.",
    evidence: "Dissertation, Customer Churn Prediction, Facial Age Estimation, EEG Motor Imagery Classifier",
  },
  {
    title: "Explaining what a model did",
    body: "SHAP attributions, and evaluation splits that match how the data really arrives.",
    evidence: "Dissertation",
  },
  {
    title: "Shipping something people can use",
    body: "A mobile app with React Native, FastAPI and Supabase; models wrapped in Streamlit dashboards; Docker and CI/CD.",
    evidence: "Halal Food Scanner, Customer Churn Prediction, EEG Motor Imagery Classifier",
  },
];

export const featured = projects[0];
export const caseStudies = projects.filter((p) => p.caseStudy);
