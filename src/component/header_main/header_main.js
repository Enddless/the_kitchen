// import headerPhoto from '../header_main/header-photo.png';
import headerPhoto from '../header_main/header_food.svg';
import './header_main.css';
import { Link } from 'react-router-dom'

function HeaderMain() {
  return (
    <div className="overflow ">
      <div className="container__header-main grid">
        <div className="header-main">
          <h1 className="header-main__title">Лучшие рецепты для вкусной жизни</h1>
          <p className="header-main__subtitle">Присоединяйтесь к миллионам пользователей,
            которые уже наслаждаются вкусом жизни с нами!
          </p>
          <Link to="/catalog">
            <button className="btn">Перейти в каталог</button>
          </Link>

        </div>
        <div className="header-block">
          <img className="photo" src={headerPhoto} alt="Фото на главной" />
        </div>
      </div>
    </div>
  );
}

export default HeaderMain;
