import './registration.css';
import  { useState} from 'react'

function Header() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  return (
    <div className="reg">
        <h1 className="title">Регистрация</h1>
        <form className="registrationForm">
                <label htmlFor="login">Введите вашу почту:</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={email}
                    placeholder="Почта"
                    onChange={(event) => setEmail (event.target.value)}
                    required>
                </input>

                <label htmlFor="password">Введите пароль:</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={password}
                    placeholder="Пароль"
                    onChange={(event) => setPassword (event.target.value)}
                    required>
                </input>
                <button className="btn btn-autorization"> Зарегистрироваться </button>
        </form>
        <p className="agree">Зарегистрировавшись, вы соглашаетесь с Условиями обслуживания и Политикой конфиденциальности</p>
    </div>
  );
}

export default Header;
