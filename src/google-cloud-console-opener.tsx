import { ActionPanel, Detail, List, Action, Icon, open } from "@raycast/api";

// 全サービスじゃないしGoogle Cloudに追従しないといけない
const consoleUrls = [
  { service: "IAM", path: "iam-admin", icon: "" },
  { service: "Compute Engine", path: "compute", icon: "" },
  { service: "Cloud Storage", path: "storage", icon: "" },
  { service: "BigQuery", path: "bigquery", icon: "" },
  { service: "Pub/Sub", path: "cloudpubsub", icon: "" },
  { service: "Dataflow", path: "dataflow", icon: "" },
  { service: "VPC Network", path: "networking", icon: "" },
  { service: "Cloud Run", path: "run", icon: "" },
  { service: "Cloud Run functions", path: "functions", icon: "" },
  { service: "Database Center", path: "database-center", icon: "" },
  { service: "AlloyDB", path: "alloydb/clusters", icon: "" },
  { service: "SQL", path: "sql/instances", icon: "" },
  { service: "Firestore", path: "firestore/databases", icon: "" },
  { service: "Logging", path: "logs", icon: "" },
  { service: "Monitoring", path: "monitoring", icon: "" },
  { service: "Error Reporting", path: "errors", icon: "" },
  { service: "Trace", path: "traces", icon: "" },
  { service: "Profiler", path: "profiler", icon: "" },
  { service: "Risk overview", path: "security/command-center", icon: "" },
  { service: "Cloud Build", path: "cloud-build", icon: "" },
  { service: "Artifact Registry", path: "artifacts", icon: "" },
  { service: "Vertex AI", path: "vertex-ai", icon: "" },
  { service: "Cloud Scheduler", path: "cloudscheduler", icon: "" },
  { service: "Eventarc", path: "eventarc/triggers", icon: "" },
];

// TODO projectsは外から設定する
const projects = [""];

export default function Command() {
  return (
    <List>
      {consoleUrls.map((item, index) => (
        <List.Item
          key={item.service}
          icon={Icon.Bird}
          title={item.service}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={SelectProject(item.path)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

const SelectProject = (path: string) => {
  return (
    <List>
      {projects.map((item, index) => (
        <List.Item
          key={item}
          icon={Icon.Link}
          title={item}
          actions={
            <ActionPanel>
              <Action
                title="Jump to link"
                onAction={() => open(`https://console.cloud.google.com/${path}?project=${item}`)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};
