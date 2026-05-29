export default function NewsWidget({
  newsItems,
  backgroundVideos,
  activeBgIndex,
  showBgDropdown,
  setShowBgDropdown,
  setActiveBgIndex,
  getBackgroundLabel,
}) {
  return (
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
  );
}
