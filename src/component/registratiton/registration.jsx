import './registration.css'
import profile from "./profile.svg"
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'


function Registration(props) {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false)
  const { loginGoogle, loginMail } = props
  //переключение на вторую форму, если выбрана авторизация через email/pass , проверяем валидность
  const [showSecondForm, setShowSecondForm] = useState(false);
  const clickStep = () => {
    setShowSecondForm(true)
  }
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //проверка на ввод значений
  const [emailForm2, setEmailForm2] = useState(false)
  const [passwordForm2, setPasswordForm2] = useState(false)
  const [formCompleted, setFormCompleted] = useState(false)

  const requiredEmail = (event) => {
    const validated = (event.target.value).match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    if (validated) {
      setEmailForm2(true);
    } else {
      setEmailForm2(false);
    }
  }

  const requiredPassword = (event) => {
    const validated = event.target.value.length >= 6
    if (validated) {
      setPasswordForm2(true);
    } else {
      setPasswordForm2(false);
    }
  }
  useEffect(() => {
    if (emailForm2 && passwordForm2) {
      setFormCompleted(true);
    } else {
      setFormCompleted(false);
    }
  }, [emailForm2, passwordForm2])

  //вызов родительской функции регистрации по гугл
  const handleClick = (e) => {
    e.preventDefault()
    loginGoogle()
    setLoader(true)
    setTimeout(() => {
      setLoader(false);
      navigate("/")
    }, 3000);
  }

  //вызов родительской функции регистрации по почте
  const handleClickMail = (e, email, password) => {
    e.preventDefault()
    loginMail(email, password)
    setLoader(true)
    setTimeout(() => {
      setLoader(false);
      navigate("/")
    }, 3000);
  }


  return (
    <div className="reg">
      <div className="grid">
        <form
          className={`registrationForm form-container ${showSecondForm ? "show-second-form" : ""}`}
          id="firebaseui-auth-container">
          <Link to='/'>
            <div className="close">
              <div className="divider divider_left"></div>
              <div className="divider divider_right"></div>
            </div>
          </Link>

          {!showSecondForm ? (
            <>
              <h1 className="title">Вход</h1>
              <button
                className="btn btn-autorization"
                onClick={(e) => handleClick(e)}>
                <div className="google">
                  <p>Продолжить с Google </p>
                </div>
              </button>
              <button
                className="btn btn-autorization btn-registration"
                onClick={clickStep}> Войти по email
              </button>
            </>
          ) : (
            <>
              <h1 className="title title-end">Завершите вход</h1>
              <fieldset className="fieldset">
                <legend className="legend">Email</legend>
                <input
                  type="email"
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={(e) => {
                    requiredEmail(e)
                    setEmail(e.target.value)
                  }}
                  required>
                </input>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="legend">Пароль</legend>
                <input
                  type="password"
                  placeholder="Придумайте пароль"
                  value={password}
                  onChange={(e) => {
                    requiredPassword(e)
                    setPassword(e.target.value)
                  }}
                  required>
                </input>
              </fieldset>
              <button
                disabled={!formCompleted}
                className={formCompleted ? "btn btn-visible btn-enabled" : "btn btn-visible btn-disabled"}
                onClick={(e) => handleClickMail(e, email, password)}
              >Вход/регистрация</button>
              <img src={profile} alt="profile" className="profile"></img>
              <p
                className="previos"
                onClick={() => setShowSecondForm(!showSecondForm)}>Назад
              </p>
            </>
          )
          }

          <p className="agree">Зарегистрировавшись, вы соглашаетесь с Условиями обслуживания и Политикой конфиденциальности</p>
        </form>
      </div>
    </div>
  );
}

export default Registration;
