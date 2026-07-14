import { ActionPanel, List, Action, Icon, getPreferenceValues } from "@raycast/api";
import { ProjectId } from "./preference";

const preferences = getPreferenceValues<Preferences>();
const projectIds = JSON.parse(preferences.projectIds) as ProjectId[];

export default function Command() {
  return (
    <List>
      {projectIds.map((item, index) => (
        <List.Item
          key={item.projectId}
          icon={Icon.Bolt}
          title={`${item.projectId}:${item.projectNumber}`}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="Copy projectId" content={item.projectId} />
              <Action.CopyToClipboard title="Copy projectNumber" content={item.projectNumber} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
