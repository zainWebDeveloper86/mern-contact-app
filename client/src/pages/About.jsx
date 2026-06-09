import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="construction-wrapper">
      <div className="construction-card">
        <h1>🚧 Under Construction</h1>
        <p>
          We're working hard to bring you something amazing.  
          Please check back soon!
        </p>

        <button
          className="home-btn"
          onClick={() => navigate("/")}
        >
          Go Back Home →
        </button>
      </div>
    </div>
  );
};

export default About;
