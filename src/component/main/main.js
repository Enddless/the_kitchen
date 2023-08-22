import './main.css';
import HomePage from '../home_page/home_page'
import RecipeDetails from '../recipe_details/recipe_details'
import Registration from '../registratiton/registration'
import ShoppingList from '../shopping_list/shopping_list'
import Search from '../search/search'
import Catalog from '../catalog/catalog'
import { Routes, Route } from 'react-router-dom'
import Profile from '../profile/profile';



const Main = (props) => {
  
  return (
        <Routes>
          <Route exact path={'/'} element={ <HomePage {...props}/> }/>
          <Route path={'/recipeDetails/:taskId'} element={ <RecipeDetails {...props}/> } />
          <Route path={'/catalog'} element={ <Catalog {...props}/> } />
          <Route path={'/registration'} element={ <Registration {...props}/> } />
          <Route path={'/shopping_list'} element={ <ShoppingList {...props}/> } />
          <Route path={'/profile'} element={ <Profile {...props}/> } />
          <Route path={'/search'} element={ <Search {...props}/> } />
        </Routes> 
  );
}

export default Main;
