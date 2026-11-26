import { checkAvailability, minutesToLabel, type CheckResult, type Room } from './availability';

export { minutesToLabel };

// ---------- Practice #12 fixtures (Task #02 contract) ----------

const P12_ROOM: Room = {
  id: 'p12-a101',
  name: 'A-101',
  building: 'Engineering Block',
  capacity: 40,
  blocked: false,
};

const P12_BOOKINGS = [
  { id: 'b1', room: 'p12-a101', start: 600, end: 660, title: 'Intro to Algorithms' },
  { id: 'b2', room: 'p12-a101', start: 780, end: 840, title: 'Faculty Meeting' },
] as const;

const P12_CURRENT_TIME = 480; // 08:00, fixed fictional value

const DAY_END = 1440; // 24:00 — valid only as an end boundary

// ---------- Descriptive reason codes (Task #02) ----------

export type ReasonCode =
  | 'AVAILABLE'
  | 'OVERLAP'
  | 'BLOCKED'
  | 'INVALID_DURATION'
  | 'PAST_START'
  | 'INVALID_START';

export interface P12Result {
  available: boolean;
  code: ReasonCode;
  message: string;
}

// ---------- Input validation (separate from the engine) ----------

export function timeToMinutes(value: string): number | null {
  if (!/^\d{2}:\d{2}$/.test(value)) return null;
  const [h, m] = value.split(':').map(Number);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

export function evaluate(
  startStr: string,
  durationStr: string,
  blocked: boolean,
): P12Result {
  const start = timeToMinutes(startStr);
  if (start === null) {
    return {
      available: false,
      code: 'INVALID_START',
      message:
        'Enter a valid start time as HH:mm between 00:00 and 23:59. 24:00 is allowed only as an end boundary.',
    };
  }

  const durationStrTrimmed = durationStr.trim();
  if (!/^\d+$/.test(durationStrTrimmed)) {
    return {
      available: false,
      code: 'INVALID_DURATION',
      message: 'Enter the duration as a whole number of minutes between 1 and 120.',
    };
  }
  const duration = Number(durationStrTrimmed);
  if (duration < 1 || duration > 120) {
    return {
      available: false,
      code: 'INVALID_DURATION',
      message: `Invalid duration: must be a whole number between 1 and 120 minutes. You entered ${durationStrTrimmed}.`,
    };
  }

  const end = start + duration;
  if (end > DAY_END) {
    return {
      available: false,
      code: 'INVALID_DURATION',
      message: `Invalid duration: the slot must end by 24:00. ${minutesToLabel(start)} + ${duration} min ends at ${minutesToLabel(end)}, which is past midnight.`,
    };
  }

  if (start <= P12_CURRENT_TIME) {
    return {
      available: false,
      code: 'PAST_START',
      message: `Start time must be after the current time (${minutesToLabel(P12_CURRENT_TIME)}). You entered ${minutesToLabel(start)}.`,
    };
  }

  // Engine decides overlap (touching endpoints allowed) and blocked room.
  const engine: CheckResult = checkAvailability(
    P12_ROOM.id,
    start,
    end,
    P12_CURRENT_TIME,
    [{ ...P12_ROOM, blocked }],
    [...P12_BOOKINGS],
  );

  if (engine.available) {
    return {
      available: true,
      code: 'AVAILABLE',
      message: `${P12_ROOM.name} is available from ${minutesToLabel(start)} to ${minutesToLabel(end)}.`,
    };
  }
  if (blocked) {
    return {
      available: false,
      code: 'BLOCKED',
      message: `${P12_ROOM.name} is currently blocked and cannot be booked.`,
    };
  }
  return {
    available: false,
    code: 'OVERLAP',
    message: engine.reason.replace(/^\[AC\d+\] /, ''),
  };
}
