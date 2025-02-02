import { ActionPanel, Detail, List, Action, Icon, open } from "@raycast/api";

// 全サービスじゃないしGoogle Cloudに追従しないといけない
const consoleUrls = [
  { service: "IAM", path: "iam-admin", icon: "google-cloud-icons/identity_and_access_management/identity_and_access_management.svg" },
  { service: "Compute Engine", path: "compute", icon: "google-cloud-icons/compute_engine/compute_engine.svg" },
  { service: "Cloud Storage", path: "storage", icon: "google-cloud-icons/cloud_storage/cloud_storage.svg" },
  { service: "BigQuery", path: "bigquery", icon: "google-cloud-icons/bigquery/bigquery.svg" },
  { service: "Pub/Sub", path: "cloudpubsub", icon: "google-cloud-icons/pubsub/pubsub.svg" },
  { service: "Dataflow", path: "dataflow", icon: "google-cloud-icons/dataflow/dataflow.svg" },
  { service: "VPC Network", path: "networking", icon: "google-cloud-icons/virtual_private_cloud/virtual_private_cloud.svg" },
  { service: "Load balancing", path: "net-services/loadbalancing", icon: "google-cloud-icons/cloud_load_balancing/cloud_load_balancing.svg" },
  { service: "Cloud DNS", path: "net-services/dns", icon: "google-cloud-icons/cloud_dns/cloud_dns.svg" },
  { service: "Cloud Run", path: "run", icon: "google-cloud-icons/cloud_run/cloud_run.svg" },
  { service: "Cloud Run functions", path: "functions", icon: "google-cloud-icons/cloud_functions/cloud_functions.svg" },
  { service: "Database Center", path: "database-center", icon: "" },
  { service: "AlloyDB", path: "alloydb/clusters", icon: "google-cloud-icons/alloydb.png" },
  { service: "SQL", path: "sql/instances", icon: "google-cloud-icons/cloud_sql/cloud_sql.svg" },
  { service: "Firestore", path: "firestore/databases", icon: "google-cloud-icons/firestore/firestore.svg" },
  { service: "Logging", path: "logs", icon: "google-cloud-icons/cloud_logging/cloud_logging.svg" },
  { service: "Monitoring", path: "monitoring", icon: "google-cloud-icons/cloud_monitoring/cloud_monitoring.svg" },
  { service: "Error Reporting", path: "errors", icon: "google-cloud-icons/error_reporting/error_reporting.svg" },
  { service: "Trace", path: "traces", icon: "google-cloud-icons/trace/trace.svg" },
  { service: "Profiler", path: "profiler", icon: "google-cloud-icons/profiler/profiler.svg" },
  { service: "Risk overview", path: "security/command-center", icon: "google-cloud-icons/security_command_center/security_command_center.svg" },
  { service: "Cloud Build", path: "cloud-build", icon: "google-cloud-icons/cloud_build/cloud_build.svg" },
  { service: "Artifact Registry", path: "artifacts", icon: "google-cloud-icons/artifact_registry/artifact_registry.svg" },
  { service: "Vertex AI", path: "vertex-ai", icon: "google-cloud-icons/vertexai/vertexai.svg" },
  { service: "Cloud Scheduler", path: "cloudscheduler", icon: "google-cloud-icons/cloud_scheduler/cloud_scheduler.svg" },
  { service: "Eventarc", path: "eventarc/triggers", icon: "google-cloud-icons/eventarc/eventarc.svg" },
];

// TODO projectsは外から設定する
const projects = [""];

export default function Command() {
  return (
    <List>
      {consoleUrls.map((item, index) => (
        <List.Item
          key={item.service}
          icon={item.icon || "google-cloud.svg"}
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
