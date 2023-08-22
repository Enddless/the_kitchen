import './preferences.css'
import caseImage from "./case.svg"
import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase.config'
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const Preferences = (props) => {
    const { exclude, userfav } = props
    const uid = JSON.parse(localStorage.getItem("userUid"))

    // получение отдельной коллекции user => exclude
    const [userExclude, setuserExclude] = useState("");
    useEffect(() => {
        const getItems = async () => {
            const preview = (Object.values(userfav).map((value) => value.defaultExclude))[0]
            setuserExclude(preview)
        };
        getItems();
    }, [userfav]);

    //состояние для индикации нажатого или ненажатого элемента
    const [status, setstatus] = useState("")
    useEffect(() => {
        const status = (Object.values(exclude).filter(item => userExclude.includes(item.id)).sort()).map(item => item.id)
        setstatus(status)
    }, [userExclude, exclude]);


    //добавляю исключения
    const addExclude = async (e, key) => {
        const filteredList = [...userExclude, key]//.filter(item => item == key);
        const docRef = await updateDoc(doc(db, 'users', uid), {
            defaultExclude: arrayUnion(key),
        });
        setuserExclude(filteredList)
    }

    //удаляю исключения
    const deleteExclude = async (e, key) => {
        const filteredList = Object.values(userExclude).filter(item => item !== key);
        const docRef = await updateDoc(doc(db, 'users', uid), {
            defaultExclude: filteredList,
        });
        setuserExclude(filteredList)
    }


    return (
        <div className="white-block white-block-preferences">
            <img src={caseImage} className="caseImage"></img>
            {Object.values(exclude).map((item, index) => {
                const key = item.id
                const name = item.name
                return (
                    <div
                        key={key}
                        className="item-product"
                    >
                        <p className="subtitle">{name}</p>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={status.includes(key) ? true : false}
                                // onChange={(e) => addExclude(e,key)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        addExclude(e, key);
                                    } else {
                                        deleteExclude(e, key)
                                    }
                                }}
                            />
                            <span className="sliderRound" ></span>
                        </label>
                    </div>
                )
            })}

        </div>

    );
}

export default Preferences
