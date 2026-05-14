const LaptopFrame = ({ src }) => (
  <div className="laptop-frame-wrap">
    <div className="laptop-frame">
      <div className="laptop-frame-lid">
        <div className="laptop-frame-cam" />
        <div className="laptop-frame-screen">
          <video src={src} autoPlay loop muted playsInline controls />
        </div>
      </div>
      <div className="laptop-frame-base">
        <div className="laptop-frame-notch" />
      </div>
    </div>
  </div>
);

export default LaptopFrame;
