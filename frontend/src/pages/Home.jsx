import "./LoginSignupForm.css";

const Home = ({ onLogout }) => {
  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Welcome to Synaptic Care</h2>
        <p className="message-text">
          You are logged in. Explore the app or log out when you are done.
        </p>
        <button className="submit-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;

