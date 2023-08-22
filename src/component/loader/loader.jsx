import css from '../loader/loader.module.css'

const Loader = (props) => {

    return (
        <div className={css.container}>
            <div className={css.wrapLoader}>
                <div className={` ${css.spinner} ${css.one}`}></div>
                <div className={` ${css.spinner} ${css.two}`}></div>
                <div className={` ${css.spinner} ${css.three}`}></div>
                <div className={` ${css.spinner} ${css.four}`}></div>
                <div className={` ${css.spinner} ${css.five}`}></div>
                <div className={` ${css.spinner} ${css.six}`}></div>
            </div>
        </div>
    );
}

export default Loader;
