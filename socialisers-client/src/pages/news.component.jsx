import React from 'react'
import { connect } from 'react-redux'
import Card from '../components/card.component';
import ReactLoading from "react-loading";

function News({news}) {
  
	return (
			<div className="world-news">
				{news.length > 0 ? (
					news.map((data, index) => (
						<Card
							name={data.title}
							image={data.urlToImage}
							link={data.url}
							buttonTitle="Open"
							externalLink={true}
							key={index}
						/>
					))
				) : (
					<ReactLoading
					type="bars"
					style={{
						position: "absolute",
						left: "50%",
						height: 100,
						width: 80,
						fill: "#75a1f3",
					}}
				/>
			)}
		</div>
	);
}

const mapStateToProps = (state) => ({
    news: state.user.news
})


export default connect(mapStateToProps, null)(News)