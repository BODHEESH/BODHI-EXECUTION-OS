"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Video, Instagram, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Content } from "@/lib/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";

const statusColumns = [
  { title: "Idea", status: "IDEA" },
  { title: "Scripted", status: "SCRIPTED" },
  { title: "Recorded", status: "RECORDED" },
  { title: "Editing", status: "EDITING" },
  { title: "Thumbnail Ready", status: "THUMBNAIL_READY" },
  { title: "Scheduled", status: "SCHEDULED" },
  { title: "Posted", status: "POSTED" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "IDEA":
      return "bg-gray-100 text-gray-800";
    case "SCRIPTED":
      return "bg-blue-100 text-blue-800";
    case "RECORDED":
      return "bg-purple-100 text-purple-800";
    case "EDITING":
      return "bg-yellow-100 text-yellow-800";
    case "THUMBNAIL_READY":
      return "bg-orange-100 text-orange-800";
    case "SCHEDULED":
      return "bg-green-100 text-green-800";
    case "POSTED":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "BODHI_TECH_TALKS":
    case "BODHI_LEARN":
      return <Video className="h-3 w-3" />;
    case "INSTAGRAM":
      return <Instagram className="h-3 w-3" />;
    case "SHORTS":
      return <Video className="h-3 w-3" />;
    default:
      return <Video className="h-3 w-3" />;
  }
};

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const currentUser = useCurrentUser();

  // Form state
  const [newContent, setNewContent] = useState({
    title: "",
    platforms: [] as Content["platforms"],
    type: "LONG_VIDEO" as Content["type"],
    status: "IDEA" as Content["status"],
    shootDate: "",
    publishDate: "",
    videoLink: "",
    scriptLink: "",
    remarks: "",
    owner: "ME" as Content["owner"],
  });

  useEffect(() => {
    if (currentUser) {
      fetchContent();
    }
  }, [currentUser]);

  const fetchContent = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/content?userId=${currentUser}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addContent = async () => {
    if (!currentUser || !newContent.title.trim()) return;

    try {
      setIsAdding(true);
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newContent,
          userId: currentUser,
        }),
      });

      if (response.ok) {
        setNewContent({
          title: "",
          platforms: [],
          type: "LONG_VIDEO",
          status: "IDEA",
          shootDate: "",
          publishDate: "",
          videoLink: "",
          scriptLink: "",
          remarks: "",
          owner: "ME",
        });
        setShowAddForm(false);
        fetchContent();
      }
    } catch (error) {
      console.error("Failed to add content:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const updateContentStatus = async (contentId: string, newStatus: Content["status"]) => {
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: contentId, status: newStatus }),
      });

      if (response.ok) {
        setContent(content.map(item => 
          item.id === contentId ? { ...item, status: newStatus } : item
        ));
      }
    } catch (error) {
      console.error("Failed to update content:", error);
    }
  };

  const deleteContent = async (contentId: string) => {
    try {
      const response = await fetch(`/api/content?id=${contentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setContent(content.filter(item => item.id !== contentId));
      }
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Pipeline</h1>
            <p className="text-gray-600">Track your content creation workflow</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Content Pipeline</h1>
            <p className="text-pink-100 text-sm sm:text-base">Track your content creation workflow</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-white text-pink-600 hover:bg-pink-50 shadow-md"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Content</span>
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="border-2 border-pink-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Add New Content</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="hover:bg-pink-100"
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
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter content title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: (e.target?.value || "LONG_VIDEO") as Content["type"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LONG_VIDEO">Long Video</option>
                  <option value="SHORT">Short</option>
                  <option value="REEL">Reel</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newContent.status}
                  onChange={(e) => setNewContent({ ...newContent, status: (e.target?.value || "IDEA") as Content["status"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="IDEA">Idea</option>
                  <option value="SCRIPTED">Scripted</option>
                  <option value="RECORDED">Recorded</option>
                  <option value="EDITING">Editing</option>
                  <option value="THUMBNAIL_READY">Thumbnail Ready</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="POSTED">Posted</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner
                </label>
                <select
                  value={newContent.owner}
                  onChange={(e) => setNewContent({ ...newContent, owner: (e.target?.value || "ME") as Content["owner"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ME">Me</option>
                  <option value="WIFE">Wife</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shoot Date
                </label>
                <input
                  type="date"
                  value={newContent.shootDate}
                  onChange={(e) => setNewContent({ ...newContent, shootDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={newContent.publishDate}
                  onChange={(e) => setNewContent({ ...newContent, publishDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platforms
              </label>
              <div className="space-y-2">
                {["BODHI_TECH_TALKS", "BODHI_LEARN", "INSTAGRAM", "SHORTS"].map((platform) => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newContent.platforms.includes(platform as Content["platforms"][0])}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewContent({
                            ...newContent,
                            platforms: [...newContent.platforms, platform as Content["platforms"][0]]
                          });
                        } else {
                          setNewContent({
                            ...newContent,
                            platforms: newContent.platforms.filter(p => p !== platform)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    {platform.replace("_", " ")}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Link
                </label>
                <input
                  type="url"
                  value={newContent.videoLink}
                  onChange={(e) => setNewContent({ ...newContent, videoLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://youtube.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Script Link
                </label>
                <input
                  type="url"
                  value={newContent.scriptLink}
                  onChange={(e) => setNewContent({ ...newContent, scriptLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://docs.google.com/..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={newContent.remarks}
                onChange={(e) => setNewContent({ ...newContent, remarks: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Additional notes (optional)"
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
                onClick={addContent}
                disabled={!newContent.title.trim() || isAdding}
              >
                {isAdding ? "Adding..." : "Add Content"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statusColumns.map((column) => {
          const columnContent = content.filter((item) => item.status === column.status);
          
          return (
            <Card key={column.status} className="min-h-[400px] shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-pink-50">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  {column.title}
                  <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                    {columnContent.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnContent.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-pink-200">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-tight">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {item.platforms.map((platform) => (
                            <Badge key={platform} className="text-xs bg-gray-100 text-gray-800">
                              {platform.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{item.owner}</span>
                        </div>
                        {item.publishDate && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(item.publishDate).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex gap-1 pt-2">
                          {column.status !== "POSTED" && (
                            <select
                              value={item.status}
                              onChange={(e) => {
                                const value = e.target?.value ?? "IDEA";
                                if (item.id) {
                                  updateContentStatus(item.id, value as Content["status"]);
                                }
                              }}
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
                              if (item.id) deleteContent(item.id);
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

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Publish Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content
              .filter((item) => item.publishDate)
              .sort((a, b) => new Date(a.publishDate!).getTime() - new Date(b.publishDate!).getTime())
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.platforms.map((platform) => (
                        <Badge key={platform} className="text-xs bg-gray-100 text-gray-800">
                          {platform.replace("_", " ")}
                        </Badge>
                      ))}
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {new Date(item.publishDate!).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">{item.owner}</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
