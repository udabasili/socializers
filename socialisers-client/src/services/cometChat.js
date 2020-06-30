import {
    CometChat
} from "@cometchat-pro/chat";
const region = "US";
const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
export default class CCManager {
    static LISTENER_KEY_MESSAGE = "msglistener";
    static appId = process.env.REACT_APP_COMET_CHAT_APP_ID ;
    static apiKey = process.env.REACT_APP_COMET_CHAT_AUTH_KEY;
    static LISTENER_KEY_GROUP = process.env.REACT_APP_COMET_GUID;
    
    static init() {
        console.log(process.env)
        return CometChat.init(CCManager.appId, appSetting);
    }

    static createUser(uid, name){
        var user = new CometChat.User(uid);

        user.setName(name);
        return CometChat.createUser(user, this.apiKey)
    }
    static getTextMessage(uid, text) {
        return new CometChat.TextMessage(
            uid,
            text,
            CometChat.MESSAGE_TYPE.TEXT,
            CometChat.RECEIVER_TYPE.USER
        );
    }

    static getMessages(){
        var conversationsRequest = new CometChat.ConversationsRequestBuilder()
            .setLimit(50)
            .setConversationType('user')
            .build();

        return conversationsRequest.fetchNext().then(
            conversationList => {
                console.log(conversationList)
                return conversationList
            },
            error => {
                console.log("Conversations list fetching failed with error:", error);
            }
        );
    }
    static getLoggedinUser() {
        return CometChat.getLoggedinUser();
    }
    static login(UID) {
        return CometChat.login(UID, this.apiKey);
    }

    static sendMessage(textMessage){
        return CometChat.sendMessage(textMessage)
        
    }
    static logOut(){
        return CometChat.logout()
    }

    static getUserMessages(GUID, callback, limit = 30) {
        const messagesRequest = new CometChat.MessagesRequestBuilder()
            .setGUID(GUID)
            .setLimit(limit)
            .build();
        callback();
        return messagesRequest.fetchPrevious();
    }

    static addMessageListener(callback) {
        CometChat.addMessageListener(
            this.LISTENER_KEY_MESSAGE,
            new CometChat.MessageListener({
                onTextMessageReceived: textMessage => {
                    callback(textMessage);
                }
            })
        );
    }
}
