"use client";

import { useStore } from "@/lib/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { subDays, format } from "date-fns";

export default function TaskChart() {
  const tasks = useStore((state) => state.tasks);
  const user = useStore((state) => state.user);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, "MMM dd");
  }).reverse();

  const data = last7Days.map((date) => {
    const dayTasks = tasks.filter((task) => {
      if (user?.role === "developer" && task.assignee !== user.email) {
        return false;
      }
      const taskDate = format(new Date(task.createdAt), "MMM dd");
      return taskDate === date;
    });

    return {
      date,
      tasks: dayTasks.length,
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
