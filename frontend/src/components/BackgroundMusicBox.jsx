import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react"; // icons

const BackgroundMusicBox = () => {
  const [muted, setMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("/sounds/about-wish-138203.mp3");
  const bgMusicRef = useRef(null);

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

  // Handle changing track
  const handleTrackChange = (e) => {
    const newTrack = e.target.value;
    setCurrentTrack(newTrack);
    if (bgMusicRef.current) {
      bgMusicRef.current.load(); // reload audio with new src
      if (!muted) {
        bgMusicRef.current.play();
      }
    }
  };

  return (
    <div className="p-4 bg-black/70 border-2 border-purple-500 rounded-2xl shadow-lg flex flex-col items-center space-y-3 w-40">
      <h2 className="text-purple-300 font-bold text-sm">Sound</h2>

      {/* Mute/Unmute Button */}
      <button
        onClick={() => setMuted(!muted)}
        className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center shadow-md transition"
      >
        {muted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
      </button>

      {/* Music Icon Button */}
      <button
        className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center shadow-md transition"
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
        className="bg-indigo-700 text-white p-2 rounded-lg shadow-md text-sm w-full z-[100000] relative cursor-pointer"
      >
        {tracks.map((track, index) => (
          <option key={index} value={track.file}>
            {track.name}
          </option>
        ))}
      </select>

      {/* Audio Element */}
      <audio ref={bgMusicRef} src={currentTrack} loop />
    </div>
);
};

export default BackgroundMusicBox;
