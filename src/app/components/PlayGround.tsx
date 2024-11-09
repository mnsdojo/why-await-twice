"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, X, PlayCircle, StopCircle } from "lucide-react";

interface FetchState {
  headers: string;
  body: string;
  loadingStage: "idle" | "headers" | "streaming" | "complete";
  startTime?: number;
  headerTime?: number;
  endTime?: number;
}

function PlayGround() {
  const [fetchState, setFetchState] = useState<FetchState>({
    headers: "",
    body: "",
    loadingStage: "idle",
  });
  const [showCode, setShowCode] = useState(false);

  const fetchData = async () => {
    const startTime = performance.now();
    setFetchState({
      headers: "",
      body: "",
      loadingStage: "headers",
      startTime,
    });

    try {
      // First await - headers
      const response = await fetch("/data.json");
      const headerTime = performance.now();

      setFetchState((prev) => ({
        ...prev,
        headers: JSON.stringify(
          {
            status: response.status,
            statusText: response.statusText,
            ...Object.fromEntries(response.headers.entries()),
          },
          null,
          2
        ),
        loadingStage: "streaming",
        headerTime,
      }));

      // Second await - slowly streaming body
      const data = await response.json();
      const endTime = performance.now();

      setFetchState((prev) => ({
        ...prev,
        body: JSON.stringify(data, null, 2),
        loadingStage: "complete",
        endTime,
      }));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="border-emerald-500 border rounded-xl p-6 w-full mt-10 bg-white relative">
      {/* Header with Server Implementation Button */}
      <div className="space-y-2 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Real Server
            </h2>
            <span className="text-xl sm:text-2xl font-light text-emerald-400 font-mono transform -rotate-3">
              Implementation
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="p-2 text-emerald-500 hover:text-emerald-600 transition-colors"
              title="View Server Code"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="w-16 h-1 bg-emerald-400 transform -rotate-3" />
        <p className="text-gray-600 text-sm sm:text-base">
          Node.js server streaming JSON response one byte at a time
        </p>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-6">
        <div className="flex gap-4 items-center">
          <button
            onClick={fetchData}
            disabled={fetchState.loadingStage !== "idle"}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${
                fetchState.loadingStage !== "idle"
                  ? "bg-gray-200 text-gray-500"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
          >
            {fetchState.loadingStage === "idle" ? (
              <>
                <PlayCircle className="w-5 h-5" /> Start Fetch
              </>
            ) : (
              <>
                <StopCircle className="w-5 h-5" /> Fetching...
              </>
            )}
          </button>

          {/* Timing Display */}
          {fetchState.startTime && (
            <div className="text-sm text-gray-600 space-y-1">
              {fetchState.headerTime && (
                <div>
                  Headers:{" "}
                  {(fetchState.headerTime - fetchState.startTime).toFixed(0)}ms
                </div>
              )}
              {fetchState.endTime && (
                <div>
                  Body:{" "}
                  {(fetchState.endTime - (fetchState.headerTime || 0)).toFixed(
                    0
                  )}
                  ms
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              Headers
              {fetchState.loadingStage === "streaming" && (
                <span className="text-emerald-500 text-sm">
                  ← First await complete!
                </span>
              )}
            </h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm h-[200px] overflow-auto">
              {fetchState.headers || "Waiting for headers..."}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              Response Body
              {fetchState.loadingStage === "complete" && (
                <span className="text-emerald-500 text-sm">
                  ← Second await complete!
                </span>
              )}
            </h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm h-[200px] overflow-auto">
              {fetchState.loadingStage === "streaming"
                ? "Streaming data..."
                : fetchState.body || "Waiting for body..."}
            </pre>
          </div>
        </div>
      </div>

      {/* Server Code Modal */}
      {showCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowCode(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold mb-4">Server Implementation</h3>

            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              <code className="text-sm">{`const http = require("http")
const fs = require("fs")
const path = require("path")

const server = http.createServer((req, res) => {
    // serve JSON, but *slowly*
    if (req.method === "GET" && req.url === "/json") {
        res.writeHead(200, { "Content-Type": "application/json" })
        
        // set up a readable stream
        const filePath = path.join(__dirname, "data.json")
        const stream = fs.createReadStream(filePath, { encoding: "utf8" })
        
        // read the stream one byte at a time and send it to the client
        stream.on("readable", function () {
            const interval = setInterval(() => {
                const chunk = stream.read(1)
                if (chunk !== null) {
                    res.write(chunk)
                } else {
                    clearInterval(interval)
                    res.end()
                }
            }, 2) // <--- slow! 2ms delay per byte
        })
        return
    }

    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("Not Found")
})`}</code>
            </pre>

            <div className="mt-4 p-4 bg-emerald-50 rounded-lg text-emerald-700">
              <p>This server demonstrates why we need two awaits by:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Responding with headers immediately</li>
                <li>Streaming the JSON response one byte at a time</li>
                <li>Adding a 2ms delay between each byte</li>
                <li>Showing how headers arrive before the complete body</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayGround;
