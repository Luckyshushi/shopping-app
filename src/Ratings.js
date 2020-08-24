import React from 'react';
import "./Ratings.scss";
import { FaStar } from 'react-icons/fa';

const Ratings = ({rating}) => {

    return(
        <div className="rating-wrapper">
            {
                [...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return(
                        <label key={i}>
                            <input
                                    className="rating-wrapper__input"
                                   type="radio"
                                   name="rating"
                                   value={ratingValue}

                            />
                            <FaStar
                                className="rating-wrapper__star"
                                color={ratingValue <= (rating) ? "#ffc107" : "#e4e5e9"}
                            />
                        </label>
                    )
                    }

                )}

        </div>
    )
};

export default Ratings;