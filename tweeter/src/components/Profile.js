import React, {useState} from "react";
import "./Profile.css";
import logo from "./tweeter-big.png";
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import {db} from "../firebase";
import TweetList from "./TweetList";
import { getDocs, collection, addDoc, query, where, doc, onSnapshot, updateDoc, arrayUnion, deleteDoc} from "firebase/firestore";

const Profile = () => {
  const [error, setError] = useState("")
  const { currentUser, logout} = useAuth()
  const allTweets = JSON.parse(localStorage.getItem("tweets"));
  const [filteredTweets, setFilteredTweets] = useState();
  const history = useNavigate();
  let userInfo = JSON.parse(localStorage.getItem("currentUserInfo"));
  async function deleteTweet(tweetid){
    try{
      await deleteDoc(doc(db, "tweets", tweetid));
      console.log("deleted tweet", tweetid)
      window.location.reload();
    }catch(e){
      console.log("error deleting tweet", e)
    }
  }


  async function likeTweet(tweetid){
    try{
      const tweetRef = doc(db, "tweets", tweetid);

      // Atomically increment the population of the city by 50.
      await updateDoc(tweetRef, {
          likes: arrayUnion(currentUser.uid)
      });
      console.log("liked tweet", tweetid)
      window.location.reload();
    }catch(e){
      console.log("error liking tweet", e)
    }
  }


  async function followUser(userid){
    try{
      const authorRef = doc(db, "profiles", userid);
      const followerRef = doc(db, "profiles", currentUser.uid);

      // Atomically increment the population of the city by 50.
      await updateDoc(authorRef, {
          followers: arrayUnion(currentUser.uid)
      })
      ;
      await updateDoc(followerRef, {
          following: arrayUnion(userid)
      });

      await updateDoc()
      console.log(currentUser.uid + "followed User " + userid);
      window.location.reload();
    }catch(e){
      console.log("error following user", e)
    }
  }

  async function commentTweet(tweetid, comment){
    try {
    const newCommentRef = await addDoc(collection(db, "comments"), {
       commentorid: currentUser.uid,
       username: userInfo.username,
       tweetid: tweetid,
       content: comment,
       createTime: new Date(),
       likes: []
    });
     window.location.reload(); 
      console.log("Tweet comment written with ID: ", newCommentRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history("/")
    } catch {
      setError("Failed to log out")
    }
  }

  function getTweetedTweets(){
    let fTweets = allTweets.filter(tweet =>
      tweet.authorid == currentUser.uid) 
    setFilteredTweets(fTweets)
  }

  function getLikedTweets(){
    let fTweets = []
    allTweets.forEach((tweet) =>{
      if(tweet.likes.includes(currentUser.uid)){
        fTweets.push(tweet);
      }
    }) 
    setFilteredTweets(fTweets)
  }
  function getFollowingTweets(){
    let following = userInfo.following;
    let fTweets = [];
    allTweets.forEach((tweet) =>{
      if(following.includes(tweet.authorid)){
        fTweets.push(tweet);
      }
    }) 

    setFilteredTweets(fTweets)
  }


  return (
    <div className="ProfilePage">
      <div className="SideBar">
        <div className="profileLogo">
          <img src={logo} alt="logo" />
        </div>
        <div className="welcome">
          <h2>Hello, {userInfo.username}!</h2>
          <img src={userInfo.profileImgUrl} style = {{height: "60px", width:"60px"}}></img>
          <div hidden={!userInfo.verified}>
              <img src={logo} alt="logo" style = {{height: "20px", width:"20px"}} />
              <p>Verified</p>
          </div>
          <div hidden={userInfo.verified}>
              <p>Not Verified</p>
          </div>
        </div>
        <div className="profileNavigation">
          <Link style={{ textDecoration: 'none' }} to="/home">Home</Link>
        </div>
        <div className="profileNavigation forButtons">
          <button onClick={getTweetedTweets}>Tweeted</button>
          <button onClick={getLikedTweets}>Liked</button>
          <br/>
          <button onClick={getFollowingTweets}>Following</button>
          <br/>
          </div>
          <div className="profileNavigation">
          <Link style={{ textDecoration: 'none' }} to="/updateProfile">Edit Profile</Link>
        </div>
        <div className="profileNavigation">
          <Link style={{ textDecoration: 'none' }} onClick={handleLogout}>LogOut</Link>
        </div>
      </div>
      <div className="MainHeader">
        <h1>Profile</h1>
      </div>
      <div className="Mainfeed">
        <TweetList tweets={filteredTweets} likeTweet = {likeTweet} commentTweet = {commentTweet} followUser = {followUser} deleteTweet = { deleteTweet }></TweetList> 
      </div>
    </div>
  );
};

export default Profile;
