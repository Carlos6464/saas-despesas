import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../services/http';
import {
  CategoriaPaginatedList,
  CategoriaCreate,
  CategoriaUpdate,
  Categoria,
} from './categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private endpoint = 'v1/categories';
  constructor(private httpService: Http) {}

  /**
   *
   * @param skip O número de registros a pular.
   * @param limit O número de registros por página.
   * @param filtro Termo para filtrar pelo nome da comissão.
   */
  getCategorias(
    skip: number = 0,
    limit: number = 10,
    filtro?: string
  ): Observable<CategoriaPaginatedList> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    if (filtro) {
      params = params.set('name', filtro);
    }
    const url = this.endpoint;

    return this.httpService.get(url, params);
  }

  /**
   *
   * @param id
   */
  getCategoriaById(id: number): Observable<CategoriaCreate> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  /**
   *
   * @param Data
   */
  createCategoria(Data: CategoriaCreate): Observable<Categoria> {
    return this.httpService.post(this.endpoint, Data);
  }

  /**
   *
   * @param id
   * @param Data
   */
  updateCategoria(id: number, Data: CategoriaUpdate): Observable<Categoria> {
    return this.httpService.put(`${this.endpoint}/${id}`, Data);
  }

  /**
   * Deleta uma comissão pelo seu ID.
   * @param id O ID da comissão a ser deletada.
   */
  deleteCategoria(id: number): Observable<any> {
    return this.httpService.delete(`${this.endpoint}/${id}`);
  }
}
