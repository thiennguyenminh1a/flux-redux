import {
    Dispatcher,
    Store
} from "./flux";

const controlPannelDispatcher = new Dispatcher();

const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_FONT_SIZE_PREFERENCE = 'UPDATE_FONT_SIZE_PREFERENCE';


const userNameUpdateAction = (name) => {
    return {
        type: UPDATE_USERNAME,
        value: name,
    }
}

const fontSizePreferenceUpdateAction = (size) => {
    return {
        type: UPDATE_FONT_SIZE_PREFERENCE,
        value: size,
    }
}

// controlPannelDispatcher.register(action => {
//     console.log("Recieved action......", action);
// })

document.getElementById('userNameInput').addEventListener('input', ({
    target
}) => {
    const name = target.value;
    console.log("Dispatching....", name);
    controlPannelDispatcher.dispatch(userNameUpdateAction(name))
})

document.forms.fontSizeForm.fontSize.forEach(element => {
    element.addEventListener('change', ({
        target
    }) => {
        controlPannelDispatcher.dispatch(fontSizePreferenceUpdateAction(target.value))
    })
})

class UserPrefsStore extends Store {
    getInitialState() {
        return localStorage[`preferences`] ? JSON.parse(localStorage[`preferences`]) : {
            userName: "Jim",
            fontSize: "small",
        }
    }
    _onDispatch(action) {
        console.log("Store receieved dispatch", action)
        switch (action.type) {
            case UPDATE_USERNAME:
                this._state.userName = action.value;
                this._emitChange();
                break;
            case UPDATE_FONT_SIZE_PREFERENCE:
                this._state.fontSize = action.value;
                this._emitChange();
                break;
            default:
                break;
        }
    }
    getUserPreferences() {
        return this._state;
    }
}

const userPrefsStore = new UserPrefsStore(controlPannelDispatcher);

const render = (({
    userName,
    fontSize
}) => {
    document.getElementById("userName").innerText = userName;
    document.getElementsByClassName('container')[0].style.fontSize = fontSize === "small" ? "16px" : "24px";
    document.forms.fontSizeForm.fontSize.value = fontSize;
})

userPrefsStore.addListener((state) => {
    console.info('The current state is ....', state);
    render(state);
    localStorage[`preferences`] = JSON.stringify(state);
})

render(userPrefsStore.getUserPreferences())