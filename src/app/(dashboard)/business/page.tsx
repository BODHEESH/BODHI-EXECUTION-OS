"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, TrendingUp, Package, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Business } from "@/lib/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";

// Custom Rupee icon component
const RupeeSign = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M8 9h8M8 15h6"/>
  </svg>
);

const statusColumns: { title: string; status: Business["orderStatus"] }[] = [
  { title: "New", status: "NEW" },
  { title: "Designing", status: "DESIGNING" },
  { title: "Printing", status: "PRINTING" },
  { title: "Packing", status: "PACKING" },
  { title: "Delivered", status: "DELIVERED" },
  { title: "Cancelled", status: "CANCELLED" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800";
    case "DESIGNING":
      return "bg-purple-100 text-purple-800";
    case "PRINTING":
      return "bg-yellow-100 text-yellow-800";
    case "PACKING":
      return "bg-orange-100 text-orange-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getBusinessTypeColor = (type: string) => {
  switch (type) {
    case "CLOTHING":
      return "bg-pink-100 text-pink-800";
    case "PRINTING_3D":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function BusinessPage() {
  const [business, setBusiness] = useState<Business[]>([]);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const currentUser = useCurrentUser();

  // Form state
  const [newBusiness, setNewBusiness] = useState({
    customerName: "",
    businessType: "CLOTHING" as Business["businessType"],
    orderStatus: "NEW" as Business["orderStatus"],
    deliveryDate: "",
    amount: 0,
    cost: 0,
    profit: 0,
    paymentStatus: "PENDING" as Business["paymentStatus"],
    handledBy: "ME" as Business["handledBy"],
    notes: "",
  });

  useEffect(() => {
    if (currentUser) {
      fetchBusiness();
      fetchMonthlyProfit();
    }
  }, [currentUser]);

  const fetchBusiness = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/business?userId=${currentUser}`);
      const data = await response.json();
      setBusiness(data);
    } catch (error) {
      console.error("Failed to fetch business data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlyProfit = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`/api/business?monthly=profit&userId=${currentUser}`);
      const data = await response.json();
      setMonthlyProfit(data.profit || 0);
    } catch (error) {
      console.error("Failed to fetch monthly profit:", error);
    }
  };

  const addBusiness = async () => {
    if (!currentUser || !newBusiness.customerName.trim() || newBusiness.amount <= 0) return;

    try {
      setIsAdding(true);
      const response = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newBusiness,
          userId: currentUser,
        }),
      });

      if (response.ok) {
        setNewBusiness({
          customerName: "",
          businessType: "CLOTHING",
          orderStatus: "NEW",
          deliveryDate: "",
          amount: 0,
          cost: 0,
          profit: 0,
          paymentStatus: "PENDING",
          handledBy: "ME",
          notes: "",
        });
        setShowAddForm(false);
        fetchBusiness();
        fetchMonthlyProfit();
      }
    } catch (error) {
      console.error("Failed to add business order:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const updateBusinessStatus = async (businessId: string, newStatus: Business["orderStatus"]) => {
    try {
      const response = await fetch("/api/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: businessId, orderStatus: newStatus }),
      });

      if (response.ok) {
        setBusiness(business.map(item => 
          item.id === businessId ? { ...item, orderStatus: newStatus } : item
        ));
        fetchMonthlyProfit(); // Refresh profit calculation
      }
    } catch (error) {
      console.error("Failed to update business:", error);
    }
  };

  const deleteBusiness = async (businessId: string) => {
    try {
      const response = await fetch(`/api/business?id=${businessId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBusiness(business.filter(item => item.id !== businessId));
        fetchMonthlyProfit(); // Refresh profit calculation
      }
    } catch (error) {
      console.error("Failed to delete business:", error);
    }
  };

  const calculateProfit = (item: Business) => item.amount - item.cost;

  const getBusinessByStatus = (status: Business["orderStatus"]) => {
    return business.filter(item => item.orderStatus === status);
  };

  const totalRevenue = business.reduce((sum, item) => sum + item.amount, 0);
  const totalCost = business.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const pendingPayments = business
    .filter(item => item.paymentStatus === "PENDING")
    .reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Tracker</h1>
            <p className="text-gray-600">Track orders and business operations</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading business data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Business Tracker</h1>
            <p className="text-emerald-100 text-sm sm:text-base">Track orders and business operations</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-md"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Order</span>
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="border-2 border-emerald-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Add New Order</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="hover:bg-emerald-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newBusiness.customerName}
                  onChange={(e) => setNewBusiness({ ...newBusiness, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  value={newBusiness.businessType}
                  onChange={(e) => setNewBusiness({ ...newBusiness, businessType: e.target.value as Business["businessType"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CLOTHING">Clothing</option>
                  <option value="PRINTING_3D">3D Printing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  value={newBusiness.orderStatus}
                  onChange={(e) => setNewBusiness({ ...newBusiness, orderStatus: e.target.value as Business["orderStatus"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="NEW">New</option>
                  <option value="DESIGNING">Designing</option>
                  <option value="PRINTING">Printing</option>
                  <option value="PACKING">Packing</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={newBusiness.paymentStatus}
                  onChange={(e) => setNewBusiness({ ...newBusiness, paymentStatus: e.target.value as Business["paymentStatus"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PARTIAL">Partial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  value={newBusiness.amount}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    const cost = newBusiness.cost;
                    setNewBusiness({ ...newBusiness, amount, profit: amount - cost });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost
                </label>
                <input
                  type="number"
                  value={newBusiness.cost}
                  onChange={(e) => {
                    const cost = parseFloat(e.target.value) || 0;
                    const amount = newBusiness.amount;
                    setNewBusiness({ ...newBusiness, cost, profit: amount - cost });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={newBusiness.deliveryDate}
                  onChange={(e) => setNewBusiness({ ...newBusiness, deliveryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Handled By
                </label>
                <select
                  value={newBusiness.handledBy}
                  onChange={(e) => setNewBusiness({ ...newBusiness, handledBy: e.target.value as Business["handledBy"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ME">Me</option>
                  <option value="WIFE">Wife</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profit (Auto-calculated)
                </label>
                <input
                  type="number"
                  value={newBusiness.profit}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newBusiness.notes}
                onChange={(e) => setNewBusiness({ ...newBusiness, notes: e.target.value })}
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
                onClick={addBusiness}
                disabled={!newBusiness.customerName.trim() || newBusiness.amount <= 0 || isAdding}
              >
                {isAdding ? "Adding..." : "Add Order"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <RupeeSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statusColumns.slice(0, 6).map((column) => {
          const columnBusiness = getBusinessByStatus(column.status);
          
          return (
            <Card key={column.status} className="min-h-[400px] shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-emerald-50">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  {column.title}
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    {columnBusiness.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnBusiness.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-emerald-200">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-tight">
                          {item.customerName}
                        </h4>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge className={`text-xs ${getStatusColor(item.orderStatus)}`}>
                            {item.orderStatus}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.businessType.replace("_", " ")}
                          </Badge>
                          <Badge className={`text-xs ${getPaymentStatusColor(item.paymentStatus)}`}>
                            {item.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Order: {item.orderDate ? new Date(item.orderDate).toLocaleDateString() : 'N/A'}</span>
                          <span className="font-medium">₹{item.amount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600 font-medium">
                            Profit: ₹{calculateProfit(item)}
                          </span>
                          <span className="text-gray-500">
                            {item.handledBy}
                          </span>
                        </div>
                        {item.deliveryDate && (
                          <div className="text-xs text-gray-500">
                            Delivery: {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'N/A'}
                          </div>
                        )}
                        <div className="flex gap-1 pt-2">
                          {column.status !== "DELIVERED" && column.status !== "CANCELLED" && (
                            <select
                              value={item.orderStatus}
                              onChange={(e) => updateBusinessStatus(item.id || "", (e.target.value || "NEW") as Business["orderStatus"])}
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
                              if (item.id) deleteBusiness(item.id);
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
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {business.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{order.customerName}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${getBusinessTypeColor(order.businessType)}`}>
                      {order.businessType.replace("_", " ")}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </Badge>
                    <Badge className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">₹{order.amount}</div>
                  <div className="text-xs text-gray-500">Profit: ₹{order.profit}</div>
                  <div className="text-xs text-gray-500">{order.handledBy}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
