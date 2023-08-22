// import logo from './logo.svg';
import './footer.css';
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className="footer content-grid">
      <div className="footer__navigation">
        <ul className="navigation">
          <Link to="/"><li className="navigation__item">На главную</li></Link>
          <Link to="/catalog"><li className="navigation__item">Рецепты</li></Link>
          <Link to="/shopping_list"><li className="navigation__item">Список покупок</li></Link>
        </ul>
      </div>
      <p className="select--none">Все права защищены</p>
      <p className="select--none"> &#169; 2023 Pixels</p>
    </div>
  );
}

export default Footer;
