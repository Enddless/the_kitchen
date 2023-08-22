import './categories.css';
import { Link } from 'react-router-dom'


const Categories = (props) => {
  const { items, updateCategoryname, categoryName } = props

  const handleName = (cat) => {
    updateCategoryname(cat)
  }
  return (
    <section className="categories">
      <div className="slider">
        {Object.values(items).map((value, index) => {
          const cat = value.id

          return (
            <Link
              key={value.id}
              to="/catalog">
              <div
                className="category"

                value={categoryName}
                onClick={() => handleName(cat)}
              >
                <img
                  key={index}
                  className="category__img"
                  src={value.image}
                  alt={value.name}
                />
                <p
                  className="category_subtitle">{value.name}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  );
}

export default Categories;
