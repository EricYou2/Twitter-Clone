import React, { useState, useRef, useEffect} from "react";
import { Form, Button, Card, Alert } from "react-bootstrap"
import {useAuth} from "../contexts/AuthContext"
import CommentList from "./CommentList"
import logo from "./tweeter-big.png";
import { getDoc, getDocs, collection, addDoc, query, where, doc, onSnapshot, updateDoc, arrayUnion} from "firebase/firestore";
import {db} from "../firebase";
import { format } from "date-fns";




export default function Tweet({ tweet, likeTweet, commentTweet, followUser, deleteTweet }) {
    const { currentUser, userInfo } = useAuth() 

  let q = query(collection(db, "comments"), where("tweetid", "==", tweet.id));
  let authorData = JSON.parse(localStorage.getItem(tweet.authorid + "Data"));
  console.log("bye", authorData);
//   const [authorData, setAuthorData] = useState();
  
// function getAuthorData(id){
//     getDoc(doc(db, "profiles", id)).then(res=>{
//         setAuthorData(res.data());
//     })
//   }

//   getAuthorData(tweet.authorid);
  
  let formattedTime = format(tweet.createTime.seconds, "MMMM do, yyyy H:mma");

let commentRef = useRef();
  function handleLikeTweet(e){
    likeTweet(tweet.id)
  }
  function handlecommentTweet(e){
    commentTweet(tweet.id, commentRef.current.value)
  }
  function handleFollow(e){
    followUser(tweet.authorid);
  }

  function handleDeleteTweet(e){
    deleteTweet(tweet.id);
  }


  useEffect(() => {
      const unsuscribe = onSnapshot(q, (querySnapshot) => {
        let allComments = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data()
          data.id = doc.id
          allComments.push(data);
        });
        localStorage.setItem("comment" + tweet.id, "");
        localStorage.setItem("comment" + tweet.id, JSON.stringify(allComments));
        console.log(allComments);
        return unsuscribe;
      })
    }, []);
  

if(tweet.image != null && tweet.image != ""){
  return (
    <div>
    <div>
        <img src={authorData.profileImgUrl} style = {{height: "20px", width:"20px"}}></img>
        <p>User: {authorData.username}</p>
        <div hidden={!authorData.verified}>
            <img src={logo} alt="logo" style = {{height: "20px", width:"20px"}} />
            <p>Verified</p>
        </div>
        
        <div hidden={authorData.verified}>
            <p>Not Verified</p>
        </div>
        <button onClick={handleFollow}>Follow</button>
        <p>Time Posted: {formattedTime}</p>
    </div>
    <button hidden={tweet.authorid != currentUser.uid} onClick={handleDeleteTweet}>Delete Tweet</button>
      <h3>
        {tweet.content}
      </h3>
      <br></br>
      <img src={tweet.image} style={{width: "50%", height: "auto"}}></img>
      <br></br>
      <div></div>
      <label>Comment:</label>
      <input type="text" ref={commentRef} placeholder="Comment something nice"></input>
      <button onClick={handlecommentTweet}>Comment</button>
      <br />
      <label>{tweet.likes.length} Likes</label>
      <button onClick={handleLikeTweet}>Like</button>
    <br/>
    <p>Current Comments</p>
    <CommentList comments={JSON.parse(localStorage.getItem("comment" + tweet.id))}></CommentList>
    </div>
  )
}else{
    return(
  <div>
    <div>
        <img src={authorData.profileImgUrl} style = {{height: "20px", width:"20px"}}></img>
        <p>User: {authorData.username}</p>
        <div hidden={!authorData.verified}>
            <img src={logo} alt="logo" style = {{height: "20px", width:"20px"}} />
            <p>Verified</p>
        </div>
        
        <div hidden={authorData.verified}>
            <p>Not Verified</p>
        </div>
        <button onClick={handleFollow}>Follow</button>
        <p>Time Posted: {formattedTime}</p>
    </div>
    <button hidden={tweet.authorid != currentUser.uid} onClick={handleDeleteTweet}>Delete Tweet</button>
      <br></br>
      <h3>
        {tweet.content}
      </h3>
      <div></div>
      <label>Comment:</label>
      <input type="text" ref={commentRef} placeholder="Comment something nice"></input>
      <button onClick={handlecommentTweet}>Comment</button>
      <br />
      <label>{tweet.likes.length} Likes</label>
      <button onClick={handleLikeTweet}>Like</button>
    <br/>
    <p>Current Comments</p>
    <CommentList comments={JSON.parse(localStorage.getItem("comment" + tweet.id))}></CommentList>
</div> 
    )

}
}