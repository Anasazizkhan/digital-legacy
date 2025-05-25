// Base64 encoded placeholder images for template backgrounds
export const templateBackgrounds = {
  love: `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hearts" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 10 Q15 0 10 10 Q0 15 10 25 L20 35 L30 25 Q40 15 30 10 Q25 0 20 10" fill="rgba(255,255,255,0.1)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hearts)"/>
    </svg>
  `)}`,
  
  wisdom: `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="books" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect x="10" y="10" width="40" height="50" fill="rgba(255,255,255,0.1)"/>
          <rect x="15" y="15" width="30" height="5" fill="rgba(255,255,255,0.05)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#books)"/>
    </svg>
  `)}`,
  
  memories: `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="frames" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect x="10" y="10" width="60" height="40" stroke="rgba(255,255,255,0.1)" fill="none" stroke-width="2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#frames)"/>
    </svg>
  `)}`,
  
  gratitude: `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="flowers" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="10" fill="rgba(255,255,255,0.1)"/>
          <circle cx="25" cy="25" r="5" fill="rgba(255,255,255,0.05)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#flowers)"/>
    </svg>
  `)}`,
  
  advice: `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="bulbs" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="20" r="15" fill="rgba(255,255,255,0.1)"/>
          <rect x="25" y="35" width="10" height="15" fill="rgba(255,255,255,0.1)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bulbs)"/>
    </svg>
  `)}`,
  
  farewell: `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="waves" x="0" y="0" width="100" height="50" patternUnits="userSpaceOnUse">
          <path d="M0 25 Q25 0 50 25 Q75 50 100 25" stroke="rgba(255,255,255,0.1)" fill="none"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#waves)"/>
    </svg>
  `)}`
}; 