import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { Container } from "react-bootstrap"
import {db, db2} from "./firebase";
import { HashRouter as Router, Route, Routes} from "react-router-dom";
import { getDoc, getDocs, collection, addDoc, query, where, doc, onSnapshot, updateDoc, arrayUnion} from "firebase/firestore";


import Home from "./components/Home";
import Login from "./components/LogIn";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Tweeted from "./components/Tweeted";
import Liked from "./components/Liked";
import Following from "./components/Following";
import { AuthProvider } from "./contexts/AuthContext"
import UpdateProfile from "./components/UpdateProfile";




function App() {
  const [tweets, setTweets] = useState([])


  let q = query(collection(db, "tweets"), where("content", "!=", ""));


  function getAuthorData(id){
    getDoc(doc(db, "profiles", id)).then(res=>{
      let data = res.data();
      localStorage.setItem(id + "Data", JSON.stringify(data));
    })
  }

  useEffect(() => {
      // const query = db2.collection('tweets').where('content', '!=', '');
      // const observer = query.onSnapshot(querySnapshot => {
      //     const data = querySnapshot.docs.map(doc => doc.data()); 
      //     setTweets(data);
      // }, err => {
      //   console.log(`Encountered error: ${err}`);
      // });
      // db2.collection('tweets').get().then(res=>{
      //   const data = res.docs.map(doc => doc.data());
      //   console.log(data);
      //   setTweets(data);
      // })



      const unsuscribe = onSnapshot(q, (querySnapshot) => {
        let allTweets = [];
        querySnapshot.forEach((doc) =>{
          let data = doc.data()
          data.id = doc.id
          getAuthorData(data.authorid);
          allTweets.push(data);
        });
        // console.log("setTweets", tweets);
        localStorage.setItem("tweets", "");
        localStorage.setItem("tweets", JSON.stringify(allTweets));
        return unsuscribe;
      
      })
    }, []);


  return (
    <Container
      // className="d-flex align-items-center justify-content-center"
      // style={{ minHeight: "100vh" }}
    >
      {/* <div className="w-100" style={{ maxWidth: "400px" }}> */}
        <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element = {<Login />}/>
            <Route path="/signup" element = {<Signup />}/>
            <Route path="/updateProfile" element = {<UpdateProfile />}/>
            <Route path="/home" element={<Home tweets = {JSON.parse(localStorage.getItem("tweets"))}/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/tweeted" element={<Tweeted />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="/following" element={<Following />} />
          </Routes>
      </AuthProvider>
      </Router>
    </div>
    </Container>
  );
}

export default App;
