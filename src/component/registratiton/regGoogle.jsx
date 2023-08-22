import profile from "./profile.svg"
import google from '../footer_main/logos_google-icon.png'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase.config'
import { signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { db } from '../../firebase/firebase.config'
import { collection, query, where, getDocs } from "firebase/firestore";

function RegGoogle(props) {
    const { openFormAuth, setOpenFormAuth } = props
    //переключение на вторую форму, если выбрана авторизация через email/pass , проверяем валидность
    const [showSecondForm, setShowSecondForm] = useState(false);
    const clickStep = () => {
        setShowSecondForm(true)
    }
   
    //всплывающее окно при авторизации через google

    const [isLogged, setIsLogged] = useState(false)
    const [userDetail, setUserdetail] = useState("");
    const navigate = useNavigate();
    function loginGoogle(e) {
        e.preventDefault()
        const provider = new GoogleAuthProvider();
        //откроется всплывающее окно входа через гугл   
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const userUid = user.uid;
                setUserdetail(user)
                console.log("User on = ", user)
                const token = user.accessToken;
                setIsLogged(!isLogged)
                window.localStorage.setItem('userUid', JSON.stringify(userUid)) //token записался
                navigate("/profile")
            }).catch((error) => {
                console.log("Ошибка при входе =", error)
            });
    }

    return (
        <>
            <h1 className="title">Регистрация</h1>
            <button
                className="btn btn-autorization"
                onClick={loginGoogle}>
                <div className="google">
                    <img src={google} alt="google"></img>
                    <p>Продолжить с Google </p>
                </div>
            </button>
            <button
                className="btn btn-autorization btn-registration"
                onClick={clickStep}> Регистрация по email
            </button>
        </>


    );
}

export default RegGoogle;
