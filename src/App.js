import React, {useState, useEffect, useRef} from 'react';
import "./normalize.css";
import { FaTimes } from 'react-icons/fa';
import { TimelineLite, Power3, TweenMax } from "gsap";
import { db, auth } from './firebase';
import Product from "./Product";
import './App.scss';


function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  let nav = useRef(null);
  let section = useRef(null);
  let images = useRef(null);
  let content = useRef(null);

  let tl = new TimelineLite();
  useEffect(() => {
        // navbar vars
        const logo = nav.firstElementChild;
         //images vars
        const imageOne = images.firstElementChild;
        const imageTwo = images.lastElementChild;
        // content vars
        const headlineFirst = content.children[0].children[0];
        const headlineSecond = headlineFirst.nextSibling;
        const contentP = content.children[1];

        TweenMax.to(section, 0, {visibility: "visible"});
        TweenMax.to(nav, 0, {visibility: "visible"});
        //for navbar animation
        tl.from(logo, 1.2, {y: 200, ease: Power3.easeOut}, 'Start')

        // for images animation
        tl.from(imageOne, 1.2, {y: 1280, ease: Power3.easeOut}, 'Start')
            .from(imageOne.firstElementChild, 2, {scale: 1.6, ease: Power3.easeOut}, .2)
            .from(imageTwo, 1.2, {y: 1280, ease: Power3.easeOut}, .2)
            .from(imageTwo.firstElementChild, 2, {scale: 1.6, ease: Power3.easeOut}, .2);
        // for content animation
        tl.staggerFrom([headlineFirst.children, headlineSecond.children], 1, {
            y: 102,
            ease: Power3.easeOut,
            delay: 0.8
        }, .15, 'Start')
            .from(contentP, 1, {y: 20, opacity: 0, ease: Power3.easeOut}, 1.4);

      db.collection('products').onSnapshot(snapshot => {
          setProducts(snapshot.docs.map(doc => ({
              id: doc.id,
              product: doc.data()
          })))
      });
  }, []);


  useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser){
                //user has logged on
                console.log(authUser);
                setUser(authUser);
            }else{
                //user has logged out
                setUser(null);
            }
        });
        return () => {
            //perform some cleanup actions
            unsubscribe();
        }
    }, [user, username]);

  const signIn = (event) => {
        event.preventDefault();
        auth
            .signInWithEmailAndPassword(email,password)
            .catch((error) => alert(error.message));
        setOpenSignIn(false);
    };

  const signUp = (event) => {
        event.preventDefault();
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) =>{
                return authUser.user.updateProfile({
                    displayName: username
                })
            })
            .catch((error) => alert(error.message));
        setOpen(false)
    };


  return (
    <div className="app">
        <div className={open ? "app__modal-visible" : "app__modal-invisible"}>
            <form className="app__signUp">
                <div className="app__signUp-header">
                    <h3>Sign up</h3>
                    <FaTimes onClick={() => setOpen(false)}/>
                </div>
                <div className="app__signUp-body">
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="email"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="app__signUp-button" onClick={signUp}>Sign up</button>
                </div>
            </form>
        </div>
        <div className={openSignIn ? "app__modal-visible" : "app__modal-invisible"}>
            <form className="app__signUp">
                        <div className="app__signUp-header">
                            <h3>Sign in</h3>
                            <FaTimes onClick={() => setOpenSignIn(false)}/>
                        </div>
                    <div className="app__signUp-body">
                        <input
                            type="text"
                            placeholder="email"
                            value={email}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" onClick={signIn}>Sign in</button>
                    </div>


                </form>
        </div>
      <div className="app__header">
        <div className="container">
            <div className="app__nav" ref={el => nav = el}>
                <a href="#" className="app__logo">Shopping Mall</a>

                {user ? (
                    <button className="app__login-container__button" onClick={() => auth.signOut()}>Sign out</button>
                ):(

                    <div className="app__login-container">
                        <button className="app__login-container__button" onClick={() => setOpenSignIn(true)}>Sign in</button>
                        <button className="app__login-container__button" onClick={() => setOpen(true)}>Sign up</button>
                    </div>
                )}
            </div>

        </div>
        <div className="container" >
            <div className="app__header-content" ref={el => section = el}>
                <div className="app__header-content__wrapper" ref={el => content = el}>
                    <h1 className="app__header-content__headline">
                        <div className="app__header-content__line">
                            <div className="app__header-content__line-inner">Do shopping from</div>
                        </div>
                        <div className="app__header-content__line">
                            <div className="app__header-content__line-inner">anywhere.</div>
                        </div>
                    </h1>
                    {!user && <p>Sign up to get started</p>}
                </div>
                <div className="app__header-content__images">
                    <div className="app__header-content__images-inner" ref={el => images = el}>
                        <div className="app__header-content__images-one">
                            <img src="/image-one.jpg" alt="header-img" id="header-img"/>
                        </div>
                        <div className="app__header-content__images-two">
                            <img src="/image-two.jpg" alt="header-img" id="header-img"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
      <div className="app__product-list">
          <div className="container">
              <div className="app__headline">
                  <h3>Our products</h3>
              </div>
              <div className={user? "app__products" : "app__products-diff"}>
              {
                  products.map(({id,product}) => (
                      <Product key={id}
                               productId={id}
                               user={user}
                               username={username}
                               title={product.title}
                               description={product.description}
                               reviews={product.reviews}
                               price={product.price}
                               imageUrl={product.imageUrl}
                               averageRate={product.averageRate}
                      />
                  ))
              }
              </div>
          </div>
      </div>
    </div>
  );
}

export default App;
