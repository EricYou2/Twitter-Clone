import React, { useContext, useState, useEffect } from "react"
import {auth, db} from "../firebase"
import { getDocs, collection, addDoc, query, where, doc, onSnapshot, setDoc} from "firebase/firestore";
const UserInfoContext = React.createContext()

export function useUser() {
  return useContext(UserInfoContext)
}

export function UserInfoProvider({ children }) {
  const [userInfo, setUserInfo] = useState()


  async function loadUserInfo(userid){
    const q = query(collection(db, "profiles"), where("userid", "==", userid));
    const querySnapshot = await getDocs(q);

    setUserInfo(querySnapshot[0]);
    console.log("query result" + querySnapshot);
    return querySnapshot;
  }

  async function createUser(userid, userEmail){
    try {
    let newUser = {
       userid: userid,
       username: userEmail,
       bio: "Nothing yet",
       followers: [],
       following: [],
       profileImgUrl: ""
    }
    await setDoc(doc(db, "profiles", userid), newUser);
    setUserInfo(newUser);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
  }


  useEffect(() => {
        const unsub = onSnapshot(doc(db, "profiles"), (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
        setUserInfo(doc.data());
        });
        return unsub
  }, [])

  const value = {
    userInfo,
    loadUserInfo,
    createUser
  }

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  )
}