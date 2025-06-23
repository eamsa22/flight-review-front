import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';;
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-comment-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.scss'
})
export class CommentDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { comment: string, response?: string | null }) {}
}

