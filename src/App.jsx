import { useState, useEffect, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
import Player from "./components/Player";
import SongList from "./components/SongList";
import songsData from "./utils/song"; // Import danh sách bài hát

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(songsData[0]); // Bài hát hiện tại

  useEffect(() => {
    setCurrentSong(songsData[currentSongIndex]);
  }, [currentSongIndex]);

  const handleSelectSong = useCallback(
    (song) => {
      const index = songsData.findIndex((s) => s.id === song.id);
      setCurrentSongIndex(index);
    },
    [songsData.length]
  );

  const handleNextSong = useCallback(() => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songsData.length);
  }, [songsData.length]); // Sử dụng useCallback để tránh re-render không cần thiết

  const handlePrevSong = useCallback(() => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex - 1 < 0 ? songsData.length - 1 : prevIndex - 1
    );
  }, [songsData.length]); // Sử dụng useCallback

  return (
    <div className="min-h-screen bg-[#46bb84] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">
        Ứng dụng Chơi Nhạc Online
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="md:col-span-1">
          <Player
            currentSong={currentSong}
            onNext={handleNextSong}
            onPrevious={handlePrevSong}
          />
        </div>
        <div className="md:col-span-1">
          <SongList
            songs={songsData}
            onSelectSong={handleSelectSong}
            currentSongId={currentSong ? currentSong.id : null}
          />
        </div>
      </div>

      <p className="mt-8 text-white text-sm">
        Được phát triển bởi sinh viên Nguyễn Hoàng Quốc Bảo
      </p>
    </div>
  );
}

export default App;
