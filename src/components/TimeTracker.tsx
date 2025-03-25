"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Task, TimeLog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function TimeTracker({ task }: { task: Task }) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTimeLog, setCurrentTimeLog] = useState<TimeLog | null>(null);
  const user = useStore((state) => state.user);
  const addTimeLog = useStore((state) => state.addTimeLog);
  const updateTimeLog = useStore((state) => state.updateTimeLog);
  const timeLogs = useStore((state) => state.timeLogs);

  const taskTimeLogs = timeLogs.filter((log) => log.taskId === task.id);
  const totalTimeSpent = taskTimeLogs.reduce(
    (acc, log) => acc + (log.duration || 0),
    0
  );

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const startTracking = () => {
    if (!user) return;

    const newTimeLog: TimeLog = {
      id: uuidv4(),
      taskId: task.id,
      userId: user.email,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
    };

    setCurrentTimeLog(newTimeLog);
    addTimeLog(newTimeLog);
    setIsTracking(true);
  };

  const stopTracking = () => {
    if (!currentTimeLog) return;

    const endTime = new Date().toISOString();
    const duration = Math.round(
      (new Date(endTime).getTime() -
        new Date(currentTimeLog.startTime).getTime()) /
        60000
    );

    const updatedTimeLog: TimeLog = {
      ...currentTimeLog,
      endTime,
      duration,
    };

    updateTimeLog(updatedTimeLog);
    setCurrentTimeLog(null);
    setIsTracking(false);
  };

  useEffect(() => {
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, []);
  console.log("totalTimeSpent", totalTimeSpent);
  if (!user || task.assignee !== user.email) {
    return <div>{formatTime(totalTimeSpent)}</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <div>{formatTime(totalTimeSpent)}</div>
      <Button
        variant="outline"
        size="sm"
        onClick={isTracking ? stopTracking : startTracking}
      >
        {isTracking ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
