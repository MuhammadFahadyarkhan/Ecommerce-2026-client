import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Loading from "../Loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.post(
        `${server}/api/order/${orderId}`,
        { status },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );
      toast.success(data.message || "Status updated successfully");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      order._id?.toLowerCase().includes(search.toLowerCase())
  );

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50";
      case "awaiting admin approval":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50";
      case "approved":
      case "shipped":
      case "delivered":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50";
      case "rejected by seller":
      case "rejected by buyer":
        return "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Manage Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View, track, and update customer orders.</p>
        </div>
        <Input
          placeholder="Search by email or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 rounded-xl bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
        />
      </div>

      {loading ? (
        <Loading />
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Order ID</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">User Email</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Total / Breakdown</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Payment Proof</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Date</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 dark:divide-zinc-900">
                  {currentOrders.map((order) => (
                    <TableRow key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                      <TableCell className="font-medium">
                        <Link to={`/order/${order._id}`} className="text-black dark:text-white font-semibold hover:underline">
                          {order._id.slice(-6).toUpperCase()}
                        </Link>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300 text-sm">
                        {order.user?.email || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="font-semibold text-slate-900 dark:text-white">Rs {Number(order.subTotal).toFixed(2)}</span>
                        {order.paymentProof ? (
                          <span className="block text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                            Due on Delivery: Rs {(order.subTotal * 0.75).toFixed(2)}
                          </span>
                        ) : (
                          <span className="block text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                            Full COD (Unpaid Advance)
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.paymentProof ? (
                          <a 
                            href={order.paymentProof} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block group w-10 h-10"
                            title="Click to view full image"
                          >
                            <img 
                              src={order.paymentProof} 
                              alt="Payment Proof" 
                              className="w-10 h-10 object-cover rounded-xl border border-slate-200 dark:border-zinc-800 group-hover:opacity-80 transition-opacity shadow-sm" 
                            />
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-zinc-900 rounded-md">
                            COD
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 text-xs">
                        {moment(order.createdAt).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell>
                        <select
                          value={order.status}
                          className="w-[170px] px-3 py-1.5 border rounded-xl bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all cursor-pointer shadow-sm"
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Awaiting Admin Approval">Awaiting Admin Approval</option>
                          <option value="Approved">Approved</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Rejected by Seller">Rejected by Seller</option>
                          <option value="Rejected by Buyer">Rejected by Buyer</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 px-1">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-medium text-slate-900 dark:text-white">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                  {Math.min(indexOfLastItem, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium text-slate-900 dark:text-white">{filteredOrders.length}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border-slate-200 dark:border-zinc-800 text-xs"
                >
                  Previous
                </Button>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-slate-200 dark:border-zinc-800 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-8">
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base">No orders found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;