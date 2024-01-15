from flask import Flask, request, jsonify, json
from flask_cors import CORS
import json
import os
from unidecode import unidecode
import parameters

app = Flask(__name__)
CORS(app)  # Habilita o CORS para todas as rotas
app.config["JSON_AS_ASCII"] = False

lists_file = "lists"
root_path = os.getcwd()


def report_list_name(list_name: str):

    lists = get_lists()
    list_index = next((index for index, list_data in enumerate(lists) if list_data["Name"] == list_name), -1)
    ls = lists[list_index] if list_index >= 0 else None

    errors = {
        "nameMissing": not list_name,
        "nameBelowMinLen": len(list_name) < parameters.minimum_list_character,
        "forbiddenName": unidecode(list_name).lower() in parameters.forbidden_list_names,
        "found": bool(ls),
    }

    texts = {
        "nameMissing": "The 'Name' property is missing or empty.",
        "nameBelowMinLen": f"The list name must have at least {parameters.minimum_list_character} characters.",
        "forbiddenName": f"The list name cannot be '{list_name}'. Please choose a different name.",
        "found": "A list with the specified name already exists. Please choose a different name.",
        "notFound": f"List '{list_name}' not found",
    }

    return {"errors": errors, "texts": texts, "list": ls, "lists": lists}


def rename_file(file_path: str, new_name: str):
    path, file_name = os.path.split(file_path)
    new_path = os.path.join(path, f"{new_name}.json")
    os.rename(file_path, new_path)


def get_json_data(json_path: str, full_path: bool = False):
    path = json_path if full_path else f"{root_path}\\{json_path}.json"
    with open(path, "r") as file:
        return json.load(file)


def save_json_data(json_path: str, data, full_path: bool = False):
    path = json_path if full_path else f"{root_path}\\{json_path}.json"
    with open(path, "w") as file:
        json.dump(data, file, indent=2)


def send_error(message: str, status_code: int = 400):
    # traceback.print_exc()
    print("❌ ERROR: " + message)
    return jsonify({"status": "error", "message": message}), status_code


def send_success(message: str, status_code: int = 200):
    return jsonify({"status": "success", "message": message}), status_code


# Ver listas
@app.route("/lists", methods=["GET"])
def get_lists() -> list:
    return get_json_data(lists_file)


@app.route("/lists/<string:list_name>", methods=["GET"])
def get_list(list_name: str):
    try:
        list_report = report_list_name(list_name)
        if list_report['errors']['nameMissing']:
            return send_error(list_report['texts']['nameMissing'], 400)
        if not list_report['errors']['found'] or not list_report['list']:
            return send_error(list_report['texts']['notFound'], 404)
        return list_report['list']
    except Exception as e:
        return send_error(str(e))


# Criar lista
@app.route("/lists", methods=["POST"])
def create_list() -> object:
    try:
        list_data = json.loads(request.data.decode("utf-8"))
        list_name = list_data.get("Name")
        list_report = report_list_name(list_name)
        if list_report['errors']['nameMissing']:
            return send_error(list_report['texts']['nameMissing'], 400)
        if list_report['errors']['nameBelowMinLen']:
            return send_error(list_report['texts']['nameBelowMinLen'], 403)
        if list_report['errors']['forbiddenName']:
            return send_error(list_report['texts']['forbiddenName'], 403)
        if list_report['errors']['found']:
            return send_error(list_report['texts']['found'], 403)
        new_list = {"Name": list_name, "Title": list_data.get("Title"), "LastID": 0}
        list_report['lists'].append(new_list)
        save_json_data(lists_file, list_report['lists'])
        save_json_data(list_name, [])
        return new_list

    except Exception as e:
        return send_error(str(e))


# Editar lista
@app.route("/lists/<string:list_name>", methods=["PATCH"])
def edit_list(list_name: str):
    try:
        if not list_name:
            return send_error("Invalid list. Please provide a valid list name.")
        list_data = json.loads(request.data.decode("utf-8"))
        new_list_name = list_data.get("Name")
        if not new_list_name:
            return send_error("The 'Name' property is missing or empty.")
        if unidecode(list_name).lower() == "lists":
            return send_error("The list name cannot be 'lists'")
        lists = get_lists()
        if not any(li.get("Name") == list_name for li in lists):
            return send_error(f"List '{list_name}' not found", 404)
        if any(li.get("Name") == new_list_name for li in lists):
            return send_error("A list with the specified name already exists. Please choose a different name.")
        list_index = next((index for index, li in enumerate(lists) if li["Name"] == list_name), -1)
        lists[list_index] = {**lists[list_index], "Name": new_list_name}

        rename_file(f"{root_path}\\{list_name}.json", new_list_name)
        save_json_data(lists_file, lists)
        return send_success("Lista atualizada com sucesso.")

    except Exception as e:
        return send_error(str(e))


# Excluir lista
@app.route("/lists/<string:list_name>", methods=["DELETE"])
def delete_list(list_name: str):
    try:
        if not list_name:
            return send_error("Invalid list. Please provide a valid list name.")
        if unidecode(list_name).lower() == "lists":
            return send_error("The list name cannot be 'lists'")
        lists = get_lists()
        list_index = next((index for index, li in enumerate(lists) if li["Name"] == list_name), -1)
        if list_index == -1:
            return send_error(f"List '{list_name}' not found", 404)
        del lists[list_index]
        save_json_data(lists_file, lists)
        list_file_path = f"{root_path}\\{list_name}.json"
        if os.path.exists(list_file_path):
            os.remove(list_file_path)
        return send_success(f"List '{list_name}' deleted.")
    except Exception as e:
        return send_error(str(e))


# Ver itens
@app.route("/lists/<string:list_name>/items", methods=["GET"])
def get_list_items(list_name: str):
    try:
        if not list_name:
            return send_error("Invalid list. Please provide a valid list name.")
        lists = get_lists()
        list_index = next((index for index, li in enumerate(lists) if li["Name"] == list_name), -1)
        if list_index == -1:
            return send_error(f"List '{list_name}' not found", 404)
        list_items = get_json_data(list_name)
        return list_items
    except FileNotFoundError:
        return send_error("CRITICAL: File list not found", 404)
    except Exception as e:
        return send_error(str(e))


# Ver item
@app.route("/lists/<string:list_name>/items(<int:item_id>)", methods=["GET"])
def get_list_item(list_name: str, item_id: int):
    try:
        if not list_name:
            return send_error("Invalid list. Please provide a valid list name.")
        list_items = get_list_items(list_name)
        list_item_index = next((index for index, list_item in enumerate(list_items) if list_item["ID"] == item_id), -1)
        if list_item_index == -1:
            return send_error(f"List item not found", 404)
        return list_items[list_item_index]
    except FileNotFoundError:
        return send_error("CRITICAL: File list not found", 404)
    except Exception as e:
        return send_error(str(e))


# Criar item
@app.route("/lists/<string:list_name>/items", methods=["POST"])
def create_list_item(list_name: str):
    try:
        if not list_name:
            return send_error("Invalid list. Please provide a valid list name.")

        # Corpo da requisição
        new_item = request.get_json()

        # Obtém as informações da lista
        list_data = get_list(list_name)

        # Adiciona +1 ao LastID e constrói o objeto do novo item
        new_id = list_data.LastID + 1
        body = {**new_item, "ID": new_id}

        # Obtém os itens da lista, adiciona esse novo item à lista e salva no JSON
        list_items = get_list_items(list_name)
        list_items.append(body)
        save_json_data(list_name, list_items)

        # Obtendo as listas, atualiza a propriedade LastID do app em questão e salva o arquivo
        lists = get_lists()
        for list_data in lists:
            if list_data["Name"] == list_name:
                list_data["LastID"] = new_id
        save_json_data(lists_file, lists)

        # Retorna o corpo do item criado
        return body

    except FileNotFoundError:
        return send_error("CRITICAL: File list not found", 404)
    except Exception as e:
        return send_error(str(e))


# Editar item
@app.route("/lists/<string:list_name>/items(<int:item_id>)", methods=["PATCH"])
def edit_list_item(list_name, item_id: int):
    try:
        if not list_name:
            return send_error("Invalid list. Please provide a valid list name.")
        item = get_list_item(list_name, item_id)
        edited_item = request.get_json()
        new_edited_item = {**item, **edited_item, "ID": item.ID}
        list_items = get_list_items(list_name)
        list_item_index = next((index for index, li in enumerate(list_items) if li["ID"] == item_id), -1)
        if list_item_index == -1:
            return send_error(f"List item not found", 404)
        list_items[list_item_index] = new_edited_item
        save_json_data(list_name, list_items)
        return new_edited_item
    except Exception as e:
        return send_error(str(e))


# Excluir item
@app.route("/lists/<string:list_name>/items(<int:item_id>)", methods=["DELETE"])
def delete_list_item(list_name: str, item_id: int) -> object:
    try:
        if not list_name:
            return send_error("Invalid list. Please provide a valid list name.")
        item = get_list_item(list_name, item_id)
        list_items = get_list_items(list_name)
        list_item_index = next((index for index, list_item in enumerate(list_items) if list_item["ID"] == item.ID),
                               -1)
        if list_item_index == -1:
            return send_error(f"List item {item_id} not found", 404)
        del list_items[list_item_index]
        save_json_data(list_name, list_items)
        return send_success(f"List item {item_id} from list '{list_name}' was deleted.")

    except Exception as e:
        return send_error(str(e))


if __name__ == "__main__":
    # Roda o servidor na porta 5000
    app.run(debug=True)
