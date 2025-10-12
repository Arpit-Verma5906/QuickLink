interface Env {
    VITE_API_URL: string;
}

// Extend the Window interface
interface Window {
    _env_: Env;
}
