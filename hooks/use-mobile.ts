import * as React from "react"

// Defines the width threshold for considering a device as 'mobile'.
const MOBILE_BREAKPOINT = 768

/**
 * A custom hook to determine if the current viewport is in a mobile configuration.
 * Listens for window resize events to update the state dynamically.
 * 
 * @returns boolean - True if the window width is less than the mobile breakpoint.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a media query list for the specified mobile breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Update state based on initial matches.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Listen for changes to the media query.
    mql.addEventListener("change", onChange)
    
    // Initial check on mount.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Clean up the event listener on unmount.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
