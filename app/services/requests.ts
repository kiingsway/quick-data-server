import axios from "axios";

export const site = "http://127.0.0.1:5000";
const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

export async function get_list(list_name: string): Promise<IList> {
  const url = `${site}/lists/${list_name}`;
  return (await axios.get<IList>(url, { headers })).data;
}

export async function get_lists(): Promise<IList[]> {
  const url = `${site}/lists`;
  return (await axios.get<IList[]>(url, { headers })).data;
}

export async function create_list(listName: string): Promise<IList> {
  const url = `${site}/lists`;
  const body = { Name: listName };
  return (await axios.post<IList>(url, body, { headers })).data;
}

export async function edit_list(listName: string, body: IList): Promise<void> {
  const url = `${site}/lists/${listName}`;
  return (await axios.patch(url, body, { headers })).data;
}

export async function delete_list(listName: string): Promise<IList> {
  const url = `${site}/lists/${listName}`;
  return (await axios.delete(url, { headers })).data;
}

export async function get_list_items(listName: string): Promise<IAnyListItem[]> {
  const url = `${site}/lists/${listName}/items`;
  return (await axios.get<IAnyListItem[]>(url, { headers })).data;
}