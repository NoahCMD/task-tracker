export default function DashboardSidebar({
  currentTime,
  weather,
  newsItems,
  backgroundVideos,
  activeBgIndex,
  showBgDropdown,
  setShowBgDropdown,
  setActiveBgIndex,
  getBackgroundLabel,
}) {
  return (
    <div className="lane left-lane">
      <div className="widget-card greeting-card">
        <span className="live-clock">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <h2 className="greeting-text">Good day, Noah</h2>
        <p className="system-date-text">
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>

      <div className="widget-card weather-card">
        <div className="weather-meta">
          <span className="weather-city">{weather.city}</span>
          <span className="weather-condition">{weather.condition}</span>
        </div>
        <span className="weather-temp">{weather.temp}°C</span>
      </div>

      <div className="widget-card news-card">
        <div className="card-header">
          <h3 className="card-title-text">Latest News</h3>
        </div>

        {newsItems.map((item, idx) => (
          <a key={idx} href={item.url} className="news-item" target="_blank" rel="noopener noreferrer">
            {item.title}
            <span>{item.source}</span>
          </a>
        ))}

        <div className="background-selector">
          <button
            type="button"
            className="bg-dropdown-toggle"
            onClick={() => setShowBgDropdown(prev => !prev)}
          >
            {getBackgroundLabel(backgroundVideos[activeBgIndex])}
            <span className="dropdown-arrow">{showBgDropdown ? '▴' : '▾'}</span>
          </button>
          {showBgDropdown && (
            <div className="bg-dropdown">
              {backgroundVideos.map((path, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`bg-dropdown-item ${idx === activeBgIndex ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveBgIndex(idx);
                    setShowBgDropdown(false);
                  }}
                >
                  {getBackgroundLabel(path)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
