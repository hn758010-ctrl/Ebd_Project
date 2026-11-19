
function App() {
  return (
    <div>
      <h1 id="project-name">StudySpot</h1>
      <p>Welcome to StudySpot!</p>
      <p>Your space to study, organize, and learn.</p>
    </div>
  );
}

export default App;
import "./App.css";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>StudySpot</h2>

        <div>
          <a href="#home">Home</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <section className="hero" id="home">
        <h1>Welcome to StudySpot!</h1>

        <p>
          Your space to study, organize, and learn.
        </p>

        <button>Get Started</button>
      </section>

      <section className="about" id="about">
        <h2>About StudySpot</h2>

        <p>
          StudySpot helps students organize their
          study activities and improve their learning
          experience.
        </p>
      </section>
    </div>
  );
}

export default App;
