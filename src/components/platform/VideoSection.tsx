"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { videoEmbedUrl } from "@/lib/platform";

/** Intro video: Aparat/YouTube embed or an uploaded mp4; loads only after a click (fast page). */
export default function VideoSection({ title, text, url, file, poster }: { title: string; text: string; url: string; file: string; poster: string }) {
  const [playing, setPlaying] = useState(false);
  const embed = videoEmbedUrl(url);
  const src = file || (!embed && url ? url : "");
  if (!embed && !src) return null;

  return (
    <section id="video" className="relative isolate py-24 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 -z-10 bg-[#0b1020]" />
      <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-[#7c3aed]/40 blur-[120px] -z-10" />
      <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#ff6b6b]/30 blur-[120px] -z-10" />
      <div className="mx-auto max-w-5xl px-4 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold">{title}</h2>
        {text && <p className="mt-4 text-white/70 max-w-2xl mx-auto leading-8">{text}</p>}
        <div className="mt-10 relative aspect-video rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(124,58,237,0.6)] bg-black">
          {playing ? (
            embed ? (
              <iframe
                src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <video src={src} poster={poster || undefined} controls autoPlay playsInline className="absolute inset-0 h-full w-full" />
            )
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="پخش ویدیو معرفی"
              className="group absolute inset-0 grid place-items-center"
              style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              {!poster && <span className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] via-[#db2777] to-[#ff9f43] opacity-80" />}
              <span className="relative h-20 w-20 rounded-full bg-white/95 text-[#7c3aed] grid place-items-center shadow-2xl group-hover:scale-110 transition">
                <Play className="h-8 w-8 translate-x-[-2px] fill-current" />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
