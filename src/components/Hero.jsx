import React from 'react'

const Hero = ({navigate}) => {
  return (
    <div 
      className='relative h-[calc(100vh-100px)] bg-cover md:bg-[length:100%_100%] bg-center bg-no-repeat'
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,.2)), url("/spices.jpeg")`,
        paddingTop: "100px",
      }}
    >
      <div className="flex items-center justify-center h-full text-center text-white px-4">
        <div>
          {/* Custom button built with Tailwind to match the reference image exactly */}
          <button 
            onClick={() => navigate("/products")} 
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-[#166534] hover:bg-[#166534]/90 rounded-full transition-all duration-300 shadow-lg mx-auto"
          >
            <span>SHOP NOW</span>
            {/* Simple inline SVG arrow icon */}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero