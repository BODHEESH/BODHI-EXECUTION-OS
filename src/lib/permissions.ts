/**
 * Role-based Permission System
 * Enforces strict permissions for WIFE role
 */

export type UserRole = 'ME' | 'WIFE';
export type Owner = 'ME' | 'WIFE';

export interface PermissionCheck {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

export function checkTaskPermissions(
  userRole: UserRole,
  taskOwner: Owner,
  assignedTo?: Owner
): PermissionCheck {
  // ME can do everything
  if (userRole === 'ME') {
    return {
      canView: true,
      canEdit: true,
      canDelete: true,
      canCreate: true,
    };
  }

  // WIFE can only view and edit tasks assigned to her
  if (userRole === 'WIFE') {
    const isAssignedToWife = assignedTo === 'WIFE' || taskOwner === 'WIFE';
    
    return {
      canView: true, // Can view all tasks
      canEdit: isAssignedToWife, // Can only edit tasks assigned to her
      canDelete: isAssignedToWife, // Can only delete her own tasks
      canCreate: true, // Can create tasks for herself
    };
  }

  return {
    canView: false,
    canEdit: false,
    canDelete: false,
    canCreate: false,
  };
}

export function checkBusinessPermissions(
  userRole: UserRole,
  handledBy: Owner
): PermissionCheck {
  // ME can do everything
  if (userRole === 'ME') {
    return {
      canView: true,
      canEdit: true,
      canDelete: true,
      canCreate: true,
    };
  }

  // WIFE can only edit/delete orders handled by her
  if (userRole === 'WIFE') {
    const isHandledByWife = handledBy === 'WIFE';
    
    return {
      canView: true, // Can view all orders
      canEdit: isHandledByWife, // Can only edit orders handled by her
      canDelete: isHandledByWife, // Can only delete orders handled by her
      canCreate: true, // Can create orders
    };
  }

  return {
    canView: false,
    canEdit: false,
    canDelete: false,
    canCreate: false,
  };
}

export function checkContentPermissions(
  userRole: UserRole,
  contentOwner: Owner
): PermissionCheck {
  // ME can do everything
  if (userRole === 'ME') {
    return {
      canView: true,
      canEdit: true,
      canDelete: true,
      canCreate: true,
    };
  }

  // WIFE can only edit/delete content owned by her
  if (userRole === 'WIFE') {
    const isOwnedByWife = contentOwner === 'WIFE';
    
    return {
      canView: true,
      canEdit: isOwnedByWife,
      canDelete: isOwnedByWife,
      canCreate: true,
    };
  }

  return {
    canView: false,
    canEdit: false,
    canDelete: false,
    canCreate: false,
  };
}

export function checkDailyTrackerPermissions(userRole: UserRole): PermissionCheck {
  // Both can view and edit daily tracker
  return {
    canView: true,
    canEdit: true,
    canDelete: userRole === 'ME', // Only ME can delete trackers
    canCreate: true,
  };
}

export function getPermissionMessage(action: string, resource: string): string {
  return `You don't have permission to ${action} this ${resource}. Only items assigned to you can be modified.`;
}
