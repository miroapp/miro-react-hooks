import { TimerEvent } from "@mirohq/websdk-types";
import { useState, useCallback, useEffect, useRef } from "react";

import { useMiro } from "../useMiro/useMiro";
import { convertTime } from "./utils";

export type TimerState = "idle" | "started" | "paused" | "ended";
export type TimeUnit = "milliseconds" | "seconds" | "minutes" | "hours" | "days";

export type TimerOpts = {
  durationUnit?: TimeUnit;
  duration: number;
  interval?: number;
  onTick?: (timestamp: number) => void;
  onStop?: () => void;
  onStart?: () => void;
};

export const useTimer = (opts: TimerOpts) => {
  const miro = useMiro();
  const [state, setState] = useState<TimerState>("idle");
  const interval = useRef<ReturnType<typeof setInterval>>();

  const tick = convertTime(opts.interval ?? 1_000, "milliseconds");

  const start = useCallback(async () => {
    const isStarted = await miro.board.experimental.timer.isStarted();
    if (isStarted) {
      throw new Error("Timer is already running");
    }

    await miro.board.experimental.timer.start(opts.duration);
  }, [miro, opts.duration]);

  const pause = useCallback(async () => {
    const isStarted = await miro.board.experimental.timer.isStarted();
    if (isStarted) {
      await miro.board.experimental.timer.pause();
    } else {
      throw new Error("Timer is not running");
    }
  }, [miro]);

  const stop = useCallback(async () => {
    const isStarted = await miro.board.experimental.timer.isStarted();
    if (isStarted) {
      await miro.board.experimental.timer.stop();
    }
  }, [miro]);

  const handleTimerStart = useCallback(
    async ({ timer }: TimerEvent) => {
      setState("started");
      opts.onStart?.();

      let timeStart = timer.startedAt;
      const timeEnd = timeStart + convertTime(timer.restDuration, "milliseconds");

      clearInterval(interval.current);
      interval.current = setInterval(() => {
        timeStart += tick;
        const restDuration = timeEnd - timeStart;

        if (timeStart >= timeEnd) {
          clearInterval(interval.current);
          stop();
          return;
        }

        opts.onTick?.(restDuration);
      }, tick);
    },
    [opts, stop, tick],
  );

  const handleTimerFinish = useCallback(async () => {
    clearInterval(interval.current);
    setState("ended");
    opts.onStop?.();
  }, [interval, opts]);

  const handleTimerUpdate = useCallback(async (event: TimerEvent) => {
    switch (event.timer.status) {
      case "STARTED":
        setState("started");
        break;
      case "PAUSED":
        setState("paused");
        break;
      case "STOPPED":
        setState("ended");
        break;
    }
  }, []);

  useEffect(() => {
    const fetchCurrent = async () => {
      const isStarted = await miro.board.experimental.timer.isStarted();
      setState(isStarted ? "started" : "idle");
    };

    fetchCurrent();
  }, [miro.board.experimental.timer]);

  useEffect(() => {
    miro.board.ui.on("experimental:timer:start", handleTimerStart);
    miro.board.ui.on("experimental:timer:finish", handleTimerFinish);
    miro.board.ui.on("experimental:timer:update", handleTimerUpdate);

    return () => {
      miro.board.ui.off("experimental:timer:start", handleTimerStart);
      miro.board.ui.off("experimental:timer:finish", handleTimerFinish);
      miro.board.ui.off("experimental:timer:update", handleTimerUpdate);
    };
  }, [miro.board.ui, handleTimerStart, handleTimerFinish, handleTimerUpdate]);

  return {
    state,
    start,
    stop,
    pause,
  };
};
