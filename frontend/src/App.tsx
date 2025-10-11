import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function App() {

  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("")

  const handleShorten = async () => {
    const trimmedLongUrl = longUrl.trim();
    if (!trimmedLongUrl) return;

    const res = await fetch("http://localhost:3000/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl: trimmedLongUrl }),
    });

    const data = await res.json();
    setShortUrl(data.shortUrl);
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      alert("Text Copied Succesfully!");
    } catch (err) {
      console.log("Failed To Copy Text", err);
    }
  }

  return (

    <main className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg bg-white shadow-xl rounded-2xl p-8 space-y-6 w-full backdrop-blur-2xl brightness-90 gap-[2%] flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          QuickLink: URL Shortener
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Paste your long URL below and get a short link instantly.
        </p>

        <div className="flex gap-[3%] w-full px-[5%]">
          <Input className="flex-1"
            value={longUrl.trim()}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <Button onClick={handleShorten}>Shorten</Button>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 text-center flex-1 w-[92%]">
          {shortUrl && (
            <div className="pb-4">
              <p className="text-sm text-gray-600">Your shortened link:</p>
              <div className="flex items-center justify-center mt-2 space-x-2">
                <a href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 font-medium hover:underline"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Copy
                </button>
              </div>
            </div>)}
          <p className="text-xs text-gray-600">
            Generated Links Will Automatically Be Deleted In 30 days
          </p>
        </div>
      </div>
    </main>
  )
}

export default App
