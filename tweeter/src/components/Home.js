import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import logo from "./tweeter-big.png";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, NavDropdown } from "react-bootstrap";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  addDoc,
  query,
  where,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import TweetList from "./TweetList";
import { storage } from "../firebase";
import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";

const Home = (tweets) => {
  console.log(tweets);
  const history = useNavigate();
  const tweetRef = useRef();
  const { currentUser, userInfo } = useAuth();
  console.log(userInfo);
  const [imageUpload, setImageUpload] = useState(null);
  tweets = tweets.tweets;
  async function handleTweet(e) {
    e.preventDefault();
    try {
      if (imageUpload == null) {
        let tweetData = {
          authorid: currentUser.uid,
          authorProfile: userInfo.profileImgUrl,
          verified: userInfo.verified,
          username: userInfo.username,
          content: tweetRef.current.value,
          createTime: new Date(),
          image: "",
          likes: [],
        };
        const newTwitRef = await addDoc(collection(db, "tweets"), tweetData);
        console.log("Document written with ID: ", newTwitRef.id);
      } else {
        const imageRef = ref(storage, `tweets/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            console.log("image url", url);
            let tweetData = {
              authorid: currentUser.uid,
              authorProfile: userInfo.profileImgUrl,
              verified: userInfo.verified,
              username: userInfo.username,
              content: tweetRef.current.value,
              createTime: new Date(),
              image: url,
              likes: [],
            };
            const newTwitRef = await addDoc(
              collection(db, "tweets"),
              tweetData
            );
            console.log("Document written with ID: ", newTwitRef.id);
          });
        });
      }
      const timer = setTimeout(() => window.location.reload(), 2000);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function deleteTweet(tweetid) {
    try {
      await deleteDoc(doc(db, "tweets", tweetid));
      console.log("deleted tweet", tweetid);
      window.location.reload();
    } catch (e) {
      console.log("error deleting tweet", e);
    }
  }

  async function likeTweet(tweetid) {
    try {
      const tweetRef = doc(db, "tweets", tweetid);

      // Atomically increment the population of the city by 50.
      await updateDoc(tweetRef, {
        likes: arrayUnion(currentUser.uid),
      });
      console.log("liked tweet", tweetid);
      window.location.reload();
    } catch (e) {
      console.log("error liking tweet", e);
    }
  }

  async function followUser(userid) {
    try {
      const authorRef = doc(db, "profiles", userid);
      const followerRef = doc(db, "profiles", currentUser.uid);

      // Atomically increment the population of the city by 50.
      await updateDoc(authorRef, {
        followers: arrayUnion(currentUser.uid),
      });
      await updateDoc(followerRef, {
        following: arrayUnion(userid),
      });

      await updateDoc();
      console.log(currentUser.uid + "followed User " + userid);
      window.location.reload();
    } catch (e) {
      console.log("error following user", e);
    }
  }

  async function commentTweet(tweetid, comment) {
    try {
      const newCommentRef = await addDoc(collection(db, "comments"), {
        commentorid: currentUser.uid,
        username: userInfo.username,
        tweetid: tweetid,
        content: comment,
        createTime: new Date(),
        likes: [],
      });
      window.location.reload();
      console.log("Tweet comment written with ID: ", newCommentRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div className="HomeScreen">
      <div className="SideBar">
        <div className="homeLogo">
          <img  src={logo} alt="logo" />
        </div>
        <div className="navigation">
          <Link style={{ textDecoration: 'none' }} to="/home" className="home">
            Home
          </Link>
        </div>
        <div className="navigation">
          <Link style={{ textDecoration: 'none' }} to="/profile">Profile</Link>
        </div>
      </div>
      <div className="MainHeader">
        <h1>Home</h1>
        <div className="tweetSomething">
        <label class="TweetSomethingLabel">Post a Tweet!</label>
        <br></br>
        <input className="TweetContent" placeholder="Tweet Something"type="text" ref={tweetRef}></input>
        <input
          type="file"
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
          style={{ width: "50%" }}
        />
        <br></br>
        <button className="pushTweet" onClick={handleTweet}>Tweet</button>
        </div>
      </div>
      <div className="Mainfeed">
        <TweetList
          tweets={tweets}
          likeTweet={likeTweet}
          commentTweet={commentTweet}
          followUser={followUser}
          deleteTweet={deleteTweet}
        ></TweetList>
      </div>
    </div>
  );
};

export default Home;
