import { closeMainWindow, open, PopToRootType } from "@raycast/api";

// open() だけでは Raycast のウィンドウが開いたまま残るため、明示的に閉じてルートに戻す
export async function openAndClose(url: string) {
  await open(url);
  await closeMainWindow({ popToRootType: PopToRootType.Immediate });
}
