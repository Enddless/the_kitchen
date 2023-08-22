// import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Header from './component/header/header'
import Main from './component/main/main'
import Footer from './component/footer/footer'
import { db } from '../src/firebase/firebase.config'
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { auth } from '../src/firebase/firebase.config'
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function App() {
  //**********РОДИТЕЛЬСКИЕ СОСТОЯНИЯ ДЛЯ ОБНОВЛЕНИЯ ИЗ ДОЧЕРНИХ ЭЛЕМЕНТОВ**********
  //состояние пропсов плашек с категориями
  const [categoryName, setCategoryName] = useState("")
  const updateCategoryname = (value) => {
    setCategoryName(value)
  }

  //состояние пропсов избранных рецептов
  const [favorNumber, setfavorNumber] = useState("")
  const updateVaforites = (value) => {
    setfavorNumber(value)
  }

  //состояние пропсов нажатого элемента
  const [categorykey, setcategorykey] = useState("")
  const updatekey = (value) => {
    setcategorykey(value)
    localStorage.setItem("keyRecipe", value)
  }

  //состояние пропсов из поиска для передачи в каталог
  const [foundRecipes, setfoundRecipes] = useState("")
  const updateRecipes = (value) => {
    setfoundRecipes(value)
  }
  const resetFoundRecipes = () => {
    setfoundRecipes([]);
  };

  //**********ПРОВЕРКА НА ЛОГИН**********
  // const [userState, setUserState] = useState(false)
  const [isLogged, setIsLogged] = useState(false)

  //**********ФУНКЦИЯ РЕГИСТРАЦИИ ЧЕРЕЗ ГУГЛ И ПЕРЕДАЧА ДАННЫХ О ПОЛЬЗОВАТЕЛЯ В ДОЧЕРНИЙ ЭЛЕМЕНТ**********
  const [userDetail, setUserdetail] = useState({});
  const [success, setsucess] = useState(false)
  const loginGoogle = async (e) => {
    const provider = new GoogleAuthProvider();
    try {
      const rezult = await signInWithPopup(auth, provider)
      const user = rezult.user;
      const userUid = user.uid;
      // const userName = user.displayName
      // const token = user.accessToken;
      window.localStorage.setItem('userUid', JSON.stringify(userUid))
      window.localStorage.setItem('user', JSON.stringify(user))
      setsucess(true)
    }
    catch (error) {
      console.log("Ошибка при входе =", error)
    };
  }
  //**********ФУНКЦИЯ РЕГИСТРАЦИИ ЧЕРЕЗ ПОЧТУ И ПАРОЛЬ , ПЕРЕДАЧА ДАННЫХ О ПОЛЬЗОВАТЕЛЯ В ДОЧЕРНИЙ ЭЛЕМЕНТ**********
  const loginMail = async (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userUid = user.uid;
        window.localStorage.setItem('userUid', JSON.stringify(userUid))
        window.localStorage.setItem('user', JSON.stringify(user))
        setsucess(true)
      })
      .catch((error) => {
        console.log("Ошибка при входе =", error)
      });
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userUid = user.uid;
        window.localStorage.setItem('userUid', JSON.stringify(userUid))
        window.localStorage.setItem('user', JSON.stringify(user))
        setsucess(true)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  //**********ФУНКЦИЯ LOGOUT**********
  const logout = () => {
    window.localStorage.removeItem('userUid')
    window.localStorage.removeItem('user')
    setIsLogged(false)
    setsucess(false)
  }


  // const [us, setUs] = useState("")

  const userUid = JSON.parse(window.localStorage.getItem('userUid'))
  const userBuf = JSON.parse(window.localStorage.getItem('user'))


  // const [userUid, setuserUid] = useState(() => {
  //   const storedUid = window.localStorage.getItem('userUid');
  //   console.log(" storedUid = ", storedUid)
  //   return storedUid ? JSON.parse(storedUid) : ""
  // });


  useEffect(() => {
    if (userUid) {
      setIsLogged(true)
      setUserdetail(userBuf)
    }
  }, [success])

  // useEffect(() => {
  //   if (isLogged) {
  //     setUserdetail(localStorage.getItem("user"))
  //     // console.log("setUserdetail = ", userDetail)
  //   }

  // }, [isLogged]);



  //**********ЗАПРОСЫ В БАЗУ ДАННЫХ**********
  // получение отдельной коллекции Категории
  const [items, setItems] = useState("");
  const citiesCol = query(collection(db, 'category'), where("type", "==", "ct00002"));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(citiesCol);
      setItems(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);


  // получение отдельной коллекции Рецепт превью
  const [recipe, setRecipe] = useState("");
  const recipeCol = query(collection(db, 'recipe_preview'), where("id", "!=", "re00000"), orderBy("id", "desc"), limit(6));
  // const recipeCol = collection(db, 'recipe_preview')
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(recipeCol);
      setRecipe(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);
  // получение отдельной коллекции Рецепт превью без лимита
  const [recipeAll, setRecipeAll] = useState("");
  const recipeAllCol = query(collection(db, 'recipe_preview'), where("id", "!=", "re00000"), orderBy("id", "desc"));
  // const recipeCol = collection(db, 'recipe_preview')
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(recipeAllCol);
      setRecipeAll(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);

  // получение отдельной коллекции Быстрые рецепты
  const [recipeFast, setRecipeFast] = useState("");
  const recipeFastCol = query(collection(db, 'recipe_preview'), where("time", "<", 60), where("time", ">", 0), limit(6));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(recipeFastCol);
      setRecipeFast(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);

  // получение отдельной коллекции Детали рецептов
  const [recipeDetails, setRecipeDetails] = useState("");
  const recipeDetailsCol = query(collection(db, 'recipe_details'), where("id", "!=", "re00000"));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(recipeDetailsCol);
      setRecipeDetails(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);

  // получение отдельной коллекции Time-Unit
  const [timeUnit, setTimeUnit] = useState("");
  const timeUnitCol = collection(db, 'unit');
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(timeUnitCol);
      setTimeUnit(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);

  // получение отдельной коллекции Product
  const [product, setProduct] = useState("");
  const productCol = query(collection(db, 'product'), where("id", "!=", "pr00000"));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(productCol);
      setProduct(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);

  // получение отдельной коллекции Unit - по наименованиям юнитов продуктов
  const [unit, setUnit] = useState("");
  const unitCol = query(collection(db, 'unit'), where("id", "!=", "un00000"));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(unitCol);
      setUnit(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);

  // получение отдельной коллекции Категории-исключения
  const [exclude, setExclude] = useState("");
  const excludeCol = query(collection(db, 'category'), where("type", "==", "ct00003"));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(excludeCol);
      setExclude(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);

  // получение отдельной коллекции Категории-только до 60 минут
  const [time, setTime] = useState("");
  const timeCol = query(collection(db, 'category'), where("type", "==", "ct00001"));
  useEffect(() => {
    const getItems = async () => {
      const citySnapshot = await getDocs(timeCol);
      setTime(citySnapshot.docs.map(doc => doc.data()))
    };
    getItems();
  }, []);


  localStorage.removeItem('task');
  localStorage.removeItem('taskElementDetails');
  localStorage.removeItem('timeDetails');
  localStorage.removeItem('selectedProducts');
  localStorage.removeItem('selectedUnits');
  localStorage.removeItem('prodForShop');
  localStorage.removeItem('unitForShop');

  return (
    <BrowserRouter>
      <div className="wrapper-app">
        <Header
          recipe={recipe}
          className="header"
          isLogged={isLogged}
          setIsLogged={setIsLogged}
          loginGoogle={loginGoogle}
          loginMail={loginMail}
          logout={logout}
        // userDetail={userDetail}
        // setUserdetail={setUserdetail}
        />
        <Main
          updateCategoryname={updateCategoryname}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          categorykey={categorykey}
          setcategorykey={setcategorykey}
          updatekey={updatekey}
          loginGoogle={loginGoogle}
          loginMail={loginMail}
          userDetail={userDetail}
          updateVaforites={updateVaforites}
          favorNumber={favorNumber}
          setfavorNumber={setfavorNumber}
          foundRecipes={foundRecipes}
          setfoundRecipes={setfoundRecipes}
          updateRecipes={updateRecipes}
          resetFoundRecipes={resetFoundRecipes}
          logout={logout}
          isLogged={isLogged}

          items={items} setItems={setItems}
          recipe={recipe} setRecipe={setRecipe}
          recipeFast={recipeFast} setRecipeFast={setRecipeFast}
          recipeDetails={recipeDetails} setRecipeDetails={setRecipeDetails}
          timeUnit={timeUnit} setTimeUnit={setTimeUnit}
          product={product} setProduct={setProduct}
          unit={unit} setUnit={setUnit}
          exclude={exclude} setExclude={setExclude}
          time={time} setTime={setTime}
          recipeAll={recipeAll}
        />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App
