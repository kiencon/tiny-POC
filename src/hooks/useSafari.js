import { useMemo } from 'react'

export const useSafari = () => {
  const isSafari = useMemo(() => {
    const userAgentString = navigator.userAgent
    // Detect Chrome
    const chromeAgent = userAgentString.indexOf('Chrome') > -1
    // Detect Safari
    let safariAgent = userAgentString.indexOf('Safari') > -1

    // Discard Safari since it also matches Chrome
    if (chromeAgent && safariAgent) safariAgent = false
    return safariAgent
  }, [])
  return isSafari
}
