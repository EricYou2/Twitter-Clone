import React from "react";
import { Link } from "react-router-dom";
const linkStyle = {

}

const tweeted = () => {
  return (
    <div className="ProfilePage">
      <div className="SideBar">
        <div className="navigation">
        <Link to="/home" style={linkStyle}>Home</Link>
        </div>
        <div className="navigation">
        <Link to="/tweeted" style={linkStyle}>Tweeted</Link>
        </div>
        <div className="navigation">
        <Link to="/liked" style={linkStyle}>Liked</Link>
        </div>
        <div className="navigation">
        <Link to="/following" style={linkStyle}>Following</Link>
        </div>
      </div>
      <div className="Mainfeed">
      Tweeted
      </div>
    </div>
  );
};

export default tweeted;
