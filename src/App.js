import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// Flying Cats Component
// Component for cats that randomly pop up in the welcome box corner
function PopupCats() {
  const [currentCat, setCurrentCat] = useState(null);
  
  const popupCats = [
    {
      src: '/images/cat2.png',
      position: { bottom: '-15px', left: '-3px' },
      size: { height: '110%', width: 'auto' }
    },
    {
      src: '/images/cat3.png', 
      position: { bottom: '-12px', left: '-9px' },
      size: { height: '90%', width: 'auto' }
    }
  ];
  
  useEffect(() => {
    const showRandomCat = () => {
      // Random delay between appearances (3-8 seconds)
      const delay = 1000 + Math.random() * 3500;
      
      setTimeout(() => {
        // Pick a random cat
        const randomCatIndex = Math.floor(Math.random() * popupCats.length);
        const randomCat = popupCats[randomCatIndex];
        setCurrentCat(randomCat);
        
        // Show for random duration (2-5 seconds)
        const showDuration = 1000 + Math.random() * 3500;
        
        setTimeout(() => {
          setCurrentCat(null);
          showRandomCat(); // Schedule next appearance
        }, showDuration);
      }, delay);
    };
    
    // Start the cycle
    showRandomCat();
    
    // Cleanup on component unmount
    return () => {
      // Any pending timeouts will be cleaned up by React
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Only render if we have a current cat
  if (!currentCat) return null;
  
  return (
    <img 
      src={currentCat.src}
      alt="Pop-up Cat"
      className="popup-cat"
      style={{
        position: 'absolute',
        bottom: currentCat.position.bottom,
        left: currentCat.position.left,
        width: currentCat.size.width,
        height: currentCat.size.height,
        zIndex: 1001,
      }}
    />
  );
}

// Simple profile page for Apollo
function ApolloProfile() {
  const navigate = useNavigate();
  return (
    <div className="main-content" style={{ position: 'relative' }}>
      <button
        className="button-90s back-btn"
        style={{ position: 'absolute', top: 10, left: 10 }}
        onClick={() => navigate('/')}
      >
        ← Back
      </button>

      <h1 className="glitter-text">aPollo</h1>

      {/* Profile header content without retro-card wrapper */}
      <div style={{ margin: '20px auto', textAlign: 'center' }}>
        <img src="/images/apollo_pfp.jpg" alt="aPollo.jpg" className="apollo-card-pfp" />
        <h3>🌟 demon. chicken. spawn. cat. bingus 🌟</h3>
        <p>Likes: chaos, zoomies, forbidden counters.</p>
      </div>

      <div className="profile-section" style={{ marginTop: 20 }}>
        <h3>Dislikes</h3>
        <ul style={{ paddingLeft: 18 }}>
          <li>Closed doors (also)</li>
          <li>The concept of "no"</li>
        </ul>
      </div>

      <div className="profile-section" style={{ marginTop: 20 }}>
        <h3>About</h3>
        <p>
          Apollo is the resident agent of entropy. When not planning elaborate
          heists on treat caches, he practices runway walks across keyboards and
          window sills. Fearless explorer of cabinets and conqueror of cardboard
          forts, he brings undeniable main-character energy to every room.
        </p>
      </div>
    </div>
  );
}
function FlyingCats() {
  const [cats, setCats] = useState([]);
  const [trailParticles, setTrailParticles] = useState([]);
  
  // Only cat1.png and cat4.png fly around
  const catImages = [
    '/images/cat1.png',
    '/images/cat4.png'
  ];

  useEffect(() => {
    // Create initial cats
    const initialCats = catImages.map((src, index) => ({
      id: index,
      src,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 4, // Random velocity x (-2 to 2)
      vy: (Math.random() - 0.5) * 4, // Random velocity y (-2 to 2)
      rotation: index === 1 ? Math.random() * 90 : 0, // Only cat4.png (index 1 now) gets initial rotation
      rotationSpeed: index === 1 ? (Math.random() > 0.5 ? 1 : -1) * 0.5 : 0, // Only cat4.png rotates
      scale: 0.6 + Math.random() * 0.4 // Random size between 0.6 and 1.0
    }));
    
    setCats(initialCats);

    // Cat movement animation loop (smooth 20 FPS)
    const catAnimationInterval = setInterval(() => {
      setCats(prevCats => 
        prevCats.map(cat => {
          let newX = cat.x + cat.vx;
          let newY = cat.y + cat.vy;
          let newVx = cat.vx;
          let newVy = cat.vy;

          // Bounce off edges (clean bounce, no chaos)
          if (newX <= 0 || newX >= window.innerWidth - 100) {
            newVx = -cat.vx;
            newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - 100) {
            newVy = -cat.vy;
            newY = Math.max(0, Math.min(window.innerHeight - 100, newY));
          }

          // No speed limiting needed since we maintain consistent speeds

          return {
            ...cat,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: cat.id === 1 ? cat.rotation + cat.rotationSpeed : cat.rotation // Only cat4.png (id 1 now) rotates
          };
        })
      );
    }, 50);
    
    // Sparkle animation loop (much more optimized)
    const sparkleAnimationInterval = setInterval(() => {
      setCats(currentCats => {
        // Create very few trail particles for performance
        const newTrailParticles = [];
        currentCats.forEach(cat => {
          // Add 2 particles per cat every frame (doubled again)
          for (let i = 0; i < 3; i++) {
            newTrailParticles.push({
              id: Math.random(),
              x: cat.x + 50 + (Math.random() - 0.5) * 20, // Center of 100px wide cat + spread
              y: cat.y + 50 + (Math.random() - 0.5) * 20, // Center of cat height + spread
              life: 1.0,
              maxLife: 10 + Math.random() * 30,
              size: 2 + Math.random() * 3,
              color: `hsl(0, 0%, ${70 + Math.random() * 30}%)`
            });
          }
        });

        setTrailParticles(prevParticles => {
          // Update existing particles and add new ones
          const updatedParticles = prevParticles
            .map(particle => ({
              ...particle,
              life: particle.life - (1 / particle.maxLife)
            }))
            .filter(particle => particle.life > 0); // Remove dead particles
          
          return [...updatedParticles, ...newTrailParticles];
        });

        return currentCats; // Don't modify cats in sparkle loop
      });
    }, 200); // 5 FPS for sparkles for sparkle creation (performance optimized)

    return () => {
      clearInterval(catAnimationInterval);
      clearInterval(sparkleAnimationInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flying-cats-container">
      {/* Render trail particles behind cats */}
      {trailParticles.map(particle => (
        <div
          key={particle.id}
          className="trail-particle"
          style={{
            position: 'fixed',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.life,
            pointerEvents: 'none',
            zIndex: 999
          }}
        />
      ))}
      
      {/* Render cats */}
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
            pointerEvents: 'none',
            zIndex: 1100, /* Increased to ensure cats fly over button */
            width: '100px',
            height: 'auto',
            filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.5))'
          }}
        />
      ))}
    </div>
  );
}

// Form Submission Component
function TalkToCatsForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // After success, show Meow for 1.75s then redirect home
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/'), 1750);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate message field is required
    if (!formData.message) {
      return; // Do nothing if no message
    }
    // prevent duplicate posts while we are submitting (button stays enabled visually)
    if (submitting) return;
    setSubmitting(true);

    // Real submission to Lambda URL
    fetch('https://jfumnb3gqn2yzfj23fonxed6w40jmoww.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name || '',
        email: formData.email || '',
        message: formData.message
      })
    })
    .then(async (res) => {
      // Best-effort parse; treat non-2xx as failure but still show success per UX simplicity
      try { await res.text(); } catch (_) {}
    })
    .catch((err) => {
      console.error('Form submit error:', err);
      // Intentionally do not block UX on errors per requirements
    })
    .finally(() => {
      setSubmitting(false);
      setSuccess(true);
      // Clear form
      setFormData({ name: '', email: '', message: '' });
    });
  };

  return (
    <div className="form-container">
      {success ? (
        <h2 className="meow-message">Meow!</h2>
      ) : (
        <>
          <h2 className="form-title glitter-text">Talk to Cats</h2>
          <div className="retro-form">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">name (optional):</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">email (optional):</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message for Cats:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="button-90s submit-btn"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
                <button 
                  type="button" 
                  className="button-90s back-btn"
                  onClick={() => navigate('/')}
                >
                  Go Back
                </button>
              </div>
            </form>
          </div>
          
          <div className="cat-corner">
            <img src="/images/cat3.png" alt="Cat listening" className="center-cat" />
          </div>
        </>
      )}
    </div>
  );
}

// Simple profile page for Aphaea
function AphaeaProfile() {
  const navigate = useNavigate();
  return (
    <div className="main-content" style={{ position: 'relative' }}>
      <button
        className="button-90s back-btn"
        style={{ position: 'absolute', top: 10, left: 10 }}
        onClick={() => navigate('/')}
      >
        ← Back
      </button>

      <h1 className="glitter-text">Aphaea</h1>

      {/* Profile header content without retro-card wrapper */}
      <div style={{ margin: '20px auto', textAlign: 'center' }}>
        <img src="/images/aphaea_pfp.jpg" alt="Aphaea.jpg" className="card-pfp" />
        <h3>✨ pwincess ✨</h3>
        <p>Likes: sunbeams, snacks, naps.</p>
      </div>

      <div className="profile-section" style={{ marginTop: 20 }}>
        <h3>Dislikes</h3>
        <ul style={{ paddingLeft: 18 }}>
          <li>Closed doors</li>
          <li>Empty food bowls</li>
          <li>Loud vacuum monsters</li>
        </ul>
      </div>

      <div className="profile-section" style={{ marginTop: 20 }}>
        <h3>About</h3>
        <p>
          Aphaea is a certified pwincess with a strict daily schedule: greet the morning
          sunbeam, inspect the snack cabinet, and supervise all keyboard activity. When not
          posing for glamour shots, she can be found patrolling comfy blankets, conducting
          advanced purr therapy, and reminding humans of the correct snack-to-pet ratio.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const hasCalledApi = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch visitor count from the API - prevent double calls
  useEffect(() => {
    // Skip if we've already called the API
    if (hasCalledApi.current) return;
    
    const fetchVisitorCount = async () => {
      setIsLoadingCount(true);
      try {
        // Set flag before making API call to prevent duplicates
        hasCalledApi.current = true;
        
        const response = await fetch('https://lh2vv3uioi2cslc4upbynarrlm0oqwtj.lambda-url.us-east-1.on.aws/');
        if (!response.ok) {
          throw new Error('Failed to fetch visitor count');
        }
        const data = await response.json();
        // If the real count is less than 1000, display 1018 instead
        setVisitorCount(data.count < 1000 ? 1018 : data.count);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
        setVisitorCount(1337); // Fallback count in case of error
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchVisitorCount();
  }, []);
  
  // Update time every second
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
      {location.pathname !== '/sayhi' && (
        <div className="corner-nav">
          <Link to="/sayhi" className="talk-cats-link">talk to cats</Link>
        </div>
      )}
      <Routes>
        <Route path="/sayhi" element={<TalkToCatsForm />} />
        <Route path="/aphaea" element={<AphaeaProfile />} />
        <Route path="/apollo" element={<ApolloProfile />} />
        <Route path="/" element={
          <div className="main-content">
          <h1 className="glitter-text">cats</h1>
          <p className="subtitle">Welcome to cats.com, a radical new way to internet, for cats by cats</p>
          
          <div className="marquee">
            <div className="marquee-text">
              ★ ☆ ★ meow ★ ☆ ★ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; meow. meow
            </div>
          </div>

          <div className="welcome-box" style={{ position: 'relative' }}>
            <PopupCats />
            <p>🌟 Hi, I'm <span className="blink">Aphaea</span> and I'm Apol<span className="blink">lo</span> and together we are a<sup>3</sup>! 🌟</p>
            <p> We're so glad that you decided to come hang out with us today </p>
            <p> Take a look around and check out how cute we are! </p>
          </div>

          <div className="retro-grid">
            <div className="retro-card">
              <img src="/images/aphaea_pfp.jpg" alt="Aphaea.jpg" className="card-pfp" />
              <h3>Aphaea</h3>
              <p>✨ pwincess ✨</p>
              <button className="button-90s" onClick={() => navigate('/aphaea')}>Click Me!</button>
            </div>
            
            <div className="retro-card">
              <img src="/images/apollo_pfp.jpg" alt="aPollo.jpg" className="apollo-card-pfp" />
              <h3>aPollo</h3>
              <p>🌟 demon. chicken. spawn. cat. bingus 🌟</p>
              <button className="button-90s" onClick={() => navigate('/apollo')}>Explore</button>
            </div>
          </div>

          <div className="pixel-border">
            <h3>🎵 Now Playing: Darude - Sandstorm 🎵</h3>
            <p>Turn up your speakers for the full experience!</p>
          </div>

          <div className="under-construction">
            🚧 This site is under construction! 🚧
            <br />
            Please excuse the mess while the cats are blogging and sleeping!
          </div>

          <div className="visitor-counter">
            {isLoadingCount ? (
              <span className="blink">Loading visitor count...</span>
            ) : (
              <>You are visitor #{visitorCount.toLocaleString()}</>
            )}
            <br />
            Current time: {currentTime.toLocaleTimeString()}
          </div>

          <p style={{fontSize: '12px', color: '#666'}}>
            Best viewed with Internet Explorer 4.0+ | 
            <span className="blink">NEW!</span> JavaScript enabled | 
            Made with ❤️ and HTML
          </p>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
