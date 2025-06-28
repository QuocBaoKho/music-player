const SongList = ({ songs, onSelectSong, currentSongId }) => {
  return (
    <div className="bg-[#538860] p-4 rounded-lg shadow-lg text-white max-h-96 overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold mb-4">Danh sách bài hát</h2>
      <ul>
        {songs.map((song) => (
          <li
            key={song.id}
            onClick={() => onSelectSong(song)}
            className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
              currentSongId === song.id ? "bg-[#416b4b]" : "hover:bg-[#416b4b]"
            }`}
          >
            <img
              src={song.cover}
              alt={song.title}
              className="w-12 h-12 object-cover rounded-md mr-3"
            />
            <div>
              <p className="font-semibold text-lg">{song.title}</p>
              <p className="text-gray-400 text-sm">{song.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
