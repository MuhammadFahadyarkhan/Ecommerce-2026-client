import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserData } from "@/context/UserContext";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = UserData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/${id}`, {
          headers: {
            token: Cookies.get("token"),
          },
        });
        setOrder(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-amber-500 dark:text-amber-400";
      case "awaiting admin approval":
        return "text-amber-600 dark:text-amber-400";
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

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-4">No Orders with this ID</h1>
        <Button 
          onClick={() => navigate("/products")}
          className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl px-6"
        >
          Shop Now
        </Button>
      </div>
    );
  }

  const date = new Date(order.createdAt);
  const formattedDate = new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

  const subTotalNum = Number(order.subTotal || 0);
  const advanceNum = subTotalNum * 0.25;
  const remainingNum = subTotalNum * 0.75;
  const hasPaidAdvance = Boolean(order.paymentProof);

  // Function to open print window with clean totals layout
  const handlePrintReceipt = () => {
    const printWindow = window.open("", "_blank", "width=700,height=900");
    if (!printWindow) return;

    const itemsHTML = order.items.map((item) => {
      const prod = item.product || {};
      const discount = prod.discountPercent || prod.discount || 0;
      const price = discount > 0 ? prod.price * (1 - discount / 100) : (prod.price || item.price || 0);
      return `
        <div style="margin-bottom: 16px; border-bottom: 2px dotted #777; padding-bottom: 12px;">
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">${prod.title || "Product"}</div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; color: #111;">
            <span>Qty: ${item.quantity} × Rs ${Number(price).toFixed(2)}</span>
            <span style="font-weight: bold;">Rs ${(item.quantity * price).toFixed(2)}</span>
          </div>
        </div>
      `;
    }).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order._id.toUpperCase()}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 30px; color: #000; background: #fff; max-width: 550px; margin: auto; }
            .header { text-align: center; border-bottom: 3px dashed #000; padding-bottom: 20px; margin-bottom: 22px; }
            .section { margin-bottom: 18px; border-bottom: 2px dashed #000; padding-bottom: 16px; font-size: 16px; }
            .totals { font-size: 18px; font-weight: bold; margin-top: 15px; }
            .footer { text-align: center; font-size: 15px; margin-top: 30px; border-top: 2px dashed #000; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0 0 8px 0; font-size: 26px; letter-spacing: 1px;">STORE RECEIPT</h2>
            <p style="margin: 4px 0; font-size: 15px;"><strong>Order ID:</strong> ${order._id.toUpperCase()}</p>
            <p style="margin: 4px 0; font-size: 15px;"><strong>Date:</strong> ${formattedDate}</p>
          </div>

          <div class="section">
            <p style="margin: 6px 0;"><strong>Customer:</strong> ${order.user?.email || "Guest"}</p>
            <p style="margin: 6px 0;"><strong>Method:</strong> ${order.method.toUpperCase()}</p>
            <p style="margin: 6px 0;"><strong>Status:</strong> ${order.status}</p>
            <p style="margin: 6px 0;"><strong>Address:</strong> ${order.address}</p>
          </div>

          <div class="section">
            <div style="font-weight: bold; margin-bottom: 14px; font-size: 17px; text-decoration: underline;">PURCHASED ITEMS:</div>
            ${itemsHTML}
          </div>

          <div class="section totals">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Subtotal:</span>
              <span>Rs ${subTotalNum.toFixed(2)}</span>
            </div>
            ${hasPaidAdvance ? `
              <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: normal; margin-bottom: 6px;">
                <span>25% Advance Paid:</span>
                <span>Rs ${advanceNum.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: normal;">
                <span>Balance Due on Delivery:</span>
                <span>Rs ${remainingNum.toFixed(2)}</span>
              </div>
            ` : `
              <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: bold; margin-top: 6px; border-top: 1px dashed #777; padding-top: 6px;">
                <span>Total Due on Delivery (COD):</span>
                <span>Rs ${subTotalNum.toFixed(2)}</span>
              </div>
            `}
          </div>

          <div class="footer">
            <p style="margin: 4px 0; font-weight: bold; font-size: 17px;">Thank you for your order!</p>
            <p style="margin: 0; font-size: 14px;">Please keep this receipt for reference.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl min-h-[70vh]">
      {user._id === order.user?._id || user.role === "admin" ? (
       <>
         {/* MAIN WEB VIEW CARD */}
         <Card className="mb-8 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-2xl overflow-hidden outline-none ring-0 focus:ring-0">
          <CardHeader className="flex flex-row items-center justify-between pb-4 p-6 border-b border-slate-100 dark:border-zinc-900">
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Order Details</CardTitle>
            <Button 
              onClick={handlePrintReceipt}
              className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl px-5 text-sm"
            >
              Print Receipt
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm md:text-base">
              <div className="space-y-3 text-slate-600 dark:text-slate-300">
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
                  <span className="font-medium text-slate-500 dark:text-slate-400">Payment Method:</span>
                  <span className="uppercase text-slate-900 dark:text-white font-medium">{order.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500 dark:text-slate-400">SubTotal:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">Rs {subTotalNum.toFixed(2)}</span>
                </div>
                
                {hasPaidAdvance ? (
                  <div className="p-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span>25% Advance Paid:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Rs {advanceNum.toFixed(2)}</span>
                    </div>
                    <span className="block text-xs text-slate-500">Remaining Due on Delivery: Rs {remainingNum.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span>Payment Type:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Full Cash on Delivery (COD)</span>
                    </div>
                    <span className="block text-xs text-slate-500">Total Due on Delivery: Rs {subTotalNum.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="font-medium text-slate-500 dark:text-slate-400">Placed At:</span>
                  <span className="text-slate-900 dark:text-white font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500 dark:text-slate-400">Paid At:</span>
                  <span className="text-slate-900 dark:text-white font-medium">{order.paidAt || "Payment through COD"}</span>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <div>
                  <span className="block font-medium text-slate-500 dark:text-slate-400 mb-1">Address:</span>
                  <p className="text-slate-900 dark:text-white font-medium leading-relaxed">{order.address}</p>
                </div>
                <div>
                  <span className="block font-medium text-slate-500 dark:text-slate-400 mb-1">User:</span>
                  <span className="text-slate-900 dark:text-white font-medium">{order.user?.email || "Guest"}</span>
                </div>

                {order.paymentProof ? (
                  <div className="pt-2">
                    <span className="block font-medium text-slate-500 dark:text-slate-400 mb-2">Payment Proof Screenshot:</span>
                    <a 
                      href={order.paymentProof} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <img 
                        src={order.paymentProof} 
                        alt="Payment Proof" 
                        className="w-24 h-24 object-cover rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:opacity-90 transition-opacity" 
                      />
                    </a>
                  </div>
                ) : (
                  <div>
                    <span className="block font-medium text-slate-500 dark:text-slate-400 mb-1">Payment Proof:</span>
                    <span className="text-slate-400 text-sm">None (Pure COD)</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WEB VIEW ITEMS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {order.items.map((e, i) => {
            if (!e.product) {
              return (
                <Card key={i} className="p-6 flex flex-col justify-between border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 rounded-2xl shadow-sm">
                  <p className="text-rose-600 dark:text-rose-400 font-semibold text-sm">Product No Longer Available</p>
                  <p className="text-xs text-slate-500 mt-2">Quantity: {e.quantity}</p>
                </Card>
              );
            }

            const discountPercent = e.product.discountPercent || e.product.discount || 0;
            const hasDiscount = discountPercent > 0;
            const discountedPrice = hasDiscount 
              ? e.product.price * (1 - discountPercent / 100) 
              : e.product.price;
            const itemTotalPrice = discountedPrice * e.quantity;

            return (
              <Card 
                key={i} 
                className="overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm hover:shadow-md transition-all outline-none ring-0 focus:ring-0"
              >
                <Link 
                  to={`/product/${e.product._id}`}
                  className="outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
                >
                  <div className="w-full h-48 bg-slate-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden relative">
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 text-xs font-semibold px-2.5 py-1 rounded-full z-10 border border-rose-200 dark:border-rose-900/50">
                        {discountPercent}% OFF
                      </span>
                    )}
                    <img
                      src={e.product.images?.[0]?.url || "/placeholder.png"}
                      alt={e.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">{e.product.title}</h3>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Quantity:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{e.quantity}</span>
                  </div>
                  <div className="flex flex-col text-sm pt-2 border-t border-slate-100 dark:border-zinc-900 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Price:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">Rs {Number(discountedPrice).toFixed(2)}</span>
                        {hasDiscount && (
                          <span className="line-through text-xs text-slate-400">
                            Rs {Number(e.product.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500 dark:text-slate-400">Total:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Rs {Number(itemTotalPrice).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
       </>
      ) : (
       <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
         <p className="text-rose-600 dark:text-rose-400 text-2xl font-bold mb-2">This is not your order</p>
         <Link className="text-sm font-medium underline text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" to={"/"}>
           Go to Home Page
         </Link>
       </div>
      )}
    </div>
  );
};

export default OrderPage;