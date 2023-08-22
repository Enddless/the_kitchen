import star_icon from "./Star.svg"
import polygon from './polygon.svg'
import './comment.css'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { collection, query, where, getDocs } from "firebase/firestore";

const Comment = (props) => {
  const { item } = props

  // получение коллекции с комментариями
  const [comments, setcomments] = useState("");
  const userCol = query(collection(db, 'recipe_comments'), where("id", "==", `${item}`));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(userCol);
      const dataFav = (citySnapshot.docs.map(doc => doc.data()))[0];
      if (dataFav) {
        setcomments(dataFav.comments);
      }
    };
    getItems();
  }, []);

  //отправка комментария
  const [commentEnter, setcommentEnter] = useState("")
  return (
    <div className="wrapper">
      <div className="comment">
        <div className="grid">
          <h1 className="title recipes-container__title">Комментарии к рецепту</h1>


          <form className="search-string">
            <input
              className="search-string__input-search"
              placeholder="Добавить комментарий"
              value={commentEnter}
              onChange={(e) => setcommentEnter(e.target.value)}
            />

              <button
                type="submit"
                className="btn btn-search"
                onClick=""
              >Отправить</button>
          </form>


          {!comments ? (
            <h1 className="subtitle">Комментариев пока нет. Вы можете стать первым.</h1>
          ) : (
            <div className="comment__container">
              {Object.values(comments).map((item, index) => {
                const starsArray = Array.from({ length: item.stars }, (_, index) => index);
                const date = new Date()
                date.setTime(item.date.seconds * 1000 + item.date.nanoseconds / 1000000)
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = (date.getDate()).toString().padStart(2, '0');
                const newDate = `${day}.${month}.${date.getFullYear()}`

                return (
                  <div
                    key={index}
                    className="comment__block">
                    <div
                      key={index}
                      className="avatar">
                    </div>
                    <div className="user-info">
                      <h2 className="title">Анонимный пользователь</h2>
                      <p className="comment-date">{newDate}</p>
                      <div className="">
                        {starsArray.map(star => (
                          <img className='star' src={star_icon} alt="звезды"></img>
                        ))}
                      </div>

                    </div>
                    <div className="flexbox-container">
                      <div className="comment__text">
                        <p>{item.text}</p>
                      </div>
                      <div>
                        <img className="comment__polygon" src={polygon} alt=""></img>
                      </div>
                    </div>

                  </div>
                )
              })
              }
            </div>
          )}
        </div>


      </div>
    </div>

  );
}

export default Comment
