import './catalog.css'
import heart from '../../assets/heart.svg';
import heart_fav from "../../assets/heart_favorites.svg"
import Sidebar from '../catalog_sidebar/sidebar'
import Loader from '../loader/loader'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";



const CatalogContent = (props) => {
  const { userDetail, recipeAll, setCategoryName, categoryName, categorykey, updatekey, userfav, foundRecipes, updateRecipes, resetFoundRecipes } = props

  //loader
  const [loader, setLoader] = useState(false)
  useEffect(() => {
    setLoader(true)
    setTimeout(() => {
      setLoader(false);
    }, 1500);

  }, [])

  //********** СТАРТОВЫЙ КОНТЕНТ **********
  const recipeAllForStart = Object.values(recipeAll)
  const [startContent, setStartContent] = useState([])
  useEffect(() => {
    setStartContent(Object.values(recipeAll))
  }, [recipeAll])

  const [content, setContent] = useState({})
  useEffect(() => {
    const startcontent = (Object.values(recipeAll))
    if (startcontent) {
      setStartContent(startcontent)
    }
  }, [])
  useEffect(() => {
    setContent(startContent)
  }, [startContent])

  // ********** ОБНОВЛЕНИЕ КОНТЕНТА, ЕСЛИ ВЫБРАНА КАТЕГОРИЯ В БЛОКЕ КАТЕГОРИЙ СВЕРХУ **********
  const elem = Object.values(recipeAll).filter(recipe => recipe.categoriesDish.includes(categoryName))
  useEffect(() => {
    if (categoryName) {
      if (elem !== null && elem !== "") {
        setContent(elem)
      }
    }
  }, [categoryName]);

  // ********** ОБНОВЛЕНИЕ КОНТЕНТА, ЕСЛИ ПЕРЕДАН ЭЛЕМЕНТА ИЗ ФОРМЫ ПОИСКА **********
  const [updateFound, setupdateFound] = useState(Object.values(foundRecipes).map(item => item.id))
  useEffect(() => {
    if (foundRecipes.length !== 0) {
      const foundId = Object.values(foundRecipes).map(item => item.id)
      const elemFound = Object.values(recipeAll).filter(recipe => foundId.includes(recipe.id))
      if (elemFound) {
        setStartContent(elemFound)
      }
      resetFoundRecipes()
    }
  }, [foundRecipes]);


  //********** CHECKBOXES И ЗАПРОСЫ **********
  // категории
  const [categoryitems, setCategoryitems] = useState(["0"]);
  const filterCategory = (event) => {
    if (event.target.checked === true) {
      setCategoryitems([...categoryitems, event.target.id])
    } else
      setCategoryitems(categoryitems.filter(item => item !== event.target.id));
  }
  const [filterOne, setFilterone] = useState({});
  useEffect(() => {
    if (categoryitems !== null) {
      const recipeCol = query(collection(db, 'recipe_preview'), where("categoriesDish", "array-contains-any", Object.values(categoryitems)));
      const getItems = async () => {
        const citySnapshot = await getDocs(recipeCol);
        setFilterone(citySnapshot.docs.map(doc => doc.data()))
      };
      getItems();
    }
  }, [categoryitems]);

  // время готовки
  const [timeItems, setTimeitems] = useState(["0"]);
  const filterTime = (event) => {
    if (event.target.checked === true) {
      setTimeitems([...timeItems, event.target.value])
    } else
      setTimeitems(timeItems.filter(item => item !== event.target.value));
  }
  const [filterTwo, setFiltertwo] = useState({});
  let elementTonumber = ((Object.values(timeItems).map((value) => Number(value.replace(/\D/g, '')))))
  const limitTime = Math.max.apply(null, elementTonumber)
  useEffect(() => {
    if (timeItems !== null) {
      const filterCol = query(collection(db, 'recipe_preview'), where("time", "<=", Math.max.apply(null, elementTonumber)), where("time", "!=", 0));
      const getItems = async () => {
        const citySnapshot = await getDocs(filterCol);
        setFiltertwo(citySnapshot.docs.map(doc => doc.data()))
      };
      getItems();
    }
  }, [timeItems]);

  // ограничения
  const [excludeItems, setExcludetems] = useState(["0"]);
  const filterExclude = (event) => {
    if (event.target.checked === true) {
      setExcludetems([...excludeItems, event.target.id])
    } else
      setExcludetems(excludeItems.filter(item => item !== event.target.id));
  }
  const [filterThree, setFilterthree] = useState({});
  useEffect(() => {
    if (excludeItems !== null) {
      const filterCol = query(collection(db, 'recipe_preview'), where("categoriesExclude", "array-contains-any", Object.values(excludeItems)));
      const getItems = async () => {
        const citySnapshot = await getDocs(filterCol);
        setFilterthree(citySnapshot.docs.map(doc => doc.data()))
      };
      getItems();
    }
  }, [excludeItems]);



  //********** РЕЗУЛЬТАТ ВСЕХ ФИЛЬТРОВ **********
  const updateForm = () => {
    if (categoryitems.length >= 2) {
      setContent(filterOne)
    }
    if (timeItems.length >= 2) {
      setContent(filterTwo)
    }
    if (excludeItems.length >= 2) {
      setContent(filterThree)
    }
  }

  //********** СБРОС ВСЕХ ФИЛЬТРОВ САЙДБАРА **********
  const resetForm = (allcheck) => {
    const allcategoryChecked = ([...allcheck].filter((checkbox) => checkbox.checked)).map((item) => item.checked = false);
    setCategoryitems(["0"])
    setTimeitems(["0"])
    setExcludetems(["0"])
    setCategoryName("")
    setContent(recipeAllForStart)
    updateRecipes([])
    setupdateFound("")
  }

  //********** СБРОС ВСЕХ ФИЛЬТРОВ в общем каталоге **********
  //состояние пропсов нажатых чекбоксов в сайдбаре
  const [check, setcheck] = useState("")
  const resetcheck = (value) => {
    setcheck(value)
  }
  const resetAll = (check) => {
    const allcategoryChecked = ([...check].filter((checkbox) => checkbox.checked)).map((item) => item.checked = false);
    setContent(recipeAllForStart)
    setCategoryitems(["0"])
    setTimeitems(["0"])
    setExcludetems(["0"])
    setCategoryName("")
    setupdateFound("")
    resetFoundRecipes()
  }

  useEffect(() => {
    const handleUnload = (event, check) => {
      event.preventDefault();
      resetAll(check)
      resetFoundRecipes()
      setContent(recipeAllForStart)
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);


  //********** ПОЛУЧАЮ И ОБНОВЛЯЮ ID НАЖАТОГО ЭЛЕМЕНТА **********
  const handleClick = (key) => {
    updatekey(key)
  }


  // получение данных "Избранное" пользователя по его uid
  const [foundFavorites, setfoundFavorites] = useState([])
  const [clickforchangeheart, setclickforchangeheart] = useState(false)
  useEffect(() => {
    const getItems = async () => {
      const preview = (Object.values(userfav).map((value) => value.favorites))[0]
      if (preview) {
        setfoundFavorites(preview)
      }
    };
    getItems();
  }, [clickforchangeheart, userfav]);

  //добавляю в избранное
  const uid = userDetail.uid
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


  //**********ИЗМЕНЕНИЕ СОСТОЯНИЯ ОТОБРАЖЕНИЯ КОЛИЧЕСТВА ДОКУМЕНТОВ**********
  const [more, setMore] = useState(9)
  const clickMore = () => {
    setMore(more + 6)
  }
  const test = Object.values(content).slice(0, more)

  return (
    <section className="categories-content">
      <div className="flexcontainer-categories ">
        <div className="grid">
          <Sidebar
            filterCategory={filterCategory}
            filterTime={filterTime}
            filterExclude={filterExclude}
            updateForm={updateForm}
            resetForm={resetForm}
            resetcheck={resetcheck}
            {...props}
          />

          {loader ? (
            <>
              <div className="container">
                <Loader />
              </div>
            </>
          ) : (
            <>
              {Object.values(test).map((task, index) => {
                const elem = index + 1;
                const key = task.id
                return (
                  <div
                    key={key}
                    className={(elem === 4 || elem % 7 === 0) ? "recipesslider__recipeblock recipesslider__recipeblock--big" : "recipesslider__recipeblock"}>
                    <Link to={`/recipeDetails/${task.id}`}>
                      <div className="recipesblock__img" >
                        <img
                          src={task.imagePreview}
                          alt="Картинка выбора рецепта"
                          key={task.id}
                          value={categorykey}
                          onClick={() => handleClick(key)}
                        />
                      </div>
                    </Link>
                    <div className="recipeblock__text">
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
            </>
          )}
        </div>
      </div>

      <div className="container-more">
        {!loader && (
          <><button className="btn btn-autorization btn-filter" onClick={clickMore}>
            {more === test.length ? "Показать еще" : "Рецептов больше нет"}
          </button>
            <button className="btn btn-autorization btn-filter" onClick={() => resetAll(check)}>Отменить фильтры

            </button>
          </>
        )}
      </div>

    </section>
  );
}

export default CatalogContent;
