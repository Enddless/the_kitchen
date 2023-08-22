import './favorites.css'
import heart from '../../assets/heart_favorites.svg';
import cooking from "./cooking.svg"
import { Link } from 'react-router-dom'
import Loader from '../loader/loader'
import { db } from '../../firebase/firebase.config'
import { doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';

const Favorites = (props) => {
    const { userfav, recipeAll, categorykey, updatekey } = props
    const uid = JSON.parse(localStorage.getItem("userUid"))
    //loader
    const [loader, setLoader] = useState(false)
    useEffect(() => {
        setLoader(true)
        setTimeout(() => {
            setLoader(false);
        }, 1500);

    }, [])

    //передача родителю ключа
    const handleClick = (key) => {
        updatekey(key)
    }

    // получение данных "Избранное" пользователя по его uid
    const [foundFavorites, setfoundFavorites] = useState([])
    useEffect(() => {
        const getItems = async () => {
            const preview = (Object.values(userfav).map((value) => value.favorites))[0]
            setfoundFavorites(preview)
            // console.log("preview1 =", preview)
        };
        getItems();
    }, [userfav]);

    //ищу только избранные рецепты
    const [recipesUser, setrecipesUser] = useState([]);
    useEffect(() => {
        const getItems = async () => {
            if (foundFavorites) {
                const preview = Object.values(recipeAll).filter(value => (foundFavorites).includes(value.id))
                setrecipesUser(preview)
            }
        };
        getItems();
    }, [foundFavorites]);

    //функция удаления из избранного
    const deleteFavorites = async (key) => {
        const filteredList = (Object.values(userfav).map((value) => value.favorites))[0].filter(item => item !== key)
        const docRef = await updateDoc(doc(db, 'users', uid), {
            favorites: filteredList,
        });
    }

    return (
        <div className="white-block white-block-favorites">
            <div className="recipes-container__recipesslider">
                {loader ? (
                    <div className="container">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {recipesUser.length !== 0 ? (
                            <>
                                {Object.values(recipesUser).map((task) => {
                                    const key = task.id
                                    return (
                                        <div
                                            className="recipesslider__recipeblock"
                                            key={key}
                                        >
                                            <Link
                                                key={key}
                                                to={`/recipeDetails/${task.id}`} >
                                                <div
                                                    key={key}
                                                    className="recipesblock__img" >
                                                    <img
                                                        src={task.imagePreview}
                                                        alt="Картинка выбора рецепта"
                                                        key={key}
                                                        value={categorykey}
                                                        onClick={() => handleClick(key)}
                                                    />
                                                </div>
                                            </Link>
                                            <div className="recipeblock__text">
                                                <p className="subtitle">{task.name}</p>
                                                <img
                                                    className="like"
                                                    src={heart}
                                                    alt="Like"
                                                    onClick={() => deleteFavorites(key)}
                                                />
                                            </div>
                                        </div>

                                    )
                                })}
                            </>
                        ) : (
                            <>
                                <h1 className="title">В вашем избранном пока пусто</h1>
                                <img className="cooking" src={cooking} alt="Повар"></img>
                            </>
                        )
                        }
                    </>
                )}

            </div>
        </div>

    );
}

export default Favorites
