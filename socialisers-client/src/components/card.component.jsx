import React from 'react'
import { LazyLoadImage } from "react-lazy-load-image-component";
import loading from '../assets/images/loading.png'
import noImage from '../assets/images/no-image.png'

export default function Card({name, image, link, id, buttonTitle, externalLink}) {

    return (
		<div className="card">
			<LazyLoadImage
			alt={loading}
			effect='blur'
			className="card__image"
			src={image ? image : noImage} 
			/>
			<div className="card__content">
			<span className="username">{name}</span>
			<a
				href={link}
				className="card__button"
				target={externalLink ? "_blank" : "_self"}
			>
				{buttonTitle}
			</a>
			</div>
		</div>
    );
}
