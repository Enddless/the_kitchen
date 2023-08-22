import heart from '../../assets/heart.svg';
import heart_fav from "../../assets/heart_favorites.svg"
import './new_recipes.css';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const NewRecipes = (props) => {
  const { recipe, categorykey, updatekey, userfav } = props
  const handleClick = (key) => {
    updatekey(key)
  }

  // получение данных "Избранное" пользователя по его uid
  const [foundFavorites, setfoundFavorites] = useState([])
  useEffect(() => {
    const getItems = async () => {
      const preview = (Object.values(userfav).map((value) => value.favorites))[0]
      if (preview) {
        setfoundFavorites(preview)
      }
    };
    getItems();
  }, [userfav]);

  //функция добавления в избранное
  const uid = JSON.parse(localStorage.getItem("userUid"))
  const addFavorites = async (key) => {
    const newFavorites = {
      favorites: arrayUnion(key),
    }
    const docRef = await updateDoc(doc(db, 'users', `${uid}`), newFavorites)
  }


  //функция удаления из избранного
  const deleteFavorites = async (key) => {
    const filteredList = (Object.values(userfav).map((value) => value.favorites))[0].filter(item => item !== key)
    const docRef = await updateDoc(doc(db, 'users', uid), {
      favorites: filteredList,
    });
  }


  return (
    <section className="recipes-container">
      <h1 className="title recipes-container__title">Попробуйте новые рецепты</h1>
      <div className="recipes-container__recipesslider">
        <div className="grid">
          {Object.values(recipe).map((task, index) => {
            const elem = index + 1; 
            const key = task.id
            return (
              <div
                key={key}
                className={(elem === 1 || elem % 6 === 0 || elem % 7 === 0 || elem % 12 === 0) ? "recipesslider__recipeblock recipesslider__recipeblock--big" : "recipesslider__recipeblock"}>
                <Link to={`/recipeDetails/${task.id}`} >
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
                    src={foundFavorites.includes(task.id) ? heart_fav : heart}
                    alt="Like"
                    onClick={() => foundFavorites.includes(task.id) ? deleteFavorites(key) : addFavorites(key)}
                  />
                </div>
              </div>

            )
          })}
        </div>
      </div>
    </section>
  );
}

export default NewRecipes;
