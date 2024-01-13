interface IList {
  Name: string;
  LastID: number;
}

interface IAppContext {
  lists: IList[];
  setList: (list?: string) => void;
  updateLists: (newLists?: IList[]) => void;
}