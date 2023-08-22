import logo from '../../assets/logo_icon2.svg'
import './header.css';
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header(props) {
  const { isLogged } = props

  //переключение бургера в мобильной версии
  const [isburgervisible, setburgervisible] = useState(false)
  const showBurger = () => {
    setburgervisible(!isburgervisible)
  }
  const clicksubmenu = () => {
    setburgervisible(!isburgervisible)
  }
  return (
    <div className="header grid" >
      <div className="header__logo">
        <Link to="/">
          <img
            src={logo}
            alt="Логотип На кухне"
            className='logo' />
        </Link>
      </div>
      <div className="header__navigation">
        <ul className="navigation">
          <Link to="/"><li className="navigation__item tests">На главную</li></Link>
          <Link to="/catalog"><li className="navigation__item tests">Рецепты</li></Link>
          <Link to="/shopping_list"><li className="navigation__item tests">Список покупок</li></Link>
        </ul>

        {isLogged === false ? (
          <Link to="/registration">
            <button
              className="btn btn-autorization">
              Войти
            </button>
          </Link>
        ) : (
          <Link to="/profile">
            <button
              className="btn btn-autorization">
              Профиль
            </button>
          </Link>
        )
        }



      </div>

      <div className="burger" onClick={showBurger}>
        <div className={isburgervisible ? "burger-line burger-line-one" : "burger-line"}></div>
        <div className={isburgervisible ? "burger-line burger-line-two" : "burger-line"}></div>
        <div className={isburgervisible ? "burger-line burger-line-three" : "burger-line"}></div>
      </div>
      {isburgervisible && (
        <div className="burger-menu">
          <div className="grid">
            <ul className="navigation">
              <Link to="/"><li className="navigation__item" onClick={clicksubmenu}>Главная</li></Link>
              <Link to="/catalog"><li className="navigation__item" onClick={clicksubmenu}>Рецепты</li></Link>
              <Link to="/shopping_list"><li className="navigation__item" onClick={clicksubmenu}>Список покупок</li></Link>
              {isLogged === false ? (
                <Link to="/registration">
                  <button
                    className="btn btn-autorization">
                    Войти
                  </button>
                </Link>
              ) : (
                <Link to="/profile">
                  <button
                    className="btn btn-autorization">
                    Профиль
                  </button>
                </Link>
              )
              }
            </ul>

          </div>

        </div>
      )}
    </div>
  );
}

export default Header;
