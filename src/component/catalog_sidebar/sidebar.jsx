import '../catalog_sidebar/sidebar.css'
import { useState } from 'react'




const Sidebar = (props) => {
  const { items, time, exclude, filterCategory, categoryitems, filterTime, timeItems, filterExclude, excludeItems, updateForm, resetForm, resetcheck } = props

  // ********** DROPDOWNS **********
  const [recipeDropdown, setRecipeDropdown] = useState(true)
  const viewRecipeBlock = () => {
    setRecipeDropdown(!recipeDropdown)
  }
  const [ingredientsDropdown, setIngredientsDropdown] = useState(true)
  const viewIngredientsBlock = () => {
    setIngredientsDropdown(!ingredientsDropdown)
  }
  const [typeRecipeDropdown, setTypeRecipeDropdown] = useState(true)
  const viewTypeRecipeBlock = () => {
    setTypeRecipeDropdown(!typeRecipeDropdown)
  }


  // ********** CHECKBOXES **********
  const handleClick = (event) => {
    updateForm(event.target.value)
  }
  const handleClickReset = () => {
    const allcheck = document.querySelectorAll("input[type =checkbox]")
    resetForm(allcheck)
    resetcheck(allcheck)
  }
  const handleCategoryfilter = (value) => {
    filterCategory(value)
  }
  const handleTimerfilter = (value) => {
    filterTime(value)
  }
  const handleExcludefilter = (value) => {
    filterExclude(value)
  }


  return (
    <div className={
      ingredientsDropdown || typeRecipeDropdown
        ? "sidebar "
        : "sidebar sidebar--height"
    }
    >
      <div className="collapse">
        <label
          className={
            recipeDropdown
              ? "custom-select__label active_dropdown"
              : "custom-select__label"
          }
          onClick={viewRecipeBlock}> Категории </label>
        {/* dropdown по категориям рецептов  */}
        {recipeDropdown && (
          <div className="dropdown" setRecipeDropdown={setRecipeDropdown}>
            <div className="custom-select__inner">
              {Object.values(items).map((value) => {
                return (
                  <div
                    className="custom-select__option"
                    key={value.id}
                  >
                    <input
                      type="checkbox"
                      id={value.id}
                      value={value.name}
                      categoryitems={categoryitems}
                      onChange={(e) => handleCategoryfilter(e)}
                    />
                    <label>{value.name}</label>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="collapse">
        {/* dropdown по времени приготовления  */}
        <label className={
          typeRecipeDropdown
            ? "custom-select__label active_dropdown"
            : "custom-select__label"
        }
          onClick={viewTypeRecipeBlock}> Время готовки</label>
        {typeRecipeDropdown && (
          <div className="dropdown" setTypeRecipeDropdown={setTypeRecipeDropdown}>
            <div className="custom-select__inner">
              {Object.values(time).map((value) => {
                return (
                  <div className="custom-select__option" key={value.id}>
                    <input
                      type="checkbox"
                      value={value.name}
                      timeItems={timeItems}
                      onChange={(e) => handleTimerfilter(e)}
                    />
                    <label>{value.name}</label>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>


      <div className="collapse">
        {/* dropdown по категориям рецептов  */}
        <label className={
          ingredientsDropdown
            ? "custom-select__label active_dropdown"
            : "custom-select__label"
        }
          onClick={viewIngredientsBlock}> Ограничения</label>
        {ingredientsDropdown && (
          <div className="dropdown" setIngredientsDropdown={setIngredientsDropdown}>
            <div className="custom-select__inner">
              {Object.values(exclude).map((value) => {
                return (
                  <div className="custom-select__option" key={value.id}>
                    <input
                      type="checkbox"
                      value={value.name}
                      id={value.id}
                      excludeItems={excludeItems}
                      onChange={(e) => handleExcludefilter(e)}
                    />
                    <label>{value.name}</label>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="btns">
        <button className="btn btn-autorization" onClick={(e) => handleClick(e)}>Применить</button>
        <button className="btn-reset" onClick={(e) => handleClickReset(e)}>Отменить фильтры</button>
      </div>
    </div>
  );
}

export default Sidebar;
