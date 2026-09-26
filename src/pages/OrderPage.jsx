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

  // Helper function to handle status text color dynamically
  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "awaiting admin approval":
        return "text-amber-500";
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

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-600">No Orders with this id</h1>
        <Button onClick={() => navigate("/products")}>Shop Now</Button>
      </div>
    );
  }

  const date = new Date(order.createdAt);
  
  // Formatted for Pakistan Standard Time (Asia/Karachi)
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

  return (
    <div className="container mx-auto py-6 px-4">
      {user._id === order.user?._id || user.role === "admin" ? (
       <>
         <Card className="mb-8 border border-slate-200 shadow-sm outline-none ring-0 focus:ring-0">
        <CardHeader className="flex flex-row items-center justify-between pb-4 p-5">
          <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
          <Button onClick={() => window.print()}>Print Order</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm md:text-base p-5">
            {/* Left Column: Order Summary Info */}
            <div className="space-y-2">
              <p>
                <strong>Status: </strong>
                <span className={`font-semibold ${getStatusTextColor(order.status)}`}>
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Total Items: </strong>
                {order.items.length}
              </p>
              <p>
                <strong>Payment Method: </strong>
                {order.method}
              </p>
              <p>
                <strong>SubTotal: </strong>
                Rs {subTotalNum.toFixed(2)}
              </p>
              
              {/* Show Advance Breakdown if payment proof exists */}
              {order.paymentProof ? (
                <p className="text-amber-600 font-medium">
                  <strong>25% Advance Paid: </strong> Rs {advanceNum.toFixed(2)} 
                  <span className="block text-xs text-gray-500">Remaining Due on Delivery: Rs {remainingNum.toFixed(2)}</span>
                </p>
              ) : (
                <p className="text-amber-600 font-medium">
                  <strong>25% Advance Option: </strong> Rs {advanceNum.toFixed(2)}
                  <span className="block text-xs text-gray-500">COD (No proof uploaded yet)</span>
                </p>
              )}

              <p>
                <strong>Placed At: </strong>
                {formattedDate}
              </p>
              <p>
                <strong>Paid At: </strong>
                {order.paidAt || "Payment through COD"}
              </p>
            </div>

            {/* Right Column: Shipping, User Info & Payment Proof Image */}
            <div className="space-y-3">
              <p>
                <strong>Address: </strong> {order.address}
              </p>
              <p>
                <strong>User: </strong> {order.user?.email || "Guest"}
              </p>

              {/* Payment Proof Image Preview for Print / View */}
              {order.paymentProof ? (
                <div className="pt-2">
                  <strong className="block mb-1">Payment Proof Screenshot:</strong>
                  <a 
                    href={order.paymentProof} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img 
                      src={order.paymentProof} 
                      alt="Payment Proof" 
                      className="w-24 h-24 object-cover rounded-md border border-gray-300 shadow-sm hover:opacity-90 transition-opacity" 
                    />
                  </a>
                </div>
              ) : (
                <p>
                  <strong>Payment Proof: </strong> <span className="text-gray-400">None (Pure COD)</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {order.items.map((e, i) => {
          // 🛡️ Safeguard check if product was deleted from database
          if (!e.product) {
            return (
              <Card key={i} className="p-6 flex flex-col justify-between border border-red-200 bg-red-50 rounded-lg">
                <p className="text-red-600 font-semibold">Product No Longer Available</p>
                <p className="text-sm text-gray-500">Quantity: {e.quantity}</p>
              </Card>
            );
          }

          // Calculate discount details
          const discountPercent = e.product.discountPercent || e.product.discount || 0;
          const hasDiscount = discountPercent > 0;
          const discountedPrice = hasDiscount 
            ? e.product.price * (1 - discountPercent / 100) 
            : e.product.price;
          const itemTotalPrice = discountedPrice * e.quantity;

          return (
            <Card 
              key={i} 
              className="overflow-hidden flex flex-col justify-between border border-slate-200 rounded-lg shadow-sm outline-none ring-0 focus:ring-0"
            >
              <Link 
                to={`/product/${e.product._id}`}
                className="outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
              >
                <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                  {hasDiscount && (
                    <span className="absolute top-2 left-2 bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full z-10">
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
              <CardContent className="p-6 space-y-2">
                <h3 className="text-base font-semibold line-clamp-2">{e.product.title}</h3>
                <p className="text-sm">
                  <strong>Quantity: </strong>
                  {e.quantity}
                </p>
                <div className="flex flex-col text-sm space-y-0.5">
                  <div className="flex items-center gap-2">
                    <strong>Price:</strong> 
                    <span>Rs {Number(discountedPrice).toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="line-through text-xs text-muted-foreground">
                        Rs {Number(e.product.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Total: Rs {Number(itemTotalPrice).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
       </>
      ) : (
     <p className="text-red-500 text-3xl text-center">This is not your order <br />
     <Link className="mt-4 underline text-blue-400" to={"/"}>Go to Home Page</Link>
     </p>
      )}
    </div>
  );
};

export default OrderPage;