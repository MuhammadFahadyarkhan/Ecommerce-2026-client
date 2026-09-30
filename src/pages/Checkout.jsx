import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { Trash, MapPin, Phone, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

const Checkout = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setAddress(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    phone: "",
  });

  const handleAddAddress = async () => {
    try {
      // Combining full address parts into a single string or sending them as an object based on your backend schema
      const fullAddressString = `${newAddress.address}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pinCode}, ${newAddress.country}`;

      const { data } = await axios.post(
        `${server}/api/address/new`,
        { 
          address: fullAddressString, 
          phone: newAddress.phone 
        },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );
      if (data.message) {
        toast.success(data.message);
        fetchAddress();
        setNewAddress({
          address: "",
          city: "",
          state: "",
          country: "",
          pinCode: "",
          phone: "",
        });
        setModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const deleteHandler = async (id) => {
    if(confirm("Are you sure you want to delete this Address")){
      try {
        const { data } = await axios.delete(`${server}/api/address/${id}`, {
          headers: {
            token: Cookies.get("token"),
          },
        });

        if (data.message) {
          toast.success(data.message);
          fetchAddress();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh] max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Checkout</h1>
          <p className="text-sm text-slate-500 mt-1">Select a delivery address or add a new one to proceed.</p>
        </div>
        <Button 
          className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 gap-2 rounded-full px-5 shadow-sm"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> Add New Address
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {address && address.length > 0 ? (
            address.map((e) => (
              <div 
                className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative" 
                key={e._id}
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span>Delivery Address</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteHandler(e._id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 rounded-full"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {e.address}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-zinc-900">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{e.phone}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/payment/${e._id}`} className="block w-full">
                  <Button className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium text-sm rounded-xl py-2.5 transition-colors shadow-sm">
                    Use Address
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800">
              <MapPin className="w-10 h-10 mx-auto text-slate-400 mb-3 opacity-50" />
              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">No saved addresses found.</p>
              <p className="text-slate-400 text-xs mt-1">Click "Add New Address" to set up your delivery location.</p>
            </div>
          )}
        </div>
      )}

      {/* Modern Dialog Modal with Full Address Inputs */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Add New Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">Street Address / House No.</label>
              <Input
                placeholder="e.g. 123 Main Street, Apt 4B"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
                className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">City</label>
                <Input
                  placeholder="e.g. Hyderabad"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">State / Province</label>
                <Input
                  placeholder="e.g. Sindh"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">Postal Code</label>
                <Input
                  placeholder="e.g. 71000"
                  value={newAddress.pinCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pinCode: e.target.value })
                  }
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">Country</label>
                <Input
                  placeholder="e.g. Pakistan"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">Phone Number</label>
              <Input
                type="number"
                placeholder="e.g. 03001234567"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl border-slate-200 dark:border-zinc-800">
              Cancel
            </Button>
            <Button 
              onClick={handleAddAddress}
              className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl"
            >
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;