import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import {
  ColumnDefinition,
  ActionDefinition,
} from '../../shared/components/generic-list/generic-list.model';
import {
  Categoria as CategoriaModel,
  CategoriaPaginatedList,
  CategoriaCreate,
  CategoriaUpdate,
} from './categoria.model';
import { HeaderButton } from '../../shared/components/page-header/page-header.model';
import { User } from '../../shared/models/user.model';

import { CategoriaService } from './categoria-service';
import { Auth } from '../../services/auth';

import { GenericList } from '../../shared/components/generic-list/generic-list';
import { PageHeader } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-categoria',
  imports: [
    GenericList,
    CommonModule,
    FormsModule,
    PageHeader,
    InputText,
    Button,
    TooltipModule,
    PaginatorModule,
    TableModule,
    ConfirmDialog,
    ToastModule,
  ],
  standalone: true,
  providers: [MessageService, ConfirmationService],
  templateUrl: './categoria.html',
  styleUrl: './categoria.scss',
})
export class Categoria implements OnInit {
  isLoading: boolean = false;

  rows: number = 10;
  first: number = 0;
  user: User | null = null;

  listData: CategoriaModel[] = [];
  listColumns: ColumnDefinition[] = [];
  listActions: ActionDefinition[] = [];
  totalRecords: number = 0;

  private ultimoLazyLoadEvent: LazyLoadEvent = { first: 0, rows: this.rows };
  formFiltro: any = { filtro: '' };

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    private categoriaService: CategoriaService,
    public router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.breadcrumbItems = [
      { label: 'Início', routerLink: '/' },
      { label: 'Categorias' },
    ];

    this.headerButtons = [
      {
        label: 'Adicionar',
        icon: 'fa-solid fa-plus',
        link: '/app/categorias/adicionar',
      },
    ];

    const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
    this.loadCategorias(eventoInicial);

    this.setupListComponent();
  }

  /**
   * Carrega as comissões de forma paginada.
   * @param event O evento emitido pela tabela PrimeNG
   */
  loadCategorias(event: LazyLoadEvent): void {
    this.isLoading = true;

    this.ultimoLazyLoadEvent = event;
    this.first = event.first ?? 0;
    const limit = event.rows ?? this.rows;

    this.carregarCategorias(this.first, limit, this.formFiltro.filtro);
  }

  /**
   *
   * @param skip
   * @param limit
   * @param filtro
   */
  carregarCategorias(skip: number, limit: number, filtro?: string) {
    this.categoriaService.getCategorias(skip, limit, filtro).subscribe({
      next: (response: CategoriaPaginatedList) => {
        this.listData = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar categorias:', erro);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados das categorias.',
        });
        this.isLoading = false;
      },
    });
  }

  /**
   * Adriano 22-09-2025
   * Definindo as colunas da table
   */
  private setupListComponent(): void {
    this.listColumns = [
      { field: 'name', header: 'Nome' },
      { field: 'created_at_formatted', header: 'Data de Cadastro' },
    ];

    this.listActions = [
      {
        actionId: 'edit',
        icon: 'fa-solid fa-pen',
        tooltip: 'Editar',
        severity: 'primary',
      },
      {
        actionId: 'delete',
        icon: 'fa-solid fa-trash',
        tooltip: 'Deletar',
        severity: 'danger',
      },
    ];
  }

  /**
   * Adriano 22-09-2025
   * Definindo qual ação será chamada no botão de acordo com sua função
   * @param event
   */
  handleAction(event: {
    action: ActionDefinition;
    item: CategoriaModel;
  }): void {
    switch (event.action.actionId) {
      case 'edit':
        this.router.navigate([`/app/categorias/editar/${event.item.id}`]);
        break;
      case 'delete':
        this.deleteComissao(event.item.id);
        break;
    }
  }

  /**
   * Acionado ao clicar no botão de filtro.
   * Reseta a paginação para a primeira página e carrega os dados com o filtro.
   */
  filtrarLista() {
    const eventoInicial: LazyLoadEvent = { first: 0, rows: this.rows };
    this.loadCategorias(eventoInicial);
  }

  /**
   * Deleta uma comissão.
   * @param event
   * @param Id
   */
  deleteComissao(Id: number) {
    this.confirmationService.confirm({
      header: 'Alerta',
      message: 'Você tem certeza de que deseja excluir este registro?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
        severity: 'danger',
      },
      accept: () => {
        this.categoriaService.deleteCategoria(Id).subscribe({
          next: () => {
            const index = this.listData.findIndex((s: any) => s.id === Id);
            if (index !== -1) {
              this.listData.splice(index, 1);
              this.totalRecords--;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Registro deletado com sucesso.',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.error?.detail || 'Erro ao deletar registro.',
            });
          },
        });
      },
    });
  }
}
