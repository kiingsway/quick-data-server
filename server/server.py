from flask import Flask, request, jsonify, json
from flask_cors import CORS
import json
import os
import traceback

app = Flask(__name__)
CORS(app)  # Habilita o CORS para todas as rotas
app.config['JSON_AS_ASCII'] = False
 
lists_file = 'lists'

def get_json_data(json_path, fullPath=False):
    path = json_path if fullPath else f'{os.getcwd()}\\{json_path}.json'
    with open(path, 'r') as file:
        return json.load(file)
    
def save_json_data(json_path, data, fullPath=False):
    path = json_path if fullPath else f'{os.getcwd()}\\{json_path}.json'
    with open(path, 'w') as file:
        json.dump(data, file, indent=2)

def send_error(message, status_code=400):
    # traceback.print_exc()
    print('❌ ERROR: ' + message)
    return jsonify({'status': 'error', 'message': message}), status_code

def send_success(message, status_code=200):
    return jsonify({'status': 'success', 'message': message})

# Ver listas
@app.route('/lists', methods=['GET'])
def get_lists():
    try:
        return get_json_data(lists_file)
    except Exception as e: return send_error(str(e))

@app.route('/lists/<string:list_name>', methods=['GET'])
def get_list(list_name):
    try:
        lists = get_lists()
        list_index = next((index for index, list in enumerate(lists) if list["Name"] == list_name), -1)
        if (list_index == -1): return send_error(f"List '{list_name}' not found", 404)
        return lists[list_index]
    except Exception as e: return send_error(str(e))

# Criar lista
@app.route('/lists', methods=['POST'])
def create_list():
    try:
        list = json.loads(request.data.decode('utf-8'))
        list_name = list.get('Name')
        if not list_name: return send_error("The 'Name' property is missing or empty.")
        if len(list_name) < 3: return send_error("The list name must have at least 3 characters.")
        lists = get_lists()
        if any(l.get("Name") == list_name for l in lists):
            return send_error("A list with the specified name already exists. Please choose a different name.")
        new_list = {'Name': list_name, 'LastID': 0}
        lists.append(new_list)
        save_json_data(lists_file, lists)
        return new_list 

    except Exception as e: return send_error(str(e))

# Editar lista
@app.route('/lists/<string:list_name>', methods=['PATCH'])
def edit_list(list_name):
    try:
        # Checar se recebeu o nome da lista na requisição
            # Erro relatando que o nome da lista não foi recebido na requisição
        if not list_name: return send_error("Invalid list. Please provide a valid list name.")
        # Checar se recebeu o nome da lista no body
            # Erro relatando que o nome da lista não foi recebido no body
        list = json.loads(request.data.decode('utf-8'))
        new_list_name = list.get('Name')
        if not new_list_name: return send_error("The 'Name' property is missing or empty.")
        # Obter todas as listas
        lists = get_lists()
        # Checar se a lista existe
            # Erro relatando que a lista não foi encontrada
        if not any(l.get("Name") == list_name for l in lists):
            return send_error(f"List '{list_name}' not found", 404)
        # Checar se o novo nome da lista já não está cadastrado
            # Erro relatando que uma lista com esse nome já existe
        if any(l.get("Name") == new_list_name for l in lists):
            return send_error("A list with the specified name already exists. Please choose a different name.")
        # Editar iteração
        list_index = next((index for index, list in enumerate(lists) if list["Name"] == list_name), -1)
        lists[list_index] = {**lists[list_index], "Name": new_list_name}

        save_json_data(lists_file, lists)
        # Salvar JSON
        return send_success('Lista atualizada com sucesso.')

    except Exception as e: return send_error(str(e))

# Excluir lista
@app.route('/lists/<string:list_name>', methods=['DELETE'])
def delete_list(list_name):
    try:
        if not list_name: return send_error("Invalid list. Please provide a valid list name.")
        lists = get_lists()
        list_index = next((index for index, list in enumerate(lists) if list["Name"] == list_name), -1)
        if (list_index == -1): return send_error(f"List '{list_name}' not found", 404)
        del lists[list_index]
        save_json_data(lists_file, lists)
        return send_success(f"List '{list_name}' deleted.")
    except Exception as e: return send_error(str(e))

# Ver itens
@app.route('/lists/<string:list_name>/items', methods=['GET'])
def get_list_items(list_name):
    try:
        if not list_name: return send_error("Invalid list. Please provide a valid list name.")
        lists = get_lists()
        list_index = next((index for index, list in enumerate(lists) if list["Name"] == list_name), -1)
        if (list_index == -1): return send_error(f"List '{list_name}' not found", 404)
        list_items = get_json_data(list_name)
        return list_items
    except FileNotFoundError as e: return send_error('CRITICAL: File list not found', 404)
    except Exception as e: return send_error(str(e))

# Ver item
@app.route('/lists/<string:list_name>/items(<int:item_id>)', methods=['GET'])
def get_list_item(list_name, item_id):
    try:
        if not list_name: return send_error("Invalid list. Please provide a valid list name.")
        list_items = get_list_items(list_name)
        list_item_index = next((index for index, list_item in enumerate(list_items) if list_item["ID"] == item_id), -1)
        if (list_item_index == -1): return send_error(f"List item not found", 404)
        return list_items[list_item_index]
    except FileNotFoundError as e: return send_error('CRITICAL: File list not found', 404)
    except Exception as e: return send_error(str(e))

# Criar item
@app.route('/lists/<string:list_name>/items', methods=['POST'])
def create_list_item(list_name): 
    try:
        if not list_name: return send_error("Invalid list. Please provide a valid list name.")
        
        # Corpo da requisição
        new_item = request.get_json()

        # Obtém as informações da lista
        list = get_list(list_name)

        # Adiciona +1 ao LastID e constrói o objeto do novo item
        new_id = list['LastID'] + 1
        body = {**new_item, 'ID': new_id}

        # Obtém os itens da lista, adiciona esse novo item à lista e salva no JSON
        list_items = get_list_items(list_name)
        list_items.append(body)
        save_json_data(list_name, list_items)

        # Obtendo as listas, atualiza a propriedade LastID do app em questão e salva o arquivo
        lists = get_lists()
        for list in lists:
            if list['Name'] == list_name: list['LastID'] = new_id
        save_json_data(lists_file, lists)

        # Retorna o corpo do item criado
        return body

    except FileNotFoundError as e: return send_error('CRITICAL: File list not found', 404)
    except Exception as e: return send_error(str(e))

# Editar item
@app.route('/lists/<string:list_name>/items(<int:item_id>)', methods=['PATCH'])
def edit_list_item(list_name, item_id):
    try:
        if not list_name: return send_error("Invalid list. Please provide a valid list name.")
        item = get_list_item(list_name, item_id)
        edited_item = request.get_json()
        new_edited_item = {**item, **edited_item, 'ID': item['ID']}
        list_items = get_list_items(list_name)
        list_item_index = next((index for index, list in enumerate(list_items) if list["ID"] == item_id), -1)
        if (list_item_index == -1): return send_error(f"List item not found", 404)
        list_items[list_item_index] = new_edited_item
        save_json_data(list_name, list_items)
        return new_edited_item
    except Exception as e: return send_error(str(e))

# Excluir item
@app.route('/lists/<string:list_name>/items(<int:item_id>)', methods=['DELETE'])
def delete_list_item(list_name, item_id):
    try:
        if not list_name: return send_error("Invalid list. Please provide a valid list name.")
        item = get_list_item(list_name, item_id)
        list_items = get_list_items(list_name)
        list_item_index = next((index for index, list_item in enumerate(list_items) if list_item["ID"] == item['ID']), -1)
        if (list_item_index == -1): return send_error(f"List item {item_id} not found", 404)
        del list_items[list_item_index]
        save_json_data(list_name, list_items)
        return send_success(f"List item {item_id} from list '{list_name}' was deleted.")

    except Exception as e: return send_error(str(e))

if __name__ == '__main__':
    # Roda o servidor na porta 5000
    app.run(debug=True)