import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
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

    fetchOrders();
  }, []);

  // Helper function to handle status text color dynamically
  const getStatusTextColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
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

          return (
            <Card
              key={order._id}
              className="border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 outline-none ring-0 focus:ring-0"
            >
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg font-normal">
                  Order #{order._id.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
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
                  <strong>SubTotal: </strong>
                  {order.subTotal}
                </p>
                <p>
                  <strong>Placed At: </strong>
                  {formattedDate}
                </p>
                <Button
                  className="mt-4 outline-none ring-0 focus:ring-0 focus-visible:ring-0"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;