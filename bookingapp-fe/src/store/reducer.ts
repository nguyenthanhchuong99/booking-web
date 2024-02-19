interface ShouldRenderState {
  shouldRender: boolean;
}

const initialState: ShouldRenderState = {
  shouldRender: false,
};

const shouldRenderReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'TOOGLE_SHOULD_RENDER':
      return {
        ...state,
        shouldRender: action.payload,
      };
    default:
      return state;
  }
};

export default shouldRenderReducer;
