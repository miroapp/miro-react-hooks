import { TimeUnit } from "./useTimer";

const timeFactors: Record<TimeUnit, number> = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
};

export const convertTime = (
  time: number,
  to: TimeUnit,
  from: TimeUnit = "milliseconds",
): number => {
  const valueInMilliseconds = time * timeFactors[from];
  const convertedValue = valueInMilliseconds / timeFactors[to];

  return convertedValue;
};

export const formatTime = (value: number, unit: TimeUnit = "milliseconds"): string => {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let formattedValue = value;
  let formattedUnit: Intl.RelativeTimeFormatUnit = "seconds";

  const seconds = convertTime(value, "seconds", unit);

  // Convert to the next higher unit
  if (seconds >= 60) {
    formattedValue = seconds / 60;
    formattedUnit = "minutes";
  }
  if (formattedValue >= 60) {
    formattedValue = formattedValue / 60;
    formattedUnit = "hours";
  }
  if (formattedValue >= 24) {
    formattedValue = formattedValue / 24;
    formattedUnit = "days";
  }

  return formatter.format(formattedValue, formattedUnit);
};

export const formatDisplayTime = (time: number, unit: TimeUnit = "milliseconds"): string => {
  const timestamp = convertTime(time, "seconds", unit);

  const minutes = Math.floor(timestamp / 60);
  const seconds = Math.floor(timestamp % 60);

  return [minutes, seconds].map((unit) => unit.toString().padStart(2, "0")).join(":");
};
