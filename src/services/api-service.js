export default class ApiService {

  _apiBase = 'http://localhost:3001';

  async getResource(url){
    const res = await fetch(`${this._apiBase}${url}`);

    if(!res.ok){
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }

    return res;
  }

  async getAllProjects(){
    let array = [];
    await this.getResource(`/projects.json`).then(response => {
      return response.json();
    }).then(data => { array = data })
    return array;
  }

  async updateProject(id, propName, statement) {
    console.log(propName)
    await fetch(`${this._apiBase}/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ [propName]: statement }),
      headers:{
        'Content-Type': 'application/json'
      }
    })  
  }

  async postProject(text) {
    let id;
    const data = { label: text } ;
    
    await fetch(`${this._apiBase}/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(result => { id = result.id })
    return id;
  }

  async deleteProject(id){      
    return await fetch(`${this._apiBase}/projects/${id}`, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json'
      }
    })
  }

  getProject(id){
    return this.getResource(`/projects/${id}`)
  }

}
