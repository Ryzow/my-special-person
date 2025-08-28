"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Heart, Music, Pause, Sparkles, Image as ImageIcon, LockKeyhole, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

/**
 * Romantic Interactive Page
 * Place this file at: app/love/page.tsx
 * Requires: Tailwind CSS, framer-motion, lucide-react, shadcn/ui basics (button, card, dialog, input)
 * Optional: Add images to /public folder and update IMAGE_URLS.
 *
 * Quick setup (if needed):
 *  npm i framer-motion lucide-react
 *  npx shadcn@latest add button card dialog input
 *
 * Personalize these constants:
 */
const PERSON_NAME = "(Dinda)"; // ex: "Lani"
const START_DATE = "2025-08-3"; // first day you fell in love or first met (YYYY-MM-DD)
const LOVE_PERCENT = 999; // show how big your love is
const IMAGE_URLS = [
  "/memory1.jpg", // put your images in /public
  "/memory2.jpg",
  "/memory3.jpg",
];
const BACKGROUND_AUDIO = "/love-song.mp3"; // put your mp3 in /public

/** Utility */
function daysBetween(fromISO: string, to = new Date()) {
  const start = new Date(fromISO + "T00:00:00");
  const diff = Math.floor((to.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}

function useNow(tickMs = 1000) {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);
  return now;
}

function useTypewriter(lines: string[], speed = 50, pauseBetween = 1200) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const full = lines[index % lines.length];
    const step = () => {
      setText((t) => {
        if (!isDeleting) {
          const next = full.slice(0, t.length + 1);
          if (next === full) {
            setTimeout(() => setIsDeleting(true), pauseBetween);
          }
          return next;
        } else {
          const next = full.slice(0, Math.max(0, t.length - 1));
          if (next.length === 0) {
            setIsDeleting(false);
            setIndex((i) => i + 1);
          }
          return next;
        }
      });
    };

    const id = setTimeout(step, isDeleting ? speed / 1.7 : speed);
    return () => clearTimeout(id);
  }, [index, isDeleting, lines, speed, pauseBetween]);

  return text;
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; x: number; size: number; dur: number }[]>([]);
  useEffect(() => {
    const add = () => {
      setHearts((h) => [
        ...h.slice(-40),
        { id: Math.random(), x: Math.random() * 100, size: 12 + Math.random() * 24, dur: 6 + Math.random() * 8 },
      ]);
    };
    const id = setInterval(add, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "-20%", opacity: [0, 1, 0.8, 0] }}
          transition={{ duration: h.dur, ease: "easeOut" }}
          className="absolute"
          style={{ left: `${h.x}%` }}
        >
          <Heart className="drop-shadow" style={{ width: h.size, height: h.size }} />
        </motion.div>
      ))}
    </div>
  );
}

function LoveMeter({ value }: { value: number }) {
  const controls = useAnimation();
  useEffect(() => {
    controls.start({ width: `${Math.min(value, 100)}%` });
  }, [value, controls]);
  return (
    <div className="w-full bg-white/10 rounded-2xl h-6 overflow-hidden backdrop-blur">
      <motion.div
        initial={{ width: 0 }}
        animate={controls}
        className="h-full bg-pink-500/80"
      />
    </div>
  );
}

function RevealImage({ src, alt }: { src: string; alt: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className={`w-full h-56 md:h-72 object-cover rounded-2xl ${revealed ? "filter-none" : "blur-md grayscale"}`}
      />
      {!revealed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button variant="secondary" onClick={() => setRevealed(true)} className="gap-2">
            <ImageIcon className="w-4 h-4" /> Lihat lebih jelas
          </Button>
        </div>
      )}
    </div>
  );
}

export default function LovePage() {
  const now = useNow(1000);
  const days = useMemo(() => daysBetween(START_DATE, now), [now]);
  const [playing, setPlaying] = useState(false);
  const [openSecret, setOpenSecret] = useState(false);
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [playing]);

  const typeText = useTypewriter([
    `Untuk ${PERSON_NAME}…`,
    "Cintaku bukan sekadar angka.",
    "Tapi kalau harus dihitung, angkanya tak terbatas.",
    "Terima kasih sudah jadi rumah untuk diriku ini.",
  ]);

  const percentDisplay = `${LOVE_PERCENT}%`;
  const meterValue = Math.min(LOVE_PERCENT, 100);

  const tryUnlock = () => {
    if (code.trim().toLowerCase() === "kita") {
      setUnlocked(true);
      setOpenSecret(true);
    }
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-rose-950 via-fuchsia-900 to-indigo-950 text-white relative">
      <FloatingHearts />

      <div className="max-w-4xl mx-auto px-4 pt-10 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              <Heart className="w-7 h-7 text-pink-400" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Seberapa Besar Cintaku — untuk {PERSON_NAME}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={playing ? "secondary" : "default"} className="gap-2" onClick={() => setPlaying((p) => !p)}>
              {playing ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" /> Putar Lagu
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Typewriter line */}
        <div className="mt-6">
          <p className="text-lg md:text-xl text-white/90 min-h-[2.5rem]">{typeText}</p>
        </div>

        {/* Meter Card */}
        <Card className="mt-6 bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Love Meter</span>
              </div>
              <span className="text-3xl font-extrabold">{percentDisplay}</span>
            </div>
            <LoveMeter value={meterValue} />
            {LOVE_PERCENT > 100 && (
              <p className="text-sm text-white/80">* Angka di atas 100% karena rasanya memang melebihi logika.</p>
            )}
          </CardContent>
        </Card>

        {/* Days counter */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 space-y-2">
              <p className="text-white/80">Sudah jatuh cinta sejak</p>
              <p className="text-2xl font-bold">{new Date(START_DATE).toLocaleDateString()}</p>
              <p className="text-sm text-white/70">Total hari mencintai: <span className="font-semibold">{days} hari</span></p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 space-y-2">
              <p className="text-white/80">Waktu sekarang</p>
              <p className="text-2xl font-bold">{now.toLocaleString()}</p>
              <p className="text-sm text-white/70">Setiap detik, selalu ada alasan baru untuk bersyukur.</p>
            </CardContent>
          </Card>
        </div>

        {/* Memories */}
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold">Kenangan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {IMAGE_URLS.map((src, i) => (
              <motion.div key={src} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <RevealImage src={src} alt={`Kenangan ${i + 1}`} />
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-white/70">* Klik untuk melihat lebih jelas. Foto buram demi privasi sampai kamu memilih membukanya.</p>
        </div>

        {/* Secret message gate */}
        <div className="mt-12">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {unlocked ? <Unlock className="w-5 h-5" /> : <LockKeyhole className="w-5 h-5" />}
                <span className="font-semibold">Pesan Rahasia</span>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  placeholder="Masukkan kode rahasia (hint: 'kita')"
                  value={code}
                  onChange={(e : any) => setCode(e.target.value)}
                  onKeyDown={(e : any) => e.key === "Enter" && tryUnlock()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button onClick={tryUnlock} disabled={!code} className="md:w-40">Buka</Button>
                <Button variant="secondary" onClick={() => setOpenSecret(true)} className="md:w-40">Intip</Button>
              </div>
              <p className="text-xs text-white/60 mt-2">Kode ini hanya kita yang tahu. Kalau lupa, klik "Intip" untuk melihat pesan umum.</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-white/70 text-sm">
          Dibuat dengan <span className="inline-flex items-center gap-1"><Heart className="w-4 h-4" /> cinta</span> dan sedikit kode.
        </div>
      </div>

      {/* Audio */}
      <audio ref={audioRef} src={BACKGROUND_AUDIO} loop preload="none" />

      {/* Secret dialog */}
      <AnimatePresence>
        {openSecret && (
          <Dialog open={openSecret} onOpenChange={setOpenSecret}>
            <DialogContent className="bg-gradient-to-b from-rose-900 to-indigo-900 text-white border-white/20">
              <DialogHeader>
                <DialogTitle>Untuk {PERSON_NAME}</DialogTitle>
                <DialogDescription className="text-white/80">
                  {unlocked
                    ? "Terima kasih karena pernah jadi tempat pulangku. Mungkin tak lagi bersama, tapi doaku tetap sama: semoga kamu bahagia — bahkan saat bukan denganku."
                    : "Walau tak semua hal bisa kembali, rasa syukurku atas semua momen tetap tinggal. Terima kasih sudah pernah ada."
                  }
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setOpenSecret(false)}>Tutup</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </main>
  );
}
