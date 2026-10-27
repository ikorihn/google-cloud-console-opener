import { ActionPanel, List, Action, Icon, getPreferenceValues } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { useState } from "react";
import { openAndClose } from "./open-and-close";

type LoggingResourceType = "cloud_run_revision" | "cloud_run_job" | "cloud_run_worker_pool";

interface LoggingResource {
  type: LoggingResourceType;
  title: string;
  labelKey: string;
  gcloudGroup: string;
}

const loggingResources: LoggingResource[] = [
  { type: "cloud_run_revision", title: "Cloud Run Revision", labelKey: "service_name", gcloudGroup: "services" },
  { type: "cloud_run_job", title: "Cloud Run Job", labelKey: "job_name", gcloudGroup: "jobs" },
  { type: "cloud_run_worker_pool", title: "Cloud Run Worker Pool", labelKey: "worker_pool_name", gcloudGroup: "worker-pools" },
];

const relativeTimeRanges = [
  { title: "Last 15 minutes", minutes: 15 },
  { title: "Last 1 hour", minutes: 60 },
  { title: "Last 6 hours", minutes: 6 * 60 },
  { title: "Last 1 day", minutes: 24 * 60 },
  { title: "Last 7 days", minutes: 7 * 24 * 60 },
];

const aroundTimeRanges = [
  { title: "±15 minutes", minutes: 15 },
  { title: "±1 hour", minutes: 60 },
];

export function LoggingQueryList({ projectId }: { projectId: string }) {
  return (
    <List navigationTitle="Resource Type">
      {loggingResources.map((resource) => (
        <List.Item
          key={resource.type}
          icon={Icon.Layers}
          title={resource.title}
          actions={
            <ActionPanel>
              <Action.Push title="Select Resource" target={<ResourceNameList projectId={projectId} resource={resource} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function ResourceNameList({ projectId, resource }: { projectId: string; resource: LoggingResource }) {
  const { gcloudPath } = getPreferenceValues<Preferences>();
  const { isLoading, data, error } = useExec(gcloudPath || "gcloud", ["run", resource.gcloudGroup, "list", `--project=${projectId}`, "--format=value(metadata.name)"], {
    // 複数リージョンに同名のリソースがあると重複して返るため除外する
    parseOutput: ({ stdout }) => [...new Set(stdout.split("\n").filter(Boolean))].sort(),
    keepPreviousData: true,
  });

  const target = (resourceName: string) => <TimeRangeList projectId={projectId} resource={resource} resourceName={resourceName} />;

  return (
    <List isLoading={isLoading} navigationTitle={resource.title} searchBarPlaceholder="Filter by name">
      <List.Item
        icon={Icon.Globe}
        title="Any"
        actions={
          <ActionPanel>
            <Action.Push title="Select Time Range" target={target("")} />
          </ActionPanel>
        }
      />
      {error && <List.Item icon={Icon.Warning} title="Failed to list resources with gcloud" subtitle="Check the gcloud path in extension preferences" />}
      {data?.map((name) => (
        <List.Item
          key={name}
          icon={Icon.Box}
          title={name}
          actions={
            <ActionPanel>
              <Action.Push title="Select Time Range" target={target(name)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function TimeRangeList({ projectId, resource, resourceName }: { projectId: string; resource: LoggingResource; resourceName: string }) {
  const [searchText, setSearchText] = useState("");
  const [severity, setSeverity] = useState("");
  const { revisionTag, time } = parseSearchText(searchText);

  const baseQuery = buildLoggingQuery(resource, resourceName, revisionTag, severity);
  const openWithTimeRange = (start: Date, end?: Date) => {
    const query = [...baseQuery, `timestamp>="${start.toISOString()}"`];
    if (end) {
      query.push(`timestamp<="${end.toISOString()}"`);
    }
    return openAndClose(`https://console.cloud.google.com/logs/query;query=${encodeURIComponent(query.join("\n"))}?project=${projectId}`);
  };

  return (
    <List
      filtering={false}
      navigationTitle={resourceName || resource.title}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="revision-tag 2026-10-27 10:00 (all optional)"
      searchBarAccessory={
        <List.Dropdown tooltip="Severity" value={severity} onChange={setSeverity}>
          <List.Dropdown.Item value="" title="Any" />
          <List.Dropdown.Item value="INFO" title="INFO" />
          <List.Dropdown.Item value="WARNING" title="WARNING" />
          <List.Dropdown.Item value="ERROR" title="ERROR" />
        </List.Dropdown>
      }
    >
      {time && (
        <List.Section title={`Around ${formatLocalTime(time)}`}>
          {aroundTimeRanges.map((range) => (
            <List.Item
              key={range.title}
              icon={Icon.Calendar}
              title={range.title}
              subtitle={baseQuery.slice(1).join(" ")}
              actions={
                <ActionPanel>
                  <Action title="Open Logs Explorer" onAction={() => openWithTimeRange(new Date(time.getTime() - range.minutes * 60_000), new Date(time.getTime() + range.minutes * 60_000))} />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      )}
      <List.Section title="Relative">
        {relativeTimeRanges.map((range) => (
          <List.Item
            key={range.title}
            icon={Icon.Clock}
            title={range.title}
            subtitle={baseQuery.slice(1).join(" ")}
            actions={
              <ActionPanel>
                <Action title="Open Logs Explorer" onAction={() => openWithTimeRange(new Date(Date.now() - range.minutes * 60_000))} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

// 検索バー1つで入力を完結させ ↵ で開けるようにするため、空白区切りの語を種類ごとに振り分ける。
// YYYY-MM-DD と HH:MM は基準時刻 (日付省略時は今日、ローカルタイム)、それ以外の語は revision tag とみなす
function parseSearchText(searchText: string) {
  const words = searchText.trim().split(/\s+/).filter(Boolean);
  const dateWord = words.find((word) => /^\d{4}-\d{2}-\d{2}$/.test(word));
  const timeWord = words.find((word) => /^\d{1,2}:\d{2}$/.test(word));
  const revisionTag = words.find((word) => word !== dateWord && word !== timeWord) ?? "";

  let time: Date | undefined;
  if (timeWord) {
    const [hours, minutes] = timeWord.split(":").map(Number);
    const base = dateWord ? new Date(`${dateWord}T00:00:00`) : new Date();
    base.setHours(hours, minutes, 0, 0);
    time = Number.isNaN(base.getTime()) ? undefined : base;
  }

  return { revisionTag, time };
}

function formatLocalTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildLoggingQuery(resource: LoggingResource, resourceName: string, revisionTag: string, severity: string) {
  const query = [`resource.type="${escapeLoggingQueryValue(resource.type)}"`];

  if (resourceName) {
    query.push(`resource.labels.${resource.labelKey}="${escapeLoggingQueryValue(resourceName)}"`);
  }

  if (revisionTag) {
    // タグの命名規則に依存しないよう、完全一致ではなく部分一致 (:) で検索する
    query.push(`labels.revisionTag:"${escapeLoggingQueryValue(revisionTag)}"`);
  }

  if (severity) {
    query.push(`severity="${escapeLoggingQueryValue(severity)}"`);
  }

  return query;
}

function escapeLoggingQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
