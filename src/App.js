import './App.css';
import { useState, useEffect } from 'react';

// Flying Cats Component
function FlyingCats() {
  const [cats, setCats] = useState([]);
  
  // Define cat images outside of useEffect to avoid dependency issues
  const catImages = [
    '/images/cat1.png',
    '/images/cat2.png',
    '/images/cat3.png',
    '/images/cat4.png'
  ];

  useEffect(() => {
    // Create initial cats
    const initialCats = catImages.map((src, index) => ({
      id: index,
      src,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 4, // Random velocity x
      vy: (Math.random() - 0.5) * 4, // Random velocity y
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      scale: 0.3 + Math.random() * 0.4, // Random size between 0.3 and 0.7
      opacity: 0.7 + Math.random() * 0.3
    }));
    
    setCats(initialCats);

    // Animation loop
    const animationInterval = setInterval(() => {
      setCats(prevCats => 
        prevCats.map(cat => {
          let newX = cat.x + cat.vx;
          let newY = cat.y + cat.vy;
          let newVx = cat.vx;
          let newVy = cat.vy;

          // Bounce off edges with some chaos
          if (newX <= 0 || newX >= window.innerWidth - 100) {
            newVx = -cat.vx + (Math.random() - 0.5) * 2;
            newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - 100) {
            newVy = -cat.vy + (Math.random() - 0.5) * 2;
            newY = Math.max(0, Math.min(window.innerHeight - 100, newY));
          }

          // Add random direction changes for chaos
          if (Math.random() < 0.02) {
            newVx += (Math.random() - 0.5) * 3;
            newVy += (Math.random() - 0.5) * 3;
          }

          // Limit speed
          const maxSpeed = 6;
          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (speed > maxSpeed) {
            newVx = (newVx / speed) * maxSpeed;
            newVy = (newVy / speed) * maxSpeed;
          }

          return {
            ...cat,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: cat.rotation + cat.rotationSpeed
          };
        })
      );
    }, 50); // 20 FPS

    return () => clearInterval(animationInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flying-cats-container">
      {cats.map(cat => (
        <img
          key={cat.id}
          src={cat.src}
          alt="Flying cat"
          className="flying-cat"
          style={{
            position: 'fixed',
            left: `${cat.x}px`,
            top: `${cat.y}px`,
            transform: `rotate(${cat.rotation}deg) scale(${cat.scale})`,
            opacity: cat.opacity,
            pointerEvents: 'none',
            zIndex: 1000,
            width: '100px',
            height: 'auto',
            filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.5))'
          }}
        />
      ))}
    </div>
  );
}

function App() {
  const [visitorCount, setVisitorCount] = useState(1337);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setVisitorCount(prev => prev + 1);
  };

  return (
    <div className="App">
      <FlyingCats />
      <div className="main-content">
        <h1 className="glitter-text">cats</h1>
        <p className="subtitle">Welcome to the Radical 90s Web Experience!</p>
        
        <div className="marquee">
          <div className="marquee-text">
            ★ ☆ ★ meow ★ ☆ ★ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; meow
          </div>
        </div>

        <div className="welcome-box">
          <p>🌟 Welcome to my totally awesome homepage! 🌟</p>
          <p>This site is <span className="blink">OPTIMIZED</span> for 800x600 resolution!</p>
        </div>

        <div className="retro-grid">
          <div className="retro-card">
            <img src="/images/aphaea_pfp.JPG" alt="Aphaea" className="card-pfp" />
            <h3>Aphaea</h3>
            <p>✨ pwincess ✨</p>
            <button className="button-90s" onClick={handleClick}>Click Here!</button>
          </div>
          
          <div className="retro-card">
            <img src="/images/apollo_pfp.JPG" alt="aPollo" className="apollo-card-pfp" />
            <h3>aPollo</h3>
            <p>🌟 demon. chicken. spawn. cat 🌟</p>
            <button className="button-90s">Explore</button>
          </div>
        </div>

        <div className="pixel-border">
          <h3>🎵 Now Playing: Darude - Sandstorm 🎵</h3>
          <p>Turn up your speakers for the full experience!</p>
        </div>

        <div className="under-construction">
          🚧 This site is under construction! 🚧
          <br />
          Please excuse the mess while I add more cool stuff!
        </div>

        <div className="visitor-counter">
          You are visitor #{visitorCount.toLocaleString()}
          <br />
          Current time: {currentTime.toLocaleTimeString()}
        </div>

        <p style={{fontSize: '12px', color: '#666'}}>
          Best viewed with Internet Explorer 4.0+ | 
          <span className="blink">NEW!</span> JavaScript enabled | 
          Made with ❤️ and HTML
        </p>
      </div>
    </div>
  );
}

export default App;
