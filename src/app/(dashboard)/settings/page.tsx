"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database, FileDown } from "lucide-react";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { exportAllData, createFullBackup } from "@/lib/export-utils";

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const currentUser = useCurrentUser();

  const handleExportCSV = async () => {
    if (!currentUser) return;
    
    setIsExporting(true);
    try {
      await exportAllData(currentUser);
      alert('Data exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackup = async () => {
    if (!currentUser) return;
    
    setIsBackingUp(true);
    try {
      await createFullBackup(currentUser);
      alert('Backup created successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Failed to create backup. Please try again.');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your data and preferences</p>
      </div>

      {/* Export & Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Export & Backup
          </CardTitle>
          <CardDescription>
            Download your data for backup or analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Export to CSV</h3>
              <p className="text-sm text-gray-600">
                Export all your tasks, habits, content, and business data as CSV files
              </p>
            </div>
            <Button 
              onClick={handleExportCSV} 
              disabled={isExporting}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Full Backup (JSON)</h3>
              <p className="text-sm text-gray-600">
                Create a complete backup of all your data in JSON format
              </p>
            </div>
            <Button 
              onClick={handleBackup} 
              disabled={isBackingUp}
              variant="outline"
            >
              <FileDown className="h-4 w-4 mr-2" />
              {isBackingUp ? 'Creating...' : 'Create Backup'}
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> It's recommended to create backups regularly to prevent data loss. 
              CSV exports are great for analysis in Excel or Google Sheets.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">User ID</span>
              <span className="font-mono text-sm">{currentUser}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-sm">Never</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Integrity */}
      <Card>
        <CardHeader>
          <CardTitle>Data Integrity</CardTitle>
          <CardDescription>
            Automatic data protection features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-green-900">Daily Tracker Auto-Creation</h4>
                <p className="text-sm text-green-700">Automatically creates today's tracker entry</p>
              </div>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-green-900">Delete Confirmations</h4>
                <p className="text-sm text-green-700">Prevents accidental data deletion</p>
              </div>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-green-900">Recurring Tasks</h4>
                <p className="text-sm text-green-700">Auto-creates next instance when completed</p>
              </div>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
