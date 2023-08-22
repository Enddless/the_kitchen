import './shopping_list.css'
import food from "./food.svg"
import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { doc, updateDoc, arrayUnion } from "firebase/firestore";


const AddList = (props) => {
    const { closeForm, unit, updateShopList } = props
    const uid = JSON.parse(localStorage.getItem("userUid"))
    const [name, setname] = useState(false)
    const [count, setcount] = useState(false)
    const [formCompleted, setFormCompleted] = useState(false)
    const [addsuccess, setaddsuccess] = useState(false)

    const requiredName = (event) => {
        const validated = event.target.value.length >= 1
        if (validated) {
            setname(true);
        } else {
            setname(false);
        }
    }

    const requiredCount = (event) => {
        const validated = event.target.value.length >= 1
        if (validated) {
            setcount(true);
        } else {
            setcount(false);
        }
    }
    useEffect(() => {
        if (name && count) {
            setFormCompleted(true);
        } else {
            setFormCompleted(false);
        }
    }, [name, count])

    //передача родителю состояния открытой формы
    const close = () => {
        closeForm()
    }

    //прогружаю из бд все возможные единицы измерения для выпадающего списка
    const [unitForAdd, setunitForAdd] = useState({})
    const [rezult, setrezult] = useState({})
    useEffect(() => {
        const getItems = async () => {
            if (unit !== 0) {
                const selectName = Object.values(unit).map((item) => item.name)
                const selectId = Object.values(unit).map((item) => item.id)
                if (selectId) {
                    const rezult = selectName.map((item, index) => {
                        return { name: selectName[index], id: selectId[index] }
                    })
                    setrezult(rezult)
                    setunitForAdd(selectName)
                }
                // setunitIDForAdd(selectId)
            }
        };
        getItems();
    }, []);

    //функция добавления своего ингредиента в бд
    const [prodName, setprodName] = useState("")
    const [prodCount, setprodCount] = useState("")
    // const [produnit, setprodUnit] = useState("")
    const [produnit, setprodUnit] = useState("кг.")

    const addProduct = async (prodName, prodCount, produnit) => {
        const unit = (Object.values(rezult).find((item) => item.name === produnit)).id
        const newIngredients = [];
        const ingredient = {
            count: prodCount,
            product: "",
            unit: unit,
        };
        const showingName = prodName
        newIngredients.push({
            ingredient,
            showingName,
        });
        const docRef = await updateDoc(doc(db, 'users', uid), {
            shoppingList: arrayUnion(...newIngredients),
        });
        updateShopList()
        setaddsuccess(true)
        setTimeout(closeForm, 1000)
        // обновить статус, если что-то изменилось, чтобы у родителя в юзэффект вставить в зависимость, 
        // что запускается при первичном рендере страницы или сли вручню что-то добавилось
        // settest()
    }

    //клик на инпуте, чтобы открыть выпадающий список
    const [click, setclick] = useState(false)
    return (
        <div className="container-for-add">
            <div className="add-shop-form">
                <div
                    className="close"
                    onClick={close}>
                    <div className="divider divider_left"></div>
                    <div className="divider divider_right"></div>
                </div>
                <h1 className="title title-add">Добавление</h1>
                <div className="blockcenter">
                    <fieldset className="fieldset">
                        <legend className="legend">Название</legend>
                        <input
                            type="text"
                            placeholder="Введите название продукта"
                            onChange={(e) => {
                                requiredName(e)
                                setprodName(e.target.value)
                            }}
                            value={prodName}
                            required>
                        </input>
                    </fieldset>

                    <div className="count-block">
                        <fieldset className="fieldset">
                            <legend className="legend">Количество</legend>
                            <input
                                type="text"
                                placeholder="Ввведите количество"
                                onChange={(e) => {
                                    requiredCount(e)
                                    setprodCount(e.target.value)
                                }}
                                value={prodCount}
                                required>
                            </input>
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="legend">Ед. измерения</legend>

                            {/* <select
                            value={produnit}
                            onChange={(e) => setprodUnit(e.target.value)}
                            className="select-block"
                        >
                            {Object.values(unitForAdd).map((item, index) => {
                                return (
                                    <option
                                        className="test"
                                        key={index}
                                        produnit={item.id}>{item}
                                    </option>
                                )
                            })}
                        </select> */}


                            <div
                                onClick={() => setclick(!click)}>
                                <input
                                    type="text"
                                    value={produnit}
                                    className="cursor"
                                    required
                                >
                                </input>
                                <p
                                    className={click ? "list-vector list-vector-noactive" : "list-vector list-vector-active"}
                                ></p>
                            </div>
                            {click && (
                                <div className="found-block">
                                    {Object.values(unitForAdd).map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="found-item">
                                                <p
                                                    key={index}
                                                    className="subtitle"
                                                    produnit={item.id}
                                                    onClick={(e) => {
                                                        setprodUnit(item)
                                                        setclick(!click)
                                                    }}
                                                >{item}</p>
                                            </div>


                                        )
                                    })}
                                </div>
                            )}
                        </fieldset>
                    </div>

                    <button
                        disabled={!formCompleted}
                        className={formCompleted ? "btn btn-visible btn-enabled" : "btn btn-visible btn-disabled"}
                        onClick={() => addProduct(prodName, prodCount, produnit)}
                    > {addsuccess ? "Добавлено." : "Добавить"}
                    </button>
                </div>
                <img src={food} alt="food" className="food"></img>
            </div>
        </div>
    );
}

export default AddList
