import './footer_main.css';
import iphone from './iPhone.svg'



function FooterMain() {
  return (
    <div className="footer-main ">
      <div className="footer-main--flexbox grid ">
        <div className="footer-install">
          <h1 className="footer-main__title">Установите приложение и сделайте поиск рецептов ещё удобнее!</h1>
          <button className="btn btn-purple">
            <a
              href="https://play.google.com/store/apps/details?id=com.andreikslpv.thekitchen"
              target='_blank'
              className="logo"
            >Google play
            </a>
          </button>
        </div>
        <div className="footer-iphone">
          <img className="footer-main__iphone" src={iphone} alt="Картинка Iphone 13 pro" />
        </div>

      </div>

    </div>
  );
}

export default FooterMain;
