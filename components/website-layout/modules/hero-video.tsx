export const HeroVideo = ({ content }: { content: Record<string, any> }) => {
  
  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        src={content.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
      />
      <div
        className="relative z-10 text-center p-8 max-w-2xl"
        style={{ color: content.textColor || "#ffffff" }}
      >
        <h1 className="text-4xl font-bold mb-4">
          {content.title || "Immersive Video"}
        </h1>
        <p className="text-lg opacity-80 mb-8">
          {content.description ||
            "Engage your audience with a powerful video background."}
        </p>
        
        {/* CTA Buttons */}
        {content.buttons && content.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {content.buttons.map((button: any, index: number) => (
              <a
                key={index}
                href={button.link || "#"}
                className={
                  button.variant === "primary"
                    ? "px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg text-center"
                    : button.variant === "secondary"
                    ? "px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-all shadow-lg text-center"
                    : button.variant === "outline"
                    ? "px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-black transition-all text-center"
                    : "px-8 py-3 text-white rounded-full font-bold hover:bg-white/10 transition-all text-center"
                }
              >
                {button.text || "Button"}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
