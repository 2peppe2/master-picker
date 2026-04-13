import { decompressFromEncodedURIComponent } from "lz-string";

type ScheduleEntryV1 = [number, number, number, number];
type ScheduleEntryV2 = [number, number, number, string];

interface SchedulePayloadV1 {
  v: undefined;
  s: number[];
  d: ScheduleEntryV1[];
}

interface SchedulePayloadV2 {
  v: "v2";
  s: number[];
  d: ScheduleEntryV2[];
}

type GroupSchedulePayload = SchedulePayloadV1 | SchedulePayloadV2;

export const decodeGroupSchedulePayload = (
  param: string,
): GroupSchedulePayload | null => {
  try {
    const decompressed = decompressFromEncodedURIComponent(param);
    if (!decompressed) {
      return null;
    }

    return JSON.parse(decompressed) as GroupSchedulePayload;
  } catch (error) {
    console.error("Failed to decode group schedule payload", error);
    return null;
  }
};
