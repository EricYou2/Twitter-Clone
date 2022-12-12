import React, { useState, useRef, useEffect} from "react";
import { Form, Button, Card, Alert } from "react-bootstrap"
import {useAuth} from "../contexts/AuthContext"

export default function Comment({ comment }) {
    let commentorData = JSON.parse(localStorage.getItem(comment.commentorid + "Data"));
    console.log("stupid", commentorData);
  return (
    <div>
        <img src={commentorData.profileImgUrl} style={{width: "30px", height: "30px"}}></img>
    <p>User: {commentorData.username}</p>
    <br />
      <h5>{comment.content}</h5>
      <br />
    </div>
  )
}