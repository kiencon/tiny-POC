export const selectBlocksReducer = state => state.blocksReducer;

export const selectBlocks = state => (
  selectBlocksReducer(state)
    ? selectBlocksReducer(state).get('data')
    : {}
);

export const selectRefs = state => (
  selectBlocksReducer(state)
    ? selectBlocksReducer(state).get('data')
    : {}
);
