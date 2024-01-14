interface IList {
  Name: string;
  LastID: number;
}

interface IAppContext {
  lists: IList[];
  setList: (list?: string) => void;
  updateLists: () => void;
  handleAlerts: (message: string, type?: 'success' | 'error') => void;
}

type TListItemValue = string | number | string[] | boolean | undefined;

type IAnyListItem = Record<string, TListItemValue> & { ID: number }; 