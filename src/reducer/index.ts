interface AuthorAction {
  type: "NEW_SEARCH" | "ADD";
  payload: any;
}

interface AuthorState {
  authors: string[];
}

export function reducer(state: AuthorState, action: AuthorAction) {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        authors: [...state.authors, ...action.payload],
      };
    case "NEW_SEARCH":
      return {
        ...state,
        authors: action.payload,
      };
    default:
      throw new Error();
  }
}
