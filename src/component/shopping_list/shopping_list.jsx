import './shopping_list.css'
import list from "./list.svg"
import plus from "./plus.svg"
import basket from "./basket.svg"
import photoreg from "./registration.svg"
import AddList from './add_list'
import Loader from '../loader/loader'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const ShoppingList = (props) => {
    const { unit, isLogged } = props
    //loader
    const [loader, setLoader] = useState(false)
    useEffect(() => {
        setLoader(true)
        setTimeout(() => {
            setLoader(false);
        }, 1500);

    }, [])

    //проверка списка покупок перед отражением
    const uid = JSON.parse(localStorage.getItem("userUid"))
    const [dataFav, setdataFav] = useState("");
    const [citySnapshot, setcitySnapshot] = useState("");
    const [shopping, setshopping] = useState("");

    const [success, setsuccess] = useState(false)
    const updateShopList = () => {
        setsuccess(!success)
    }


    useEffect(() => {
        const getItems = async () => {
            const userCol = query(collection(db, 'users'), where("uid", "==", `${uid}`));
            const citySnapshot = await getDocs(userCol);
            setcitySnapshot(citySnapshot)
        };
        getItems();
    }, [success]);

    useEffect(() => {
        const getItems = async () => {
            if (citySnapshot) {
                const dataFav = (citySnapshot.docs.map(doc => doc.data()))[0]
                setdataFav(dataFav)
            }
        };
        getItems();
    }, [citySnapshot]);

    useEffect(() => {
        const getItems = async () => {
            const foundShoppingList = dataFav.shoppingList
            setshopping(foundShoppingList)
        };
        getItems();
    }, [dataFav]);

    //получаю наименования юнитов количества ингредиентов
    const [selectedUnits, setselectedUnits] = useState([])
    useEffect(() => {
        if (shopping) {
            const getItems = () => {
                const select = Object.values(shopping).map((item) => item.ingredient).map((item) => item.unit).map((value) => (Object.values(unit).find((item) => item.id === value)).name)
                setselectedUnits(select)
            };
            getItems();
        }
    }, [shopping]);

    //нажатые чекбоксы
    const [checkbox, setcheckbox] = useState([]);
    const [isCheckedAll, setisCheckedAll] = useState(false)
    const [isclearAll, setisclearAll] = useState(false)
    const changeitem = (event) => {
        setisCheckedAll(false)
        setisclearAll(false)
        if (event.target.checked === true) {
            setcheckbox([...checkbox, event.target.value])

        } else
            setcheckbox(checkbox.filter(item => item !== event.target.value))
    }

    //удаление из списка покупок нажатых чекбоксов
    const deleteField = async (checkbox) => {
        const filteredList = Object.values(shopping).filter(item => !checkbox.includes(item.showingName));
        const docRef = await updateDoc(doc(db, 'users', uid), {
            shoppingList: filteredList,
        });
        setshopping(filteredList)
        clearAll()
    }

    //выбрать все чекбоксы
    const selectAll = (e) => {
        const test1 = document.getElementsByClassName("checkboxes")
        const uncheckedCheckboxes = ([...test1].filter((checkbox) => !checkbox.checked));
        // const uncheck = uncheckedCheckboxes.map((item) => item.checked = true)
        const uncheckName = uncheckedCheckboxes.map((item) => item.value)
        setcheckbox([...checkbox, ...uncheckName])
        setisCheckedAll(!isCheckedAll)
        setisclearAll(false)
    }

    //очистить все чекбоксы
    const clearAll = (e) => {
        const test1 = document.getElementsByClassName("checkboxes")
        const uncheckedCheckboxes = ([...test1].filter((checkbox) => checkbox.checked));
        // const uncheck = uncheckedCheckboxes.map((item) => item.checked = false)
        const uncheckName = uncheckedCheckboxes.map((item) => item.value)
        setcheckbox([...checkbox, ...uncheckName])
        setisclearAll(!isclearAll)
        setisCheckedAll(false)
    }
    //открыть или закрыть форму добавления
    const [addShop, setAddShop] = useState(false)
    const openForm = () => {
        setAddShop(!addShop)
    }
    const closeForm = () => {
        setAddShop(false)
    }


    return (
        <div className="shopping-list-container">
            <h1 className="title"> Список покупок</h1>
            <div className="fullcontent-container">
                <div className="grid">
                    <div className="content ">
                        <div className="foradd">
                            {loader ? (
                                <>
                                    <div className="container-loader">
                                        <Loader />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {!isLogged ? (
                                        <>
                                            <div className="info">
                                                <p className="subtitle">Чтобы добавить ингредиенты в список покупок нужно войти.</p>
                                                <img className="shop-registration" src={photoreg} alt="Нужно зарегистрироваться"></img>
                                            </div>

                                        </>
                                    ) : (
                                        <>

                                            {shopping && shopping.length !== 0 && ( //isLoading
                                                <div className={addShop ? "option content-dark" : "option"}>
                                                    <div className="selectinput">
                                                        <input
                                                            id="all"
                                                            type="checkbox"
                                                            onClick={selectAll}
                                                            readOnly
                                                            checked={isCheckedAll}
                                                        />
                                                        <label htmlFor="all" className="list-text"> Выбрать все
                                                        </label>
                                                    </div>
                                                    <div className="selectinput">
                                                        <input
                                                            id="all"
                                                            type="checkbox"
                                                            onClick={clearAll}
                                                            readOnly
                                                            checked={isclearAll}
                                                        />
                                                        <label htmlFor="all" className="list-text"> Очистить все
                                                        </label>
                                                    </div>

                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => deleteField(checkbox)}
                                                    >
                                                        Удалить выбранные
                                                    </button>
                                                </div>
                                            )}
                                            <div className={addShop ? "info content-dark" : "info"}>
                                                {shopping && shopping.length !== 0 && (
                                                    <>
                                                        {Object.values(shopping).map((value, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="product-row">
                                                                    <div className="product-item">
                                                                        <input
                                                                            id={index}
                                                                            type="checkbox"
                                                                            className="checkboxes"
                                                                            onChange={(e) => {
                                                                                changeitem(e)
                                                                                // setinput(e.target.value)
                                                                            }}
                                                                            value={value.showingName}
                                                                            checked={value.checked}
                                                                        />
                                                                        <div className="product-text">
                                                                            <label htmlFor={index} className="list-text">{value.showingName}</label>
                                                                            <p className="list-text">{value.ingredient.count} {selectedUnits[index]}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="pen-container">
                                                                        <svg className="pen" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M16.9983 8.89014L15.1099 7.00175L2.671 19.4406V21.329H4.5594L16.9983 8.89014ZM18.8867 7.00175L20.775 5.11335L18.8867 3.22495L16.9983 5.11335L18.8867 7.00175ZM5.66519 24H0V18.3335L17.9425 0.391017C18.1929 0.140649 18.5325 0 18.8867 0C19.2408 0 19.5804 0.140649 19.8309 0.391017L23.609 4.16915C23.8593 4.41959 24 4.75922 24 5.11335C24 5.46747 23.8593 5.8071 23.609 6.05755L5.66519 24Z" fill="#757070" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                        <img
                                                            className="basket"
                                                            src={basket}>
                                                        </img>
                                                    </>
                                                )}
                                                {shopping.length == 0 && (
                                                    <>
                                                        <p className="subtitle">Ваш список пока что пуст &#128532; </p>
                                                        <span className="text">Пополните его автоматически из карточки рецепта или добавьте продукты нажав на «+»</span>
                                                        <img src={list} className="checklist"></img>
                                                    </>
                                                )}
                                            </div>


                                            {addShop &&
                                                <AddList
                                                    closeForm={closeForm}
                                                    updateShopList={updateShopList}
                                                    {...props}
                                                />
                                            }
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="add">
                        {!loader && (
                            <>
                                <button className="add-shop-btn" onClick={openForm}>
                                    <img src={plus}></img>
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>

    );
}

export default ShoppingList
