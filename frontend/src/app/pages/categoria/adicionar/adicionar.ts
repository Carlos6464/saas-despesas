import { Categoria } from './../categoria.model';
import { Component, OnInit } from '@angular/core';
import { CategoriaCreate, CategoriaUpdate } from '../categoria.model';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CategoriaService } from '../categoria-service';
import { Auth } from '../../../services/auth';
import { User } from '../../../shared/models/user.model';
import { HeaderButton } from '../../../shared/components/page-header/page-header.model';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

import { PageHeader } from '../../../shared/components/page-header/page-header';
import { FormInput } from '../../../shared/components/form-input/form-input';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-adicionar',
  imports: [
    PageHeader,
    FormInput,
    ButtonModule,
    ToastModule,
    FormsModule,
    CardModule,
  ],
  standalone: true,
  templateUrl: './adicionar.html',
  styleUrl: './adicionar.scss',
})
export class Adicionar implements OnInit {
  user: User | null = null;

  Form: CategoriaCreate = {
    name: '',
    user_id: undefined,
  };

  isLoading: boolean = false;
  isEditMode: boolean = false;
  private currentCategoriaId: number | null = null;
  pageTitle: string = 'Adicionar';

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user && !this.user.is_admin) {
      this.Form.user_id = this.user.id;
    }

    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.pageTitle = 'Editar';
        this.currentCategoriaId = +id;
        this.loadCategoriaData(this.currentCategoriaId);
      }
    });

    this.breadcrumbItems = [
      { label: 'Início', routerLink: '/' },
      { label: 'Categorias', routerLink: '/app/categorias' },
      { label: this.pageTitle },
    ];

    this.headerButtons = [
      {
        label: 'Voltar',
        icon: 'fa-solid fa-arrow-left',
        link: '/app/categorias',
      },
    ];
  }

  loadCategoriaData(id: number): void {
    this.isLoading = true;
    this.categoriaService.getCategoriaById(id).subscribe({
      next: (Categoria) => {
        this.Form = { ...Categoria };
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            'Não foi possível carregar os dados da categoria para edição.',
        });
        this.isLoading = false;
      },
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) =>
        control.markAsTouched()
      );
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos obrigatórios.',
      });
      return;
    }

    this.isLoading = true;

    const operation =
      this.isEditMode && this.currentCategoriaId
        ? this.categoriaService.updateCategoria(
            this.currentCategoriaId,
            this.Form
          )
        : this.categoriaService.createCategoria(this.Form);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode
          ? 'Categoria atualizada com sucesso!'
          : 'Categoria cadastrada com sucesso!';
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: message,
        });

        setTimeout(() => {
          this.router.navigate(['/app/categorias']);
        }, 1500);
      },
      error: (err: any) => {
        let detailMessage =
          err.error?.detail || 'Ocorreu um erro desconhecido ao salvar.';
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: detailMessage,
          life: 5000,
        });
        this.isLoading = false;
      },
    });
  }
}
