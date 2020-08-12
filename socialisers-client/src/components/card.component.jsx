import React from 'react'
import { LazyLoadImage } from "react-lazy-load-image-component";
import loading from '../assets/images/loading.png'
import noImage from '../assets/images/no-image.png'
import { Link } from 'react-router-dom';

export default function Card({name, image, link, id, buttonTitle, externalLink}) {

    return (
		<div className="card">
			<img
				className="card__image"
				src={image ? image : noImage}
				/>
			<div className="card__content">
			<span className="username">{name}</span>
			{externalLink ? (
				<a
					href={link}
					className="card__button"
					target="_blank"
					>
					{buttonTitle}
				</a>
			) : (
				<Link to={link} className="card__button">
					{buttonTitle}
				</Link>
			)}
			</div>
		</div>
    );
}
