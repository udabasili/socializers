import React, { Component } from 'react';
import Card from '../components/card.component';
export default class Friends extends Component {
  
  render() {
    let friends = null
    const { currentUser} = this.props
    friends = currentUser.friends

    return (
      <div className="friends__list">
        {friends ? (
          friends.map((friend, index) => (
            <Card
              name={friend.username}
              image={friend.userImage}
              link={`/profile/${friend._id}`}
              key={index}
              buttonTitle='View'
              id={friend._id}
            />
          ))
        ) : (
          <h2>No Friends </h2>
        )}
      </div>
    );
  }
}
