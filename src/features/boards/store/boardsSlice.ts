import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BoardResponseDto } from '@/infrastructure/api/generated/models/BoardResponseDto';
import type { BoardRequestDto } from '@/infrastructure/api/generated/models/BoardRequestDto';

interface BoardsState {
    boards: BoardResponseDto[];
    currentBoard: BoardResponseDto | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: BoardsState = {
    boards: [],
    currentBoard: null,
    isLoading: false,
    error: null,
};

export const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        fetchBoardsRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchBoardsSuccess: (state, action: PayloadAction<BoardResponseDto[]>) => {
            state.isLoading = false;
            state.boards = action.payload;
        },
        fetchBoardsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        createBoardRequest: (state, _action: PayloadAction<BoardRequestDto>) => {
            state.isLoading = true;
            state.error = null;
        },
        createBoardSuccess: (state, action: PayloadAction<BoardResponseDto>) => {
            state.isLoading = false;
            state.boards.push(action.payload);
        },
        createBoardFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        setCurrentBoard: (state, action: PayloadAction<BoardResponseDto | null>) => {
            state.currentBoard = action.payload;
        },
    },
});

export const {
    fetchBoardsRequest,
    fetchBoardsSuccess,
    fetchBoardsFailure,
    createBoardRequest,
    createBoardSuccess,
    createBoardFailure,
    setCurrentBoard,
} = boardsSlice.actions;

export default boardsSlice.reducer;
