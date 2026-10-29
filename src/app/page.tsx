import fs from "node:fs";
import path from "node:path";
import { Navbar } from "@/components/Navbar";
import { ScrollBanner } from "@/components/ScrollBanner";

export const dynamic = "force-static";

// Reads every image inside /public/frames at build time.
// To swap the video, just replace the images in that folder
// (any file names work, they are sorted in natural order).
function getFrames(): string[] {
  const dir = path.join(process.cwd(), "public", "frames");
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return files.map((f) => `/frames/${f}`);
}

export default function Home() {
  const frames = getFrames();
  return (
    <>
      <Navbar />
      <main>
        <ScrollBanner frames={frames} />
      </main>
    </>
  );
}
