"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Task } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TimeTracker from "./TimeTracker";
import TaskActions from "./TaskActions";

export default function TaskList() {
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const tasks = useStore((state) => state.tasks);
  const user = useStore((state) => state.user);

  const filteredTasks = tasks
    .filter((task) => {
      if (user?.role === "developer" && task.assignee !== user.email) {
        return false;
      }
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }
      return (
        task.title.toLowerCase().includes(filter.toLowerCase()) ||
        task.description.toLowerCase().includes(filter.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search tasks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="reopened">Reopened</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Time Spent</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>
                  {format(new Date(task.dueDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <TimeTracker task={task} />
                </TableCell>
                <TableCell>
                  <TaskActions task={task} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const variants: Record<Task["status"], { color: string; label: string }> = {
    open: { color: "bg-blue-100 text-blue-800", label: "Open" },
    in_progress: {
      color: "bg-yellow-100 text-yellow-800",
      label: "In Progress",
    },
    pending_approval: {
      color: "bg-purple-100 text-purple-800",
      label: "Pending Approval",
    },
    closed: { color: "bg-green-100 text-green-800", label: "Closed" },
    reopened: { color: "bg-red-100 text-red-800", label: "Reopened" },
  };

  const { color, label } = variants[status];

  return (
    <Badge variant="outline" className={color}>
      {label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const variants: Record<Task["priority"], { color: string; label: string }> = {
    low: { color: "bg-gray-100 text-gray-800", label: "Low" },
    medium: { color: "bg-orange-100 text-orange-800", label: "Medium" },
    high: { color: "bg-red-100 text-red-800", label: "High" },
  };

  const { color, label } = variants[priority];

  return (
    <Badge variant="outline" className={color}>
      {label}
    </Badge>
  );
}
