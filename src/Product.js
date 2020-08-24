import React, {useState, useEffect} from 'react';
import { db } from './firebase';
import firebase from "firebase";
import { FaStar, FaArrowRight, FaUser, FaTimesCircle } from 'react-icons/fa';
import Ratings from "./Ratings";


function Product(props) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const [ratingsSum, setRatingsSum] = useState(null);
    const [averageRate, setAverageRate] = useState(props.averageRate);

    const [open, setOpen] = useState(false);

    const [reviews, setReviews] = useState(props.reviews);


    useEffect(() => {
        let subscribed;
        if (props.productId) {
            subscribed = db
                .collection("products")
                .doc(props.productId)
                .collection("comments")
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }
        return () => {
            subscribed();
        };
    }, [props.productId]);


    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n-1) + '...' : str;
    }

    const postComment = (event) => {
        event.preventDefault();
        let data = {
            text: comment,
            username: props.user.displayName,
            rating: rating,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        db.collection("products").doc(props.productId).collection("comments").add(data);


        setRatingsSum(ratingsSum + rating);
        setAverageRate((averageRate*comments.length*5 + rating*100)/((comments.length+1)*5));
        db.collection('products').doc(props.productId).update({averageRate: (averageRate*comments.length*5 + rating*100)/((comments.length+1)*5)});


        setReviews(reviews + 1);
        db.collection('products').doc(props.productId).update({reviews: reviews + 1});

        setComment('');
        setRating(null)
    };


    return (
        <div className="product">
            <div className={props.user? "product__card" : "product__card-diff"}>
                <div className={props.user? "product__card-content": "product__card-diff-content"}>
                    <div className={props.user? "product__card-image" : "product__card-diff-image"}>
                        <img src={props.imageUrl} alt={props.title}/>
                    </div>
                    <div className={props.user? "product__card-body" : "product__card-diff-body"}>
                        <h3>{props.title}</h3>
                        {props.user && <p>{truncate(props.description, 80)}</p>}
                        <p>{props.price} &#36;</p>
                        <div className={`product__star-rating ${props.user && "product__star-rating-diff"}`}>
                            <div className="product__star-rating-sprite">
                                <span style={{width:`${averageRate}%`}} className="product__star-rating-sprite-rating"/>
                            </div>
                            {props.user && <p> ({reviews})</p>}
                        </div>
                        {props.user && <p className="product__see-comments" onClick={() => setOpen(true)}>Comments <span><FaArrowRight/></span></p>}
                    </div>
                </div><div className="product__comments-wrapper">
                    {props.user &&
                    <div className={open? "product__comments-visible" : "product__comments-invisible"}>
                        <div className="product__comments">
                            {comments.map((comment, id) => (
                                <div key={id} className="product__comment">
                                    <div className="product__comment-user">
                                        <div className="product__comment-userIcon">
                                            <span><FaUser/></span>
                                        </div>
                                        <div className="product__comment-username">
                                            <h4>{comment.username}</h4>
                                            <Ratings rating={comment.rating}/>
                                        </div>
                                    </div>
                                    <p className="product__comment-text">{comment.text}</p>
                                </div>

                            ))}
                        </div>
                        <form className="product__comment-box">
                                <h3>Leave a comment</h3>
                                <div className="product__rating-wrapper">
                                    <p className="product__rating-wrapper__text">Rate the product: </p>
                                    {
                                        [...Array(5)].map((star, i) => {
                                                const ratingValue = i + 1;
                                                return(
                                                    <label key={i}>
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            value={ratingValue}
                                                            onClick={() => setRating(ratingValue)}
                                                        />
                                                        <FaStar
                                                            className="star"
                                                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                                            onMouseOver={() => setHover(ratingValue)}
                                                            onMouseOut={() => setHover(null)}
                                                        />
                                                    </label>
                                                )
                                            }

                                        )}

                                </div>
                                <textarea
                                    className="product__comment-box__textarea"
                                    type="text"
                                    placeholder="Type something..."
                                    value={comment}
                                    name="comment"
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button
                                    disabled={!(comment && rating)}
                                    className="product__comment-box__button"
                                    type="submit"
                                    onClick={postComment}
                                >
                                    Post
                                </button>
                        </form>
                        <div onClick={() => setOpen(false)} className="product__comments-visible__exitIcon"><FaTimesCircle/></div>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Product;
