"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

const statusColumns: Array<{ title: string; status: Task["status"] }> = [
  { title: "Backlog", status: "BACKLOG" },
  { title: "Today", status: "TODAY" },
  { title: "In Progress", status: "IN_PROGRESS" },
  { title: "Waiting", status: "WAITING" },
  { title: "Done", status: "DONE" },
];

const priorityColors = {
  HIGH: "bg-red-100 text-red-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  LOW: "bg-green-100 text-green-800",
};

const categoryColors = {
  YOUTUBE: "bg-purple-100 text-purple-800",
  BODHI_LEARN: "bg-blue-100 text-blue-800",
  ECOMMERCE: "bg-orange-100 text-orange-800",
  PRINTER: "bg-pink-100 text-pink-800",
  WORK: "bg-gray-100 text-gray-800",
  PERSONAL: "bg-indigo-100 text-indigo-800",
};

const timeEstimates = {
  MIN15: "15 min",
  MIN30: "30 min",
  HOUR1: "1 hour",
  HOUR2: "2 hours",
  HOUR4: "4 hours",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "TODAY" | "WIFE">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const currentUser = useCurrentUser();

  // Form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "WORK" as Task["category"],
    priority: "MEDIUM" as Task["priority"],
    status: "BACKLOG" as Task["status"],
    dueDate: "",
    estimatedTime: "HOUR1" as Task["estimatedTime"],
    owner: "ME" as Task["owner"],
  });

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const fetchTasks = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks?userId=${currentUser}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!currentUser || !newTask.title.trim()) return;

    try {
      setIsAdding(true);
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTask,
          userId: currentUser,
        }),
      });

      if (response.ok) {
        setNewTask({
          title: "",
          description: "",
          category: "WORK",
          priority: "MEDIUM",
          status: "BACKLOG",
          dueDate: "",
          estimatedTime: "HOUR1",
          owner: "ME",
        });
        setShowAddForm(false);
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });

      if (response.ok) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    if (filter === "TODAY") return matchesSearch && task.status === "TODAY";
    if (filter === "WIFE") return matchesSearch && task.owner === "WIFE";
    return matchesSearch;
  });

  const getTasksByStatus = (status: Task["status"]) => {
    return filteredTasks.filter(task => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your tasks and projects</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tasks</h1>
            <p className="text-purple-100 text-sm sm:text-base">Manage your tasks and projects</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-white text-purple-600 hover:bg-purple-50 shadow-md"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="border-2 border-purple-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Add New Task</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="hover:bg-purple-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Task["category"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="WORK">Work</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="YOUTUBE">YouTube</option>
                  <option value="BODHI_LEARN">Bodhi Learn</option>
                  <option value="ECOMMERCE">E-commerce</option>
                  <option value="PRINTER">3D Printing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Time
                </label>
                <select
                  value={newTask.estimatedTime}
                  onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value as Task["estimatedTime"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="MIN15">15 min</option>
                  <option value="MIN30">30 min</option>
                  <option value="HOUR1">1 hour</option>
                  <option value="HOUR2">2 hours</option>
                  <option value="HOUR4">4 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner
                </label>
                <select
                  value={newTask.owner}
                  onChange={(e) => setNewTask({ ...newTask, owner: e.target.value as Task["owner"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ME">Me</option>
                  <option value="WIFE">Wife</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter task description (optional)"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={addTask}
                disabled={!newTask.title.trim() || isAdding}
              >
                {isAdding ? "Adding..." : "Add Task"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("ALL")}
            className={filter === "ALL" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
          >
            All Tasks
          </Button>
          <Button
            variant={filter === "TODAY" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("TODAY")}
            className={filter === "TODAY" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
          >
            Today
          </Button>
          <Button
            variant={filter === "WIFE" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("WIFE")}
            className={filter === "WIFE" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
          >
            Wife's Tasks
          </Button>
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statusColumns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <Card key={column.status} className="min-h-[400px] shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-purple-50">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  {column.title}
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-200">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-tight">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs ${categoryColors[task.category]}`}>
                            {task.category.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.owner}
                          </Badge>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                          </div>
                        )}
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {timeEstimates[task.estimatedTime]}
                        </div>
                        <div className="flex gap-1 pt-2">
                          {column.status !== "DONE" && (
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id || "", (e.target.value || "BACKLOG") as Task["status"])}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {statusColumns.map(col => (
                                <option key={col.status} value={col.status}>
                                  {col.title}
                                </option>
                              ))}
                            </select>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (task.id) deleteTask(task.id);
                            }}
                            className="text-xs px-2 py-1 h-6"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
