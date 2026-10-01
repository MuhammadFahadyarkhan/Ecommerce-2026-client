import React, { useState } from 'react';
import { ShieldCheck, FileText, Truck, RotateCcw, CheckCircle2, Mail, Phone } from 'lucide-react';

const Policies = () => {
  const [activeTab, setActiveTab] = useState('all');

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-zinc-800 dark:text-zinc-200">
      
      {/* Page Header */}
      <div className="text-center space-y-3 bg-gradient-to-b from-zinc-100 to-transparent dark:from-zinc-900/50 dark:to-transparent p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Store Policies & Legal Hub
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          We believe in transparency. Please review our privacy guidelines, terms of service, shipping standards, and return protocols below.
        </p>

        {/* Quick Nav Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          <button 
            onClick={() => scrollToSection('privacy')}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => scrollToSection('terms')}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            Terms & Conditions
          </button>
          <button 
            onClick={() => scrollToSection('shipping')}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            Shipping Policy
          </button>
          <button 
            onClick={() => scrollToSection('returns')}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            Returns & Refunds
          </button>
        </div>
      </div>

      {/* Privacy Policy */}
      <section id="privacy" className="scroll-mt-24 bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-zinc-100 dark:border-zinc-900 space-y-6 transition-all hover:shadow-md">
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Privacy Policy</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p><strong className="text-zinc-900 dark:text-white">Information Collection:</strong> We collect personal information such as names, addresses, email addresses, and phone numbers solely for the purpose of processing orders and providing customer support.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p><strong className="text-zinc-900 dark:text-white">Data Usage:</strong> Your information is used only for order processing, delivery, and communication with you. We do not sell or share your data with third parties.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p><strong className="text-zinc-900 dark:text-white">Cookies:</strong> We use cookies to enhance your browsing experience and provide personalized recommendations. You can manage cookie preferences in your browser settings.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p><strong className="text-zinc-900 dark:text-white">Data Access:</strong> You have the right to request access to, correction of, or deletion of your personal data. Email us @ <span className="text-black dark:text-white font-semibold">Masalaykishop@gmail.com</span></p>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section id="terms" className="scroll-mt-24 bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-zinc-100 dark:border-zinc-900 space-y-6 transition-all hover:shadow-md">
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <FileText size={22} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Terms and Conditions</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <div className="flex gap-4 items-start">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white shrink-0">1</span>
            <p><strong className="text-zinc-900 dark:text-white">Order Placement:</strong> By placing an order, you agree to our terms and conditions, including pricing, payment methods, and shipping policies.</p>
          </div>
          <div className="flex gap-4 items-start">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white shrink-0">2</span>
            <p><strong className="text-zinc-900 dark:text-white">Shipping:</strong> We offer multiple shipping options, and delivery times may vary. Any shipping costs are specified during checkout.</p>
          </div>
          <div className="flex gap-4 items-start">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white shrink-0">3</span>
            <p><strong className="text-zinc-900 dark:text-white">Returns:</strong> Returns are accepted within 30 days of receiving your order.</p>
          </div>
          <div className="flex gap-4 items-start">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white shrink-0">4</span>
            <p><strong className="text-zinc-900 dark:text-white">Dispute Resolution:</strong> In case of disputes, we strive to resolve them amicably. Feel free to share with us @ <span className="text-black dark:text-white font-semibold">Masalaykishop@gmail.com</span></p>
          </div>
        </div>
      </section>

      {/* Shipping and Delivery Policy */}
      <section id="shipping" className="scroll-mt-24 bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-zinc-100 dark:border-zinc-900 space-y-6 transition-all hover:shadow-md">
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <Truck size={22} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Shipping and Delivery Policy</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p><strong className="text-zinc-900 dark:text-white">Shipping Methods:</strong> We offer various shipping methods, including standard and expedited options. Shipping costs and estimated delivery times are provided during checkout.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p><strong className="text-zinc-900 dark:text-white">Shipping Issues:</strong> In the rare event of lost shipments or damaged goods, please write to us @ <span className="text-black dark:text-white font-semibold">Masalaykishop@gmail.com</span></p>
          </div>
        </div>
      </section>

      {/* Return and Refund Policy */}
      <section id="returns" className="scroll-mt-24 bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-zinc-100 dark:border-zinc-900 space-y-6 transition-all hover:shadow-md">
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <RotateCcw size={22} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Return and Refund Policy</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p><strong className="text-zinc-900 dark:text-white">Eligibility:</strong> You can return products within 30 days of receipt.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p>
              <strong className="text-zinc-900 dark:text-white">Return Process:</strong> Contact us @ <span className="text-black dark:text-white font-semibold">Masalaykishop@gmail.com</span> or WhatsApp on <a href="https://wa.me/923062300042" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white font-semibold underline underline-offset-4 hover:opacity-75">03062300042</a>. We will provide instructions on returning the item.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 shrink-0"></span>
            <p><strong className="text-zinc-900 dark:text-white">Refund:</strong> Refunds will be processed once we receive and inspect the returned item. Please allow a reasonable time for the refund to appear in your account.</p>
          </div>
        </div>
      </section>

      {/* Agreement & Contact Footer Card */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-inner">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
          Agreement & Updates
        </h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          By using our website and services, you agree to abide by these policies. We reserve the right to update or modify these policies as needed to ensure the best experience for our customers. Please review these policies regularly for any changes.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-4 text-sm font-medium text-zinc-900 dark:text-white">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Mail size={16} /> Masalaykishop@gmail.com
          </div>
          <a href="https://wa.me/923062300042" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 transition-all">
            <Phone size={16} /> 03062300042
          </a>
        </div>
      </section>

    </div>
  );
};

export default Policies;