import Loading from "@/components/Loading";
import { CartData } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { server } from "@/main";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Payment = () => {
  const { cart, subTotal, fetchCart } = CartData();
  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("cod"); // Automatically set to cod
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/${id}`, {
        headers: { token: Cookies.get("token") },
      });

      setAddress(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAddress();
  }, [id]);

  const paymentHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/order/new/cod`,
        {
          method,
          phone: address.phone,
          address: address.address,
        },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      setLoading(false);
      toast.success(data.messege);
      fetchCart();
      navigate("/orders");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.messege || "Something went wrong");
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">
              Proceed to Payment
            </h2>
            <div>
              <h3 className="text-xl font-semibold">Products</h3>
              <Separator className="my-2" />

              <div className="space-y-4">
                {cart &&
                  cart.map((e, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-lg shadow border dark:border-gray-700"
                    >
                      <img
                        src={e.product.images[0].url}
                        alt="xyz"
                        className="w-16 h-16 object-cover rounded mb-4 md:mb-0"
                      />

                      <div className="flex-1 md:ml-4 text-center md:text-left">
                        <h2 className="text-lg font-medium">
                          {e.product.title}
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          Rs {e.product.price} * {e.quantity}
                        </p>

                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          Rs {e.product.price * e.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="text-lg font-medium text-center">
              Total Price to be Paid: Rs {subTotal}
            </div>

            {address && (
              <div className="bg-card p-4 rounded-lg shadow border space-y-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-center">Details</h3>
                <Separator className="my-2 h-[1px] w-full bg-border" />

                <div className="flex flex-col space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Delivery Address</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      <strong>Address:</strong> {address.address}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      <strong>Phone:</strong> {address.phone}
                    </p>
                  </div>

                  <div className="w-full md:w-1/2">
                    <h4 className="font-semibold mb-1">Payment Method</h4>
                    <div className="p-2 border rounded-lg bg-card dark:bg-gray-900 dark:text-white text-sm font-medium">
                      Cash on Delivery (COD)
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              className="w-full py-3 mt-4"
              onClick={paymentHandler}
              disabled={!address}
            >
              Proceed To Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;