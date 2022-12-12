import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import logo from "./tweeter-big.png";
import { getDocs, collection, addDoc, query, where} from "firebase/firestore";
import {db} from "../firebase";

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { signup, currentUser, loadUserInfo, createUser} = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useNavigate();

//   async function createUser(userid, userEmail){
//     try {
//     const newUserRef = await addDoc(collection(db, "profiles"), {
//        userid: userid,
//        username: userEmail,
//        bio: "Nothing yet",
//        followers: [],
//        following: [],
//        profileImgUrl: ""
//     });
//     console.log("Document written with ID: ", newUserRef.id);
//     } catch (e) {
//     console.error("Error adding document: ", e);
//     }
//   }

//   async function loadUser(userid){
//     const q = query(collection(db, "profiles"), where("userid", "==", userid));
//     const querySnapshot = await getDocs(q);
//     console.log(querySnapshot);

//     setUserInfo(querySnapshot[0]);
//     return querySnapshot[0];
//   }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError("")
      setLoading(true)
      let res = await signup(emailRef.current.value, passwordRef.current.value);
      await createUser(res.user.uid, res.user.email);
    //   await loadUserInfo(res.user.uid);
      history("/home")
    } catch(error){
      setError("error" + error);
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <div className="logo">
          <img src={logo} alt="tweeter-logo" />
        </div>
        <Card.Body>
          <h2 className="text-center mb-4">Create Account</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit" style={{marginTop : '15px'}}>
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link style={{fontSize: '15px'}} to="/">Log In</Link>
      </div>
    </>
  )
}