import React, { useRef, useState, useEffect} from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth} from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { doc, updateDoc } from "firebase/firestore";
import {db} from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";




export default function UpdateProfile() {
  const usernameRef = useRef()
  const passwordRef = useRef()
  let userInfo = JSON.parse(localStorage.getItem("currentUserInfo"));
  const [imageUpload, setImageUpload] = useState(null);
  const [previewImage, setPreviewImage] = useState(userInfo.profileImgUrl);
  const [imageUrl, setImageUrl] = useState();
  const { currentUser, updatePassword } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useNavigate()
  

  function handleSubmit(e) {
    e.preventDefault()
    const promises = []
    setLoading(true)
    setError("")

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        let updatedUsername = usernameRef.current.value;
        console.log(updatedUsername)
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
            const userRef = doc(db, "profiles", currentUser.uid);
            await updateDoc(userRef, {
                username: updatedUsername,
                profileImgUrl: url
            });
        });
        });
        history("/profile")
      })
      .catch((e) => {
        setError("Failed to update account" + e)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                ref={usernameRef}
                required
                defaultValue={userInfo.username}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep same"
              />
            </Form.Group>
            <div style={{textAlign:"center"}}>
                <p>Current Profile Picture</p>
                <img src={previewImage} style = {{height: "100px", width:"100px"}}></img>
                <input
                    type="file"
                    onChange={(event) => {
                        setImageUpload(event.target.files[0]);
                        setPreviewImage(URL.createObjectURL(event.target.files[0]));
                    }}
                />
            </div>
            <Button disabled={loading} className="w-100" style={{marginTop: "20px"}} type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/profile">Cancel</Link>
      </div>
    </>
  )
}