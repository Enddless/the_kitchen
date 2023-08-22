import './recipe_details.css'
import timer from "./timer.svg"
import fire from "./fire.svg"

import Search from '../search/search'
import Categories from '../categories/categories'
import Comment from '../comment/comment'
import Viewed from '../viewed/viewed'
import { useState, useRef, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { doc, updateDoc, arrayUnion } from "firebase/firestore";


const RecipeDetails = (props) => {
  const { recipeAll, recipeDetails, product, unit, categorykey } = props

  const [success, setsuccess] = useState(false)

  //здесь ищу только ту запись коллекции recipe_preview, где id = id выбранного рецепта
  const [taskId, settaskId] = useState(() => {
    const storedRecipe = categorykey
    return storedRecipe ? storedRecipe : []
  });

  const [task, setTask] = useState(() => {
    const storedRecipe = window.localStorage.getItem('task');
    return storedRecipe ? JSON.parse(storedRecipe) : (Object.values(recipeAll).find(rec => rec.id === taskId))
  });

  //здесь ищу только ту запись коллекции recipe_details где id = id выбранного рецепта
  const [taskElementDetails, setTaskdetails] = useState(() => {
    const storedRecipe = window.localStorage.getItem('taskElementDetails');
    return storedRecipe ? JSON.parse(storedRecipe) : (Object.values(recipeDetails).find(rec => rec.id === taskId))
  });

  // ищу ID всех ингредиентов выбранного рецепта
  let ingredientsMap = {};
  ingredientsMap = Object.values(taskElementDetails.ingredients).map((value) => { return value.product })

  //здесь содержатся веса продуктов, которые указаны в ингредиентах выбранного рецепта
  let ingrCountMap = {};
  ingrCountMap = Object.values(taskElementDetails.ingredients).map((value) => { return value.count })

  //здесь содержатся только те продукты, которые указаны в ингредиентах выбранного рецепта

  const [selectedProducts, setSelectedproduct] = useState(() => {
    const storedRecipe = window.localStorage.getItem('selectedProducts');
    return storedRecipe ? JSON.parse(storedRecipe) : (ingredientsMap.map((value) => (Object.values(product).find((product) => product.id === value).name)))
  });

  //здесь содержатся unit продуктов, которые указаны в продуктах выбранного рецепта
  let unitsProductsMap = {};
  unitsProductsMap = Object.values(taskElementDetails.ingredients).map((value) => { return value.unit })

  const [selectedUnits, setSelectedunits] = useState(() => {
    const storedRecipe = window.localStorage.getItem('selectedUnits');
    return storedRecipe ? JSON.parse(storedRecipe) : (unitsProductsMap.map((value) => (Object.values(unit).find((item) => item.id === value).name)))
  });

  // создание нового массива для отражения ингредиентов с количеством
  const ingredientsRezult = selectedProducts.map((item, index) => {
    return { product: item, ingrCountMap: ingrCountMap[index], unitProd: selectedUnits[index] }
  })



  //прокрутка блока ингредиентов
  //ищу координаты нужного блока
  const [scrollTop, setscrolltop] = useState(192)
  const [curentTop, setcurentTop] = useState("")
  const divRef = useRef(null);
  const blockRef = useRef(null);
  useEffect(() => {
    const divElement = divRef.current;
    const blockElement = blockRef.current;
    const handleScroll = () => {
      const rect = blockRef.current.getBoundingClientRect();
      const currentTop = divRef.current.offsetTop;
      const isScrollingUp = window.scrollY < rect.top
      if (rect.top < 0 && rect.bottom - (rect.bottom * 0.4) > window.innerHeight) {
        if (isScrollingUp) {
          // прокручиваю страницу вверх
          setscrolltop(currentTop - 1);
        } else {
          // прокручиваю страницу вниз
          setscrolltop(currentTop + 1);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  //калькулятор порций
  const [startValueCount, setstartValueCount] = useState(task.portions)
  const [startValueCalories, setstartValueCalories] = useState(task.portions)
  const [startValueTimer, setstartValueTimer] = useState(task.portions)
  let startValueIngredients = []
  startValueIngredients = ingredientsRezult.map((value) => value.ingrCountMap)
  const [ingredStart, setIngredStart] = useState(startValueIngredients)
  const [countStart, setCountStart] = useState(task.portions)
  const [caloriesStart, setCalories] = useState(task.caloriesCount)
  const [timeStart, setTime] = useState(task.time)
  const countMinus = (count, caloriesCount) => {
    if (count >= 1) {
      const newCount = count - 1
      setCountStart(newCount)
      const newCalories = Math.round((startValueCalories / startValueCount) * newCount)
      setCalories(newCalories)
      const newTimer = Math.round((startValueTimer / startValueCount) * newCount)
      setTime(newTimer)
      const newIngred = startValueIngredients.map(value => (value / startValueCount * newCount).toFixed(1))
      setIngredStart(newIngred)
    }
  }
  const countPlus = (count, caloriesCount) => {
    const newCount = count + 1
    setCountStart(newCount)
    const newCalories = Math.round((startValueCalories / startValueCount) * newCount)
    setCalories(newCalories)
    const newTimer = Math.round((startValueTimer / startValueCount) * newCount)
    setTime(newTimer)
    const newIngred = startValueIngredients.map(value => (value / startValueCount * newCount).toFixed(1))
    setIngredStart(newIngred)
  }

  useEffect(() => {
    window.localStorage.setItem('task', JSON.stringify(task));
    window.localStorage.setItem('taskElementDetails', JSON.stringify(taskElementDetails));
    window.localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    window.localStorage.setItem('selectedUnits', JSON.stringify(selectedUnits));
    window.localStorage.setItem('prodForShop', JSON.stringify(prodForShop));
    window.localStorage.setItem('unitForShop', JSON.stringify(unitForShop));
  }, [task, taskElementDetails, selectedProducts, selectedUnits]);



  //добавляю в список покупок
  const [prodForShop, setprodForShop] = useState(() => {
    const storedRecipe = window.localStorage.getItem('prodForShop');
    return storedRecipe ? JSON.parse(storedRecipe) : ingredientsMap.map((value) => (Object.values(product).find((product) => product.id === value)).id)
  });
  const [unitForShop, setunitForShop] = useState(() => {
    const storedRecipe = window.localStorage.getItem('unitForShop');
    return storedRecipe ? JSON.parse(storedRecipe) : unitsProductsMap.map((value) => (Object.values(unit).find((item) => item.id === value)).id)
  });
  const shop = prodForShop.map((item, index) => {
    return { productId: item, productName: selectedProducts[index], ingrCountMap: ingrCountMap[index], unitProd: unitForShop[index] }
  })


  const uid = JSON.parse(localStorage.getItem("userUid"))

  const addShoppingList = async (list) => {
    const newIngredients = [];
    list.forEach((item) => {
      const ingredient = {
        count: item.ingrCountMap,
        product: item.productId,
        unit: item.unitProd,
      };

      const showingName = item.productName

      newIngredients.push({
        ingredient,
        showingName,
      });
    });
    const docRef = await updateDoc(doc(db, 'users', uid), {
      shoppingList: arrayUnion(...newIngredients),
    });


    setsuccess(!success)
  }
  useEffect(() => {
    window.localStorage.setItem('task', JSON.stringify(task));
    window.localStorage.setItem('taskElementDetails', JSON.stringify(taskElementDetails));
    window.localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    window.localStorage.setItem('selectedUnits', JSON.stringify(selectedUnits));
    window.localStorage.setItem('prodForShop', JSON.stringify(prodForShop));
    window.localStorage.setItem('unitForShop', JSON.stringify(unitForShop));
  }, [task, taskElementDetails, selectedProducts, selectedUnits]);

  //обновление данных рецепта на странице, если нажат просмотренный рецепт снизу
  useEffect(() => {
    settaskId(categorykey)
    localStorage.removeItem('task');
    localStorage.removeItem('taskElementDetails');
    localStorage.removeItem('timeDetails');
    localStorage.removeItem('selectedProducts');
    localStorage.removeItem('selectedUnits');
  }, [categorykey])
  useEffect(() => {
    setTask((Object.values(recipeAll).find(rec => rec.id === taskId)))
    localStorage.setItem('task', JSON.stringify(task));
    setTaskdetails(Object.values(recipeDetails).find(rec => rec.id === taskId))
    localStorage.setItem('taskElementDetails', JSON.stringify(taskElementDetails));
    setSelectedproduct(ingredientsMap.map((value) => (Object.values(product).find((product) => product.id === value).name)))
    localStorage.setItem('taskElementDetails', JSON.stringify(selectedProducts));
    setSelectedunits(unitsProductsMap.map((value) => (Object.values(unit).find((item) => item.id === value).name)))
    localStorage.setItem('taskElementDetails', JSON.stringify(selectedUnits));

    setstartValueCount(task.portions)
    setstartValueCalories(task.caloriesCount)
    setstartValueTimer(task.time)

    setCountStart(task.portions)
    setCalories(task.caloriesCount)
    setTime(task.time)

  }, [taskId, task])


  //добавляю в просмотренное, если рецепт открыт на странице детально
  useEffect(() => {
    const addHistory = async () => {
      const newHistoryItem = {
        history: arrayUnion(taskId),
      }
      const docRef = await updateDoc(doc(db, 'users', uid), newHistoryItem)
    }
    addHistory()
  }, [])

  return (
    <>
      <div className="container-main recipe__details">
        <div className="grid">
        <Search {...props} />
        <Categories {...props} />
          <h1 className="title recipes-container__title">{task.name}
          </h1>
          <div className='recipe__details__info'>
            <div className="grid">
              <div className="details__photo">
                <img src={taskElementDetails.imageDetails} alt="Фотография блюда"></img>

              </div>
              <div className='details_text'>
                <p>{taskElementDetails.description}</p>
              </div>
            </div>
          </div>

          <div className="info__block">
            <div className="grid">
              <div className="info__block__item">
                <p className="info__block__item__title">Время приготовления:</p>
                <p className="subtitle info__block__item__subtitle">
                  <img src={timer}></img>
                  <span>{timeStart} минут</span>
                </p>
              </div>

              <div className="info__block__item">
                <p className="info__block__item__title">Калории: </p>
                <p className="subtitle info__block__item__subtitle">
                  <img src={fire}></img>
                  <span

                  >{caloriesStart} ккл</span>
                </p>
              </div>

              <div className="info__block__item">
                <p className="info__block__item__title">Количество порций:</p>
                <div className="btn-count-block">
                  <button
                    className="btn btn-count btn-count-plus"
                    setCountStart={setCountStart}
                    onClick={() => countPlus(countStart, caloriesStart)}> +
                  </button>
                  <button
                    className="btn btn-count btn-count-center"
                    setCountStart={setCountStart}>{countStart}
                  </button>
                  <button
                    className="btn btn-count btn-count-minus"
                    setCountStart={setCountStart}
                    onClick={() => countMinus(countStart, caloriesStart)}> -
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="block_sbs_recipe" ref={blockRef}>
            <h1 className="title recipes-container__title">Пошаговый рецепт</h1>
            <div className="grid">
              <div className="grid-steps">
                {Object.values(taskElementDetails.steps).map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="step__block">
                      <div className="step__block__item">
                        <h2 className="step-title">Шаг {value.number}</h2>
                        <p className="subtitle step__block__item__subtitle">{value.text}
                        </p>
                      </div>
                    </div>

                  )
                })}
              </div>


              <div className={scrollTop ? " fixed ingredients" : "ingredients"}
                ref={divRef} style={{ top: scrollTop + 'px' }}
              >
                <h2 className="ingredients_title">Вам понадобятся:</h2>
                {Object.values(ingredientsRezult).map((value, index) => {
                  const product = value.product
                  const count = ingredStart[index]
                  const unitProduct = value.unitProd
                  return (
                    <p
                      key={index}
                      className="ingredients_subtitle">{product} - {count} {unitProduct}</p>
                  )
                })}
                <button
                  className="btn btn-autorization"
                  onClick={() => addShoppingList(shop)}
                >{success ? "Добавлено" : "В список покупок"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Comment item={categorykey} />
      <Viewed {...props} />
    </>
  );
}

export default RecipeDetails
