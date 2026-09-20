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
            <a href="" className="text-sm hover:underline">About Us</a>
            <a href="" className="text-sm hover:underline">Contact</a>
            <a 
              href="https://wa.me/YOUR_PHONE_NUMBER" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-500 hover:underline"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={18} />
              WhatsApp
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