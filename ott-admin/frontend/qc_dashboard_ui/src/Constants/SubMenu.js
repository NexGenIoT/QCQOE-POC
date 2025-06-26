export const sideMenu = [
  {
    id: 1,
    title: "Video Quality Of Experience (QOE)",
    subMenu: [
      {
        value: "Experience Insights",
        path: "experience-insights",
      },
      {
        value: "Real-time key insights",
        path: "realtime-key-insights",
      },
      {
        value: "User engagement metrics",
        path: "user-engagement-metrics",
      },
      {
        value: "Quality of Experience (QoE)",
        path: "quality-of-experience",
      },
      {
        value: "Favorite",
        path: "favorite",
      },
      {
        value: "Location",
        path: "location",
      },
      {
        value: "SSO & Playback Errors",
        path: "error-screen",
      }
    ],
  },
  {
    id: 2,
    title: "Video Quality Check (QC)",
    subMenu: [
      {
        value: "Overview",
        path: "overview",
        tabId: 0,
      },
      {
        value: "Log Details",
        path: "overview",
        tabId: 1
      },
      {
        value: "Issue Analysis",
        path: "overview",
        tabId: 2
      },
      {
        value: "Pending In Queue",
        path: "overview",
        tabId: 3
      },
      {
        value: "Resource Management",
        path: "overview",
        tabId: 4
      },
      {
        value: "Ingestion Insight",
        path: "overview",
        tabId: 5
      }
    ],
  },
  {
    id: 3,
    title: "Mitigation Summary Dashboard",
    subMenu: [
      {
        value: "Mitigation",
        path: "mitigation",
        tabId: 0
      },
      {
        value: "Analytics",
        path: "mitigation",
        tabId: 1
      },
    ],
  },
  {
    id: 4,
    title: "Expert System Dashboard",
    subMenu: [
      {
        value: "Detected Anomalies",
        path: "detectedanomalies",
        tabId: 0,
      },
      {
        value: "Estimated root causes",
        path: "detectedanomalies",
        tabId: 1,
      },
      {
        value: "Configure RCA",
        path: "detectedanomalies",
        tabId: 2,
      },
      {
        value: "Configure Mitigation",
        path: "detectedanomalies",
        tabId: 3,
      },
      {
        value: "AI Pipeline Insight",
        path: "detectedanomalies",
        tabId: 4,
      },
      
    ],
  },
];
