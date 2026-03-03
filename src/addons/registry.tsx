import type {
  AddonMeta,
  AddonProps,
  DeadlineAddon,
  TimespanAddon,
} from "./types";

import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
const TimespanAddonPlaceholder: React.FC<AddonProps<TimespanAddon>> = ({
  data,
  mode,
}) => (
  <div style={{ fontSize: "12px", color: "#666" }}>
    📅 Timespan ({mode}): {new Date(data.start).toLocaleDateString()} -{" "}
    {new Date(data.end).toLocaleDateString()}
  </div>
);

// eslint-disable-next-line react-refresh/only-export-components
const DeadlineAddonPlaceholder: React.FC<AddonProps<DeadlineAddon>> = ({
  data,
  mode,
}) => (
  <div style={{ fontSize: "12px", color: "#666" }}>
    ⏰ Deadline ({mode}): {new Date(data.target).toLocaleDateString()}
  </div>
);

// ************ Factory Functions ***********

const createDefaultTimespan = (): TimespanAddon => {
  const now = Date.now();
  const oneHourLater = now + 60 * 60 * 1000; // 60min * 60s * 1000 ms

  return {
    type: "timespan",
    id: `timespan_${now}_${Math.random().toString(36).substr(2, 9)}`,
    start: now,
    end: oneHourLater,
    isAllDay: false,
  };
};

const createDefaultDeadline = (): DeadlineAddon => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    type: "deadline",
    id: `deadline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    target: tomorrow.getTime(),
    isAllDay: false,
  };
};

// ************ Registry ***********
export const addonRegistry = {
  timespan: {
    type: "timespan",
    label: "时段",
    icon: "📅",
    component: TimespanAddonPlaceholder, // 暂时使用占位符
    createDefault: createDefaultTimespan,
  } as AddonMeta<TimespanAddon>,

  deadline: {
    type: "deadline",
    label: "截止",
    icon: "⏰",
    component: DeadlineAddonPlaceholder,
    createDefault: createDefaultDeadline,
  } as AddonMeta<DeadlineAddon>,

  // 后续可在此处添加 timer 和 schedule
} as const;

// ************ Export ***********

export type RegisteredAddonType = keyof typeof addonRegistry;
export const addonTypeList = Object.keys(
  addonRegistry,
) as RegisteredAddonType[];

export function getAddonMeta(
  type: RegisteredAddonType,
): AddonMeta<TimespanAddon> | AddonMeta<DeadlineAddon> {
  return addonRegistry[type];
}
