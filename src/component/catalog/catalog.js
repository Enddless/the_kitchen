import './catalog.css'
import { useState, useEffect } from 'react'
import Search from '../search/search'
import { db } from '../../firebase/firebase.config'
import { onSnapshot, collection, query, where } from "firebase/firestore";


import Categories from '../categories/categories';

import CatalogContent from './catalogContent'

const Catalog = (props) => {

  localStorage.removeItem('task');
  localStorage.removeItem('taskElementDetails');
  localStorage.removeItem('timeDetails');
  localStorage.removeItem('selectedProducts');
  localStorage.removeItem('selectedUnits');
  localStorage.removeItem('prodForShop');
  localStorage.removeItem('unitForShop');

  //получаю айди избранных рецептов у пользователя
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
    <div className="catalog__container">
      <h1 className="title">Каталог рецептов</h1>
      <div className="grid">
        <Search  {...props} />
        <Categories {...props} />

        <CatalogContent
          userfav={userfav}
          {...props} />
      </div>
    </div>
  );
}

export default Catalog;
