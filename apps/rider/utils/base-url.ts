import Constants from "expo-constants";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
    /**
     * Gets the IP address of your host-machine. If it cannot automatically find it,
     * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
     * you don't have anything else running on it, or you'd have to change it.
     *
     * **NOTE**: This is only for development. In production, you'll want to set the
     * baseUrl to your production API URL.
     */
    const debuggerHost = Constants.expoConfig?.hostUri;

    // In development (when debuggerHost is available), always use localhost
    // to ensure cookie consistency with OAuth redirects.
    // The Next.js server should be accessible as localhost from the emulator/simulator.
    if (debuggerHost) {
        const detectedHost = debuggerHost?.split(":")[0];
        console.log(
            "Detected debugger host:",
            detectedHost,
            "Using 'localhost:3001' for API base URL in development.",
        );
        console.log(`http://${detectedHost}:3001`)
        return `http://${detectedHost}:3001`;
    }

    // Fallback for production or when debuggerHost is not available
    return `http://localhost:3001`;
};