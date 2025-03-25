"use client";

import { useStore } from "@/lib/store";
import { Task } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function TaskActions({ task }: { task: Task }) {
  const user = useStore((state) => state.user);
  const updateTask = useStore((state) => state.updateTask);
  const deleteTask = useStore((state) => state.deleteTask);

  const handleStatusChange = (newStatus: Task["status"]) => {
    updateTask({
      ...task,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    });
    toast.success("Task status updated !");
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast.success("Task deleted !");
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.role === "developer" && task.assignee === user.email && (
          <>
            {task.status === "open" && (
              <DropdownMenuItem
                onClick={() => handleStatusChange("in_progress")}
              >
                Start Working
              </DropdownMenuItem>
            )}
            {task.status === "in_progress" && (
              <DropdownMenuItem
                onClick={() => handleStatusChange("pending_approval")}
              >
                Submit for Review
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
        {user.role === "manager" && task.status === "pending_approval" && (
          <>
            <DropdownMenuItem onClick={() => handleStatusChange("closed")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve & Close
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("reopened")}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject & Reopen
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
