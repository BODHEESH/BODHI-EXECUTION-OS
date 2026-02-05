/**
 * Export and Backup Utilities
 */

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get all unique keys from all objects
  const keys = Array.from(
    new Set(data.flatMap(obj => Object.keys(obj)))
  );

  // Create CSV header
  const header = keys.join(',');

  // Create CSV rows
  const rows = data.map(obj => {
    return keys.map(key => {
      const value = obj[key];
      if (value === null || value === undefined) return '';
      
      // Handle dates
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      // Handle objects and arrays
      if (typeof value === 'object') {
        return JSON.stringify(value).replace(/"/g, '""');
      }
      
      // Escape commas and quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportAllData(userId: string) {
  try {
    // Fetch all data
    const [tasksRes, trackersRes, contentRes, businessRes] = await Promise.all([
      fetch(`/api/tasks?userId=${userId}`),
      fetch(`/api/daily-tracker?userId=${userId}`),
      fetch(`/api/content?userId=${userId}`),
      fetch(`/api/business?userId=${userId}`),
    ]);

    const tasks = await tasksRes.json();
    const trackers = await trackersRes.json();
    const content = await contentRes.json();
    const business = await businessRes.json();

    // Export each dataset
    exportToCSV(tasks, 'bodhi_tasks');
    
    setTimeout(() => {
      exportToCSV(trackers, 'bodhi_daily_trackers');
    }, 500);
    
    setTimeout(() => {
      exportToCSV(content, 'bodhi_content');
    }, 1000);
    
    setTimeout(() => {
      exportToCSV(business, 'bodhi_business');
    }, 1500);

    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data. Please try again.');
    return false;
  }
}

export function createBackupJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_backup_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function createFullBackup(userId: string) {
  try {
    const [tasksRes, trackersRes, contentRes, businessRes] = await Promise.all([
      fetch(`/api/tasks?userId=${userId}`),
      fetch(`/api/daily-tracker?userId=${userId}`),
      fetch(`/api/content?userId=${userId}`),
      fetch(`/api/business?userId=${userId}`),
    ]);

    const backup = {
      exportDate: new Date().toISOString(),
      userId,
      data: {
        tasks: await tasksRes.json(),
        dailyTrackers: await trackersRes.json(),
        content: await contentRes.json(),
        business: await businessRes.json(),
      },
    };

    createBackupJSON(backup, 'bodhi_full_backup');
    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    alert('Failed to create backup. Please try again.');
    return false;
  }
}
