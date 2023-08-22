// import logo from './logo.svg';
import './home_page.css';
import HeaderMain from '../header_main/header_main'
import Search from '../search/search'
import Categories from '../categories/categories'
import NewRecipes from '../new_recipes/new_recipes'
import FastRecipes from '../fast_recipes/fast_recipes'
import FooterMain from '../footer_main/footer_main'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { onSnapshot, collection, query, where } from "firebase/firestore";


const HomePage = (props) => {

  localStorage.removeItem('task');
  localStorage.removeItem('taskElementDetails');
  localStorage.removeItem('timeDetails');
  localStorage.removeItem('selectedProducts');
  localStorage.removeItem('selectedUnits');

  // получение пользователя по его uid и передача дочерним элементам
  const uid = JSON.parse(localStorage.getItem("userUid"))
  const [userfav, setuserfav] = useState("");
  const userCol = query(collection(db, 'users'), where("uid", "==", `${uid}`));
  useEffect(() => {
    const unsubscribe = onSnapshot(userCol, (snapshot) => {
      const dataFav = snapshot.docs.map(doc => doc.data());
      if (dataFav.length !== 0) {
        setuserfav(dataFav);
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <div className="content-grid">
      <div className="container-homepage ">
        <HeaderMain />
        <div className="container-main grid">
          <Search {...props} />
          <Categories {...props} />
          <NewRecipes
            userfav={userfav}
            {...props} />
          <FastRecipes
            userfav={userfav}
            {...props} />
        </div>
        <FooterMain />
      </div>
    </div>
  );
}

export default HomePage
