import Loading from "@/components/Loading";
import { CartData } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { server } from "@/main";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Payment = () => {
  const { cart, fetchCart } = CartData();
  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("cod"); // "cod" or "25% Advance"
  const [proofFile, setProofFile] = useState(null);
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

  // Helper function to eliminate floating-point precision glitches
  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // 🛡️ Dynamically calculate the correct subtotal with discounts applied
  const calculatedSubTotal = cart.reduce((acc, e) => {
    if (!e.product) return acc;
    const discountPercent = e.product.discountPercent || e.product.discount || 0;
    const discountedPrice = discountPercent > 0 
      ? e.product.price * (1 - discountPercent / 100) 
      : e.product.price;
    return acc + (discountedPrice * e.quantity);
  }, 0);

  const paymentHandler = async () => {
    if (!address) return;

    setLoading(true);
    try {
      if (method === "cod") {
        // Send as regular JSON for the COD route
        const { data } = await axios.post(
          `${server}/api/order/new/cod`,
          {
            method: "cod",
            phone: address.phone,
            address: address.address,
          },
          {
            headers: { token: Cookies.get("token") },
          }
        );

        setLoading(false);
        toast.success(data.messege || data.message);
        fetchCart();
        navigate("/orders");

      } else {
        // Send as FormData for 25% Advance (using "files" to match multer array configuration)
        if (!proofFile) {
          setLoading(false);
          return toast.error("Please upload your 25% payment proof screenshot");
        }

        const formData = new FormData();
        formData.append("method", "25% Advance");
        formData.append("phone", address.phone);
        formData.append("address", address.address);
        formData.append("files", proofFile); // Matches multer .array("files", 10)

        const { data } = await axios.post(
          `${server}/api/order/new/proof`, 
          formData, 
          {
            headers: {
              token: Cookies.get("token"),
            },
          }
        );

        setLoading(false);
        toast.success(data.messege || data.message);
        fetchCart();
        navigate("/orders");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.messege || error.response?.data?.message || "Something went wrong");
    }
  };

  const advanceAmount = formatCurrency(calculatedSubTotal * 0.25);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">
              Proceed to Payment
            </h2>
            <div>
              <h3 className="text-xl font-semibold">Products</h3>
              <Separator className="my-2" />

              <div className="space-y-4">
                {cart &&
                  cart.map((e, i) => {
                    if (!e.product) return null;

                    // Calculate discount metrics for each item dynamically
                    const discountPercent = e.product.discountPercent || e.product.discount || 0;
                    const hasDiscount = discountPercent > 0;
                    const discountedPrice = hasDiscount 
                      ? e.product.price * (1 - discountPercent / 100) 
                      : e.product.price;
                    const itemTotalPrice = discountedPrice * e.quantity;

                    return (
                      <div
                        key={i}
                        className="flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-lg shadow border dark:border-gray-700"
                      >
                        <img
                          src={e.product.images[0].url}
                          alt="xyz"
                          className="w-16 h-16 object-cover rounded mb-4 md:mb-0"
                        />

                        <div className="flex-1 md:ml-4 text-center md:text-left space-y-1">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <h2 className="text-lg font-medium">
                              {e.product.title}
                            </h2>
                            {hasDiscount && (
                              <span className="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground dark:text-gray-400">
                            <span>Rs {formatCurrency(discountedPrice)} * {e.quantity}</span>
                            {hasDiscount && (
                              <span className="line-through text-xs">
                                Rs {formatCurrency(e.product.price)}
                              </span>
                            )}
                          </div>

                          <p className="text-sm font-semibold text-muted-foreground dark:text-gray-400">
                            Total: Rs {formatCurrency(itemTotalPrice)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="text-lg font-medium text-center">
              Total Price: Rs {formatCurrency(calculatedSubTotal)}
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

                  <div className="w-full">
                    <h4 className="font-semibold mb-2">Payment Method</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 dark:border-gray-700">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={method === "cod"}
                          onChange={() => setMethod("cod")}
                        />
                        <span className="text-sm font-medium">Cash on Delivery (COD)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 dark:border-gray-700">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="25% Advance"
                          checked={method === "25% Advance"}
                          onChange={() => setMethod("25% Advance")}
                        />
                        <span className="text-sm font-medium">25% Advance Payment</span>
                      </label>
                    </div>
                  </div>

                  {method === "25% Advance" && (
                    <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-lg space-y-3">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                        Please transfer <strong>Rs {advanceAmount}</strong> (25% of Rs {formatCurrency(calculatedSubTotal)}) to the bank details below and upload your payment screenshot proof for admin approval.
                      </p>

                      <div className="bg-white dark:bg-gray-900 p-3 rounded border dark:border-gray-800 text-xs space-y-1 font-mono">
                        <p><strong>Account Title:</strong> KHAWAJA MUHAMMAD ZUNAIN</p>
                        <p><strong>Bank:</strong> Askari Bank Limited (Khayyam Chowk Branch, Sargodha)</p>
                        <p><strong>Account Number:</strong> 07420200020048</p>
                        <p><strong>IBAN:</strong> PK83ASCM0007420200020048</p>
                      </div>

                      <div className="space-y-1 pt-1">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Upload Payment Screenshot
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProofFile(e.target.files[0])}
                          className="bg-white dark:bg-gray-900"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Charges Notice */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md text-xs text-blue-800 dark:text-blue-200 text-center font-medium">
              ℹ️ Delivery Charges will be told on the confirmation call.
            </div>

            <Button
              className="w-full py-3 mt-2"
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