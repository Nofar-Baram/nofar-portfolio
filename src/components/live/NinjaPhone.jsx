const NinjaPhone = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "2rem 1rem" }}>
    <div style={{
      position: "relative",
      width: "280px",
    }}>
      {}
      <img
        src="/assets/iphone-frame.png"
        alt="iPhone frame"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          position: "relative",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {}
      <div style={{
        position: "absolute",
        top: "4.9%",
        left: "7%",
        right: "8%",
        bottom: "5%",
        transform: "scale(0.97)",
        borderRadius: "40px",
        overflow: "hidden",
        zIndex: 1,
      }}>
        <video
          src="/assets/Ninja.mp4"
          autoPlay loop muted playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  </div>
);

export default NinjaPhone;