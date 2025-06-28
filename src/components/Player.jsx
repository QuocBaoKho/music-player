import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const Player = ({ currentSong, onNext, onPrevious }) => {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0); // Tiến trình bài hát (0-100%)
  const [duration, setDuration] = useState(0); // Tổng thời lượng bài hát
  // Thêm một state để lưu trữ ID của bài hát đang được tải trong audioRef
  const [loadedSongId, setLoadedSongId] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (currentSong) {
      if (loadedSongId !== currentSong.id) {
        audio.src = currentSong.src;
        audio.load();
        setProgress(0);
        setLoadedSongId(currentSong.id);
      }

      if (!isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      // Xử lý trường hợp không có bài hát nào được chọn
      audio.pause();
      audio.src = ""; // Xóa src nếu không có bài nào
      setLoadedSongId(null);
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }
  }, [currentSong, isPlaying, loadedSongId]);
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      onNext(); // Tự động chuyển bài khi kết thúc
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onNext, onPrevious]); // Chỉ chạy lại khi onNext thay đổi

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    const audio = audioRef.current;
    audio.currentTime = (newProgress / 100) * audio.duration;
    setProgress(newProgress);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <div className="bg-[#538860] p-4 rounded-lg shadow-lg text-white flex flex-col items-center">
      {currentSong ? (
        <>
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-32 h-32 object-cover rounded-full mb-4 shadow-md"
          />
          <h3 className="text-xl font-semibold mb-1">{currentSong.title}</h3>
          <p className="text-gray-400 mb-4">{currentSong.artist}</p>

          <div className="w-full flex items-center mb-2">
            <span className="text-sm text-gray-400 mr-2">
              {formatTime((progress / 100) * duration)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-400 ml-2">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-4">
            <button
              onClick={onPrevious}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6 text-white rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832L14 10l-4.445-2.832z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={togglePlayPause}
              className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? (
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832L14 10l-4.445-2.832z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              )}
            </button>

            <button
              onClick={onNext}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832L14 10l-4.445-2.832z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center w-full max-w-xs">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.381 8.006A3 3 0 0112 5.004V3.5a1.5 1.5 0 013 0v11a1.5 1.5 0 01-3 0V15a3 3 0 01-2.619-2.994c-.95.05-1.785-.473-2.317-1.39l-2.664-4.815A1 1 0 003 5.922V10a1 1 0 102 0V7.078c.026.06.052.12.078.18l2.664 4.815c.532.917 1.367 1.439 2.317 1.39z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      ) : (
        <p className="text-gray-400">Chọn một bài hát để phát</p>
      )}
    </div>
  );
};
export default Player;
