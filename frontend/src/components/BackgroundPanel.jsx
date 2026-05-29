export default function BackgroundVideo({ backgroundVideos, activeBgIndex, videoRef }) {
  return (
    <div className="app-background-video-wrap">
      <video ref={videoRef} className="app-background-video" autoPlay muted loop playsInline>
        <source src={backgroundVideos[activeBgIndex]} type="video/mp4" />
      </video>
    </div>
  );
}
