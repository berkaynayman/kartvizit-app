import { SnackbarService } from './../../services/snackbar.service';
import { CardService } from './../../services/card.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card } from 'src/app/models/card';


@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent implements OnInit {
  cardForm!: FormGroup
  constructor(
    private dialogRef: MatDialogRef<CardModalComponent>,
    private fb: FormBuilder,
    private cardService: CardService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    
    this.cardForm = this.fb.group( {
      name:    [this.data?.name    || '', Validators.maxLength(50)],
      title:   [this.data?.title   || '', [Validators.required, Validators.maxLength(255)]],
      phone:   [this.data?.phone   || '', [Validators.required, Validators.maxLength(20)]],
      email:   [this.data?.email   || '', [Validators.email, Validators.maxLength(50)]],
      address: [this.data?.address || '', Validators.maxLength(50)]
    });
  }

  addCard() {
    this.cardService.addCard(this.cardForm.value)
    .subscribe((res: any) => {
      this.getSuccess(res || 'Kartvizit başarıylar eklendi');
    }, (err: any) => {
      this.getError(err.message || 'Kartvizit eklenirken bir sorun oluştu')
    });
  }

  updateCard(): void{
    this.cardService.updateCard(this.cardForm.value, this.data.id)
      .subscribe((res: any) => {
        this.getSuccess(res || 'Kartvizit başarıylar güncellendi');
      }, (err: any) => {
        this.getError(err.message || 'Kartvizit güncellenidrken bir sorun oluştu')
      });
  }

  deleteCard(){
    this.cardService.deleteCard(this.data.id)
      .subscribe((res: any) => {
        this.getSuccess(res || 'Kartvizit başarıylar silindi');
      }, (err: any) => {
        this.getError(err.message || 'Kartvizit silinirken bir sorun oluştu')
      })
  }

  getSuccess(message: string): void {
    this.snackbarService.createSnackbar(message)
    this.cardService.getCards();
    this.dialogRef.close();
  }

  getError(message: string):void {
    this.snackbarService.createSnackbar(message)
  }


} 
