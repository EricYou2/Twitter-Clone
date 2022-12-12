import React, { useContext, useState, useEffect } from "react"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth, db} from "../firebase"
import { getDocs, collection, addDoc, query, where, doc, onSnapshot, setDoc} from "firebase/firestore";
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState()

//   async function loadUserInfo(userid){
//     const q = query(collection(db, "profiles"), where("userid", "==", userid));
//     const querySnapshot = await getDocs(q);

//     setUserInfo(querySnapshot[0]);
//     localStorage.setItem("currentUserInfo", JSON.stringify(querySnapshot[0]));
//     console.log("query result" + querySnapshot);
//     return querySnapshot;
//   }

  async function createUser(userid, userEmail){
    try {
    let newUser = {
       userid: userid,
       username: userEmail,
       bio: "Nothing yet",
       followers: [],
       following: [],
       profileImgUrl: "https://firebasestorage.googleapis.com/v0/b/creativeproject-7d8d0.appspot.com/o/Default_pfp.svg.png?alt=media&token=d1675b8c-8105-4e83-872f-be5e5e35662c",
       verified: false
    }
    await setDoc(doc(db, "profiles", userid), newUser);
    localStorage.setItem("currentUserInfo", JSON.stringify(newUser))
    setUserInfo(newUser);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth)
  }
  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false);
        const unsub = onSnapshot(doc(db, "profiles", user.uid), (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
        let data = doc.data();
        setUserInfo(data);
        localStorage.setItem("currentUserInfo", JSON.stringify(doc.data()));
    })
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userInfo,
    login,
    signup,
    logout,
    createUser,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}