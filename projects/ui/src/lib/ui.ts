import { Component, signal, WritableSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

type ResourceMetaResponse = {
  id: string;
  name: string;
  label?: string;
  fields: {
    name: string;
    type: string;
    label?: string;
    isId?: boolean;
    isEditable?: boolean;
    isVisible?: boolean;
  }[];
};

type ListResult<T> = { total: number; records: T[] };

@Component({
  selector: 'ng-admin-ui',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
  ],
  template: `
    <div class="p-4">
      <h2 class="mb-4 text-xl font-semibold">Admin Panel</h2>

      <div class="mb-4 flex gap-2">
        <label>Resource:</label>
        <select [(ngModel)]="selectedResourceId" (change)="loadList()">
          <option *ngFor="let r of resources()" [value]="r.id">
            {{ r.label || r.name }}
          </option>
        </select>
        <button pButton label="New" (click)="openNew()"></button>
      </div>

      @if (records(); as recs) {
        <p-table [value]="recs" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th *ngFor="let f of visibleFields()">{{ f.label || f.name }}</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td *ngFor="let f of visibleFields()">{{ row[f.name] }}</td>
              <td>
                <button
                  pButton
                  size="small"
                  label="Edit"
                  (click)="openEdit(row)"
                ></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      }

      <p-dialog
        [(visible)]="dialogVisible"
        [modal]="true"
        [style]="{ width: '32rem' }"
      >
        <ng-template pTemplate="header"
          >{{ isEdit ? 'Edit' : 'New' }}
          {{ currentResource()?.label || currentResource()?.name }}</ng-template
        >
        @if (currentResource(); as res) {
          <div class="flex flex-col gap-3">
            <div *ngFor="let f of formFields()" class="flex flex-col gap-1">
              <label>{{ f.label || f.name }}</label>
              <input pInputText [(ngModel)]="editingRecord[f.name]" />
            </div>
          </div>
        }
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" (click)="closeDialog()"></button>
          <button
            pButton
            label="Save"
            (click)="save()"
            severity="primary"
          ></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
})
export class UiComponent implements OnInit {
  private readonly apiBase = '/admin';
  resources: WritableSignal<ResourceMetaResponse[]> = signal([]);
  records: WritableSignal<any[]> = signal([]);
  selectedResourceId: string | null = null;
  dialogVisible = false;
  isEdit = false;
  editingRecord: any = {};

  async ngOnInit() {
    await this.loadResources();
  }

  currentResource() {
    return (
      this.resources().find((r) => r.id === this.selectedResourceId) || null
    );
  }

  visibleFields() {
    const res = this.currentResource();
    return res ? res.fields.filter((f) => f.isVisible !== false) : [];
  }

  formFields() {
    const res = this.currentResource();
    return res
      ? res.fields.filter((f) => !f.isId && f.isEditable !== false)
      : [];
  }

  async loadResources() {
    const resp = await fetch(`${this.apiBase}/resources`);
    const list: ResourceMetaResponse[] = await resp.json();
    this.resources.set(list);
    if (!this.selectedResourceId && list.length) {
      this.selectedResourceId = list[0].id;
      await this.loadList();
    }
  }

  async loadList() {
    if (!this.selectedResourceId) return;
    const resp = await fetch(
      `${this.apiBase}/resources/${this.selectedResourceId}/records`,
    );
    const data: ListResult<any> = await resp.json();
    this.records.set(data.records);
  }

  openNew() {
    this.isEdit = false;
    this.editingRecord = {};
    this.dialogVisible = true;
  }

  openEdit(row: any) {
    this.isEdit = true;
    this.editingRecord = { ...row };
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  async save() {
    if (!this.selectedResourceId) return;
    const url =
      this.isEdit && this.editingRecord.id
        ? `${this.apiBase}/resources/${this.selectedResourceId}/records/${this.editingRecord.id}`
        : `${this.apiBase}/resources/${this.selectedResourceId}/records`;
    const method = this.isEdit && this.editingRecord.id ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.editingRecord),
    });
    this.dialogVisible = false;
    await this.loadList();
  }
}
