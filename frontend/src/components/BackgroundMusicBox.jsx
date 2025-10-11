import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

const moduleColors = {
  CVModule: {
    border: "border-purple-500",
    bgMain: "bg-purple-600 hover:bg-purple-500",
    bgAlt: "bg-indigo-600 hover:bg-indigo-500",
    text: "text-purple-300",
    select: "bg-indigo-500"
  },
  InterviewModule: {
    border: "border-green-500",
    bgMain: "bg-green-600 hover:bg-green-500",
    bgAlt: "bg-emerald-600 hover:bg-emerald-500",
    text: "text-green-300",
    select: "bg-emerald-500"
  },
  NetworkingModule: {
    border: "border-yellow-500",
    bgMain: "bg-yellow-500 hover:bg-yellow-400",
    bgAlt: "bg-amber-600 hover:bg-amber-500",
    text: "text-yellow-300",
    select: "bg-amber-500"
  },
  Journal: {
    border: "border-blue-500",
    bgMain: "bg-blue-500 hover:bg-blue-400",
    bgAlt: "bg-blue-600 hover:bg-blue-500",
    text: "text-blue-300",
    select: "bg-blue-500"
  }
};

const BackgroundMusicBox = ({ moduleName = "CVModule" }) => {
  const [muted, setMuted] = useState(true);
  const [currentTrack, setCurrentTrack] = useState("/sounds/about-wish-138203.mp3");
  const bgMusicRef = useRef(null);
  const boxRef = useRef(null);

  const colors = moduleColors[moduleName] || moduleColors.CVModule;

  const tracks = [
    {
      name: "Kids Game Gaming Background",
      file: "/sounds/kids-game-gaming-background-music-295075.mp3"
    },
    { name: "1010 Secrets", file: "/sounds/1010-secrets-138202.mp3" },
    { name: "About Wish", file: "/sounds/about-wish-138203.mp3" },
    {
      name: "80s Joyful Electronic Pop Anime",
      file: "/sounds/80s-joyful-electronic-pop-anime-video-game-music-groovy-dance-201383.mp3"
    },
    { name: "A Phonk House", file: "/sounds/a-phonk-house-122654.mp3" },
    { name: "Calm Beats for Gaming", file: "/sounds/calm-beats-for-gaming-323456.mp3" },
    { name: "Cherry Bomb", file: "/sounds/cherry-bomb-159465.mp3" },
    { name: "Chill Gaming Session", file: "/sounds/chill-gaming-session-323463.mp3" },
    { name: "Crystal Skies", file: "/sounds/crystal-skies-170913.mp3" },
    { name: "Energetic Pop 5", file: "/sounds/energetic-pop-5-133326.mp3" },
    { name: "Energetic Pop 6", file: "/sounds/energetic-pop-6-133327.mp3" },
    { name: "Energetic Pop Fun 3", file: "/sounds/energetic-pop-fun-3-133324.mp3" },
    {
      name: "Pokemon Ruby Sapphire Lofi",
      file: "/sounds/feora-vgm-yume-surf-theme-pokemon-ruby-amp-sapphire-lofi-410586.mp3"
    },
    { name: "Think of Backseat Kiss", file: "/sounds/think-of-backseat-kiss-138206.mp3" }
  ];

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.3;
      if (!muted) {
        bgMusicRef.current.play().catch(() => console.log("Autoplay blocked"));
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [muted, currentTrack]);

  const handleTrackChange = (e) => {
    const newTrack = e.target.value;
    setCurrentTrack(newTrack);
    if (bgMusicRef.current) {
      bgMusicRef.current.load();
      if (!muted) bgMusicRef.current.play();
    }
  };

  // Draggable Logic
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 200, y: 80 });
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const boxWidth = boxRef.current.offsetWidth;
      const boxHeight = boxRef.current.offsetHeight;

      const newX = Math.min(
        Math.max(e.clientX - dragOffset.current.x, 0),
        window.innerWidth - boxWidth
      );
      const newY = Math.min(
        Math.max(e.clientY - dragOffset.current.y, 0),
        window.innerHeight - boxHeight
      );
      setPosition({ x: newX, y: newY });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={boxRef}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move p-4 bg-black/70 border-2 rounded-2xl shadow-lg flex flex-col items-center space-y-3 w-40 ${colors.border} cursor-grab active:cursor-grabbing 
              hover:scale-105 active:scale-95`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 40,
        userSelect: "none"
      }}
    >
      <h2 className={`font-bold text-sm ${colors.text}`}>Sound</h2>

      <button
        onClick={() => setMuted(!muted)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${colors.bgMain}`}
      >
        {muted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
      </button>

      <button
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${colors.bgAlt}`}
        onClick={(e) => {
          e.stopPropagation();
          if (bgMusicRef.current) {
            bgMusicRef.current.currentTime = 0;
            bgMusicRef.current.play();
          }
        }}
      >
        <RotateCcw size={24} color="white" />
      </button>

      <select
        value={currentTrack}
        onChange={handleTrackChange}
        onMouseDown={(e) => e.stopPropagation()} // prevent dragging while interacting
        className={`${colors.select} text-white p-2 rounded-lg shadow-md text-sm w-full cursor-pointer`}
      >
        {tracks.map((track, index) => (
          <option key={index} value={track.file}>
            {track.name}
          </option>
        ))}
      </select>

      <audio ref={bgMusicRef} src={currentTrack} loop />
    </div>
  );
};

export default BackgroundMusicBox;
