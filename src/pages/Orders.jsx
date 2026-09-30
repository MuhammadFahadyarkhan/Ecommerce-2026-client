import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proofFiles, setProofFiles] = useState({});
  const [uploadingId, setUploadingId] = useState(null);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFileChange = (orderId, file) => {
    setProofFiles((prev) => ({ ...prev, [orderId]: file }));
  };

  const handleUploadProof = async (orderId) => {
    const file = proofFiles[orderId];
    if (!file) {
      return toast.error("Please select a payment screenshot first");
    }

    setUploadingId(orderId);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const { data } = await axios.put(
        `${server}/api/order/${orderId}/proof`,
        formData,
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      toast.success(data.message || "Payment proof uploaded successfully!");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload payment proof");
    } finally {
      setUploadingId(null);
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "awaiting admin approval":
        return "text-amber-500 dark:text-amber-400";
      case "approved":
      case "shipped":
      case "delivered":
        return "text-emerald-600 dark:text-emerald-400";
      case "rejected by seller":
      case "rejected by buyer":
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-slate-500 dark:text-slate-400";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">No Orders Yet</h1>
        <Button 
          onClick={() => navigate("/products")}
          className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl px-6"
        >
          Shop Now
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-[70vh] max-w-7xl">
      <div className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white tracking-tight">Your Orders</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => {
          const date = new Date(order.createdAt);
          const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()}`;

          const isRejected = order.status?.toLowerCase().includes("rejected");
          const isDelivered = order.status?.toLowerCase() === "delivered";
          
          const isCodWithoutProof = 
            order.method?.toLowerCase() === "cod" && 
            !order.paymentProof && 
            !isRejected && 
            !isDelivered;

          const computedSubTotal = order.items?.reduce((acc, item) => {
            const prod = item.product || item; 
            const price = prod.price || item.price || 0;
            const discountPercent = prod.discountPercent || prod.discount || item.discountPercent || 0;
            const discountedPrice = discountPercent > 0 
              ? price * (1 - discountPercent / 100) 
              : price;
            const qty = item.quantity || 1;
            return acc + (discountedPrice * qty);
          }, 0);

          const finalSubTotal = computedSubTotal > 0 ? computedSubTotal : order.subTotal;
          const advanceAmount = (finalSubTotal * 0.25).toFixed(2);

          return (
            <Card
              key={order._id}
              className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all duration-200 p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <CardHeader className="p-0 pb-4 border-b border-slate-100 dark:border-zinc-900 mb-4">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                    Order #{order._id.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Method:</span>
                    <span className="uppercase text-slate-900 dark:text-white font-medium">{order.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Status:</span>
                    <span className={`font-semibold ${getStatusTextColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Total Items:</span>
                    <span className="text-slate-900 dark:text-white font-medium">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 dark:text-slate-400">SubTotal:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">Rs {Number(finalSubTotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Placed At:</span>
                    <span className="text-slate-900 dark:text-white font-medium">{formattedDate}</span>
                  </div>

                  {isCodWithoutProof && (
                    <div className="mt-4 p-4 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 rounded-xl space-y-3">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        Want 25% Advance? Transfer <strong className="text-slate-900 dark:text-white">Rs {advanceAmount}</strong> and upload screenshot:
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(order._id, e.target.files[0])}
                        className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-9 cursor-pointer rounded-lg"
                      />
                      <Button
                        size="sm"
                        className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl font-medium text-xs h-9 transition-colors"
                        disabled={uploadingId === order._id}
                        onClick={() => handleUploadProof(order._id)}
                      >
                        {uploadingId === order._id ? "Uploading..." : "Upload 25% Proof"}
                      </Button>
                    </div>
                  )}

                  {order.paymentProof && (
                    <div className="mt-3 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-center">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Payment Proof Submitted</span>
                    </div>
                  )}
                </CardContent>
              </div>

              <Button
                className="mt-6 w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl font-medium text-sm transition-colors"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                View Details
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;