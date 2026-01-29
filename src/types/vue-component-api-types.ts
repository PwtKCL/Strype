
/**
 * Components custom APIs (types)
 * 
 * Vue 3 doesn't expose $root and $children anymore so we can't access the components directly via traversing 
 * the Vue components as we did before.
 * Instead, we can retrieve the different Components' methods or datas or computed props via some "API".
 * 
 * These APIs are created per Component and this typing file allows us to have one place to declare the signatures of the methods.
 * 
 * To make reactivity working and code readable, datas are accessed or updated via proper getter/setter functions.
 * 
 * (The APIs are accessible via the store, see in store why.)
 **/

import FrameContainer from "@/components/FrameContainer.vue";
import { BvModalEvent } from "bootstrap-vue";
import { CloudDriveComponent, CloudDriveFile } from "@/types/cloud-drive-types";
import { AppEvent, SaveRequestReason, StrypePEALayoutMode, StrypeSyncTarget } from "@/types/types";

export type AppComponentAPI = {
  applyShowAppProgress: (event: AppEvent) => void;
  setStateFromPythonFile: (completeSource: string, fileName: string, lastSaveDate: number, requestFSFileLoadedNotification: boolean, fileLocation?: FileSystemFileHandle) => Promise<void>,
  finaliseOpenShareProject: (message?: {key: string, param: string}) => void,
  onExpandedPythonExecAreaSplitPaneResize: (event: any, calledForResize?: boolean) => void,
  onStrypeCommandsSplitPaneResize: (event: any, useSpecificPEALayout?: StrypePEALayoutMode) => void,
  getRefedFrameContainerComponent: (refId: string) => InstanceType<typeof FrameContainer>,
};

export type CommandsComponentAPI = {
  onCommandsSplitterResize: (event: any) => void,
  resetPEACommmandsSplitterDefaultState: () => Promise<void>,
  setCommandsSplitterPane2Size: (v: number) => void,
  // #v-ifdef MODE == VITE_STANDARD_PYTHON_MODE
  setPEACommandsSplitterPanesMinSize: (onlyResizePEA?: boolean) => void,
  // #v-endif
};

export type PEAComponentAPI = {
  togglePEALayout:(layoutMode: StrypePEALayoutMode, userTriggeredAction?: boolean) => void,
  clear: () => void,
  getIsConsoleAreaShowing: () => boolean,
  getIsGraphicsAreaShowing: () => boolean,
};

export type MenuComponentAPI = {
  onStrypeMenuHideModalDlg: (event: BvModalEvent, dlgId: string, forcedProjectName?: string, saveReason ?: SaveRequestReason) => void,
  toggleMenuOnOff: (e: Event | null) => void,
  setCurrentErrorNavIndex: (v: number) => void, 
  goToError: (event: MouseEvent | null, toNext: boolean) => void,
}

export type CloudDriveHandlerComponentAPI = {
  getDriveName: () => string,
  getSpecificCloudDriveComponent: (cloudTarget: StrypeSyncTarget) => CloudDriveComponent | null,
  searchCloudDriveElements: (cloudTarget: StrypeSyncTarget, fileName: string, fileLocationId: string, searchAllSPYFiles: boolean, searchOptions: Record<string, string>) => Promise<CloudDriveFile[]>,
  readFileContentForIO: (cloudTarget: StrypeSyncTarget, fileId: string, isBinaryMode: boolean, filePath: string) => Promise<string | Uint8Array | {success: boolean, errorMsg: string}>,
  writeFileContentForIO: (cloudTarget: StrypeSyncTarget, fileContent: string|Uint8Array, fileInfos: {filePath: string, fileName?: string, fileId?: string, folderId?: string}) => Promise<string>,
}