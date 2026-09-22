import React from 'react'

const TopBar = () => {
  return (
    <div className="bg-[#166534] text-white py-2.5 px-4 sm:px-8 border-b border-green-700/50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        {/* Left Side: WhatsApp Order & Delivery Info */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          
          {/* WhatsApp Section - Wrapped in an active WhatsApp chat link */}
          <a 
            href="https://wa.me/923062300042?text=Hello,%20I%20want%20to%20order%20from%20Khalis%20Masala%20Shop." 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 group cursor-pointer"
          >
            {/* WhatsApp SVG Icon */}
            <svg className="w-8 h-8 fill-current text-white shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <div className="text-left">
              <p className="text-xs text-gray-200 tracking-wider">WhatsApp Order</p>
              <p className="text-sm font-bold tracking-wide underline underline-offset-2">03062300042</p>
            </div>
          </a>

          {/* Divider Line */}
          <div className="hidden sm:block h-8 w-[1px] bg-green-500/40"></div>

          {/* Delivery Info */}
          <div className="flex items-center gap-2.5">
            {/* Delivery Truck SVG Icon */}
            <svg className="w-7 h-7 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <div className="text-left">
              <p className="text-xs font-semibold tracking-wider">Delivery</p>
              <p className="text-sm font-bold text-gray-100">All over Pakistan</p>
            </div>
          </div>

        </div>

        {/* Right Side: Brand Tagline */}
        <div className="text-center md:text-right">
          <p className="text-lg font-bold tracking-wide">معیار ۔ خالضت ۔ اعتماد</p>
          <p className="text-xs text-gray-200 tracking-wider">Pure Taste &bull; Better Health &bull; A Happier Home</p>
        </div>

      </div>
    </div>
  )
}

export default TopBar