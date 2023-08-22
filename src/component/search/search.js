import './search.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { collection, query, where, getDocs } from "firebase/firestore";


const Search = (props) => {
  const { updatekey, categorykey, updateRecipes } = props
  const [search, setSearch] = useState("")



  //фильтрую все превью рецепты по имени
  const [items, setItems] = useState({});
  useEffect(() => {
    const getItems = async () => {
      const citiesCol = query(collection(db, 'recipe_preview'), where("id", "!=", "re00000"));
      const citySnapshot = await getDocs(citiesCol);
      if (citySnapshot) {
        const preview = citySnapshot.docs.map(doc => doc.data())
        const filter = preview.map((item, index) => {
          return {
            id: item.id, name: item.name
          }
        })
        setItems(filter)
      }
    };
    getItems()
  }, [])

  //ищу в строке с названием рецепта подстроку из поиска
  const [foundRecipes, setfoundRecipes] = useState([])
  const [nonefound, setnonefound] = useState(false)
  useEffect(() => {
    const getItems = async () => {
      const foundRecipes = Object.values(items).filter(value => (value.name.toLowerCase()).includes(search.toLowerCase()))
      if (search) {
        setfoundRecipes(foundRecipes)
      } else {
        setfoundRecipes([])
      }
    };
    getItems()
  }, [search])

  //если совпадений не нашлось в поиске, уведомляем пользователя
  useEffect(() => {
    if (foundRecipes == "") {
      setnonefound(true)
    }
  }, [foundRecipes])

  //update ключа нажатого элемента в поиске
  const handleClick = (key) => {
    updatekey(key)
    setfoundRecipes([])
    setSearch("")
  }
  //при нажатии на кнопку поиска Найти, отражать все элементы в странице каталога
  //передаю весь готовый массив поиска в каталог 
  const viewedRecipesPreview = (foundRecipes) => {
    updateRecipes(foundRecipes)
    setfoundRecipes([])
    setSearch("")
  }

  return (
    <section className="search">
      <div className="">
        <form className="search-string">
          <input
            className="search-string__input-search"
            placeholder="Найти рецепт"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Link to="/catalog">
            <button
              type="submit"
              className="btn btn-search"
              onClick={() => viewedRecipesPreview(foundRecipes)}
            >Найти</button>
          </Link>


        </form>
        {nonefound && search && (
          <>
            <div className="found-block">
              <div className="found-item">
                <p className="subtitle">Совпадений не нашлось. Попробуйте задать поиск по-другому.</p>
              </div>
            </div>
          </>
        )}
        {foundRecipes.length !== 0 && (
          <div className="found-block">
            {Object.values(foundRecipes).map(item => {
              const key = item.id
              return (
                <Link
                  key={key}
                  to={`/recipeDetails/${item.id}`}>
                  <div
                    key={key}
                    className="found-item"
                    value={categorykey}
                    onClick={() => handleClick(key)}
                  >
                    <p className="subtitle">{item.name}</p>
                  </div>
                </Link>
              )
            })}

          </div>
        )}
      </div>
    </section>
  );
}

export default Search;
