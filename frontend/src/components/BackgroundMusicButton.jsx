import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react"; // icons (install: npm i lucide-react)

const BackgroundMusicButton = () => {
  const [muted, setMuted] = useState(false);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.3;
      if (!muted) {
        bgMusicRef.current.play().catch(() => {
          console.log("Autoplay blocked, waiting for user action.");
        });
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [muted]);

  return (
    <div className="p-4 bg-black/70 border-2 border-purple-500 rounded-2xl shadow-lg flex flex-col items-center space-y-3 w-28">

      <h2 className="text-purple-300 font-bold text-sm">Sound</h2>

      <button
        onClick={() => setMuted(!muted)}
        className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center shadow-md transition"
      >
        {muted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
      </button>

      <button className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center shadow-md transition">
        <Music size={24} color="white" />
      </button>

      <audio ref={bgMusicRef} src="/sounds/BackgroundMusic.mp3" loop />
    </div>
  );
};

export default BackgroundMusicButton;
