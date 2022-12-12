import React, { useState, useRef, useEffect} from "react";
import logo from "./tweeter-big.png";
import "./LogIn.css";
import {useAuth} from "../contexts/AuthContext"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { getDocs, collection, addDoc, query, where} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom"
import {db} from "../firebase";
export default function Login() {
  const [users, setUsers] = useState([]);
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login, currentUser, userInfo, setUserInfo} = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useNavigate()


  async function loadUser(userid){
    const q = query(collection(db, "profiles"), where("userid", "==", userid));
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot);
    return querySnapshot[0];
  }

  async function handleSubmit(e){
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value);
      history("/home");
    } catch {
      setError("Failed to log in")
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
          <h2 className="text-center mb-4">Log In</h2>
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
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link style={{fontSize: '15px'}} to="/signup">Sign Up</Link>
      </div>
    </>
  );
}
