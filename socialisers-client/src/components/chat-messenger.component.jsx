import React from "react";
import CCManager from "../services/cometChat";
import { CometChat } from "@cometchat-pro/chat";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ChatMessenger extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		messages: [],
		messageText: "",
		senderID: props.currentUser.username,
		sendName: props.currentUser.name,
		recieverId: "",
		};
	}

	componentDidMount() {
		this.messageListener();
	}

	goBack = () => {
		this.props.setReceiver(null)
	}

	scrollToBottom = () => {
		const chat = document.getElementById("chatList");
		chat.scrollTop = chat.scrollHeight;
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.sendMessage();
		event.target.reset();
	};

	handleChange = (event) => {
		this.setState({ messageText: event.target.value });
	};

	messageListener = () => {
		CCManager.addMessageListener((data, error) => {
		if (error) return console.log(`error: ${error}`);
		this.setState(
			(prevState) => ({
			messages: [...prevState.messages, data],
			}),
			() => {
			this.scrollToBottom();
			}
		);
		});
	};

	sendMessage = () => {
		var receiverID = this.props.receiver.username;
		var receiverType = CometChat.RECEIVER_TYPE.USER;
		var textMessage = new CometChat.TextMessage(
		receiverID,
		this.state.messageText,
		receiverType
	);

    CCManager.sendMessage(textMessage).then((message) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message],
      }));
    });
  };

  render() {
    const { senderID } = this.state;
    var receiver= this.props.receiver;
    return (
		receiver &&
			<div className="chat-messenger">
				<div className="chat-messenger__header">
					<div className="user-header">
						{receiver.username}
						<FontAwesomeIcon 
						icon={faTimes} 
						color="red" 
						onClick={this.goBack}
						style={{marginLeft: '1rem', cursor: 'pointer'}} />
					</div>
				</div>
				<ul className="chat-messenger__list" id="chatList">
				{this.state.messages.map((data) => (
					<div key={data.id}>
					{data.sender.uid === senderID ? (
						<li className="chat-message self">
						<div className="chat-message__avatar">
							{" "}
							{data.sender.uid[0]}
						</div>
						<p className="chat-message__message">{data.data.text}</p>
						</li>
					) : (
						<li className="chat-message other">
						<div className="chat-message__avatar ">
							{" "}
							{data.sender.uid[0]}
						</div>
						<p className="chat-message__message">{data.data.text}</p>
						</li>
					)}
					</div>
				))}
				</ul>
				<div className="chat-messenger__input">
				<form onSubmit={this.handleSubmit}>
					<input
					className="chat-messenger__textarea"
					type="text"
					placeholder="Type message and press Enter"
					onChange={this.handleChange}
					/>
				</form>
			</div>
		</div>
    );
  }
}
export default ChatMessenger