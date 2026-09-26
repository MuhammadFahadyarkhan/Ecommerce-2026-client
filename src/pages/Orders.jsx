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
        return "text-yellow-500";
      case "approved":
      case "shipped":
      case "delivered":
        return "text-green-500";
      case "rejected by seller":
      case "rejected by buyer":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-gray-600">No Orders Yet</h1>
        <Button onClick={() => navigate("/products")}>Shop Now</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 min-h-[70vh]">
      <div className="text-3xl font-bold mb-6 text-center">Your Orders</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => {
          const date = new Date(order.createdAt);
          const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()}`;

          const isRejected = order.status?.toLowerCase().includes("rejected");
          const isCodWithoutProof = order.method?.toLowerCase() === "cod" && !order.paymentProof && !isRejected;

          // 🛡️ Fallback calculation: compute discounted subtotal safely
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
              className="border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 outline-none ring-0 focus:ring-0 flex flex-col justify-between"
            >
              <div>
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-lg font-normal">
                    Order #{order._id.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-1">
                  <p>
                    <strong>Method: </strong> {order.method}
                  </p>
                  <p>
                    <strong>Status: </strong>
                    <span className={`font-semibold ${getStatusTextColor(order.status)}`}>
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Total Items: </strong> {order.items.length}
                  </p>
                  <p>
                    <strong>SubTotal: </strong> Rs {Number(finalSubTotal).toFixed(2)}
                  </p>
                  <p>
                    <strong>Placed At: </strong> {formattedDate}
                  </p>

                  {isCodWithoutProof && (
                    <div className="mt-4 p-3 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 rounded-lg space-y-2">
                      <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                        Want 25% Advance? Transfer <strong>Rs {advanceAmount}</strong> and upload screenshot:
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(order._id, e.target.files[0])}
                        className="bg-white dark:bg-gray-900 text-xs h-9"
                      />
                      <Button
                        size="sm"
                        className="w-full mt-1 bg-amber-600 hover:bg-amber-700 text-white"
                        disabled={uploadingId === order._id}
                        onClick={() => handleUploadProof(order._id)}
                      >
                        {uploadingId === order._id ? "Uploading..." : "Upload 25% Proof"}
                      </Button>
                    </div>
                  )}

                  {order.paymentProof && (
                    <div className="mt-2 text-xs">
                      <span className="font-semibold text-green-600">Payment Proof Submitted</span>
                    </div>
                  )}
                </CardContent>
              </div>

              <Button
                className="mt-6 outline-none ring-0 focus:ring-0 focus-visible:ring-0 w-full"
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