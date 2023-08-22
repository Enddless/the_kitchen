import heart from './heart.png';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './viewed.css'


const Viewed = (props) => {
  const { userDetail, categorykey, updatekey, recipeAll } = props
  const [historyList, sethistoryList] = useState("");
  //получение истории просмотренных рецептов
  const uid = userDetail.uid
  const userCol = query(collection(db, 'users'), where("uid", "==", `${uid}`));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(userCol);
      const dataHistory = (citySnapshot.docs.map(doc => doc.data()))[0]
      if (dataHistory.length !== 0) {
        const foundHistoryList = dataHistory.history
        sethistoryList(foundHistoryList)
      }
    };
    getItems();
  }, []);
  //получение превью рецептов, которые числятся как просмотренные
  const [preview, setpreview] = useState([]);
  useEffect(() => {
    const getItems = async () => {
      const preview = Object.values(recipeAll).filter(value => (historyList).includes(value.id))
      setpreview(preview)
    };
    getItems();
  }, [historyList]);

  //передача родителю
  const handleClick = (key) => {
    updatekey(key)
    window.scrollTo(0,0)
  }

  //добавляю в избранное, если захочется
  const addFavorites = async (key) => {
    const newFavorites = {
      favorites: arrayUnion(key),
    }
    const docRef = await updateDoc(doc(db, 'users', `${uid}`), newFavorites)
  }
  //**********НАСТРОЙКИ ДЛЯ СЛАЙДЕРА**********
  const settings = {
    dots: false,
    infinite: false,
    variableWidth: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1309,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="viewed">
      <h1 className="title">Последнее просмотренное</h1>
      {!historyList ? (
        <>
          <p className="subtitle-viewed">Пока Вы не просмотрели ни одного рецепта</p>
        </>
      ) : (
        <>

          <div className="recipes-container__recipesslider">
            <Slider {...settings}>
              {Object.values(preview).map((task) => {
                const key = task.id
                return (
                  <div className="recipesslider__recipeblock">
                    <Link to={`/recipeDetails/${task.id}`}>
                      <div className="recipesblock__img" >
                        <img
                          src={task.imagePreview}
                          alt="Картинка выбора рецепта"
                          key={key}
                          value={categorykey}
                          onClick={() => handleClick(key)}
                        />
                      </div>
                    </Link>
                    <div className="recipeblock__text"
                    >
                      <p className="subtitle">{task.name}</p>
                      <img
                        className="like"
                        src={heart}
                        alt="Like"
                        onClick={() => addFavorites(key)}
                      />
                    </div>
                  </div>

                )
              })}
            </Slider>
          </div>

        </>
      )}
    </div>

  );
}

export default Viewed
