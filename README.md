# react-redux
react의 구현체 redux를 이용한 쿠폰생성기 예제


## testing
```javascript
npm install
gulp
```

gulpfile.js 에 'webserver', 'browserify', 'watch' 가 지정되어 있고, webserver로는 express를 사용하고 react(jsx)와 ecmascript 2015 문법을 사용하기 위해 babel presets을 사용하였다.


## 학습목표

react의 구현체인 redux를 간단한 예제를 통해 어떻게 적용하는지 데이터(상태)가 어떻게 변화되고 전달 되는지 알아본다. 


## redux 구조

redux는 다음과 같은 구조를 가진다.

- **store** 애플리케이션의 상태를 저장/수정 할 수 있는 객체 이며, 하나의 애플리케이션당 하나의 store를 가진다.
- **reducer** 이전 상태와 현재 상태를 받아서 다음 상태를 반환하는 순수 함수이다.
- **action** 애플리케이션에서 store에 데이터의 묶음 이고 순수 함수로 되어 있다.
- **container component** redux와 연결하기 위한 상위 컴포넌트
- **component** 하위 컴포넌트

### store

```javascript
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import todos from './reducers';
import Apps from './containers/Apps';

let store = createStore(todos);
render(
    <Provider store={store}>
        <Apps />
    </Provider>, document.getElementById('wrap')
)
```
스토어에 리듀서를 등록하고 Apps(container component)에 props로 store를 념겨 참조할 수 있도록 하여야 한다.
flux에서는 여러 스토어를 가질 수 있지만 redux는 하나의 스토어를 가질 수 있다.
애플리케이션의 크기가 커지면 스토어를 만드는 것이 아니라 하나의 스토어에 여러게의 리듀서를 가지는 형태가 되어야 한다.


### reducer

todos에서 반환되는 state={}는 이전상태이고 action은 액션에서 보낸 현재 상태이다. 여기서 주의할 점은 리듀서에는 어떠한 비지니스 로직 및 계산하는 자바스크립트 형식이 들어가면 안된다. 이곳은 상태의 변경을 감지하는 역할만 한다.

```javascript
import {CREATE_COUPON} from '../actions';

const todos = (state={}, action) => {
    switch(action.type){
        case CREATE_COUPON:
            return [...state, {
                'type':action.type,
                'code':action.code
            }]
        default:
            return state
    }
}

export default todos
```

애플리케이션이 커지면 커질수록 많은 리듀서들이 생겨나게 되어 파일을 쪼개어 관리는 방법이 훤씩 효율적이다. combineReducers를 이용하여 쪼개진 리듀서들 묶어 
줄수 있다.

```javascript
import {combineReducers} from 'redux';
import reducer1 from './reducer1.js';
import reducer2 from './reducer2.js';

const todoApp = combineReducers({
    reducer1,
    reducer2
});

export default todoApp;
```


### action

액션또한 리듀서와 같아 비지니스로직이 없어야 한다.

```javascript
export const CREATE_COUPON = 'CREATE_COUPON';
export const createCoupon = (code) => {
    return {
        type:CREATE_COUPON,
        code:code
    }
}
```


### container component

redux의 connect를 사용하여 컴포넌트에 dispatch와 state를 주입 시킨다.
하위 컴포넌트에서 받은 데이터 묶음을 dispatch로 액션을 보내고 변경된 상태를 다시 하위 컴포넌트로 전달한다.

```javascript
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createCoupon} from '../actions';
import App from '../components/App';


class Apps extends Component {
    render(){
        const {dispatch, state} = this.props;
        this.state = (state.length) ? {code:state[state.length - 1].code} : '';
        return <App onclick={code => dispatch(createCoupon(code))} coupon={{code:this.state.code}} />
    }
}

const mapStateToProps = (state) => {
    return {
        state:state.todo
    }
}

export default connect(mapStateToProps)(Apps);
```
컴포넌트에서 바로 값을 변경 ( this.setState )를 하지않고 store에서 생성된 state를 받아 component로 값을 전달( props ) 한다.


### component

쿠폰 키를 생성하는 로직을 이곳에 구현한다. 버튼 클릭시 생성된 쿠폰키를 바로 this.setState 하지 않고 props 로 전달 받아 변경한다.

```javascript
import React, {Component} from 'react';
import uuid from 'node-uuid';

class App extends Component{
    clickHandler(e){
        this.props.onclick(uuid.v4());
    }

    render(){
        return(
            <div className='container'>
                <h1>CouponPage</h1>
                <span>{this.props.coupon?this.props.coupon.code:''}</span>
                <button onClick={e => this.clickHandler(e)}>쿠폰받기</button>
            </div>
        )
    }
}

export default App;
```
