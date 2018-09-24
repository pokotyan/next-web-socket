import { put, take, all, fork, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../actions/socket';
import io from 'socket.io-client';

function createSocketConnection() {
  const socket = io('http://localhost:8999');

  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

// この関数は、指定されたソケットからeventChannelを作成します。
// 受信した `initReserve:receive`, `initSelected:receive`, `updateSelected:receive`, `broadCastReserve:receive` イベントに対するsubscriptionをセットアップします
function subscribe(socket) {
  // `eventChannel`はsubscriber関数をとります。
  // subscriber関数はsocketから渡ってきたデータをchannelに入れるために `emit`引数をとります
  return eventChannel(emit => {
    // handlerの役割はデータをchannelに入れることです。
    // これにより、Sagaは返されたchannelからこのデータを取得できます。
    // ここではreduxのactionがデータとしてchannelに入ります。
    const initReserveHandler = async (reservedBox) => {
      emit(socketActions.reserveUpdate({ reservedBox }));
    }

    const initSelectedHandler = async (selectedBox) => {
      emit(socketActions.selectedUpdate({ selectedBox }));
    }

    const updateSelectedHandler = async (selectedBox) => {
      emit(socketActions.selectedUpdate({ selectedBox }));
    }

    const broadCastReserveHandler = async (reservedBox) => {
      emit(socketActions.reserveUpdate({ reservedBox }));
    }

    // subscription をセットアップ
    socket.on('initReserve:receive', initReserveHandler);
    socket.on('initSelected:receive', initSelectedHandler);
    socket.on('updateSelected:receive', updateSelectedHandler);
    socket.on('broadCastReserve:receive', broadCastReserveHandler);

    // subscriberはsubscribeを解除する関数を返さなければなりません。
    // これは、sagaが `channel.close`メソッドを呼び出すときに呼び出されます
    const unsubscribe = () => {
      socket.off('initReserve:receive', initReserveHandler);
      socket.off('initSelected:receive', initSelectedHandler);
      socket.off('updateSelected:receive', updateSelectedHandler);
      socket.off('broadCastReserve:receive', broadCastReserveHandler);
    }

    return unsubscribe;
  });
}

function* initStatus({ socket, userId }) {
  // ブラウザがリロードされたときのためにredisから値を取ってきて、reservedBoxのstore更新
  yield socket.emit('initReserve');
  // ブラウザがリロードされたときのためにredisから値を取ってきて、selectedBoxのstore更新
  yield socket.emit('initSelected', { userId });
}

function* syncStatus(socket) {
  while (true) {
    const { payload: { boxId, userId } } = yield take(socketActions.SYNC_RESERVE);

    yield all([
      // reserveBoxのredisを更新、更新した値をbroadcastして、他ブラウザのreseveBoxのstore更新
      call(socket.emit, ['broadCastReserve', { boxId, userId }]),
      // selectedBoxのredisを更新、自身のブラウザのselectedBoxのstore更新
      call(socket.emit, ['updateSelected', { boxId, userId }]),
    ])
  }
}

function* writeStatus(socket) {
  const channel = yield call(subscribe, socket);

  while (true) {
    // subscriber関数から渡ってきたデータ(reduxのaction)を取得します。
    const action = yield take(channel);

    yield put(action);
  }
}

function* watchOnSocket() {
  while (true) {
    try {
      const { payload: { userId } } = yield take(socketActions.INIT_SOCKET);
      const socket = yield call(createSocketConnection)

      // redisから現在の状態を取得し、storeに反映させる初期化のタスク。
      yield fork(initStatus, { socket, userId });

      // ボックスを選択した際、自身の選択ボックスの更新と、その選択したボックス情報を他ブラウザにブロードキャストするタスク。
      yield fork(syncStatus, socket);

      // webSocketのイベントを待ち受け、socketから受け取ったデータを元にactionをdispatchし、storeを更新するタスク。
      // 上記のinitStatus、syncStatusのタスクがemitするwebsocketのイベントはサーバー側で受信される。
      // 受信後、サーバー側ではredisからのデータ取得,更新の処理が行われ、 `**:receive`　のwebsocketイベントが送信される。
      // その`**:receive`のイベントを待ち受けるタスク。(websocketとredux-sagaの世界を繋ぐためにeventChannelを用いる)
      yield fork(writeStatus, socket);
    } catch (err) {
      console.error('socket error:', err)
    }
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchOnSocket)
  ]);
}
