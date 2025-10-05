import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

// Accent colors by module
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
  }
};

const BackgroundMusicBox = ({ moduleName = "CVModule" }) => {
  const [muted, setMuted] = useState(true);
  const [currentTrack, setCurrentTrack] = useState("/sounds/about-wish-138203.mp3");
  const bgMusicRef = useRef(null);

  const colors = moduleColors[moduleName] || moduleColors.CVModule;

  // ✅ Full list of available music tracks
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
        bgMusicRef.current.play().catch(() => {
          console.log("Autoplay blocked, waiting for user action.");
        });
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

  return (
    <div
      className={`p-4 bg-black/70 border-2 rounded-2xl shadow-lg flex flex-col items-center space-y-3 w-40 ${colors.border}`}
    >
      <h2 className={`font-bold text-sm ${colors.text}`}>Sound</h2>

      {/* Mute/Unmute */}
      <button
        onClick={() => setMuted(!muted)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${colors.bgMain}`}
      >
        {muted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
      </button>

      {/* Restart Track */}
      <button
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${colors.bgAlt}`}
        onClick={() => {
          if (bgMusicRef.current) {
            bgMusicRef.current.currentTime = 0;
            bgMusicRef.current.play();
          }
        }}
      >
        <Music size={24} color="white" />
      </button>

      {/* Track Selector */}
      <select
        value={currentTrack}
        onChange={handleTrackChange}
        className={`${colors.select} text-white p-2 rounded-lg shadow-md text-sm w-full z-[100000] relative cursor-pointer`}
      >
        {tracks.map((track, index) => (
          <option key={index} value={track.file}>
            {track.name}
          </option>
        ))}
      </select>

      {/* Audio */}
      <audio ref={bgMusicRef} src={currentTrack} loop />
    </div>
  );
};

export default BackgroundMusicBox;
