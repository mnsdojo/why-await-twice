import fs from "fs";
import {} from "stream";
import path from "path";
import { NextResponse } from "next/server";

export  async function GET() {
  const filePath = path.join(process.cwd(), "public", `data.json`);
  try {
    const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });

    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => {
          if (typeof chunk === "string") {
            controller.enqueue(new TextEncoder().encode(chunk));
          } else {
            controller.enqueue(new Uint8Array(chunk));
          }
        });
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (error) => controller.error(error));
      },
    });
    const response = new NextResponse(readableStream);
    response.headers.set("Content-Type", "application/json");
    return response;
  } catch (error) {
    console.error("Error streaming file:", error);
    return new NextResponse(JSON.stringify({ error: "File not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}
