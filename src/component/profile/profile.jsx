import Favorites from '../favorites/favorites'
import Preferences from '../preferences/preferences'
import './profile.css'
import exit_vector from "./logout-box.svg"
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../firebase/firebase.config'
import { onSnapshot, collection, query, where, doc, setDoc } from "firebase/firestore";

const Profile = (props) => {
    const { recipe, userDetail, updateVaforites, logout } = props
    const [activeForm, setActiveForm] = useState("favorites")


    const openForm = (formName) => {
        setActiveForm(formName)
    }
    const addNewUser = async (uid) => {
        const newUser = {
            defaultExclude: [],
            favorites: [],
            history: [],
            shoppingList: {
                ingredient: {
                    count: "",
                    product: "",
                    unit: "",
                },
                showingName: "",
            },
            uid: uid
        }
        const docRef = await setDoc(doc(db, 'users', `${uid}`), newUser)
    }

    const uid = JSON.parse(localStorage.getItem("userUid"))
    // получение пользователя по его uid "FFBZ5v6Vt1cW7nkMXQVXhbfQqQZ2" или создание нового
    const [userfav, setuserfav] = useState("");
    const userCol = query(collection(db, 'users'), where("uid", "==", `${uid}`));
    useEffect(() => {
        //проверяем есть ли вообще в базе такой пользователь, 
        const unsubscribe = onSnapshot(userCol, (snapshot) => {
            const dataFav = snapshot.docs.map(doc => doc.data());
            if (dataFav.length !== 0) {
                setuserfav(dataFav)
                updateVaforites(dataFav)
            } else {
                addNewUser(uid)
            }
        });

        return () => unsubscribe();
    }, []);

    //exit
    const exit = () => {
        logout()
    }

    localStorage.removeItem('task');
    localStorage.removeItem('taskElementDetails');
    localStorage.removeItem('timeDetails');
    localStorage.removeItem('selectedProducts');
    localStorage.removeItem('selectedUnits');
    return (
        <>
            {userDetail && (
                <div className="container">
                    <div className="profile-wrapper">
                        <div className="grid">
                            <div className="profile-user">
                                <img className="profile-photo" src={userDetail.photoURL}></img>
                                <p className="profile-username">{userDetail.displayName}</p>
                                <p className="profile-useremail">{userDetail.email}</p>
                                <p className="profile-change">Изменить профиль</p>
                                <p
                                    className={
                                        activeForm === 'favorites' ? "profile-category text-underline" : "profile-category"
                                    }
                                    onClick={() => openForm("favorites")}>Избранное
                                </p>
                                <p
                                    className={
                                        activeForm === 'preferences' ? "profile-category text-underline" : "profile-category"
                                    }
                                    onClick={() => openForm("preferences")}>Мои предпочтения
                                </p>
                                <Link to="/">
                                    <div
                                        className="logout-box"
                                        onClick={exit}
                                    >
                                        <img src={exit_vector}></img>
                                        <p className="logout-box-title">Выйти</p>
                                    </div>
                                </Link>

                            </div>

                            {activeForm === 'favorites' && <Favorites
                                recipe={recipe}
                                userDetail={userDetail}
                                userfav={userfav}
                                {...props} />}
                            {activeForm === 'preferences' && <Preferences userDetail={userDetail} userfav={userfav} {...props} />}
                        </div>


                    </div>
                </div>
            )}
        </>

    );
}

export default Profile
