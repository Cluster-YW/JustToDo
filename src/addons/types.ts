// Addon types identifier
export type AddonType = "timespan" | "deadline" | "timer" | "schedule";

// Base Addon interface
export interface BaseAddon {
  type: AddonType;
  id: string;
}

export interface TimespanAddon extends BaseAddon {
  type: "timespan";
  start: number; // timestamp: ms
  end: number; // timestamp: ms
  isAllDay: boolean;
}

export interface DeadlineAddon extends BaseAddon {
  type: "deadline";
  target: number; // timestamp: ms
  isAllDay: boolean;
}

export interface TimerAddon extends BaseAddon {
  type: "timer";
  startTime: number; // timestamp: ms
  isAllDay: boolean;
}

export interface ScheduleAddon extends BaseAddon {
  type: "schedule";
  pattern: "daily" | "weekly";
  time: string;
  weekdays?: number[];
}

export type Addon = TimespanAddon | DeadlineAddon | TimerAddon | ScheduleAddon;
export type DisplayMode = "compact" | "edit";
// compact - view mode
// edit - edit mode

export interface AddonProps<T extends Addon> {
  data: T;
  mode: DisplayMode;
  onUpdate: (newData: T) => void;
  onRemvove: () => void;
  isTaskCompleted: boolean;
}

// *********** Registry Metadata ***********
export interface AddonMeta<T extends Addon> {
  type: AddonType;
  label: string; // label for the addon in the UI
  icon: string; // icon for the addon in the UI
  component: React.ComponentType<AddonProps<T>>;
  createDefault: () => T;
}
