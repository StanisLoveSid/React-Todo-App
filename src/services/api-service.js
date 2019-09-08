export default class ApiService {

  _apiBase = 'http://localhost:3001';

  async getResource(url){
    const res = await fetch(`${this._apiBase}${url}`);

    if(!res.ok){
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }

    return await res;
  }

  async getAllProjects(){
    let array = [];
    await this.getResource(`/projects.json`).then(response => {
      return response.json();
    }).then(data => { array = data })
    return await array;
  }

  getProject(id){
    return this.getResource(`/projects/${id}`)
  }

}
