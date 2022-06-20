export const selectBrandReducer = state => state.brandReducer;

export const selectInformationBrand = state => (
  selectBrandReducer(state) ? state.brandReducer.get('data').data : []
);

export const selectInformationSection = state => {
  return selectBrandReducer(state) ? state.brandReducer.get('data').data[0] : {};
};

export const selectFiles = (state, type) => {
  const files = state.brandReducer.get('data').data[1];
  const information = selectBrandReducer(state)
    ? files && files.filter(file => file.type === type)
    : [];
  return information;
};

export const selectTypeFileUploading = state => {
  return selectBrandReducer(state)
    ? selectBrandReducer(state).get('typeFileUploading')
    : '';
};
export const selectIsloading = state => {
  return selectBrandReducer(state)
    ? selectBrandReducer(state).get('isFileLoading')
    : {};
};
