export type TRestParameters = 'list_name' | 'item_id'
export type EmptyObj = Record<string, never>;

export interface IREST {
  uri: string;
  method: string;
  statusCode?: number;
}

interface RequesterInitialProps {
  title: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  params?: string[];
  form?: EmptyObj | Record<string, string | undefined>
  handleInputParamChange?: (e: any) => void;
  bodyKeys?: string[];
  body?: EmptyObj | Record<string, string | undefined>
  handleInputBodyChange?: (e: any) => void;
}

interface RequesterPropsWithoutParam extends RequesterInitialProps {
  params?: never;
  form?: never;
  handleInputParamChange?: never;
  bodyKeys?: never;
  body?: never;
  handleInputBodyChange?: never;
}

interface RequesterPropsWithParams extends RequesterInitialProps {
  params: string[];
  form: EmptyObj | Record<string, string | undefined>
  handleInputParamChange: (e: any) => void;
}

interface RequesterPropsWithBodyKeys extends RequesterInitialProps {
  bodyKeys: string[];
  body: EmptyObj | Record<string, string | undefined>
  handleInputBodyChange: (e: any) => void;
}

export type RequesterProps = RequesterPropsWithParams | RequesterPropsWithBodyKeys | RequesterPropsWithoutParam;