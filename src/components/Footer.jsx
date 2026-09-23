import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="w-full mt-8">
      <hr className="border border-gray-300 dark:border-gray-700" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex flex-col md:flex-row justify-between items-center">
            <div>
                  <div className="inline-flex items-center gap-1.5">
                  <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
                  Khalis Masala Shop
                  </h1>
                    </div>
              <p className="text-sm">Your one-stop shop for everything you need</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            
            <a 
              href="https://wa.me/923062300042?text=Hello,%20I%20want%20to%20order%20from%20Khalis%20Masala%20Shop." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors shadow-sm"
              aria-label="WhatsApp Order"
            >
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm">Follow us:</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:opacity-75" aria-label="Facebook">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:opacity-75" aria-label="Twitter">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:opacity-75" aria-label="Instagram">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:opacity-75" aria-label="YouTube">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer