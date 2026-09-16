import { call, put, takeLatest } from 'redux-saga/effects';
import { BoardControllerService } from '@/infrastructure/api/generated/services/BoardControllerService';
import type { BoardResponseDto } from '@/infrastructure/api/generated/models/BoardResponseDto';
import {
    fetchBoardsRequest,
    fetchBoardsSuccess,
    fetchBoardsFailure,
    createBoardRequest,
    createBoardSuccess,
    createBoardFailure,
} from './boardsSlice';

function* handleFetchBoards() {
    try {
        const boards: BoardResponseDto[] = yield call([BoardControllerService, 'getUserBoards']);
        yield put(fetchBoardsSuccess(boards));
    } catch (error: any) {
        yield put(fetchBoardsFailure(error.message || 'Failed to fetch boards'));
    }
}

function* handleCreateBoard(action: ReturnType<typeof createBoardRequest>) {
    try {
        const board: BoardResponseDto = yield call([BoardControllerService, 'createBoard'], action.payload);
        yield put(createBoardSuccess(board));
    } catch (error: any) {
        yield put(createBoardFailure(error.message || 'Failed to create board'));
    }
}

export function* boardsSaga() {
    yield takeLatest(fetchBoardsRequest.type, handleFetchBoards);
    yield takeLatest(createBoardRequest.type, handleCreateBoard);
}
