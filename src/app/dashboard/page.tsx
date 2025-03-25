"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import TaskList from "@/components/TaskList";
import TaskChart from "@/components/TaskChart";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const user = useStore((state) => state.user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      useStore.getState().setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    useStore.getState().setUser(null);
    toast.success("Logged out successfully !");

    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              {user.role === "manager" ? "Manager View" : "Developer View"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user.role === "developer" && (
              <CreateTaskDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </CreateTaskDialog>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-lg font-semibold mb-4">Task Trends</h2>
            <TaskChart />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <QuickStats />
          </Card>
        </div>

        <div className="mt-6">
          <TaskList />
        </div>
      </div>
    </div>
  );
}

function QuickStats() {
  const tasks = useStore((state) => state.tasks);
  const user = useStore((state) => state.user);

  const userTasks =
    user?.role === "manager"
      ? tasks
      : tasks.filter((task) => task.assignee === user?.email);

  const stats = {
    total: userTasks.length,
    open: userTasks.filter((t) => t.status === "open").length,
    inProgress: userTasks.filter((t) => t.status === "in_progress").length,
    pendingApproval: userTasks.filter((t) => t.status === "pending_approval")
      .length,
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard title="Total Tasks" value={stats.total} />
      <StatCard title="Open" value={stats.open} />
      <StatCard title="In Progress" value={stats.inProgress} />
      <StatCard title="Pending" value={stats.pendingApproval} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
